import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { readFile } from 'fs/promises';
const configData = JSON.parse(await readFile(new URL('./configs.json', import.meta.url)));

import userRoutes from './routes/api/users.js';
import noteRoutes from './routes/api/notes.js';
import authRoutes from './routes/api/auth.js';
import extraRoutes from './routes/api/extras.js'


const app = express();

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))

app.use(cors());

app.use('/api/v1/users', userRoutes); //done
app.use('/api/v1/notes', noteRoutes); //done
app.use('/api/v1/auth', authRoutes); //done
app.use('/api/v1/extras', extraRoutes); //done


app.get('/test', function (req, res) {
    res.json({ msg: 'test' })
})


mongoose.connect(configData.CONNECTION_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => app.listen(configData.SERVER_PORT, () => console.log(`Server running on port: ${configData.SERVER_PORT}`)))
.catch(error => {
    console.error(error.message)
})