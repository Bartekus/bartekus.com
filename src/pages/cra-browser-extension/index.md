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
```
diff --git a/node_modules/react-scripts/config/paths.js b/node_modules/react-scripts/config/paths.js
index 11d81b7..f095618 100644
--- a/node_modules/react-scripts/config/paths.js
+++ b/node_modules/react-scripts/config/paths.js
@@ -63,7 +63,11 @@ module.exports = {
   appBuild: resolveApp('build'),
   appPublic: resolveApp('public'),
   appHtml: resolveApp('public/index.html'),
+  appBackgroundHtml: resolveApp('public/background.html'),
+  appOptionsHtml: resolveApp('public/options.html'),
   appIndexJs: resolveModule(resolveApp, 'src/index'),
+  appBackgroundJs: resolveModule(resolveApp, 'src/background'),
+  appOptionsJs: resolveModule(resolveApp, 'src/options'),
   appPackageJson: resolveApp('package.json'),
   appSrc: resolveApp('src'),
   appTsConfig: resolveApp('tsconfig.json'),
@@ -85,7 +89,11 @@ module.exports = {
   appBuild: resolveApp('build'),
   appPublic: resolveApp('public'),
   appHtml: resolveApp('public/index.html'),
+  appBackgroundHtml: resolveApp('public/background.html'),
+  appOptionsHtml: resolveApp('public/options.html'),
   appIndexJs: resolveModule(resolveApp, 'src/index'),
+  appBackgroundJs: resolveModule(resolveApp, 'src/background'),
+  appOptionsJs: resolveModule(resolveApp, 'src/options'),
   appPackageJson: resolveApp('package.json'),
   appSrc: resolveApp('src'),
   appTsConfig: resolveApp('tsconfig.json'),
@@ -120,7 +128,11 @@ if (
     appBuild: resolveOwn('../../build'),
     appPublic: resolveOwn(`${templatePath}/public`),
     appHtml: resolveOwn(`${templatePath}/public/index.html`),
+    appBackgroundHtml: resolveOwn(`${templatePath}/public/background.html`),
+    appOptionsHtml: resolveOwn(`${templatePath}/public/options.html`),
     appIndexJs: resolveModule(resolveOwn, `${templatePath}/src/index`),
+    appBackgroundJs: resolveModule(resolveOwn, `${templatePath}/src/background`),
+    appOptionsJs: resolveModule(resolveOwn, `${templatePath}/src/options`),
     appPackageJson: resolveOwn('package.json'),
     appSrc: resolveOwn(`${templatePath}/src`),
     appTsConfig: resolveOwn(`${templatePath}/tsconfig.json`),
diff --git a/node_modules/react-scripts/config/webpack.config.js b/node_modules/react-scripts/config/webpack.config.js
index 25840d9..6b9e08f 100644
--- a/node_modules/react-scripts/config/webpack.config.js
+++ b/node_modules/react-scripts/config/webpack.config.js
@@ -43,7 +43,7 @@ const appPackageJson = require(paths.appPackageJson);
 const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
 // Some apps do not need the benefits of saving a web request, so not inlining the chunk
 // makes for a smoother build process.
-const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
+// const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
 
 const isExtendingEslintConfig = process.env.EXTEND_ESLINT === 'true';
 
@@ -149,35 +149,21 @@ module.exports = function(webpackEnv) {
       : isEnvDevelopment && 'cheap-module-source-map',
     // These are the "entry points" to our application.
     // This means they will be the "root" imports that are included in JS bundle.
-    entry: [
-      // Include an alternative client for WebpackDevServer. A client's job is to
-      // connect to WebpackDevServer by a socket and get notified about changes.
-      // When you save a file, the client will either apply hot updates (in case
-      // of CSS changes), or refresh the page (in case of JS changes). When you
-      // make a syntax error, this client will display a syntax error overlay.
-      // Note: instead of the default WebpackDevServer client, we use a custom one
-      // to bring better experience for Create React App users. You can replace
-      // the line below with these two lines if you prefer the stock client:
-      // require.resolve('webpack-dev-server/client') + '?/',
-      // require.resolve('webpack/hot/dev-server'),
-      isEnvDevelopment &&
-        require.resolve('react-dev-utils/webpackHotDevClient'),
-      // Finally, this is your app's code:
-      paths.appIndexJs,
-      // We include the app code last so that if there is a runtime error during
-      // initialization, it doesn't blow up the WebpackDevServer client, and
-      // changing JS code would still trigger a refresh.
-    ].filter(Boolean),
+    entry: {
+      background: paths.appBackgroundJs,
+      options: paths.appOptionsJs,
+      popup: paths.appIndexJs,
+    },
     output: {
       // The build folder.
-      path: isEnvProduction ? paths.appBuild : undefined,
+      path: paths.appBuild,
       // Add /* filename */ comments to generated require()s in the output.
       pathinfo: isEnvDevelopment,
       // There will be one main bundle, and one file per asynchronous chunk.
       // In development, it does not produce real files.
       filename: isEnvProduction
         ? 'static/js/[name].[contenthash:8].js'
-        : isEnvDevelopment && 'static/js/bundle.js',
+        : isEnvDevelopment && 'static/js/[name].bundle.js',
       // TODO: remove this when upgrading to webpack 5
       futureEmitAssets: true,
       // There are also additional JS chunk files if you use code splitting.
@@ -558,6 +544,62 @@ module.exports = function(webpackEnv) {
       ],
     },
     plugins: [
+      // Generates an `background.html` file with the <script> injected.
+      new HtmlWebpackPlugin(
+        Object.assign(
+          {},
+          {
+            inject: true,
+            template: paths.appBackgroundHtml,
+            filename: 'background.html',
+            excludeChunks: ['popup', 'options'],
+          },
+          isEnvProduction
+            ? {
+              minify: {
+                removeComments: true,
+                collapseWhitespace: true,
+                removeRedundantAttributes: true,
+                useShortDoctype: true,
+                removeEmptyAttributes: true,
+                removeStyleLinkTypeAttributes: true,
+                keepClosingSlash: true,
+                minifyJS: true,
+                minifyCSS: true,
+                minifyURLs: true,
+              },
+            }
+            : undefined
+        )
+      ),
+      // Generates an `options.html` file with the <script> injected.
+      new HtmlWebpackPlugin(
+        Object.assign(
+          {},
+          {
+            inject: true,
+            template: paths.appOptionsHtml,
+            filename: 'options.html',
+            excludeChunks: ['popup', 'background'],
+          },
+          isEnvProduction
+            ? {
+              minify: {
+                removeComments: true,
+                collapseWhitespace: true,
+                removeRedundantAttributes: true,
+                useShortDoctype: true,
+                removeEmptyAttributes: true,
+                removeStyleLinkTypeAttributes: true,
+                keepClosingSlash: true,
+                minifyJS: true,
+                minifyCSS: true,
+                minifyURLs: true,
+              },
+            }
+            : undefined
+        )
+      ),
       // Generates an `index.html` file with the <script> injected.
       new HtmlWebpackPlugin(
         Object.assign(
@@ -565,6 +607,7 @@ module.exports = function(webpackEnv) {
           {
             inject: true,
             template: paths.appHtml,
+            excludeChunks: ['background', 'options'],
           },
           isEnvProduction
             ? {
@@ -587,9 +630,9 @@ module.exports = function(webpackEnv) {
       // Inlines the webpack runtime script. This script is too small to warrant
       // a network request.
       // https://github.com/facebook/create-react-app/issues/5358
-      isEnvProduction &&
-        shouldInlineRuntimeChunk &&
-        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
+      // isEnvProduction &&
+      //   shouldInlineRuntimeChunk &&
+      //   new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
       // Makes some environment variables available in index.html.
       // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
       // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
@@ -638,9 +681,12 @@ module.exports = function(webpackEnv) {
             manifest[file.name] = file.path;
             return manifest;
           }, seed);
-          const entrypointFiles = entrypoints.main.filter(
-            fileName => !fileName.endsWith('.map')
-          );
+          const entrypointFiles = {};
+          for (const property in entrypoints) {
+            entrypointFiles[property] = entrypoints[property].filter(
+              fileName => !fileName.endsWith('.map')
+            );
+          }
 
           return {
             files: manifestFiles,
diff --git a/node_modules/react-scripts/scripts/build.js b/node_modules/react-scripts/scripts/build.js
index fa30fb0..07998b1 100644
--- a/node_modules/react-scripts/scripts/build.js
+++ b/node_modules/react-scripts/scripts/build.js
@@ -222,6 +222,6 @@ function build(previousFileSizes) {
 function copyPublicFolder() {
   fs.copySync(paths.appPublic, paths.appBuild, {
     dereference: true,
-    filter: file => file !== paths.appHtml,
+    filter: file => file !== paths.appHtml && file !== paths.appBackgroundHtml && file !== paths.appOptionsHtml,
   });
 }

```

### 9. Patch react-scripts & start the app
> Run `yarn install` then `yarn start` or `yarn build`

### 10. Open your extension
> open `chrome://extensions/` and using `Load unpacked` select the `build` folder from the root of your CRA project.

You should see a new `popup` icon as well as be able to inspect `background.html`.
In addition, if you got into the `Details` of your extension, you will be able to see `Extension options` too.

## Acknowledgments
Big thanks goes to [Matteo](https://mmazzarolo.com/) for his [Developing a browser extension with Create React App](https://mmazzarolo.com/blog/2019-10-19-browser-extension-development/)
article from which this idea was born.
