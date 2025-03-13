import DevCycleProvider from '@devcycle/openfeature-web-provider'
import { OpenFeature } from '@openfeature/web-sdk'
import { users } from "./users";
import { updateUI } from "./updateUI";

const { DEVCYCLE_CLIENT_SDK_KEY } = process.env;

let openFeatureClient;
let devcycleProvider;

// Create DevCycle client and set up event listeners
export const setUpOpenFeature = async () => {
    if (!process.env.DEVCYCLE_CLIENT_SDK_KEY) {
        alert('Set your DEVCYCLE_CLIENT_SDK_KEY environment variable to use the DevCycle JavaScript SDK.')
    }

    // Initialize the DevCycle client with your SDK key and user
    devcycleProvider = new DevCycleProvider(DEVCYCLE_CLIENT_SDK_KEY, { 
        logLevel: "debug",
        // Controls the interval between flushing events to the DevCycle servers
        eventFlushIntervalMS: 1000
    });
    await OpenFeature.setContext(users[0]);
    await OpenFeature.setProviderAndWait(devcycleProvider);
    openFeatureClient = OpenFeature.getClient();

    // Update the app when DevCycle receives the first user config
    updateUI(openFeatureClient, devcycleProvider);

    // Update the app when DevCycle receives realtime updates from the dashboard
    openFeatureClient.addHandler("PROVIDER_CONFIGURATION_CHANGED", () => {
        updateUI(openFeatureClient, devcycleProvider);
    });
};

// You can use this function to change which user is identified. The new user will receive a different config,
// depending on the user properties and your feature's targeting rules
const identifyNewUser = () => {
    openFeatureClient.setContext(users[1]);
}

