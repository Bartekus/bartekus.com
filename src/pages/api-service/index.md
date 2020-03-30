---
title: API Service
date: '2019-01-01'
spoiler: An example of an api service.
---

Here is how I would implement an `api service` using `fetch` in create-react-app (or CRA in short) to communicate with REST type of backend API.
It's going to be divided into two distinctive files, `index.js` and `helpers.js`

> `src/services/api/index.js`
```js
import { get, post, postBlob, put, del } from './helpers';

const directory = {
  info: () => ({ path: `/api/info`, method: 'get' }),

  user: {
    password: {
      reset: ({user}) => ({ path: `/api/user/${user}/password/reset`, method: 'post' }),
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
As you can observe, `index.js` imports all the available methods from the `helpers.js`, adds a directory object and default exports everything as unified `api service`
Before we go into the specifics of the implementation of the methods contained in the `helpers.js` file, I'd like bring your attention to directory object.
It might be a bit strange to you at first, but it will all make sense once we get to the modular redux that utilizes sagas where having it done this way, will lend itself to keep our sagas more readable and streamlined.

For now lets have a look at the implementation of all the 

> `src/services/api/helpers.js`
```js
export async function handleResponse(response) {
  if (response.ok) {
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      throw new Error('Server response is not in JSON format');
    }
  } else {
    throw {
       url: response.url,
       status: response.status,
       statusText: response.statusText,
       message: response.message || `${error.status} ${error.statusText}`
    };
  }
}

export function scrubEmptyStrings(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      return (value === '' || value === null) ? undefined : value;
    })
  );
}

export async function get(path, query = {}, sendToken = true) {
  query = scrubEmptyStrings(query);

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  if (Object.keys(query).length > 0) {
    const params = new URLSearchParams();
    for (let key in query) {
      params.set(key, query[key]);
    }
    path += '?' + params.toString();
  }

  const response = await fetch(path, { headers, method: 'get', credentials: 'include' });

  return await handleResponse(response);
}

export async function post(path, body = {}, sendToken = true) {
  body = scrubEmptyStrings(body);

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  body = JSON.stringify(body);

  const response = await fetch(path, { headers, method: 'post', body, credentials: 'include' });

  return await handleResponse(response);
}

export async function postBlob(path, body, sendToken = true) {
  const headers = {
    accept: 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  const response = await fetch(path, { headers, method: 'post', body, credentials: 'include' });

  return await handleResponse(response);
}

export async function put(path, body = {}, sendToken = true) {
  body = scrubEmptyStrings(body);

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  body = JSON.stringify(body);

  const response = await fetch(path, { headers, method: 'put', body, credentials: 'include' });

  return await handleResponse(response);
}

export async function del(path, sendToken = true) {
  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  const accessToken = await auth.getAccessToken();
  if (sendToken) headers['authorization'] = `Bearer ${accessToken}`;

  const response = await fetch(path, { headers, method: 'delete', credentials: 'include' });

  return await handleResponse(response);
}

```

Few things to notice here:
- we take full advantage of async/await every chance we get
- we assume that we're going to be using token authentication
- we are sending the access token by default (however we allow this to be overridden if needed be)
- we expect all the server ok returns to contain body that's of the JSON type
- we remove all key/values from our client queries where the value is an empty string or null

Next, lets have a look at how I would implement auth0 service.
