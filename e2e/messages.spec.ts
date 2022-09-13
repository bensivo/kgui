import waitForExpect from 'wait-for-expect';
import WebSocket from 'ws';
import * as uuid from 'uuid';

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
        const CorrelationId = uuid.v4();
        await reqRes(ws, {
            Topic: 'message.produce',
            Data: {
                CorrelationId,
                ClusterName: "cluster1",
                Topic: "logs",
                Partition: 0,
                Message: JSON.stringify({
                    year: 2022,
                    month: 8,
                    day: 8,
                }),
            }
        }, {
            Topic: 'message.produced',
            Data: {
                CorrelationId,
                Status: 'SUCCESS'
            }
        })
    })

    describe('consume', () => {
        it('can read a message', async () => {
            await reqRes(ws, {
                Topic: 'message.consume',
                Data: {
                    ConsumerId: "testing",
                    ClusterName: "cluster1",
                    Topic: "logs",
                    Partition: 0,
                    Offset: -1,
                }

            }, {
                Topic: 'message.consumed',
                Data: {
                    ConsumerId: "testing",
                    ClusterName: "cluster1",
                    EOS: false,
                    Partition: 0,
                    Topic: 'logs',
                    Message: expect.objectContaining({
                        Value: Buffer.from(JSON.stringify({
                            year: 2022,
                            month: 8,
                            day: 8,
                        })).toString('base64'),
                    })
                }
            });
        })
        it('gets an EOS at the end of the topic', async () => {
            await reqRes(ws, {
                Topic: 'message.consume',
                Data: {
                    ConsumerId: "testing",
                    ClusterName: "cluster1",
                    Topic: "logs",
                    Partition: 0,
                    Offset: -1,
                    EOS: false,
                }

            }, {
                Topic: 'message.consumed',
                Data: {
                    ClusterName: 'cluster1',
                    ConsumerId: 'testing',
                    Topic: 'logs',
                    Partition: 0,
                    EOS: true,
                }
            })
        })
    })
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
