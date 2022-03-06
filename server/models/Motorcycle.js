import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MotorcycleSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    odo: {
        type: String,
        required: true,
        trim: true
    },
    maxSpeed: {
        type: String,
        required: true,
        trim: true
    },
    kmPerLiter: {
        type: String,
        required: true,
        trim: true
    },
    passengerCount: {
        type: String,
        required: true,
        trim: true
    },
    frontBrake: {
        type: String,
        required: true,
        trim: true
    },
    rearBrake: {
        type: String,
        required: true,
        trim: true
    },
    lastOilChange: {
        type: Date,
        required: true,
        trim: true
    },
    img: {
        type: String
    },
    isRemoved: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

const Motorcycle = mongoose.model('motorcycles', MotorcycleSchema);
export default Motorcycle;