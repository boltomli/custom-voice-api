# Demo

This is a demo to try [Azure Custom Voice](https://customvoice.ai) on mobile, as well as web/desktop.

## Dependencies

Refer to [Capacitor from Ionic](https://capacitor.ionicframework.com/docs/).

## Init

Just some notes on how to create this repo. Don't have to repeat after clone.

```
npm install -g ionic
ionic start custom-voice-api blank --type=angular --capacitor
```

Don't have to connect to Ionic Appflow SDK now, press N when it asks.

## Setup

```
git clone https://github.com/boltomli/custom-voice-api.git && cd custom-voice-api
npm install && npm run build
```

### Web

Try in browser with `ionic serve`. Build PWA to deploy with `ionic build --prod --service-worker`.

### Mobile

Note that iOS is supported on macOS only.

```
npx cap add android
npx cap add ios
npx cap open android
npx cap open ios
```

### Desktop

```
npx cap add electron
cd electron && npm run electron:start
```

## Limitations

This is a work in progress. Prepare data like <https://github.com/boltomli/Data-for-CustomVoice.AI> to create models and deploy on <https://customvoice.ai>.

## TODO

Manage data? Record and upload data? Feel free to issue, fork, PR.
