const express = require('express');
let multer = require("multer");


const path = require("path");
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./upoadedBeats");
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString() + file.originalname);
    let filename = new Date().toISOString() + file.originalname;
     req.body.file = filename

    cb(null, filename)
  }
});
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploadedBeats')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })

console.log(storage);
const fileFilter = (req, file, cb) => {
  if (
     file.mimetype === "audio/mpeg" ||
     file.mimetype === "audio/wave" ||
     file.mimetype === "audio/wav" ||
     file.mimetype === "audio/mp3"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
