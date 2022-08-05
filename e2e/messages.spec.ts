import waitForExpect from 'wait-for-expect';
import WebSocket from 'ws';

/**
 * Preconditions for this test:
 * - kafka is running
 * - server is running
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
            Topic: 'clusters.add',
            Data: {
                Name: "cluster1",
                BootstrapServer: "localhost:9092",
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
            ws.close(1000); // Code for normal closure
        });

        jest.clearAllMocks();
    });

    it('send message', async () => {
        await reqRes(ws, {
            Topic: 'req.messages.produce',
            Data: {
                ClusterName: "cluster1",
                Topic: "messages",
                Partition: 0,
                Message: new Date(Date.now()).toTimeString()
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
        await reqRes(ws,{
            Topic: 'req.messages.consume',
            Data: {
                ClusterName: "cluster1",
                Topic: "messages",
                Partition: 0,
                Offset: -3,
            }

        }, {
            Topic: 'res.messages.consume',
            Data: {
                ClusterName: "cluster1",
                Topic: "messages",
                Partition: 0,
                Message: "hi"
            }
        })
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
