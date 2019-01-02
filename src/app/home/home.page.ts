import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  region: string;
  key: string;
  tokenUrl: string;
  token: string;
  voice: string;

  voice_items = [
    'test 1',
    'test 2'
  ];

  constructor(
    private platform: Platform,
    private storage: Storage,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {
    this.platform.ready().then(() => {
      this.storage.get('region').then((region) => {
        this.region = region ? region : 'westus';
        this.storage.get('key').then((key) => {
          this.key = key;
          this.validateKey();
        });
      });
    });
  }

  voiceSelected() {
    console.log('Selected ', this.voice);
  }

  validateKey() {
    this.tokenUrl = `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
    this.http.post(this.tokenUrl, '', {
      headers: {'Ocp-Apim-Subscription-Key': this.key},
      responseType: 'text'
    }).subscribe((token) => {
      this.token = token;
      this.toastCtrl.create({
        message: 'Key validated against Speech Services.',
        duration: 1000
      }).then((toast) => {
        toast.present();
      });
    }, (err) => {
      this.toastCtrl.create({
        message: 'Wrong key or region?\n' + err.message,
        duration: 1000
      }).then((toast) => {
        toast.present();
      });
    });
  }

  saveSettings() {
    this.storage.set('region', this.region).then(() => {
      this.storage.set('key', this.key).then(() => {
        this.validateKey();
      });
    });
  }
}
