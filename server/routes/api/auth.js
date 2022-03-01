import express from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressValidator from 'express-validator';
import User from "../../models/User.js";


const router = express.Router();

router.post('/', async(req, res) => {
    res.json('login')
})

router.post('/logout', async(req, res) => {
    res.json('logout')
})



export default router;
