const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);


router.post('/', upload.single('file'), async (req,res) => {
        
  const {
    file,
    body: { title, artist, bpm , type }
  } = req;
  
  if (file.detectedFileExtension != ".wav") {
    console.log('invalid file type');
  }
      
  const fileName = artist + ' - ' + title + file.detectedFileExtension;
    await pipeline(
      file.stream,
      fs.createWriteStream(`./uploadedBeats/${fileName}`)
    );
    // console.log(path);
  res.send("File uploaded as " + fileName);
})




module.exports = router;