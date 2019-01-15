import { Component, OnInit } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  region: string;
  key: string;

  constructor(
    private platform: Platform,
    private storage: StorageService,
    private toastCtrl: ToastController
  ) {
    this.platform.ready().then(() => {
      this.storage.get('region').then((region) => {
        this.region = region ? region : 'westus';
        this.storage.get('key').then((key) => {
          this.key = key;
          if (!key) {
            this.toastCtrl.create({
              message: 'Empty key',
              duration: 1000
            }).then((toast) => {
              toast.present();
            });
          }
        });
      });
    });
  }

  ngOnInit() {
  }

  saveSettings() {
    this.storage.set('region', this.region).then(() => {
      this.storage.set('key', this.key).then(() => {
        this.toastCtrl.create({
          message: 'key saved',
          duration: 500
        }).then((toast) => {
          toast.present();
        });
      });
    });
  }
}
