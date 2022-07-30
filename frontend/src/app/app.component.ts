import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  constructor(private socketService: SocketService) { }

  async ngOnInit() {
    await this.socketService.initialize();

    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.socketService.send({
        Topic: 'req.clusters.add',
        Data: {
          Name: "cluster" + i,
          BootstrapServer: "localhost:9092",
          Timeout: 10,
          SaslMechanism: "",
          SaslUsername: "",
          SaslPassword: "",
          SSLEnabled: false,
          SSLCaCertificatePath: "",
          SSLSkipVerification: true,
        },
      })
    }
  }
}
