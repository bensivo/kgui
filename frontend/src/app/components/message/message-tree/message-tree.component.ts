import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { Message } from 'src/app/store/messages.store';

interface Node {
  name: string;
  children?: Node[];
}

@Component({
  selector: 'app-message-tree',
  templateUrl: './message-tree.component.html',
  styleUrls: ['./message-tree.component.less']
})
export class MessageTreeComponent implements OnInit {
  @Input()
  message!: Message;


  constructor() { }
  ngOnInit(): void {
    let data = '' + this.message.data;
    try {
      data = JSON.parse(data);
    } catch (e) { }

    const tree = this.toTreeData(data);

    this.dataSource.setData([{
      name: `${this.timestamp} -  Partition ${this.message.partition} - Offset ${this.message.offset}`,
      children: tree,
    }]);
    this.treeControl.expandAll();
  }

  get timestamp() {
    return new Date(this.message.time).toLocaleString();
  }

  toTreeData(obj: any): any {
    if (typeof obj !== 'object') {
      return [{
        name: obj,
      }];
    }

    return Object.entries(obj).map(([key, value]) => {
      if (typeof value !== 'object') {
        return {
          name: `${key}: ${value}`,
        };
      }

      return {
        name: `${key}: ${value}`,
        children: this.toTreeData(value)
      }
    });
  }


  private transformer = (node: Node, level: number): any => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level
  });

  treeControl = new FlatTreeControl<any>(
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


  hasChild = (_: number, node: any): boolean => node.expandable;
}
