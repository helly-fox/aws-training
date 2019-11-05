const AWS = require('aws-sdk'),
      fse = require('fs-extra');

const s3 = new AWS.S3();

const downLoadFromBucket = (Key, destinationFolder) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key
  };

  s3.getObject(params, (err, { Body }) => {
    fse.outputFile(`${destinationFolder}/${Key}`, Body, function(err) {
      if(err) {
        return console.log(err);
      }
    });
  });
}

const downloadBucketContent = () => {
  s3.listObjects({Bucket: process.env.BUCKET_NAME}, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      data.Contents.map(({Key}) => downLoadFromBucket(Key, destinationFolder));
    }
  });
}

downloadBucketContent(process.argv[2]);
