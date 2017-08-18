
# masalib angular-firebase-study App

angular and firebase study app

angular4 more than

not test angular2

## Usage

Create an account at https://firebase.google.com/

Create project at https://firebase.google.com/

- `git clone https://github.com/masalib/angular-firebase-study.git angular-firebase-study`
- `cd angular-firebase-study`
- `npm install`

Create the environment files below in `src/environments/`.

#### environment.ts
```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "APIKEY",
    authDomain: "DEV-APP.firebaseapp.com",
    databaseURL: "https://DEV-APP.firebaseio.com",
    storageBucket: "DEV-APP.appspot.com"
  }
};
```
#### environment.prod.ts
```typescript
export const environment = {
  production: true,
  firebaseConfig: {
    // same as above, or use a different firebase project to isolate environments
  }
};
```


And finally `ng serve`

vagrant case
ng serve --host 192.168.33.10 --port 4200 --live-reload true




## inspire

oauth
https://github.com/codediodeio/angular-firestarter.git

chat
https://github.com/Yamamoto0525/NgChat
