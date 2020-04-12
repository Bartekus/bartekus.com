---
title: Modular Redux
date: '2019-03-01'
spoiler: Modular Redux (w/Redux-Saga for side effects handling) implemented in CRA
---

Over the years of working with react-redux, I've came to adapt and implement redux in a way that I find is easy to maintain and extend.
It is build on the idea of the [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux), with few distinctions:
 - modules are directory based
 - it keeps the separation between actions, middleware, reducer & sagas
 - it automatically add's all actions, reducers & sagas ***
 
 *** an idea that I got from [ARc - Atomic React](https://arc.js.org/)

Before we go into specifics, here is the folder structure that we'll end up with:
```bash
.
├──▶/src/                         # Source dir at the root of the CRA
│   ├──▶/services/                # All our apps services will go here
│   │   ├──▶/api/                 # API service 
│   │   │   ├──▶ /helpers.js      # Contains all the methods available in our API service
│   │   │   └──▶ /index.js        # Is the main entry file that contains API directory & default exports
│   │   └──▶/auth/                # Auth service
│   │       └──▶ /index.js        # Contains the implementation of AuthService (based on auth0-js driver) 
│   ├──▶/store/                   # Everything redux goes here
│   │   ├──▶/modules/             # Each module is a duck and an entry in redux store
│   │   │   └──▶/auth0/           # We will use auth0 authentication as an in-depth example
│   │   │       ├──▶ /actions.js  # auth0 actions
│   │   │       ├──▶ /reducer.js  # auth0 reducer
│   │   │       └──▶ /sagas.js    # auth0 sagas
│   │   ├──▶ /actions.js          # Automatically scans all the folders under modules dir and exports their actions
│   │   ├──▶ /configure.js        # Contains configureStore function used to initialize redux store
│   │   ├──▶ /helpers.js          # Contains helper methods, such as action creator helper functions
│   │   ├──▶ /middleware.js       # Automatically scans all the folders under modules dir and exports their middleware
│   │   ├──▶ /reducers.js         # Automatically scans all the folders under modules dir and exports their reducer
│   │   └──▶ /sagas.js            # Automatically scans all the folders under modules dir and exports their sagas
▼
```

To make this quick and to the point, lets look at the four key pieces, mainly actions, middleware, reducers and sagas directly in the store dir.
All these files contain what some would call root aggregate methods which take advantage of webpack's `require.context` functionality in order to:
 - scan each directory under the modules folder
 - automatically export their respective actions, middleware, reducers and sagas
 
> `/src/store/actions.js`
```js
const req = require.context('.', true, /\.\/.+\/actions\.js$/);

req.keys().forEach(key => {
  const actions = req(key);

  Object.keys(actions).forEach(name => {
    module.exports[name] = actions[name];
  });
});
```

> `/src/store/helpers.js`
```js
export function createAction(type, payload) {
  return typeof payload === 'undefined' ? { type } : { type, payload };
}

export function createErrorAction(type, error) {
  return { type, error };
}

export function createErrorActionWithPayload(type, payload, error) {
  return { type, payload, error };
}
```

> `/src/store/middleware.js`
```js
const req = require.context('.', true, /\.\/.+\/middleware\.js$/);

module.exports = req.keys().map(key => req(key).default);
```

> `/src/store/reducers.js`
```js
import camelCase from 'lodash/camelCase';
import { combineReducers } from 'redux';

const reducers = {};

const req = require.context('.', true, /\.\/.+\/reducer\.js$/);

req.keys().forEach(key => {
  const storeName = camelCase(key.replace(/\.\/modules\/(.+)\/.+$/, '$1'));
  reducers[storeName] = req(key).default;
});

export default combineReducers(reducers);
```

> `/src/store/sagas.js`
```js
import { all, fork } from 'redux-saga/effects';

const req = require.context('.', true, /\.\/.+\/sagas\.js$/);

const sagas = req.keys().map(key => req(key).default);

export default function* root(services) {
  yield all(sagas.map(saga => fork(saga, services)));
}
```

As you can see, we take advantage of [`require.context`](https://webpack.js.org/api/module-methods/#webpack) which is a special feature supported by webpack's compiler that allows you to get all matching modules starting from some base directory.
The intention is to tell webpack at compile time to transform that expression into a dynamic list of all the possible matching module requests that it can resolve, in turn adding them as build dependencies and allowing you to require them at runtime.

What this means, is that we no longer have to worry about having to manually add our actions, middleware, reducers and sagas to our redux store, it's done for us automatically by webpack.


Now lets take a look at how I would configure redux store:
> `/src/store/configure.js`
```js
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';

import middleware from './middleware';
import rootReducer from './reducers';
import rootSaga from './sagas';

const configureStore = ({ initialState, AuthService, ApiService }) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

  const sagaMiddleware = createSagaMiddleware();
  const enhancer = composeEnhancers(
    applyMiddleware(...middleware, sagaMiddleware)
  );

  const store = createStore(rootReducer, initialState, enhancer);

  const services = { AuthService, ApiService };
  let sagaTask = sagaMiddleware.run(rootSaga, services);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default;
      store.replaceReducer(nextReducer);
    });

    module.hot.accept('./sagas', () => {
      const nextSagas = require('./sagas').default;
      sagaTask.cancel();
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(nextSagas, services);
      });
    });
  }

  return store;
};

export default configureStore;
```

Everything in our `configure.js` should look familiar to most of redux-saga users, as it is pretty standard way of redux store implementation for use with sagas.
One thing to notice here is the passing of `AuthService` & `ApiService` as parameter of `configureStore` function, that we then wrap in services object and pass as argument during sagaTask creation.
We do this once again as part of the `module.hot` saga refresh functionality.

The reason for doing it this way is so that we no longer have to import `AuthService` or `ApiService` in individual module sagas as our auth0 example will show us later.

Now lets take a look at the `src/index.js` of our CRA app to see the rest of the implementation before we move to details of auth0 implementation.

> `src/index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configure';
import AuthService from './services/auth';
import ApiService from './services/api';

const store = configureStore({ initialState: {}, AuthService, ApiService });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

This too should be pretty standard for the most part for anyone who previously had to deal with redux implementation in CRA app.

### Now lets take a look at how we are actually going to implement our auth0 module.

First we are going to implement our auth0 module actions.
We will be utilizing `createAction` and `createErrorAction` imported from our `/src/store/helpers.js` file to keep things concise and organized.
Finally, we will be export everything individually.

> `/src/store/modules/auth0/actions.js`
```js
import { createAction, createErrorAction } from '../../helpers';

export const AUTHENTICATE_PENDING = 'AUTHENTICATE_PENDING';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_ERROR = 'AUTHENTICATE_ERROR';

export const PASSWORD_RESET_PENDING = 'PASSWORD_RESET_PENDING';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const PASSWORD_RESET_ERROR = 'PASSWORD_RESET_ERROR';

export function authenticate() {
  return createAction(AUTHENTICATE_PENDING);
}

export function authenticateSuccess(payload) {
  return createAction(AUTHENTICATE_SUCCESS, payload);
}

export function authenticateError(error) {
  return createErrorAction(AUTHENTICATE_ERROR, error);
}

export function passwordReset() {
  return createAction(PASSWORD_RESET_PENDING);
}

export function passwordResetSuccess(payload) {
  return createAction(PASSWORD_RESET_SUCCESS, payload);
}

export function passwordResetError(error) {
  return createErrorAction(PASSWORD_RESET_ERROR, error);
}

```

Next lets have a look at how we are going to implement our reducer.
> `/src/store/modules/auth0/reducer.js`
```js
import {
  AUTHENTICATE_PENDING,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_ERROR,
  PASSWORD_RESET_PENDING,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_ERROR,
} from './actions';

const initialState = {
  authenticated: null,
  authenticatePending: null,
  authenticateResponse: null,
  authenticateError: null,

  passwordResetPending: null,
  passwordResetResponse: null,
  passwordResetError: null,
};

export default function auth0(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATE_PENDING:
      return {
        ...state,
        authenticated: null,
        authenticatePending: true,
        authenticateResponse: null,
        authenticateError: null,
      };

    case AUTHENTICATE_SUCCESS:
      return {
        ...state,
        authenticated: true,
        authenticatePending: false,
        authenticateResponse: action.payload,
      };

    case AUTHENTICATE_ERROR:
      return {
        ...state,
        authenticated: false,
        authenticatePending: false,
        authenticateError: action.error,
      };

    case PASSWORD_RESET_PENDING:
      return {
        ...state,
        passwordResetPending: true,
        passwordResetResponse: null,
        passwordResetError: null,
      };

    case PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        passwordResetPending: false,
        passwordResetResponse: action.payload,
      };

    case PASSWORD_RESET_ERROR:
      return {
        ...state,
        passwordResetPending: false,
        passwordResetError: action.error,
      };

    default:
      return state;
  }
}

