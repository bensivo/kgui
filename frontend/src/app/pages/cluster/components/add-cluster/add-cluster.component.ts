import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EmitterService } from 'src/app/emitter/emitter.service';
import { Cluster } from '../cluster/cluster.component';

@Component({
  selector: 'app-add-cluster-component',
  templateUrl: './add-cluster.component.html',
  styleUrls: ['./add-cluster.component.less']
})
export class AddClusterComponent implements OnInit {

  @Input()
  formGroup!: FormGroup;

  constructor(private emitterService: EmitterService, private router: Router,) { }


  async ngOnInit(): Promise<void> {
    console.log(this.formGroup.value)
    this.emitterService.emitter.stream('clusters.changed').subscribe(() => {
      this.router.navigate(['/clusters']);
    })
  }

  cancel() {
    this.router.navigate(['/clusters']);
  }

  submit() {
    this.emitterService.emitter.send<Cluster>({
      Topic: 'clusters.add',
      Data: {
        Name: this.formGroup.value.name,
        BootstrapServer: this.formGroup.value.bootstrapServer,
        SaslMechanism: this.formGroup.value.saslEnabled ? this.formGroup.value.saslMechanism : '',
        SaslUsername: this.formGroup.value.saslEnabled ? this.formGroup.value.saslUsername : '',
        SaslPassword: this.formGroup.value.saslEnabled ? this.formGroup.value.saslPassword : '',
        SSLEnabled: this.formGroup.value.sslEnabled,
        SSLCaCertificatePath: '', // TODO: implement
        SSLSkipVerification: this.formGroup.value.sslEnabled && this.formGroup.value.sslSkipVerification,
      }
    })
  }
}
