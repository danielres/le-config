# le-config

A simple config handler and validator for all your projects and environments.

[![travis build](https://img.shields.io/travis/danielres/le-config.svg)](https://travis-ci.org/danielres/le-config)
[![Coverage Status](https://coveralls.io/repos/github/danielres/le-config/badge.svg?branch=master)](https://coveralls.io/github/danielres/le-config?branch=master)

## Usage

1. Create a new file `config.js`
2. Import or require `le-config` as follow:

   ```javascript
   // config.js (ES6)
   import { checks, makeConfig } from "@danielres/le-config";
   ```

   or

   ```javascript
   // config.js (CommonJS)
   const { checks, makeConfig } = require("@danielres/le-config");
   ```

3. Generate a secure, centralized config for you app:

   ```javascript
   // config.js (ES6)
   import { checks, makeConfig } from "@danielres/le-config";

   const REGEXP_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   const emailCheck = checks.string.regexp(REGEXP_EMAIL);

   export default makeConfig({
     port: [process.env.PORT, checks.int.port()],
     flags: {
       feature1: [process.env.FLAGS_FEATURE1, checks.boolean.boolean],
       feature2: [process.env.FLAGS_FEATURE2, checks.boolean.boolean],
     },
     emails: {
       admin: [process.env.EMAILS_ADMIN, emailCheck],
       editor: [process.env.EMAILS_EDITOR, emailCheck],
     },
   });
   ```

4. Use the resulting secure config thourought your app:

   ```javascript
   // src/index.js (ES6)
   import express from "express";
   import config from "./config";

   const { emails, flags, port } = config;

   const app = express();

   if (flags.feature1) console.log("Feature1 enabled.");
   if (flags.feature2) console.log("Feature2 enabled.");

   app.get("/", (req, res) =>
     res.send(`Hello world! Contact the admin at: ${emails.admin}`)
   );

   app.listen(port, () => {
     console.log(`Listening on http://localhost:${port}`);
   });
   ```

5. Fail **FAST** when the config is not valid.

   This prevents your app from being started or deployed if any check fails, while offering helpful console output.

   - **Example 1:** If your app has a build step:

     ```json
     // in package.json
     {
       "scripts": {
         "prebuild": "node ./config.js",
         "dev": "node ./config.js && nodemon src",
         "start": "node ./config.js && node src"
       }
     }
     ```

   - **Example 2:** If your app has no build step:

     ```json
     // in package.json
     {
       "scripts": {
         "dev": "node ./config.js && nodemon src",
         "start": "node ./config.js && node src"
       }
     }
     ```

## Example "fail fast" terminal output

```
[nodemon] starting `node -r esm ./index.js`

╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 3 config validation errors:
 ✗ port: should be an integer within 1025 and 65534 | Actual: 8000000
 ✗ feature1: should be a boolean | Actual: oopsie
 ✗ feature2: should be a boolean | Actual: undefined
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌

[nodemon] app crashed - waiting for file changes before starting...
```
