import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster } from '../cluster/cluster.component';

@Component({
  selector: 'app-add-cluster',
  templateUrl: './add-cluster.component.html',
  styleUrls: ['./add-cluster.component.less']
})
export class AddClusterComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder, private socketService: SocketService, private router: Router ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(''),
      bootstrapServer: new FormControl(''),
      saslEnabled: new FormControl(false),
      saslMechanism: new FormControl(''),
      saslUsername: new FormControl(''),
      saslPassword: new FormControl(''),
      sslEnabled: new FormControl(false),
      sslSkipVerification: new FormControl(false),
    });

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
        SaslPassword:this.formGroup.value.saslEnabled ?  this.formGroup.value.saslPassword : '',
        SSLEnabled: this.formGroup.value.sslEnabled,
        SSLCaCertificatePath: '', // TODO: implement
        SSLSkipVerification: this.formGroup.value.sslEnabled && this.formGroup.value.sslSkipVerification,
      }
    })
  }
}
