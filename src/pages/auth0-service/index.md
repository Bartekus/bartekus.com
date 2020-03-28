---
title: auth0 Service
date: '2019-01-26'
spoiler: An example of auth0 EventEmitter based service.
---

Since authentication is quite a vital part of any web-app, I'm going to demonstrate how to implement it as a service in CRA.
This service will extend the EventEmitter so that the act of login in or out can be broadcast as an event.

```js
import auth0 from 'auth0-js';
import EventEmitter from 'events';

const localStorageKey = 'loggedIn';
const loginEvent = 'loginEvent';
const homepage = process.env.PUBLIC_URL;

const webAuth = new auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: `${window.location.protocol}//${window.location.host}${homepage}/callback`,
  responseType: 'token id_token',
  scope: 'openid profile email',
});

class AuthService extends EventEmitter {
  idToken = null;
  idTokenPayload = null;
  accessToken = null;
  accessTokenExpiry = null;

  signIn = customState => {
    webAuth.authorize({
      appState: customState,
    });
  };

  signUp = customState => {
    webAuth.authorize({
      appState: customState,
      mode: 'signUp',
    });
  };

  cookieLogin = idToken => {
    this.idToken = idToken;
    this.accessToken = idToken;
    this.accessTokenExpiry = new Date(Date.now() + 900000000);

    localStorage.setItem(localStorageKey, 'true');

    this.emit(loginEvent, {
      loggedIn: true,
    });
  };

  localLogin = authResult => {
    this.idToken = authResult.idToken;
    this.idTokenPayload = authResult.idTokenPayload;
    this.accessToken = authResult.accessToken;
    this.accessTokenExpiry = new Date(authResult.idTokenPayload.exp * 1000);

    localStorage.setItem(localStorageKey, 'true');

    this.emit(loginEvent, {
      loggedIn: true,
      idTokenPayload: authResult.idTokenPayload,
      state: authResult.appState || {},
    });
  };

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        if (err) {
          return reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  };

  renewTokens = () => {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) !== 'true') {
        return reject('Not logged in');
      }

      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  };

  signOut = () => {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.idTokenPayload = null;
    this.accessToken = null;
    this.accessTokenExpiry = null;

    webAuth.logout({
      returnTo: `${window.location.protocol}//${window.location.host}${homepage}`,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    });

    this.emit(loginEvent, { loggedIn: false });
  };

  isAccessTokenValid() {
    return this.accessToken && this.accessTokenExpiry && Date.now() < this.accessTokenExpiry;
  }

  getAccessToken = () => {
    return new Promise((resolve, reject) => {
      if (this.isAccessTokenValid()) {
        resolve(this.accessToken);
      } else {
        this.renewTokens().then(authResult => {
          resolve(authResult.accessToken);
        }, reject);
      }
    });
  };

  isAuthenticated = () => {
    return this.isAccessTokenValid() && localStorage.getItem(localStorageKey) === 'true';
  };
}

export default new AuthService();

```
Please note that we are passing the auth0 credentials to the service using environmental variables.
This means that at the root of our CRA we'll have an `.env` file with the required info as such:

```bash
REACT_APP_AUTH0_DOMAIN=<YOUR-AUTH0-DOMAIN>
REACT_APP_AUTH0_CLIENT_ID=<YOUR-AUTH0-CLIENT-ID>
REACT_APP_AUTH0_AUDIENCE=<YOUR-AUTH0-AUDIENCE>

```
