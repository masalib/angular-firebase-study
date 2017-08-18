
# masalib angular-firebase-study App




## Usage
Create an account at https://firebase.google.com/
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
