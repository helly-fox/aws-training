const AWS = require('aws-sdk'),
      fse = require('fs-extra');

const writeToCsv = data => {
  const content = data.Contents.map(({Key}) => {
    const [fileName, ...filePathArr] = Key.split('/').reverse();
    return `"/${filePathArr.join('/')}","${fileName}"`
  }).join('\n');

  fse.outputFile(`bucket-list.csv`, content, function(err) {
    if(err) {
      return console.log(err);
    }
  });
};

const getBucketContentToCSV = () => {
  const s3 = new AWS.S3();

  s3.listObjects({Bucket: process.env.BUCKET_NAME}, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      writeToCsv(data);
    }
  });
};

getBucketContentToCSV();
