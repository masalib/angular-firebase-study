var functions = require('firebase-functions');
//const lighthouseReporter = require('lighthouse-reports');
//const lighthouse = require('lighthouse');
const lighthouse = require('lighthouse');
const chromeLauncher = require('lighthouse/chrome-launcher');


module.exports = functions.https.onRequest((req, res) => {
      res.send("Hello from Firevase!");
      console.log('helloWorld');


	function launchChromeAndRunLighthouse(url, flags = {}, config = null) {
	  return chromeLauncher.launch().then(chrome => {
	    flags.port = chrome.port;
	    return lighthouse(url, flags, config).then(results =>
	      chrome.kill().then(() => results));
	  });
	}

	const flags = {};
	//const flags = {logLevel: 'info', output: 'json'};
	// Usage:
	launchChromeAndRunLighthouse('https://angular-study-chat.firebaseapp.com/', flags).then(results => {
	  // Use results!
		console.log(results);
		console.log('helloWorld1.5');

	});

      console.log('helloWorld2');

//      lighthouse('https://angular-study-chat.firebaseapp.com/')
//       .then(results => {
//         console.log('magic here');
//      });

//  lighthouseReporter.run('https://angular-study-chat.firebaseapp.com/')
//    .then(data => {
//        res.send( data.audits); // do something with the audits 
//    });

});

