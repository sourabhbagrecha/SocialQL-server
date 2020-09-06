const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { getUserId } = require("../middlewares/auth");
const config = require("config");

const accessKeyId = config.get("AWS.ACCESS_KEY_ID");
const secretAccessKey = config.get("AWS.AWS_SECRET_ACCESS_KEY");

const Bucket = "learning-graphql-demo";

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});

const singleUploadStream = async (parent, args, context) => {
  const { file, key } = args;
  const userId = getUserId(context);
  const { filename, mimetype, createReadStream } = await file;
  const fileStream = createReadStream();

  const uploadParams = {
    Bucket,
    Key: `${key}-${userId}-${filename}`,
    Body: fileStream,
  };
  const result = await s3.upload(uploadParams).promise();
  return {
    url: result.Location,
    key,
  };
};

const getSignedUrl = ({Key}) => {
  const signedUrlExpireSeconds = 60 * 5

  const url = s3.getSignedUrl('putObject', {
      Bucket,
      Key,
      Expires: signedUrlExpireSeconds,
  });

  return url;
}

module.exports = { s3, singleUploadStream, getSignedUrl };
