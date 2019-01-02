import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  voice: string;

  voice_items = [
    'test 1',
    'test 2'
  ];

  voiceSelected() {
    console.log('Selected ', this.voice);
  }
}