```
As you can observe, our reducer is a named function (after the module itself) that we export as default.
Since it's a reducer, we also provide it with initial state and implement it as a switch statement that contains case for each possible action as well as default return (state).

Next let dive into the implementation of our saga.
> `/src/store/modules/auth0/sagas.js`
```js
import { put, call, takeLatest } from 'redux-saga/effects';

import {
  AUTHENTICATE_PENDING,
  authenticateSuccess,
  authenticateError,
  PASSWORD_RESET_PENDING,
  passwordResetSuccess,
  passwordResetError,
} from './actions';

export function* parseHash(AuthService) {
  try {
    const response = yield call(AuthService.handleAuthentication);

    yield put(authenticateSuccess(response));
  } catch (err) {
    yield put(authenticateError(err));
  }
}

export function* passwordReset(ApiService) {
  try {
    const { path, method } = ApiService.directory.user.password.reset();
    const response = yield call(ApiService[method], path);

    yield put(passwordResetSuccess(response));
  } catch (err) {
    yield put(passwordResetError(err));
  }
}

export default function* auth0({AuthService, ApiService}) {
  yield takeLatest(AUTHENTICATE_PENDING, parseHash, AuthService);
  yield takeLatest(PASSWORD_RESET_PENDING, passwordReset, ApiService);
}
```
As you can see, we implemented two worker sagas: `parseHash` and `passwordReset`.
Our default export is our watch saga named auth0.
If you are new to `redux-saga` or generator functions, this article should be of some help to you:
[Generators/Yield vs. Async/Await](https://medium.com/front-end-weekly/modern-javascript-and-asynchronous-programming-generators-yield-vs-async-await-550275cbe433)

Going back to our implementation, since we passed `AuthService` and `ApiService` during redux store creation,
we now continue to pass it into our worker sagas as needed.

As far as our `redux-saga` methods go, we utilize:
- [`takeLatest`](https://redux-saga.js.org/docs/api/index.html#takelatestpattern-saga-args)
- [`call`](https://redux-saga.js.org/docs/api/index.html#callfn-args)
- [`put`](https://redux-saga.js.org/docs/api/index.html#putaction)

Also please notice how `passwordReset` generator function is composed,
since this is the pattern that we will be (re)using across most of our worker sagas.

Now if you recall how the `ApiService` was implemented:
> `src/services/api/index.js`
```js
import { get, post, postBlob, put, del } from './helpers';

const directory = {
  info: () => ({ path: `/api/info`, method: 'get' }),

  user: {
    password: {
      reset: () => ({ path: `/api/user/password/reset`, method: 'post' }),
    },
  }
};

export default {
  get,
  post,
  postBlob,
  put,
  del,
  directory,
};
```
Notice how we are deconstructing our `ApiService.directory.user.password.reset()` to extract the `path` and `method`.

Then in the next line, `yield call(ApiService[method], path)` can be understood as:
> `yield call(ApiService.post, '/api/user/password/reset')`

Which is `redux-saga` way of executing `ApiService.post('/api/user/password/reset')`

Next we will look at implement routing along with private and callback functionality to take advantage of our authentication capability.
