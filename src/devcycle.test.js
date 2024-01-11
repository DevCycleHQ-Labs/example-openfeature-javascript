import { fireEvent, waitFor } from '@testing-library/dom';
import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom';
import { setUpDevCycle } from './devcycle.js';
import { users } from './users.js';

process.env.DEVCYCLE_CLIENT_SDK_KEY = 'mocked-sdk-key';

const mockAllFeatures = jest.fn(() => ({}))
const mockDevCycleClient = {
    identifyUser: jest.fn(() => Promise.resolve(true)),
    resetUser: jest.fn(() => Promise.resolve(true)),
    onClientInitialized: jest.fn(() => Promise.resolve(true)),
    variableValue: jest.fn(),
    subscribe: jest.fn(),
    allFeatures: mockAllFeatures
}

const mockVariableValue = (variable, value) => {
    mockDevCycleClient.variableValue.mockImplementation((variableKey, defaultValue) => {
        return variable === variableKey ? value : defaultValue
    })
}

jest.mock('@devcycle/js-client-sdk', () => ({
    initializeDevCycle: () => mockDevCycleClient
}));

const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

describe('DevCycle client initialization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.documentElement.innerHTML = html.toString();
    });

    test('App initializes DevCycle client correctly', async () => {
        setUpDevCycle();
        await waitFor(() => expect(mockDevCycleClient.onClientInitialized).toHaveBeenCalled());
    });

    test('App handles default variation', async () => {
        setUpDevCycle();
        await waitFor(() => {
            expect(document.getElementById('variation-name')).toHaveTextContent('Default');
        });
    })
})

describe('Togglebot speed', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.documentElement.innerHTML = html.toString();
    });

    test('Togglebot handles speed "off"', async () => {
        mockVariableValue('togglebot-speed', 'off');
        setUpDevCycle();
        await waitFor(() => {
            expect(document.getElementById('togglebot-message')).toHaveTextContent("Hello! Nice to meet you.");
            expect(document.getElementById('instructions-header')).toHaveTextContent('Welcome to DevCycle\'s example app');
        });
    })

    test('Togglebot handles speed "slow"', async () => {
        mockVariableValue('togglebot-speed', 'slow');
        setUpDevCycle();
        await waitFor(() => {
            expect(document.getElementById('togglebot-message')).toHaveTextContent("Awesome, look at you go!");
            expect(document.getElementById('instructions-header')).toHaveTextContent('Great! You\'ve taken the first step in exploring DevCycle.');
        });
    })

    test('Togglebot handles speed "fast"', async () => {
        mockVariableValue('togglebot-speed', 'fast');
        setUpDevCycle();
        await waitFor(() => {
            expect(document.getElementById('togglebot-message')).toHaveTextContent("This is fun!");
            expect(document.getElementById('instructions-header')).toHaveTextContent('You\'re getting the hang of things.');
        });
    })

    test('Togglebot handles speed "off-axis"', async () => {
        mockVariableValue('togglebot-speed', 'off-axis');
        setUpDevCycle();
        await waitFor(() => {
            expect(document.getElementById('togglebot-message')).toHaveTextContent("...I'm gonna be sick...");
            expect(document.getElementById('instructions-header')).toHaveTextContent('You\'re getting the hang of things.');
        });
    })


    test('Togglebot handles speed "surprise"', async () => {
        mockVariableValue('togglebot-speed', 'surprise');
        setUpDevCycle();
        await waitFor(() => {
            expect(document.getElementById('togglebot-message')).toHaveTextContent("What the unicorn?");
            expect(document.getElementById('instructions-header')).toHaveTextContent('You\'re getting the hang of things.');
        });
    })
})

