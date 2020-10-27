const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { createServer } = require('http');
const mongoose = require('mongoose');
const User = require('../models/Users');
const Beat = require('../models/Beats');

//* get every beat in database
router.get("/", async (req, res) => {

    try {
        let music = await Beat.find();
        res.status(200).json(music);
    } catch (err) {
        res.status(500).json(err);
    }
});

//* play specific beat   
router.get("/play/:name", (req,res) => {
    // const server = createServer((req, res) => {
        const path = "./uploadedBeats/" + req.params.name;
        //automatically destroy res if there is an error
        pipeline(fs.createReadStream(path),pipe(res), (err) => {
            if(err) console.error(err)
        })
    // })
})

//* uplaod beat
router.post("/upload", upload.single('audioFile'), async (req, res) => {
    //destructuring request to access variables 
    const {
        file,
        body: { userId, title, artist, featureArtist, bpm, type, contract, price }
    } = req;

    //! check for file type and size
    if (file.detectedFileExtension != ".wav") {
        res.status(400).json({   status: "error", 
                                    type: "file type", 
                                    msg: "Invalid file format. Please upload only . wav or .mp3 file"});
    } else if (file.size > 70000000){
        res.status(400).json({  status: "error", 
                                type:"file size", 
                                message:"Maximum file size is 70Mb"})
    } else {
        // create file name with variables passed in and saving to directory
        const fileName = new Date().toISOString() + artist + ' - ' + title + file.detectedFileExtension;
        const path = await pipeline(
            file.stream,
            fs.createWriteStream(`./uploadedBeats/${fileName}`)
            );
        
        // create new Beat object and poplulate with received variables
        try {
            const newBeat = new Beat({
                userId: userId,
                title: title,
                artist: artist,
                featureArtist: featureArtist != 'undefined' ?  featureArtist : "",
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

            // write the object in database
            let savedBeat = await newBeat.save()
            .then(dbRes => 
                User.updateOne({_id: userId}, { $push: {beats: dbRes.id} })    
            )
            .then( dbRes => res.status(200).json({
                status: "success",
                type: "upload",
                msg: "uploaded succesfully"}))
            .catch((err) => {
                res.status(400).json({
                    status: "error",
                    type: "upload",
                    msg: "Couldn't upload. Please try again later"
                });
            })
        } catch (err) {
            res.status(500).json({
                status: "error",
                type: "upload",
                msg: "something went wrong, please try again later"
            });
            console.log(err);
        }
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