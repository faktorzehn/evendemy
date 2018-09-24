# Evendemy Server
## How to install the server
* 'npm install' in the server folder
* install mongodb from https://www.mongodb.com

## How to execute locally
* start mongodb "path/of/my/mongod.exe" --dbpath="where/to/store/your/mongodb"
* be sure, that you have a "C:/images" folder (defined in server/developer-config.json)
* start server: node src/server.js

## What you should do for production
If you like to use it in production be sure that developer-config is removed and everything is configured in config.json.
Be sure that you implemented plugins/auth.js!
Run 'npm run build' and begin to configure config.json and plugins/auth.js

## How to update from an existing installation
Be sure that you make a backup before updating to a new version!
We create a task for an easier upgrade of the backend. Run 'npm run build-for-upgrade'. This will build the server.js but don't copy plugins/auth, assets or config.
* save config.json, auth.js
* replace server.js, package-kson and package-lock.json
* run 'npm install' again
