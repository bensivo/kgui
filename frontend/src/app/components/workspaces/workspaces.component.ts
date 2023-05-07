import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as wails from '../../../../wailsjs/go/main/App';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmitterService } from 'src/app/emitter/emitter.service';
import { PersistedState, StorageService } from 'src/app/storage/storage.service';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.less']
})
export class WorkspacesComponent implements OnInit {

  fileData: string = '';
  showModal: boolean = false;

  constructor(
    private storageService: StorageService,
    private emitterService: EmitterService,
    private notification: NzNotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.emitterService.emitter.stream<any>('load.data').subscribe(() => {
      this.router.navigateByUrl('/clusters');
    });
  }

  get logoSrc(): string {
    if (!!(window as any).runtime) {
      return "/assets/color-logo-text-only.png"
    } else {
      return "/app/assets/color-logo-text-only.png"
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
        } catch (e) {
          console.error(e);
          this.notification.create('error', 'Error', 'Failed to parse file');
        }
      };
      reader.readAsText(file);
    }
  }

  onClickNewWorkspace() {
    this.storageService.load({
      version: 1,
      clusters: [],
      consumers: [],
      producers: [],
      nav: {
        expanded: false,
        nodes: []
      }
    });

    this.router.navigateByUrl('/clusters')
  }

  async  onClickOpenWorkspace() {
    if (!!(window as any).runtime) {
      // If running in wails desktop env
      const output = await wails.Open()
      this.storageService.load(output as any);
      this.router.navigateByUrl('/clusters')
    } else {
      // If running in webapp env
      this.showModal = true;
    }
  }

  onSubmitModal(e?: any) {
    if (e) {
      e.preventDefault();
    }

    const data = JSON.parse(this.fileData);
    this.storageService.load(data);
    this.showModal = false;

    this.router.navigateByUrl('/clusters')
  }

  onCancelModal() {
    this.showModal = false;
  }
}