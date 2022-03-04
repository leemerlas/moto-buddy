import express from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressValidator from 'express-validator';
import config from 'config';
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
    check('firstName', 'First Name is required').exists(),
    check('lastName', 'Last Name is required').exists(),
], 
async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }

    try {
        const { firstName, lastName, contactNumber, city, email, password } = req.body;

        let existingUser = await User.findOne({email: email});

        if (existingUser) {
            return res.status(500).json({ errors: [ { msg: 'Email exists already!' } ] });
        }
            
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

        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token: token, message: "User registered successfully." });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error
        });
    }
})


export default router;
