# DevCycle JavaScript SDK Example App

An example app built using the [DevCycle JavaScript SDK](https://docs.devcycle.com/sdk/client-side-sdks/javascript/)

## Creating a Demo Feature
This example app is designed to have 3 different experiences: one for `user-1`, one for `user-2`, and the default experience for all other users. This requires that your project has a feature with the expected variables, as well as some simple targeting rules. To set up that feature:

* [Create a new Release feature](https://docs.devcycle.com/introduction/quickstart#2-create-a-feature) on the DevCycle dashboard and add the following variables:
   * A string variable with the key `togglebot-greeting`
        * Set this to a different greeting message for each of your variations.
   * A boolean variable with the key `togglebot-wink`
        * Set this to `true` in one variation and `false` in the other.
   * A string variable with the key `togglebot-speed`
        * Set this to `fast` in one variation, and `off` in the other
* Create the following [targeting rules](https://docs.devcycle.com/essentials/targeting) in your Development environment:
    * A rule targeting the user with `User ID` `is` `user-1` 
        * Target this user with your first variation
    * A rule targeting the user with `User ID` `is` `user-2`
        *  Target this user with the other variation

Now when you run the example app and switch your identity between these users, you'll be able to see the different variations.


## Running the example
* Run `yarn install` in the project directory to install dependencies
* Create a `.env` file and set `DEVCYCLE_CLIENT_SDK_KEY` to the SDK Key for your environment.\
You can find this under [Settings > Environments](https://app.devcycle.com/r/environments) on the DevCycle dashboard.
* Run `yarn build` to build the project
* Open `index.html` to view it in your browser.

To experiment with targeting, update the user objects in `src/users.js` based on your targeting rules.

Re-run `yarn build` and refresh after making changes.

## Running the tests

* Run `yarn test` to run the tests
* See `src/devcycle.test.js` for examples of mocking the DevCycle SDK.
