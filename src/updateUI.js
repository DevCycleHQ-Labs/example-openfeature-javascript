// Use DevCycle variables to control the UI
export const updateUI = (openFeatureClient, devcycleProvider) => {
    updateToggleBotSection(openFeatureClient, devcycleProvider);
    updateInstructionsSection(openFeatureClient);
}

const getToggleBotMessage = (spinSpeed) => {
    switch (spinSpeed) {
        case 'surprise': return 'What the unicorn?'
        case 'off-axis': return "...I'm gonna be sick..."
        case 'fast': return "This is fun!"
        case 'slow': return "Awesome, look at you go!"
        default: return "Hello! Nice to meet you."
    }
}

const updateToggleBotSection = (openFeatureClient, devcycleProvider) => {
    // Display variation name
    const demoFeature = devcycleProvider.devcycleClient.allFeatures()['hello-togglebot'];
    document.getElementById("variation-name").innerHTML = `"${demoFeature?.variationName ?? 'Default'}"`;

    // Get variables from DevCycle
    const shouldWink = openFeatureClient.getBooleanValue('togglebot-wink', false);
    const spinSpeed = openFeatureClient.getStringValue('togglebot-speed', 'off');

    // Display message based on spinSpeed variable
    document.getElementById("togglebot-message").innerHTML = getToggleBotMessage(spinSpeed);

    // Choose togglebot image based on variables
    const togglebot = document.getElementById("togglebot");
    togglebot.src =
        spinSpeed === 'surprise' ? "./images/unicorn.svg" :
            shouldWink ? "./images/togglebot-wink.png" :
                "./images/togglebot.png";

    // Animate togglebot using spinSpeed variable
    togglebot.classList.remove("spin-slow", "spin-fast", "spin-off-axis", "spin-off");
    togglebot.classList.add(`spin-${spinSpeed}`);
}

const updateInstructionsSection = (openFeatureClient) => {
    const text = openFeatureClient.getStringValue('example-text', 'default');

    let header;
    let details;
    switch (text) {
        case 'step-1':
            header = "Welcome to DevCycle's example app.";
            details = stepOneInstructions;
            break;
        case 'step-2':
            header = "Great! You've taken the first step in exploring DevCycle.";
            details = stepTwoInstructions;
            break;
        case 'step-3':
            header = "You're getting the hang of things.";
            details = stepThreeInstructions;
        default:
            header = "Welcome to DevCycle's example app.";
            details = defaultInstructions;
            break;
    }

    document.getElementById("instructions-header").innerHTML = header;
    document.getElementById("instructions-body").innerHTML = details;
}

const defaultInstructions = `
    <p>
        If you got to the example app on your own, follow our <a target="_blank" href="https://github.com/DevCycleHQ-Labs/example-javascript/blob/main/README.md">README</a> guide to create the Feature and Variables you need in DevCycle to control this app.
    </p>
`;

const stepOneInstructions = `
    <p>
     If you got here through the onboarding flow, just follow the instructions to change and create new Variations and see how the app reacts to new Variable values.
    </p>
`;

const stepTwoInstructions = `
    <p>
        You've successfully toggled your very first variation. You are now serving a different value to your users and you can see how the example app has reacted to this change.
    </p>
    <p>
        Next, go ahead and create a whole new variation to see what else is possible in this app.
    </p>
`;

const stepThreeInstructions = `
    <p>
        By creating a new Variation with new Variable values and toggling it on for all users you've already explored the fundamental concepts within DevCycle.
    </p>
    <p>
        There's still so much more to the platform, so go ahead and complete the onboarding flow and play around with the Feature that controls this example in your dashboard.
    </p>
`;

