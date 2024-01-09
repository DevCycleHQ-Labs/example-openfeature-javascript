// Use DevCycle variables to control the UI 
export const updateUI = (devcycleClient) => {
    const demoFeature = devcycleClient.allFeatures()['hello-togglebot'];

    updateToggleBotSection(devcycleClient, demoFeature);
    updateInstructionsSection(demoFeature);
}

const getToggleBotMessage = (spinSpeed) => {
    switch (spinSpeed) {
        case 'surprise': return 'What the unicorn?'
        case 'off-axis': return "...I’m gonna be sick..."
        case 'fast': return "This is fun!"
        case 'slow': return "Awesome, look at you go!"
        default: return "Hello! Nice to meet you."
    }
}

const updateToggleBotSection = (devcycleClient, demoFeature) => {
    // Display variation name
    document.getElementById("variation-name").innerHTML = `"${demoFeature?.variationName ?? 'Default'}"`;

    // Get variables from DevCycle
    const shouldWink = devcycleClient.variableValue('togglebot-wink', false);
    const spinSpeed = devcycleClient.variableValue('togglebot-speed', 'off');

    // Display message based on spinSpeed variable
    document.getElementById("togglebot-message").innerHTML = getToggleBotMessage(spinSpeed);

    // Choose togglebot image based on message based on shouldWink variable
    const togglebot = document.getElementById("togglebot");
    togglebot.src =
        spinSpeed === 'surprise' ? "./images/unicorn.svg" :
            shouldWink ? "./images/togglebot-wink.png" :
                "./images/togglebot.png";

    // Animate togglebot using spinSpeed variable
    togglebot.classList.remove("spin-slow", "spin-fast", "spin-off-axis", "spin-off");
    togglebot.classList.add(`spin-${spinSpeed}`);

    // TODO handle unicorn with wink
}

const updateInstructionsSection = (demoFeature) => {
    let header;
    let details;
    switch (demoFeature?.variationKey) {
        case undefined:
            header = "Welcome to DevCycle's example app.";
            details = defaultVariationInstructions;
            break;
        case "variation-base":
            header = "Welcome to DevCycle's example app.";
            details = baseVariationInstructions;
            break;
        case "variation-wink":
            header = "Great! You've taken the first step in exploring DevCycle.";
            details = winkVariationInstructions;
            break;
        default: // custom variation
            header = "You’re getting the hang of things.";
            details = customVariationInstructions;
    }

    document.getElementById("instructions-header").innerHTML = header;
    document.getElementById("instructions-body").innerHTML = details;
}

const defaultVariationInstructions = `
    <p>
        If you got to the example app on your own, follow our <a target="_blank" href="https://github.com/DevCycleHQ-Labs/example-javascript/blob/main/README.md">README</a> guide to create the Feature and Variables you need in DevCycle to control this app.
    </p>
`;


const baseVariationInstructions = `
    <p>
     If you got here through the onboarding flow, just follow the instructions to change and create new Variations and see how the app reacts to new Variable values.
    </p>
`;

const winkVariationInstructions = `
    <p>
        You've successfully toggled your very first variation. You are now serving a different value to your users and you can see how the example app has reacted to this change.
    </p>
    <p>
        Next, go ahead and create a whole new variation to see what else is possible in this app.
    </p>
`;

const customVariationInstructions = `
    <p>
        By creating a new Variation with new Variable values and toggling it on for all users you’ve already explored the fundamental concepts within DevCycle.
    </p>
    <p>
        There’s still so much more to the platform, so go ahead and complete the onboarding flow and play around with the Feature that controls this example in your dashboard.
    </p>
`;

