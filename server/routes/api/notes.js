import express from "express";
import Note from "../../models/Note.js"
import auth from "../../middleware/auth.js";

const router = express.Router();

router.get('/', auth, async(req, res) => {
    try {
        let notes = await Note.find({ isRemoved: false })
        res.json(notes)

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error
        })
    }
})

router.post('/', auth, async(req, res) => {
    try {
        const { title, description } = req.body;

        let note = new Note({
            user: req.user.id,
            title,
            description,
        })

        let newNote = await note.save();
        res.json(newNote)

    } catch (error) {
        
    }
})

router.put('/', auth, async(req, res) => {
    try {
        const { noteId, title, description, isImportant } = req.body;

        let note = await Note.findByIdAndUpdate(noteId, {
            title,
            description,
            isImportant
        }, {new: true})

        res.json(note)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error
        })
    }    
})

router.delete('/', auth, async(req, res) => {
    try {
        const { noteId } = req.body;
        let note = await Note.findByIdAndUpdate(noteId, {
            isRemoved: true
        }, {new: true})

        res.json(note)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error
        })
    }
})


export default router;
