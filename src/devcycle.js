import { initializeDevCycle } from "@devcycle/js-client-sdk";
import { users } from "./users";

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

    setUpIdentifyDropdown(devcycleClient);
    document.getElementById("reset").onclick = () => {
        devcycleClient.resetUser().then(() => updateUI(devcycleClient));
        document.getElementById("identify").options[3].selected = true;
    };

    // Update the app when DevCycle receives the first user config
    devcycleClient.onClientInitialized().then(({ config }) => {
        updateUI(devcycleClient);
    });

    // Update the app when DevCycle receives realtime updates from the dashboard
    devcycleClient.subscribe('configUpdated', () => {
        updateUI(devcycleClient);
    });
}

const setUpIdentifyDropdown = (devcycleClient) => {
    const identifyDropdown = document.getElementById("identify");

    identifyDropdown.innerHTML = `
        ${users.map(user => (
         `<option key='${user.user_id}' value='${JSON.stringify(user)}'>${user.name}</option>`
        ))}
        <option key="anonymous" value='{}'>Anonymous User</option>
    `

    identifyDropdown.onchange = (event) => {
        devcycleClient.identifyUser(JSON.parse(event.target.value)).then(() => updateUI(devcycleClient));
    }
}

// Use DevCycle variables to control the UI 
const updateUI = (devcycleClient) => {
    const greeting = devcycleClient.variableValue('togglebot-greeting', 'Hello world!')
    const shouldWink = devcycleClient.variableValue('togglebot-wink', false)
    const spinSpeed = devcycleClient.variableValue('togglebot-speed', 'off')
    
    document.getElementById("greeting").innerHTML = greeting;
    const togglebot = document.getElementById("togglebot");
    togglebot.src = shouldWink ? "./images/togglebot-wink.png" : "./images/togglebot.png";

    togglebot.classList.remove("spin-slow", "spin-fast", "spin-super-fast", "spin-off");
    togglebot.classList.add(`spin-${spinSpeed}`);
};
