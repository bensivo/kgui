import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StorageService } from 'src/app/storage/storage.service';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.less']
})
export class WorkspacesComponent {

  fileData: string = '';
  showModal: boolean = false;

  constructor(
    private storageService: StorageService,
    private notification: NzNotificationService,
    private router:Router,
  ) { }

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
        }catch(e) {
          console.error(e);
          this.notification.create('error', 'Error', 'Failed to parse file');
        }
      };
      reader.readAsText(file);
    }
  }

  onClickNewWorkspace(){
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

  onClickOpenWorkspace(){
    this.showModal = true;
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