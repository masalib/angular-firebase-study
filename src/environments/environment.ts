// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// <>となっている部分は、自分のapiKeyを入力
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDjGGDVEu22MqJm8f-y5J1Wox7h5g7MY-c",
    authDomain: "masalib-hosting.firebaseapp.com",
    databaseURL: "https://masalib-hosting.firebaseio.com",
    projectId: "masalib-hosting",
    storageBucket: "masalib-hosting.appspot.com",
    messagingSenderId: "863123791806"

  }
};
