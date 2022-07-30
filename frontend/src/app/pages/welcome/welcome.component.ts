import { Component, OnInit } from '@angular/core';
import { Message, SocketService } from 'src/app/socket/socket.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  clusters: any[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.stream('res.clusters.add').subscribe((m: Message<any>) => {
      this.clusters = m.Data
    })
  }
}
