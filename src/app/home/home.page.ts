import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform, ToastController } from '@ionic/angular';
import { StorageService } from '../../services/storage';
import { File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
import xmlbuilder from 'xmlbuilder/lib';

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
    private storage: StorageService,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private file: File,
    private media: Media
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
      this.gender = endpoint.models[0].properties.Gender;
      this.name = endpoint.name;
    } else {
      this.toastCtrl.create({
        message: 'Endpoint is not ready yet ' + endpoint.status,
        duration: 1000
      }).then((toast) => {
        toast.present();
      });
    }
  }

  speakText() {
    if (!this.text) {
      this.toastCtrl.create({
        message: 'No text to speak.',
        duration: 1000
      }).then((toast) => {
        toast.present();
      });
    } else {
      const ssml_doc = xmlbuilder.create('speak')
        .att('version', '1.0')
        .att('xml:lang', this.locale.toLowerCase())
        .ele('voice')
        .att('xml:lang', this.locale.toLowerCase())
        .att('xml:gender', this.gender)
        .att('name', this.name)
        .txt(this.text)
        .end().toString();
      this.http.post(this.endpoint, ssml_doc, {
        headers: {
          'content-type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat' : 'riff-16khz-16bit-mono-pcm',
          'Authorization': 'Bearer ' + this.token,
          'X-Search-AppId': '07D3234E49CE426DAA29772419F436CA',
          'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960'
        },
        responseType: 'arraybuffer'
      }).subscribe((synth) => {
        if (this.platform.is('hybrid') && !this.platform.is('electron')) {
          this.file.resolveLocalFilesystemUrl(this.file.dataDirectory).then(entry => {
            this.file.writeFile(entry.toInternalURL(), 'synth.wav', synth, {replace: true}).then(fileEntry => {
              this.media.create(fileEntry.toInternalURL()).play();
            }, (err: Error) => {
              this.toastCtrl.create({
                message: err.message,
                duration: 1000
              }).then((toast) => {
                toast.present();
              });
            });
          }, (err: Error) => {
            this.toastCtrl.create({
              message: err.message,
              duration: 1000
            }).then((toast) => {
              toast.present();
            });
          });
        } else {
          const audioContext = new AudioContext();
          audioContext.decodeAudioData(synth).then((buffer) => {
            const src = audioContext.createBufferSource();
            src.buffer = buffer;
            src.connect(audioContext.destination);
            src.start(0);
          }, (err: Error) => {
            this.toastCtrl.create({
              message: err.message,
              duration: 1000
            }).then((toast) => {
              toast.present();
            });
          });
        }
      }, (err: Error) => {
        this.toastCtrl.create({
          message: err.message,
          duration: 1000
        }).then((toast) => {
          toast.present();
        });
      });
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
