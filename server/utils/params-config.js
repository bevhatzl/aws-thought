// This file has a singular purpose: to return a configured params object. We'll use a package called uuid that will generate a unique 36-character alphanumeric string, which we'll use as the image file names.
const { v4: uuidv4 } = require('uuid');

const params = fileName => {
  const myFile = fileName.originalname.split('.');
  const fileType = myFile[myFile.length - 1];

  const imageParams = {
    Bucket: 'user-images-7f6a2a9f-699a-40b8-b557-a28634f43d7b',
    Key: `${uuidv4()}.${fileType}`,
    Body: fileName.buffer,
    ACL: 'public-read' // allow read access to this file
  };

  return imageParams;
};

module.exports = params;