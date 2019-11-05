const AWS = require('aws-sdk'),
      fs = require('fs'),
      path = require('path');

const mimeTypes = {
  'html': 'text/html',
  'js': 'text/javascript',
  'css': 'text/css',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'wav': 'audio/wav',
  'mp4': 'video/mp4',
  'woff': 'application/font-woff',
  'ttf': 'application/font-ttf',
  'eot': 'application/vnd.ms-fontobject',
  'otf': 'application/font-otf',
  'wasm': 'application/wasm'
};

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

const uploadStaticSite = (folderPath, bucketName) => {
  const s3 = new AWS.S3({apiVersion: '2006-03-01', region: "eu-central-1"});

  walkSync(folderPath, function(filePath) {
    let bucketPath = filePath.substring(filePath.indexOf('/') + 1);
    let [ext, ...rest] = bucketPath.split('.').reverse();
    let params = {Bucket: bucketName, Key: bucketPath,  Body: fs.readFileSync(filePath), ContentType: mimeTypes[ext], ACL: 'public-read' };
    s3.putObject(params, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Successfully uploaded '+ bucketPath +' to ' + bucketName);
      }
    });
  });
};

uploadStaticSite(process.argv[2], process.env.BUCKET_NAME);
