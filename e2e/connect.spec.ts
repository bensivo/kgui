import WebSocket from 'ws';

/**
 * Preconditions for this test:
 * - kafka is running
 * - server is running
 * - the topic 'messages' has at least 1 message on it
 * - streamview.json is an empty json object
 */

describe('connect', () => {

    const connect = () => new Promise<WebSocket>((resolve) => {
        const ws = new WebSocket('ws://localhost:8080/connect');
        ws.on('open', () => {
            resolve(ws);
        });
    });

    const close = (ws: WebSocket) => new Promise<void>((resolve) => {
        ws.on('close', () => {
            resolve();
        });

        setTimeout(() => {
            ws.close(1000); // Code for normal closure
        }, Math.random() * 2000)
    });

    it('should connect', async () => {
        const ws = await connect();
        expect(ws.readyState).toEqual(WebSocket.OPEN);
        await close(ws);
    });

    it('can handle multiple connections at once', async () => {
        const sockets = await Promise.all([
            connect(),
            connect(),
            connect(),
            connect(),
            connect(),
        ]);


        await Promise.all(sockets.map(s => close(s)));
        
    })
});
