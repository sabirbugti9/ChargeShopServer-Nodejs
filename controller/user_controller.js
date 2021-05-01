const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.signUpUserController = async (req, res, next) => {
    let user = User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,

    });
    user = await user.save();

    if (!user)
        return res.status(500).send('The User cannot be created')

    res.send(user);

};
exports.getSingleUser = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid User Id');
    }
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({
            message: 'The Category with the given ID was not found',
        })
    }
    res.status(200).json(user);
};



exports.getUserController = async (req, res, next) => {
    const userList = await User.find().select('-passwordHash');
    console.log("HOn");
    if (!userList) {
        res.status(500).json({
            success: false,
        })
    }
    res.send(userList);
};
exports.loginUserController= async (req,res) => {
    const user = await User.findOne({email: req.body.email})

   const secret = process.env.secret;
    if(!user) {
        return res.status(400).send('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
       
        res.status(200).send({user: user.email , token: token}) 
    } 
    else {
       res.status(400).send('password is wrong!');
    }
}