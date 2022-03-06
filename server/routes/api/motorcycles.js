import express from "express";
import fs from 'fs';
import Motorcycle from "../../models/Motorcycle.js"
import auth from "../../middleware/auth.js";

const router = express.Router();

router.get('/', auth, async(req, res) => {
    try {
        let motorcycles = await Motorcycle.find({ user: req.user.id, isRemoved: false }).sort({ model: 1 })
        res.json(motorcycles)

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
        const { brand, model, odo, maxSpeed, kmPerLiter, passengerCount, frontBrake, rearBrake, lastOilChange } = req.body;
        
        let finalName = '';

        if (req.files) {
            let fileName = req.files.file.name.split(".")[0]
            const file = req.files.file;
            const fileType = file.name.split('.').pop()

            // const path = `/${aircraftNumber}/${fileCategory}/${fileDescription}`
            fs.mkdir(`../client/public/static/images/file-uploads`, {recursive: true}, () => {
                file.mv(`../client/public/static/images/file-uploads/${fileName}.${fileType}`, err => {
                    if (err) {
                        console.log(err)
                    }
                })
            });

            finalName = `${fileName}.${fileType}`;
        }
        

        let moto = new Motorcycle({
            user: req.user.id,
            brand,
            model,
            odo,
            maxSpeed,
            kmPerLiter,
            passengerCount,
            frontBrake,
            rearBrake,
            lastOilChange,
            img: finalName
        })

        let newMoto = await moto.save();
        res.json(newMoto)

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error
        })
    }
})

router.put('/', auth, async(req, res) => {
    try {
        const { motoId, brand, model, odo, maxSpeed, kmPerLiter, passengerCount, frontBrake, rearBrake, lastOilChange } = req.body;

        let oldMoto = await Motorcycle.findById(motoId)
        console.log(oldMoto.img);
        oldMoto = oldMoto.img;

        if (req.files) {
            let fileName = req.files.file.name.split(".")[0]
            const file = req.files.file;
            const fileType = file.name.split('.').pop()

            // const path = `/${aircraftNumber}/${fileCategory}/${fileDescription}`
            fs.mkdir(`../client/public/static/images/file-uploads`, {recursive: true}, () => {
                file.mv(`../client/public/static/images/file-uploads/${fileName}.${fileType}`, err => {
                    if (err) {
                        console.log(err)
                    }
                })
            });

            oldMoto = `${fileName}.${fileType}`;
        }

        console.log(req.body);
        let moto = await Motorcycle.findByIdAndUpdate(motoId, {
            brand,
            model,
            odo,
            maxSpeed,
            kmPerLiter,
            passengerCount,
            frontBrake,
            rearBrake,
            lastOilChange,
            img: oldMoto
        }, {new: true})

        res.json(moto)
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
        const { motoId } = req.body;
        let moto = await Motorcycle.findByIdAndUpdate(motoId, {
            isRemoved: true
        }, {new: true})

        res.json(moto)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error
        })
    }
})


export default router;
