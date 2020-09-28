var express = require("express");
var router = new express.Router();
const mongoose = require("mongoose");
const User = require("../models/Users");
const Favourite = require("../models/Favourites");

router.get("/", (req, res) => {
    Favourite.findOne({ userId: { $eq: req.user.id } })
    // .populate('favouriteList')
    .then((dbRes) => {
        console.log(req.user.id)
        res.status(200).json(dbRes);
    }).catch((err) => console.log(err))
});

//* add user favourites in favorites collection
router.post("/add/:id", (req, res) => {
    // deconstruct from req objet to access variables globaly
    const { user, params } = req;
    //find favourites in playlist collection depending on user id
    Favourite.findOne({ userId: user.id })
    .populate('favouriteList')
        .then(async (list) => {
            //check if user already has favourites collection in db
            if (!list) {
                const newFavourite = new Favourite({
                    userId: user.id,
                    favouriteList: params.id,
                });
                //if user doesnt have favourites collection
                //save the new favourite in database
                try {
                    const savedFavourite = await newFavourite.save()
                    .then( dbRes =>
                        User.updateOne({_id: user.id}, {$push: {favourites: dbRes._id}}, {new: true})
                    )
                    console.log(savedFavourite);
                    res.status(200).json({status:"ok", message:"added to favourites"});
                } catch (err) {
                    res.status(400).send(err);
                }
            } else {
                //if collection already exists get the _id and favourites in collection
                //loop through it to check for duplicate before updating
                const listId = list.id;
                dbResList = list.favouriteList;
                const updatedList = [...dbResList];

                if ( dbResList.find( (item) => item.id === params.id) !== undefined) {
                    return res.status(400).json({ status:"error", message: "already liked" });
                } else {
                    updatedList.push(params.id);
                }
                // console.log(updatedList);

                //update db with updated array
                Favourite.updateOne(
                    { _id: listId },
                    {
                        $set: {
                            favouriteList: updatedList,
                        },
                    }
                )
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
                res.status(200).json({status:"ok", message: "added to favourites" });
            }
        })
        .catch((err) => console.log(err));
});

// * delete spacific beat from favourite list in db
router.post('/delete/:id', (req, res) => {
    const {user, params} = req;

    Favourite.findOneAndUpdate(
        {userId: user.id},
        {$pull: {'favouriteList': params.id}}, {new: true}
    ).then( res =>
        console.log(res)
    ).catch( err =>
        console.log(err))
            
    res.status(200).json({status:"ok", message:"deleted from cart"})
})

module.exports = router;
