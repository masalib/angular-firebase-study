var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const request = require('request-promise');
const _ = require('lodash');
// List of output languages.
const LANGUAGES = ['es', 'fr', 'ar', 'ja'];

const mkdirp = require('mkdirp-promise');
// Include a Service Account Key to use a Signed URL
//const gcs = require('@google-cloud/storage')({keyFilename: 'service-account-credentials.json'});
var gcs = require('@google-cloud/storage')({
  projectId: 'angular-study-chat',
  keyFilename: './angular-study-chat-cbe543f3f678.json'
});

const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';


exports.translate = functions.database.ref('/translations/{translationId}').onWrite(event => {
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

//thumbnail

exports.generateThumbnail = functions.storage.object().onChange(event => {
  // File and directory paths.
  const filePath = event.data.name;
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

//  console.log('filePath');
//  console.log(filePath);

  // Exit if this is triggered on a file that is not an image.
  if (!event.data.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a Thumbnail.');
    return;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }

  // Cloud Storage files.
  const bucket = gcs.bucket(event.data.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return file.download({destination: tempLocalFile});
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile]);
  }).then(() => {
    console.log('Thumbnail created at', tempLocalThumbFile);
    // Uploading the Thumbnail.
    return bucket.upload(tempLocalThumbFile, {destination: thumbFilePath});
  }).then(() => {
    console.log('Thumbnail uploaded to Storage at', thumbFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalThumbFile);
    // Get the Signed URLs for the thumbnail and original image.
    const config = {
      action: 'read',
      expires: '03-01-2500'
    };
    return Promise.all([
      thumbFile.getSignedUrl(config),
      file.getSignedUrl(config)
    ]);
  }).then(results => {
    console.log('Got Signed URLs.');
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];
    // Add the URLs to the Database
    return admin.database().ref('images').push({path: fileUrl, thumbnail: thumbFileUrl});
  }).then(() => console.log('Thumbnail URLs saved to database.'));
});
