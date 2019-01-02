import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
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
    private storage: Storage
  ) {
    this.platform.ready().then(() => {
      this.storage.get('region').then((region) => {
        this.region = region ? region : 'westus';
        this.tokenUrl = `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
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
    if (this.key) {
      this.token = 'placeholder';
    } else {
      this.token = '';
    }
  }

  saveSettings() {
    this.storage.set('region', this.region).then(() => {
      this.storage.set('key', this.key).then(() => {
        this.validateKey();
      });
    });
  }
}
