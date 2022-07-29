import waitForExpect from 'wait-for-expect';
import WebSocket from 'ws';

/**
 * Preconditions for this test:
 * - kafka is running
 * - server is running
 * - the topic 'messages' has at least 1 message on it
 * - streamview.json is an empty json object
 */

describe('send', () => {
    let ws: WebSocket;

    beforeEach(async () => {
        await new Promise<void>((resolve) => {
            ws = new WebSocket('ws://localhost:8080/connect');
            ws.on('open', () => {
                resolve();
            });
        });

        ws.send(JSON.stringify({
            Topic: 'req.clusters.add',
            Data: {
        Name: "cluster1",
        BootstrapServer: "localhost:9092",
        Timeout: 10,
        SaslMechanism: "",
        SaslUsername: "",
        SaslPassword: "",
        SSLEnabled: false,
        SSLCaCertificatePath: "",
        SSLSkipVerification: true,
            }
        }))
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

    it('send message', async () => {
        await reqRes(ws, {
            Topic: 'req.messages.send',
            Data: {
                ClusterName: "cluster1",
                Topic: "messages",
                Partition: 0,
                Message:"Hello"
            }
        }, {
            Topic: 'res.message.send',
            Data: {
                // TODO: need some kind of message identifier
                Status: 'OK'
            }
        })
    });

    it('read messages', async () => {
        ws.send(JSON.stringify({
            Topic: 'req.messages.read',
            Data: {
                ClusterName: "cluster1",
                Topic: "messages",
                Partition: 0,
                Offset: -1000,
            }
        }))
    });
});


async function reqRes(ws: WebSocket, req: any, res: any) {
    const callback = jest.fn();
    ws.on('message', (buffer) => {
        callback(JSON.parse(buffer.toString()))
    });

    ws.send(JSON.stringify(req));

    await waitForExpect(() => {
        expect(callback).toHaveBeenCalledWith(res);
    });
}
