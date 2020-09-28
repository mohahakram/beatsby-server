const env = require("dotenv").config();
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Carts");

router.post("/", async (req, res) => {
    const { user } = req;

    //search cart in db and return message if no cart is found
    await Cart.findOne({ userId: user.id })
        .populate("cartList")
        .then( async (cart) => {
            if (!cart && cart.cartList.length < 1) {
                res.status(400).json({message: "Cart is empty"}) 
            }
            // if items in cart retrun total price
            const price = cart.cartList.reduce((accumulator, item) => {
                    return accumulator + item.price;
            }, 0);

            const total = price * 100;   // multiply by 100, stripe uses cents 

            const paymentIntent = await stripe.paymentIntents.create({
                amount: total ,
                currency: "eur",
                // verify integration in this guide by including this parameter
                metadata: { integration_check: "accept_a_payment" },
            });
            // send back a secret key to client 
            res.send({ clientSecret: paymentIntent.client_secret });
        }).catch( err => console.log(err))
});

module.exports = router;
