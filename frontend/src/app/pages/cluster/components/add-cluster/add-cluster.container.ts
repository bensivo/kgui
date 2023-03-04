import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClusterStore } from 'src/app/store/cluster.store';

@Component({
  selector: 'app-add-cluster',
  template: `
  <app-add-cluster-component *ngIf="(formGroup$ | async) as formGroup" [formGroup]="formGroup"></app-add-cluster-component>
  `
})
export class AddClusterContainer{

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private clusterStore: ClusterStore) { }

  cluster$ = this.route.params.pipe(
    map((params) => {
      const clusters = this.clusterStore.state.clusters;
      console.log(clusters);
      return clusters.find((c) => c.Name === params.name);
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

}
