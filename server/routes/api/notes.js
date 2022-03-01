import express from "express";
import Note from "../../models/Note.js"

const router = express.Router();

router.get('/', async(req, res) => {
    res.json('get notes')
})

router.post('/', async(req, res) => {
    res.json('add notes')
})

router.put('/', async(req, res) => {
    res.json('edit notes')
})

router.delete('/', async(req, res) => {
    res.json('remove notes')
})



export default router;
