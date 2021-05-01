const express = require("express");
const router = express.Router();




const { loginUserController, getUserController, signUpUserController, getSingleUser } = require('../controller/user_controller');

router.post('/signUp', signUpUserController),
    router.post('/login', loginUserController),

    router.get('/', getUserController),


    router.get('/:id', getSingleUser),


    module.exports = router;
