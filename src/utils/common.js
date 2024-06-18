const config = require("dotenv").config();
const s3 = require("../handlers/aws");

const bucketName = process.env.AWS_BUCKET_NAME
  ? process.env.AWS_BUCKET_NAME
  : "";

module.exports.getS3PublicUrl = async (bucketName, key) => {
  const region = process.env.AWS_REGION;
  let url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  return url;
};
