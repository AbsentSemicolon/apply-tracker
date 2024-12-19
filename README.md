# Application Tracker

This application is used to track different job applications sent out. Created this as a way to personally track where I had applications out to and as a project to keep my skills sharp. This uses local storage to make things work fast and to keep things simple, at first. This is a living project though and as new things come into I hope to keep updating this.

## To Use

Right now this depends on some manual steps to use beyond the demo setup.

1. Log into [gist.github.com](https://gist.github.com) and create a private gist.
    2. Name the file in the gist as applications. The actual name of the gist can be anything.
    3. Fill in the content as `{}`. There must be an object for the app to grab, which does not fail gracefully yet.
3. You must create an access token so the application can read the gist.
    1. Log into [github.com/settings/tokens](https://github.com/settings/tokens).
    2. Click on **new token (classic)** and give it only **gist** privileges.
    3. Copy the token given
4. In **Dev Tools** for your browser of choice you'll create an object in **local storage**.
    1. Create the key with the name `applyTrackerData`.
    2. The value will be: `{gistId: "\<your gist id\>", accessToken: "\<access token from step 2.iii\>"}`.
5. Refresh the site, and remove `?demo=true` if you were viewing it in demo mode. You should now be able to create entries and it'll save it in the gist.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
