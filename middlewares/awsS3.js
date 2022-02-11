const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const Photo = require("../models/Photo");
const { ERROR_MESSAGE } = require("../constants");

AWS.config.update({
  accessKeyId: process.env.S3_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: "ap-northeast-2",
});

const s3 = new AWS.S3();
const BUCKET_NAME = "travelphotolog";

const uploadServerImg = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const deleteServerImg = async (req, res, next) => {
  const { id: photoId } = req.params;
  const callback = (error, data) => {
    if (data) {
      next();
      return;
    }

    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  };

  try {
    const { url } = await Photo.findById(photoId).exec();
    const devidedUrl = url.split("/");
    const key = devidedUrl[devidedUrl.length - 1];

    s3.deleteObject(
      {
        Bucket: BUCKET_NAME,
        Key: key,
      },
      (error, data) => callback(error, data)
    );
  } catch (error) {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.uploadServerImg = uploadServerImg;
exports.deleteServerImg = deleteServerImg;
