const config = require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: process.env.REGION,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

module.exports = s3;
