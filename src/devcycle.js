import { initializeDevCycle } from "@devcycle/js-client-sdk";
import { users } from "./users";
import { updateUI } from "./updateUI";

// Create DevCycle client and set up event listeners
export const setUpDevCycle = () => {
    if (!process.env.DEVCYCLE_CLIENT_SDK_KEY) {
        alert('Set your DEVCYCLE_CLIENT_SDK_KEY environment variable to use the DevCycle JavaScript SDK.')
    }

    // Initialize the DevCycle client with your SDK key and user
    const devcycleOptions = { logLevel: "debug" };
    const devcycleClient = initializeDevCycle(
        process.env.DEVCYCLE_CLIENT_SDK_KEY,
        users[0], // identifying initial user as user-1
        devcycleOptions
    );

    // Update the app when DevCycle receives the first user config
    devcycleClient.onClientInitialized().then(({ config }) => {
        updateUI(devcycleClient);
    });

    // Update the app when DevCycle receives realtime updates from the dashboard
    devcycleClient.subscribe('configUpdated', () => {
        updateUI(devcycleClient);
    });
};

// You can use this function to change which user is identified. The new user will receive a different config, 
// depending on the user properties and your feature's targeting rules
const identifyNewUser = (devcycleClient) => {
    devcycleClient.identifyUser(users[1]).then(() => updateUI(devcycleClient));
}

