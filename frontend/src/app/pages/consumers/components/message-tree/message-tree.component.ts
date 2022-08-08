import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

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
  selector: 'app-message-tree',
  templateUrl: './message-tree.component.html',
  styleUrls: ['./message-tree.component.less']
})
export class MessageTreeComponent implements OnInit{
  @Input()
  value!: string;

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

  datasource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener)
  selectListSelection = new SelectionModel<FlatNode>(true);

  ngOnInit() {
    const treeNode = jsonToTreeNode(``, JSON.parse(this.value));
    this.datasource.setData([treeNode]);
  }

  private transformer(node: TreeNode, level: number): FlatNode {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level,
    }
  }

  hasChild(_: number, node: FlatNode): boolean {
    return node.expandable;
  }

}

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