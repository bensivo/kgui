import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClusterStore } from 'src/app/store/cluster.store';

@Component({
  selector: 'app-add-cluster',
  template: `
  <app-add-cluster-component *ngIf="(data$ | async) as data" [formGroup]="data.formGroup" [clusterId]="data.clusterId"></app-add-cluster-component>
  `
})
export class AddClusterContainer{

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private clusterStore: ClusterStore) { }

  cluster$ = this.route.params.pipe(
    map((params) => {
      const clusters = this.clusterStore.store.entities;
      return clusters.find((c) => c.id === params.id);
    })
  )

  formGroup$: Observable<FormGroup> = this.cluster$.pipe(
    map(cluster => {
      const formGroup = this.formBuilder.group({
        name: new FormControl(cluster?.Name ?? ''),
        bootstrapServer: new FormControl(cluster?.BootstrapServer ?? ''),
        saslEnabled: new FormControl(!!cluster?.SaslMechanism ?? false),
        saslMechanism: new FormControl(cluster?.SaslMechanism ?? ''),
        saslUsername: new FormControl(cluster?.SaslUsername ?? ''),
        saslPassword: new FormControl(cluster?.SaslPassword ?? ''),
        sslEnabled: new FormControl(cluster?.SSLEnabled ?? false),
        sslSkipVerification: new FormControl(cluster?.SSLSkipVerification ?? false),
      });

      console.log('Group', formGroup)
      return formGroup
    })
  );

  data$ = combineLatest([
    this.cluster$,
    this.formGroup$,
  ]).pipe(
    map(([cluster, formGroup]) => ({
      clusterId: cluster?.id,
      formGroup,
    }))
  )

}
