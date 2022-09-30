import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Tab } from 'src/app/store/tab.store';

@Component({
  selector: 'app-tab-content-component',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.less']
})
export class TabContentComponent implements OnChanges{
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  @Input()
  tab!: Tab;

  
}
