import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SocketService } from 'src/app/socket/socket.service';
import { ClusterStore } from 'src/app/store/cluster.store';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

const jsonToTreeNode = (key: string, value: any): TreeNode => {
  if (typeof (value) !== 'object') {
    return {
      name: `${key}: ${value}`,
    }
  }

  return {
    name: key,
    children: Object.entries(value).map(([key, value]) => (jsonToTreeNode(key, value)))
  }
};

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
  topicInput = new FormControl('');
  clusterInput: any;
  offsetInput = new FormControl(-10);

  clusters: any[] = []
  messages: any[] = []

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
        const offset = msg.Message.Offset;
        const partition = msg.Message.Partition;

        const treeNode = jsonToTreeNode(`p${partition}:${offset}`, JSON.parse(value));
        this.messages = [...this.messages, treeNode]

        this.dataSource.setData(this.messages);
        this.treeControl.expandAll();
      })

  }

  consume() {
    this.messages = [];

    this.socketService.send({
      Topic: 'req.messages.consume',
      Data: {
        ClusterName: this.clusterInput.Name,
        Topic: this.topicInput.value,
        Partition: 0,
        Offset: this.offsetInput.value,
      }
    });
  }


  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
  });
  selectListSelection = new SelectionModel<FlatNode>(true);

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
}
