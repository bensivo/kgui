import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/socket/socket.service';
import { ClusterStore } from 'src/app/store/cluster.store';



interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-consumers',
  templateUrl: './consumers.component.html',
  styleUrls: ['./consumers.component.less']
})
export class ConsumersComponent implements OnInit {
  topicInput = '';
  clusterInput: any;
  offsetInput = -1;

  clusters: any[] = []
  messages: string[] = [];


  constructor(private clusterStore: ClusterStore, private socketService: SocketService) { }

  ngOnInit(): void {
    this.clusterStore.store
      .subscribe((state) => {
        console.log(state);
        this.clusters = state.clusters;
      })

    this.socketService.stream('res.messages.consume')
      .subscribe((msg: any) => {
        const value = atob(msg.Message.Value);
        this.messages.push(value);
      })
  }

  consume() {
    this.socketService.send({
      Topic: 'req.messages.consume',
      Data: {
        ClusterName: this.clusterInput.Name,
        Topic: this.topicInput,
        Partition: 0,
        Offset: this.offsetInput,
      }
    });
  }
}
