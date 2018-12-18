# Evendemy Server


## How to use
You can find a compiled version of Evendemy-Server in the dist folder. Just change the configuration (for production) and Evendemy is ready to use.

## How to execute locally
Execute 'npm i' in the server folder.
Start the backend part for development with 'node src/server.js'.

## How to build for production
Execute 'npm i' in the webapp folder.
Build the sources with 'npm run build'.
Change the 
* configuration
* plugins/auth.js
* assets/mail.htm and assets/mail.json

 to your needs. (Be sure that developer-config is removed)


## Other requirements
Install mongodb from https://www.mongodb.com (Version v3.4.9). It is required to execute Evendemy.

## How to update from an existing installation
Be sure that you make a backup before updating to a new version!
We created a task for an easier upgrade of the backend. Run 'npm run build-for-upgrade'. This will build the server.js but don't copy plugins/auth, assets or config.
* save config.json, auth.js
* replace server.js, package.json and package-lock.json
* run 'npm install' again
