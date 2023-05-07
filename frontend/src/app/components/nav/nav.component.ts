import { Component, ViewEncapsulation } from '@angular/core';
import { nanoid } from 'nanoid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StorageService } from 'src/app/storage/storage.service';
import { NavStore } from 'src/app/store/nav.store';
import * as wails from '../../../../wailsjs/go/main/App';

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

  showModal = false;
  fileData: string = '';

  get logoSrc(): string {
    if (!!(window as any).runtime) {
      return "/assets/color-logo-text-only.png"
    } else {
      return "/app/assets/color-logo-text-only.png"
    }
  }

  addFolder() {
    this.navStore.insertNode({
      id: nanoid(),
      name: 'Untitled',
      type: 'folder',
      children: [],
      expanded: false,
    })
  }

  isBrowserRuntime() {
    return !(window as any).runtime;
  }

  saveToFile() {
    this.storageService.save();
  }

  async openLoadDialog() {
    if (!!(window as any).runtime) {
      // If running in wails desktop env
      const output = await wails.Open()
      this.storageService.load(output as any);
    } else {
      // If running in webapp env
      this.showModal= true;
    }
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
    this.showModal = false;
  }

  onSubmitModal(e?: any) {
    if (e) {
      e.preventDefault();
    }

    const data = JSON.parse(this.fileData);
    this.storageService.load(data);

    this.showModal = false;
  }
}
