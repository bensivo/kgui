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

  async onClickOpenWorkspace() {
    if (!!(window as any).runtime) {
      const output = await wails.Open()
      this.storageService.load(output as any);
      this.router.navigateByUrl('/clusters')
    } else {
      await this.storageService.loadFile();
      this.router.navigateByUrl('/clusters');
    }
  }
}