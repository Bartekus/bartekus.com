---
title: CRA Browser Extension
date: '2019-11-01'
spoiler: How to modify CRA for use as browser extension
---

Ever wanted to use CRA as foundation for building an awesome browser extension but weren't sure how to get everything working?

I'm going to show you how I would modify create-react-app application so that it can be used as perfect baseline for your project.

### 1. Create a new app with Create React App

Let’s start by creating a new React app:
> npx create-react-app cra-extension

### 2. Setup the manifest

By default Create React App creates a Web App manifest in the /public dir.
We don’t need it: a browser extension requires a WebExtension API manifest, which follows a completely different standard.

> Replace the content of public/manifest.json:
```json
{
  "name": "CRA Extension",
  "version": "1.0.0",
  "manifest_version": 2,
  "options_page": "options.html",
  "background": {
    "page": "background.html"
  },
  "browser_action": {
    "default_popup": "index.html"
  }
}
```
P.S.: While we’re at it, I would also clean up the public dir, making sure we keep there only manifest.json and index.html.

### 3. Create background html and js|ts files
> Add public/background.html file with content:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
</body>
</html>
```

> Add src/background.js|ts file with content:
```js
 export default (function() {
   console.log('This should work!!!');
 })();
```

### 4. Create options html and js|ts files
> Add public/options.html file with content:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
</body>
</html>
```

> Add src/options.js|ts file with content:
```js
 export default (function() {
   console.log('This also should work!');
 })();
```

### 5. Install few helpers
> yarn add patch-package postinstall-postinstall webpack-extension-reloader --dev

### 6. Implement watch script
> Add scrips/watch.js file with content:
```js
#!/usr/bin/env node

// A script for developing a browser extension with live-reloading using Create React App (no need to eject).
// Run it instead of the "start" script of your app for a nice development environment.
// P.S.: Install webpack-extension-reloader.

// Force a "development" environment in watch mode
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const fs = require("fs-extra");
const paths = require("react-scripts/config/paths");
const webpack = require("webpack");
const configFactory = require("react-scripts/config/webpack.config");
const colors = require("colors/safe");
const ExtensionReloader = require("webpack-extension-reloader");

// Create the Webpack config usings the same settings used by the "start" script of create-react-app.
const config = configFactory("development");

// Add the webpack-extension-reloader plugin to the Webpack config.
// It notifies and reloads the extension on code changes.
config.plugins.push(new ExtensionReloader());

// Start Webpack in watch mode.
const compiler = webpack(config);
const watcher = compiler.watch({}, function(err) {
  if (err) {
    console.error(err);
  } else {
    // Every time Webpack finishes recompiling copy all the assets of the
    // "public" dir in the "build" dir (except for the background.html, index.html and options.html)
    fs.copySync(paths.appPublic, paths.appBuild, {
      dereference: true,
      filter: file => file !== paths.appHtml && file !== paths.appBackgroundHtml && file !== paths.appOptionsHtml
    });
    // Report on console the successful build
    console.clear();
    console.info(colors.green("Compiled successfully!"));
    console.info("Built at", new Date().toLocaleTimeString());
    console.info();
    console.info("Note that the development build is not optimized.");
    console.info("To create a production build, use yarn build.");
    console.info();
  }
});
```

### 7. Modify npm scripts
> In your package.json add homepage, then modify start scripts add postinstall like this:
```json
{
  "homepage": "/",
  "scripts": {
    "start": "node ./scripts/watch",
    "postinstall": "patch-package"
  }
}
```

### 8. Create patch for react-scripts
> In the root of your CRA project, create directory name `patches` along with a file `react-scripts+3.4.1.patch` containing:

`gist:bartekus/6e95dd76b24096f2c74153ecfc6fea30`

> Alternatively you can modify the react-scripts yourself

Have a look at this [gist](https://gist.github.com/bartekus/10896b9821a3ad91bb353e985144d38f/revisions?diff=unified) to see how you can
modify and patch react-scripts to use CRA for your future browser extension. It's quite simple, just make the modification to the existing
`react-scripts` inside your `node_modules`, then run:
> npx patch-package react-scripts

### 9. Patch react-scripts & start the app
> Run `yarn install` then `yarn start` or `yarn build`

### 10. Open your extension
> open `chrome://extensions/` and using `Load unpacked` select the `build` folder from the root of your CRA project.

You should see a new `popup` icon as well as be able to inspect `background.html`.
In addition, if you got into the `Details` of your extension, you will be able to see `Extension options` too.

## Acknowledgments
Big thanks goes to [Matteo](https://mmazzarolo.com/) for his [Developing a browser extension with Create React App](https://mmazzarolo.com/blog/2019-10-19-browser-extension-development/)
article from which this idea was born.
