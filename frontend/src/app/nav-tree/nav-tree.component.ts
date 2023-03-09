import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
    private navStore: NavStore,
    private router: Router,
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
      isLeaf: item.type !== 'folder',
      expanded: item.type === 'folder' ? item.expanded : undefined,
      children: item.type === 'folder' ? this.navNodesToNzNodes(item.children) : undefined,
      icon: {
        'folder': undefined,
        'consumer': 'api',
        'producer': 'send',
      }[item.type]
    }))
  }

  private nzNodesToNavNodes(nzNodes: NzTreeNodeOptions[]): NavNode[] {
    return nzNodes.map(node => ({
      id: node.key,
      name: node.title,
      type: (node.isLeaf ? 'consumer' : 'folder') as any,
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

    this.router.navigate(['/workspace']);

    const consumer = this.consumerStore.store.entities.find(c => c.id === node.key);

    if (consumer) {
      // See if this consumer is already in a tab
      const existing = this.tabStore.store.entities.find(t =>
        t.targetType === 'consumer' && t.targetId === consumer.id
      )
      if (existing) {
        this.tabStore.selectTab(existing.id)
        return;
      }

      const tab: Tab = {
        id: nanoid(),
        active: true,
        targetType: 'consumer',
        targetId: consumer.id
      };

      this.tabStore.store.upsert(tab);
      this.tabStore.selectTab(tab.id);
      return
    }

    const producer = this.producerStore.store.entities.find(p => p.id === node.key);
    if (producer) {
      // See if this producer is already in a tab
      const existing = this.tabStore.store.entities.find(t =>
        t.targetType === 'producer' && t.targetId === producer.id
      )
      if (existing) {
        this.tabStore.selectTab(existing.id)
        return;
      }

      const tab: Tab = {
        id: nanoid(),
        active: true,
        targetType: 'producer',
        targetId: producer.id
      };

      this.tabStore.store.upsert(tab);
      this.tabStore.selectTab(tab.id);
      return
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
    const id = nanoid();
    this.navStore.insertNode(
      {
        id,
        name: 'Untitled',
        type: 'consumer',
      },
      parentNode.key,
    )

    this.navStore.updateNode(parentNode.key, {
      expanded: true
    });

    this.consumerStore.store.upsert({
      id,
      name: 'Untitled',
      topic: '',
      follow: false,
      offset: 0,
      filters: [],
    })
  }

  addProducer(parentNode: NzTreeNode) {
    const id = nanoid();
    this.navStore.insertNode(
      {
        id,
        name: 'Untitled',
        type: 'producer',
      },
      parentNode.key,
    )
    this.navStore.updateNode(parentNode.key, {
      expanded: true
    });

    this.producerStore.store.upsert({
      id,
      name: 'Untitled',
      topic: '',
      partition: 0,
      message: '',
    });
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
