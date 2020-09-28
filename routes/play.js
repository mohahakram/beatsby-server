const express = require("express");
const router = express.Router();
const { createReadStream } = require("fs");
const { pipeline } = require("stream");
const fs = require("fs");

// * create stream to send chunks of file
router.get("/:name", (req, res) => {
  // The filename is simple the local directory and tacks on the requested url
  var filename = `./uploadedBeats/${req.params.name}`  
  // This line opens the file as a readable stream
  var readStream = fs.createReadStream(filename)   
  // This will wait until we know the readable stream is actually valid before piping
  readStream.on("open", function () {
      // This just pipes the read stream to the response object (which goes to the client)
      res.writeHead(200, {
          "Content-Type": "audio/wav",
      });
      readStream.pipe(res);
  })   
  // catch any errors that happen while creating the readable stream (usually invalid names)
  readStream.on("error", function (err) {
      res.end(err);
  });
});

module.exports = router;
