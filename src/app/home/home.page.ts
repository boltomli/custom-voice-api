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
  modelUrl: string;
  models: any;
  endpointUrl: string;
  endpoints: any;
  endpoint: string;
  locale: string;
  gender: string;
  name: string;
  voice: string;
  text: string;
  testUrl: string;

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
          if (key) {
            this.getEndpoints();
          } else {
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

  getModels() {
    this.tokenUrl = `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
    this.http.post(this.tokenUrl, '', {
      headers: {'Ocp-Apim-Subscription-Key': this.key},
      responseType: 'text'
    }).subscribe((token) => {
      this.token = token;
      this.modelUrl = `https://${this.region}.cris.ai/api/texttospeech/v2.0/models`;
      this.http.get(this.modelUrl, {
        headers: {'Ocp-Apim-Subscription-Key': this.key},
        responseType: 'json'
      }).subscribe((models) => {
        this.models = models;
      }, (err: Error) => {
        this.toastCtrl.create({
          message: 'No valid model?\n' + err.message,
          duration: 1000
        }).then((toast) => {
          toast.present();
        });
      });
    }, (err: Error) => {
      this.toastCtrl.create({
        message: 'Wrong key or region?\n' + err.message,
        duration: 1000
      }).then((toast) => {
        toast.present();
      });
    });
  }

  selectModel(model: any) {
    this.voice = model.id;
  }

  getEndpoints() {
    this.tokenUrl = `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
    this.http.post(this.tokenUrl, '', {
      headers: {'Ocp-Apim-Subscription-Key': this.key},
      responseType: 'text'
    }).subscribe((token) => {
      this.token = token;
      this.endpointUrl = `https://${this.region}.cris.ai/api/texttospeech/v2.0/endpoints`;
      this.http.get(this.endpointUrl, {
        headers: {'Ocp-Apim-Subscription-Key': this.key},
        responseType: 'json'
      }).subscribe((endpoints) => {
        this.endpoints = endpoints;
      }, (err: Error) => {
        this.toastCtrl.create({
          message: 'No valid endpoint?\n' + err.message,
          duration: 1000
        }).then((toast) => {
          toast.present();
        });
      });
    }, (err: Error) => {
      this.toastCtrl.create({
        message: 'Wrong key or region?\n' + err.message,
        duration: 1000
      }).then((toast) => {
        toast.present();
      });
    });
  }

  selectEndpoint(endpoint: any) {
    if (endpoint.status === 'Succeeded') {
      this.endpoint = endpoint.endpointUrls.Ssml;
      this.locale = endpoint.locale;
      this.gender = endpoint.models[0].properties.gender;
      this.name = endpoint.name;
    }
  }

  saveSettings() {
    this.storage.set('region', this.region).then(() => {
      this.storage.set('key', this.key).then(() => {
        this.getEndpoints();
      });
    });
  }
}
