import express from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressValidator from 'express-validator';
import config from 'config';
const { check, validationResult } = expressValidator;
import auth from '../../middleware/auth.js';
import User from "../../models/User.js";


const router = express.Router();

router.post('/', 
[
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password cannot be empty').exists()
],
async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ errors: [ { msg: 'Invalid credentials' } ] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ errors: [ { msg: 'Invalid credentials' } ] });
        }

        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 7200 },
            (err, token) => {
                if (err) throw err;
                
                res.json({ token });
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
