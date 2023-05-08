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
  ) { }

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
      await this.storageService.loadFile();
    }
  }
}
