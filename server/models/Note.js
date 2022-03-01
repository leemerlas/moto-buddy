import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    dueDate: {
        type: Date,
        trim: true
    },
    isImportant: {
        type: Boolean,
        default: false
    },
    subTasks: {
        type: Array,
        default: []
    },
    isRemoved: {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true})

const Note = mongoose.model('notes', NoteSchema);
export default Note;