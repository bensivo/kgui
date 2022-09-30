import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketService } from 'src/app/socket/socket.service';
import { ClusterStore } from 'src/app/store/cluster.store';
import { Cluster } from '../cluster/cluster.component';

@Component({
  selector: 'app-add-cluster-component',
  templateUrl: './add-cluster.component.html',
  styleUrls: ['./add-cluster.component.less']
})
export class AddClusterComponent implements OnInit {

  @Input()
  formGroup!: FormGroup;

  constructor(private socketService: SocketService, private router: Router,) { }


  async ngOnInit(): Promise<void> {
    console.log(this.formGroup.value)
    this.socketService.stream('clusters.changed').subscribe(() => {
      this.router.navigate(['/clusters']);
    })
  }

  cancel() {
    this.router.navigate(['/clusters']);
  }

  submit() {
    this.socketService.send<Cluster>({
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
