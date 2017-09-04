var functions = require('firebase-functions');
const admin = require('firebase-admin');

try {
	admin.initializeApp(functions.config().firebase);
} catch (err) {
	//console.error('Firebase initialization error', err.stack)
}




const request = require('request-promise');
const _ = require('lodash');
// List of output languages.
const LANGUAGES = ['es', 'fr', 'ar', 'ja'];




module.exports = functions.database.ref('/translations/{translationId}').onWrite(event => {


  const snapshot = event.data;
  const promises = [];
  _.each(LANGUAGES, (lang) => {
      console.log(lang)
      promises.push(createTranslationPromise(lang, snapshot));
   })
  return Promise.all(promises)
});
// URL to the Google Translate API.
function createTranslateUrl(lang, text) {
  return `https://www.googleapis.com/language/translate/v2?key=${functions.config().firebase.apiKey}&source=en&target=${lang}&q=${text}`;
}
function createTranslationPromise(lang, snapshot) {
  const key = snapshot.key;
  const text = snapshot.val().english;
  let translation = {}
  return request(createTranslateUrl(lang, text), {resolveWithFullResponse: true}).then(
      response => {
        if (response.statusCode === 200) {
          const resData = JSON.parse(response.body).data;
          translation[lang] = resData.translations[0].translatedText
          return admin.database().ref(`/translations/${key}`)
              .update(translation);
        }
        else throw response.body;
      });
}
