import waitForExpect from 'wait-for-expect';
import WebSocket from 'ws';

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

    const cluster1 = {
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

    const cluster2 = {
        Name: "cluster2",
        BootstrapServer: "localhost:9092",
        Timeout: 10,
        SaslMechanism: "",
        SaslUsername: "",
        SaslPassword: "",
        SSLEnabled: false,
        SSLCaCertificatePath: "",
        SSLSkipVerification: true,
    }

    it('list clusters', async () => {
        await reqRes(
            ws,
            {
                Topic: 'clusters.refresh',
            },
            {
                Topic: 'clusters.changed',
                Data: []

            }
        )
    });

    it('add cluster', async () => {
        await reqRes(
            ws,
            {
                Topic: 'clusters.add',
                Data: cluster1,
            },
            {
                Topic: 'clusters.changed',
                Data: [
                    cluster1
                ]
            })
    });

    it('add another cluster', async () => {
        await reqRes(
            ws,
            {
                Topic: 'clusters.add',
                Data: cluster2,
            },
            {
                Topic: 'clusters.changed',
                Data: [cluster1, cluster2]
            })
    });

    it('remove a cluster', async () => {
        await reqRes(
            ws,
            {
                Topic: 'clusters.remove',
                Data: {
                    Name: cluster2.Name
                },
            },
            {
                Topic: 'clusters.changed',
                Data: [cluster1]
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
