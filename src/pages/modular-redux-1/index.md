---
title: Modular Redux - Part 1
date: '2019-03-01'
spoiler: Part 1 of Modular Redux (w/Redux-Saga for side effects handling) implementation in CRA
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

In part 2, we will look at an example of an actual redux module implementation.
