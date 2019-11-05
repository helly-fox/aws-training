const AWS = require('aws-sdk'),
      fse = require('fs-extra');

const s3 = new AWS.S3();

const downLoadFromBucket = ({Key, VersionId, destinationFolder}) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key,
    VersionId
  };

  s3.getObject(params, (err, res) => {
    if (res && res.Body) {
      fse.outputFile(`${destinationFolder}/${Key}`, res.Body, function (err) {
        if (err) {
          return console.log(err);
        }
      });
    }
  });
};

const downloadBucketContent = (destinationFolder, VersionId) => {
  s3.listObjects({Bucket: process.env.BUCKET_NAME}, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      data.Contents.map(({Key}) => downLoadFromBucket({Key, VersionId, destinationFolder}));
    }
  });
};

downloadBucketContent(process.argv[2], process.argv[3]);
