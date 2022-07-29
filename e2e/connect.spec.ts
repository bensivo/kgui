import WebSocket from 'ws';

/**
 * Preconditions for this test:
 * - kafka is running
 * - server is running
 * - the topic 'messages' has at least 1 message on it
 * - streamview.json is an empty json object
 */

describe('connect', () => {
    let ws: WebSocket;

    beforeEach(async () => {
        await new Promise<void>((resolve) => {
            ws = new WebSocket('ws://localhost:8080/connect');
            ws.on('open', () => {
                resolve();
            });
        });
    });

    afterEach(async () => {
        await new Promise<void>((resolve) => {
            ws.on('close', () => {
                resolve();
            });
            // ws.terminate();
            ws.close(1000); // Code for normal closure
        });

        jest.clearAllMocks();
    });

    it('should connect', async () => {
        expect(ws.readyState).toEqual(WebSocket.OPEN);
    });
});
