import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
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
    isImportant: {
        type: Boolean,
        default: false
    },
    isRemoved: {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true})

const Note = mongoose.model('notes', NoteSchema);
export default Note;