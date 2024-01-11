import { waitFor } from '@testing-library/dom';
import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom';
import { setUpDevCycle } from './devcycle.js';

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

describe('App content', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.documentElement.innerHTML = html.toString();
    });

    test.each([
        ['off', 'Hello! Nice to meet you.'],
        ['slow', 'Awesome, look at you go!'],
        ['fast', 'This is fun!'],
        ['off-axis', "...I'm gonna be sick..."],
        ['surprise', "What the unicorn?"],
    ])('Togglebot message is updated for speed "%s"', async (speed, expectedMessage) => {
        mockVariableValue('togglebot-speed', speed);
        setUpDevCycle();
        await waitFor(() => {
            expect(document.getElementById('togglebot-message')).toHaveTextContent(expectedMessage);
        });
    })

    test.each([
        'default',
        'step-1',
        'step-2',
        'step-3',
    ])('App description is updated for value "%s"', async (exampleText) => {
        mockVariableValue('example-text', exampleText);
        setUpDevCycle();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await waitFor(() => {
            expect(document.getElementById('instructions-header').textContent).toMatchSnapshot();
            expect(document.getElementById('instructions-body').textContent).toMatchSnapshot();
        });
    })
})

