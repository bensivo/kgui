import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { nanoid } from 'nanoid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StorageService } from 'src/app/storage/storage.service';
import { NavStore } from 'src/app/store/nav.store';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class NavComponent {
  constructor(
    private navStore: NavStore,
    private storageService: StorageService,
    private notification: NzNotificationService,
  ) { }

  showRenameModal = false;
  fileData: string = '';

  addFolder() {
    this.navStore.insertNode({
      id: nanoid(),
      name: 'Untitled',
      type: 'folder',
      children: [],
      expanded: false,
    })
  }

  openLoadDialog() {
    this.showRenameModal = true;
  }

  onFileUpload(e: Event) {
    const file = (e.target as HTMLInputElement)?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const dataStr = reader?.result?.toString();
          if (!dataStr) {
            return;
          }

          this.fileData = dataStr;
        }catch(e) {
          console.error(e);
          this.notification.create('error', 'Error', 'Failed to parse file');
        }
      };
      reader.readAsText(file);
    }
  }

  onCancelModal() {
    this.showRenameModal = false;
  }

  onSubmitModal(e?: any) {
    if (e) {
      e.preventDefault();
    }

    const data = JSON.parse(this.fileData);
    this.storageService.load(data);

    this.showRenameModal = false;
  }
}
