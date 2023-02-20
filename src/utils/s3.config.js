const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const bucketAccessKey = process.env.AWS_ACCESS_KEY;
const bucketSecretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region: bucketRegion,
  accessKeyId: bucketAccessKey,
  secretAccessKey: bucketSecretKey,
});

const uploadFile = (dir, file) => {
  const fileStream = fs.createReadStream(file.path);

  return s3
    .upload({
      Bucket: bucketName,
      Body: fileStream,
      Key: `${dir}/${file.filename}`,
    })
    .promise();
};

const uploadFileBuffer = (dir, buffer) => {
  return s3
    .upload({
      Bucket: bucketName,
      Body: buffer,
      Key: `${dir}/export-${Date.now()}.xlsx`,
    })
    .promise();
};

module.exports = { uploadFile, uploadFileBuffer };
