# Evendemy Server
## How to install the server
* 'npm install' in the server folder
* install mongodb from https://www.mongodb.com

## How to execute locally
* start mongodb "path/of/my/mongod.exe" --dbpath="where/to/store/your/mongodb"
* be sure, that you have a "C:/images" folder (defined in server/developer-config.json)
* start server: node server.js

## What you should do for production
At the current state, the server part is configured for development. If you like to use it in production:
* delete developer-config.json
* configure config.json
* and implement auth.json for your authentification (e.g. ldap)

## How to update from an existing installation
Be sure that you make a backup before updating to a new version!
* save config.json, auth.js
* if you changed something in the assets folder: save it
* remove and update all other files from the server (don't forget to remove the developers-config.json)
* replace saved files
* run 'npm install' again
