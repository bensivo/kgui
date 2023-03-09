import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { nanoid } from 'nanoid';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsumerStore } from '../store/consumer.store';
import { NavNode, NavStore } from '../store/nav.store';
import { ProducerStore } from '../store/producer.store';
import { Tab, TabStore } from '../store/tab.store';


@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class NavTreeComponent {

  constructor(
    private nzContextMenuService: NzContextMenuService,
    private tabStore: TabStore,
    private consumerStore: ConsumerStore,
    private producerStore: ProducerStore,
    private navStore: NavStore
  ) { }

  @ViewChild('nztree')
  nzTree: NzTreeComponent | undefined;

  activatedNode?: NzTreeNode;

  showRenameModal = false;
  renameModalNode: NzTreeNode | undefined;
  renameModalInput = new FormControl('');

  nzTreeNodeOptions$: Observable<NzTreeNodeOptions[]> = this.navStore.navItems$.pipe(
    map(navItems => this.navNodesToNzNodes(navItems))
  )

  private navNodesToNzNodes(navNodes: NavNode[]): NzTreeNodeOptions[] {
    return navNodes.map(item => ({
      key: item.id,
      title: item.name,
      isLeaf: item.type === 'leaf',
      expanded: item.type === 'folder' ? item.expanded : undefined,
      children: item.type === 'folder' ? this.navNodesToNzNodes(item.children) : undefined,
    }))
  }

  private nzNodesToNavNodes(nzNodes: NzTreeNodeOptions[]): NavNode[] {
    return nzNodes.map(node => ({
      id: node.key,
      name: node.title,
      type: (node.isLeaf ? 'leaf' : 'folder') as any,
      expanded: !node.isLeaf ? node.isExpanded : undefined,
      children: !node.isLeaf && node.children ? this.nzNodesToNavNodes(node.children) : undefined,
    }))
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log('Nz Tree Event', event)

    if (event.eventName === 'drop') {
      const nzNodes = this.nzTree?.getTreeNodes();
      if (nzNodes) {
        this.navStore.setNodes(this.nzNodesToNavNodes(nzNodes));
      }
    }
  }

  onClickItem(data: any): void {
    let node: NzTreeNode = (data instanceof NzTreeNode) ? data : data.node;

    if (!node) {
      return;
    }

    if (!node.isLeaf) {
      this.navStore.updateNode(node.key, {
        expanded: !node.isExpanded
      })
      return;
    }

    const consumer = this.consumerStore.store.entities.find(c => c.name === node.title);

    if (consumer) {
      // TODO: don't create tab if already open
      const tab: Tab = {
        id: nanoid(),
        active: true,
        targetType: 'consumer',
        targetId: consumer.id
      };

      this.tabStore.store.upsert(tab);
      this.tabStore.selectTab(tab.id); console.log('No consumer with id', node.key);

      // TODO: create a corresponding consumer in the consumer store
      return
    }

    const producer = this.producerStore.store.entities.find(c => c.name === node.title);
    if (producer) {
      // TODO: don't create tab if already open
      const tab: Tab = {
        id: nanoid(),
        active: true,
        targetType: 'producer',
        targetId: producer.id
      };

      this.tabStore.store.upsert(tab);
      this.tabStore.selectTab(tab.id); console.log('No consumer with id', node.key);

      // TODO: create a corresponding producer in the producer store
      return;
    }
  }

  openContextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  openRenameModal(node: NzTreeNode) {
    this.renameModalNode = node;
    this.renameModalInput.setValue(node.title);
    this.showRenameModal = true;
  }

  addFolder(parentNode: NzTreeNode) {
    this.navStore.insertNode(
      {
        id: nanoid(),
        name: 'Untitled',
        type: 'folder',
        children: [],
        expanded: false,
      },
      parentNode.key,
    )

    this.navStore.updateNode(parentNode.key, {
      expanded: true
    }
    );
  }

  addConsumer(parentNode: NzTreeNode) {
    this.navStore.insertNode(
      {
        id: nanoid(),
        name: 'Untitled',
        type: 'leaf',
      },
      parentNode.key,
    )

    this.navStore.updateNode(parentNode.key, {
      expanded: true
    }
    );
  }

  addProducer(parentNode: NzTreeNode) {
    this.navStore.insertNode(
      {
        id: nanoid(),
        name: 'Untitled',
        type: 'leaf',
      },
      parentNode.key,
    )

    this.navStore.updateNode(parentNode.key, {
      expanded: true
    }
    );
  }

  removeNode(node: NzTreeNode) {
    this.navStore.removeNode(node.key);
  }

  onCancelModal() {
    this.showRenameModal = false;
  }

  onSubmitModal(e?: any) {
    if (e) {
      e.preventDefault();
    }

    this.showRenameModal = false;

    const node = this.renameModalNode;
    if (!node) {
      return;
    }

    this.navStore.updateNode(node.key, {
      name: this.renameModalInput.value.trim(),
    })
  }
}
