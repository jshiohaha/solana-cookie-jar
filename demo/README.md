# CookieJar Demo

This is a react project to demo the CookieJar component. Users can use this as an example of how to leverage CookieJar or use its subcomponents to create custom token transfer functionality.

## Getting Set Up

### Prerequisites

* Ensure you have recent versions of both `node` and `yarn` installed.

### Installation

1. Clone the root solana-cookie-jar repo
```
git clone https://github.com/jshiohaha/solana-cookie-jar.git
```

2. Change directories, install dependencies, and build solana-cookie-jar:
```
cd solana-cookie-jar
yarn && yarn build
```

3. Change directories, install dependencies, and build the demo:
```
cd demo # you should alraady be in solana-cookie-jar dir
yarn
```

> Please note: this demo is using the relative import of solana-cookie-jar. to use a version from NPM, simply delete that import in package.json and run `npm i solana-cookie-jar` to get the latest version.

1. Define your environment variables using the instructions below. Then, start the local server with `npm run start`.

#### Environment Variables

To run the project, first rename the `.env.example` file at the root directory to `.env` and update the following variables:

```
REACT_APP_DESTINATION_ADDRESS=__PLACE_HOLDER__
```

This is how the demo will know where to send token transfers invoked by the user.

## Miscellaneous

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
