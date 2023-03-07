import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select } from '@ngneat/elf';
import { nanoid } from 'nanoid';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { tap } from 'rxjs/operators';
import { ConsumerStore } from '../store/consumer.store';
import { NavStore } from '../store/nav.store';
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

  nzTreeNodeOptions$ = this.navStore.store.pipe(
    select(s => s.nzTreeNodes),
    tap(s => console.log('Update', s))
  )

  activatedNode?: NzTreeNode;

  showRenameModal = false;
  renameModalNode: NzTreeNode | undefined;
  renameModalInput = new FormControl('');


  nzEvent(event: NzFormatEmitEvent): void {
    console.log('Nz Tree Event', event)

    const nodes = this.nzTree?.getTreeNodes();
    if (nodes) {
      this.navStore.setNodes(nodes);
    }
  }

  onClickItem(data: any): void {
    let node: NzTreeNode = (data instanceof NzTreeNode) ? data : data.node;

    if (!node) {
      return;
    }

    if (!node.isLeaf) {
      node.isExpanded = !node.isExpanded;
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
        title: 'Untitled',
        key: nanoid(),
        isLeaf: false,
      },
      parentNode,
    )
  }

  addConsumer(parentNode: NzTreeNode) {
    this.navStore.insertNode(
      {
        title: 'Untitled',
        key: nanoid(),
        isLeaf: true,
      },
      parentNode,
    )
  }

  addProducer(parentNode: NzTreeNode) {
    this.navStore.insertNode(
      {
        title: 'Untitled',
        key: nanoid(),
        isLeaf: true,
      },
      parentNode,
    )
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

    this.navStore.replaceNode(node.key, {
      ...this.navStore.coerceToNodeOptions(node),
      title: this.renameModalInput.value.trim(),
    });
  }
}
