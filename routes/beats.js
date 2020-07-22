const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const mongoose = require('mongoose');
const Beat = require('../models/Beats')

//* get every beat in database
router.get("/", async (req, res) => {

    try {
        let music = await Beat.find();
        res.status(200).json(music);
    } catch (err) {
        res.status(500).json(err);
    }
});

//* uplaod beat
router.post("/upload", upload.single('audioFile'), async (req, res) => {

    console.log(req.body);
    console.log(req.file);

    //destructuring to access variables
    const {
        file,
        body: { title, artist, featureArtist, bpm, type, contract, price }
    } = req;

    // if (audioFile.detectedFileExtension != ".wav" || audioFile.detectedFileExtension != ".mp3") {
    //     res.status(400).send('Invalid format. Please upload only . wav or .mp3 files');
    // } else if (audioFile.size > 70000000){
    //     res.status(400).send('Maximum file size is 70Mb')
    // }
    
    
    //* create file name with variables passed in and saving to directory
    const fileName = new Date().toISOString() + artist + ' - ' + title + file.detectedFileExtension;
    const path = await pipeline(
        file.stream,
        fs.createWriteStream(`./uploadedBeats/${fileName}`)
    );

    // res.send("File uploaded as " + fileName);
        //* create new Beat object and poplulate with received variables
    try {
        const newBeat = new Beat({
            title: title,
            artist: artist,
            featureArtist: featureArtist,
            bpm: bpm,
            type: type,
            contract: contract,
            price: price,
            audioFile: {
                fileName: fileName,
                path: './uploadedBeats/'+fileName,
                originalName: file.originalName,
                mimeType: file.detectedMimeType,
                size: file.size
            }
        });

        //*write the object in database
        let savedBeat = await newBeat.save();
        res.status(200).json({ data: savedBeat });
    } catch (err) {
        res.status(500).json({ error: err });
    }

});

//* delete specific beat using passed in id
router.delete("/delete/:musicId", async (req, res) => {

    try {
        const id = req.params.musicId;
        let result = await Beat.remove({ _id: id });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;