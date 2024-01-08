import { fireEvent, waitFor } from '@testing-library/dom';
import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom';
import { setUpDevCycle } from './devcycle.js';
import { users } from './users.js';

process.env.DEVCYCLE_CLIENT_SDK_KEY = 'mocked-sdk-key';

const mockDevCycleClient = {
    identifyUser: jest.fn(() => Promise.resolve(true)),
    resetUser: jest.fn(() => Promise.resolve(true)),
    onClientInitialized: jest.fn(() => Promise.resolve(true)),
    variableValue: jest.fn(),
    subscribe: jest.fn(),
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

beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.innerHTML = html.toString();
});

test('App initializes DevCycle client correctly', async () => {
    setUpDevCycle();
    await waitFor(() => expect(mockDevCycleClient.onClientInitialized).toHaveBeenCalled());
});

test('Clicking identify button calls identifyUser function', async () => {
    setUpDevCycle();

    const identifySelect = document.getElementById('identify');
    identifySelect.onchange({ target: { value: JSON.stringify(users[1]) }});
    await waitFor(() => expect(mockDevCycleClient.identifyUser).toHaveBeenCalledWith(users[1]));
});

test('Clicking reset button calls resetUser function', async () => {
    setUpDevCycle();
    fireEvent.click(document.getElementById('reset'));

    await waitFor(() => expect(mockDevCycleClient.resetUser).toHaveBeenCalled());
});

test('Uses "togglebot-greeting" variable to control header', async () => {
    expect(document.getElementById('greeting')).toHaveTextContent("Loading...")
    const mockGreeting = "Hello Mocked Greeting";
    mockVariableValue('togglebot-greeting', mockGreeting);
    setUpDevCycle();
    await waitFor(() => expect(document.getElementById('greeting')).toHaveTextContent(mockGreeting));
});
