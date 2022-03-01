import express from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressValidator from 'express-validator';
const { check, validationResult } = expressValidator;
import User from "../../models/User.js";

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        let users = await User.find();
        res.json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error
        })
    }
})

router.post('/',     
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
        check('firstName', 'firstName is required').exists(),
        check('firstName', 'lastName is required').exists(),
    ], 
    async(req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { firstName, lastName, contactNumber, city, email, password } = req.body;
            

            let user = new User({
                firstName,
                lastName,
                contactNumber,
                city,
                email,
                password
            })

            const salt = await bcrypt.genSalt(10);

            let encryptedPassword = await bcrypt.hash(password, salt)
            user.password = encryptedPassword;

            await user.save();

            res.json({
                message: "User registered successfully."
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
                error: error
            });
        }



})


export default router;
