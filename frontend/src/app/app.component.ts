import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  constructor(private socketService: SocketService) { }

  async ngOnInit() {
    await this.socketService.initialize();
  }
}
