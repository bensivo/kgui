import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzContextMenuServiceModule, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';


import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import {
  BlockOutline,
  AppstoreOutline,
  FolderOutline,
  EditOutline,
  DeleteOutline,
  CaretDownOutline,
  MinusCircleOutline,
  FileOutline,
  PlusOutline,
  MenuFoldOutline,
  ApiOutline,
  SendOutline,
} from '@ant-design/icons-angular/icons';

@NgModule({
  declarations: [],
  providers: [
    { provide: NZ_ICONS, useValue: [
      BlockOutline,
      AppstoreOutline,
      FolderOutline,
      EditOutline,
      DeleteOutline,
      CaretDownOutline,
      MinusCircleOutline,
      FileOutline,
      PlusOutline,
      MenuFoldOutline,
      ApiOutline,
      SendOutline,
    ]}
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzContextMenuServiceModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzLayoutModule,
    NzMenuModule,
    NzModalModule,
    NzNotificationModule,
    NzRadioModule,
    NzSelectModule,
    NzSpaceModule,
    NzSwitchModule,
    NzTabsModule,
    NzDropDownModule,
    NzTreeModule,
    NzTreeViewModule,
  ],
  exports: [
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzContextMenuServiceModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzLayoutModule,
    NzMenuModule,
    NzModalModule,
    NzNotificationModule,
    NzRadioModule,
    NzSelectModule,
    NzSpaceModule,
    NzSwitchModule,
    NzDropDownModule,
    NzTabsModule,
    NzTreeModule,
    NzTreeViewModule,
  ],
})
export class NgZorroModule { }
