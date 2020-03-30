---
title: Modular Redux - Part 2
date: '2019-04-01'
spoiler: Part 2 of Modular Redux (w/Redux-Saga for side effects handling) implementation in CRA
---

In Part 1 we went over the structure as well as few underlining methods required for our Modular Redux implementation.
Now lets take a look at how we are actually going to implement our auth0 module.

First we are going to implement our auth0 module actions.
We will be utilizing `createAction` and `createErrorAction` imported from our `/src/store/helpers.js` file to keep things concise and organized.
Finally we will be export everything individually.

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
