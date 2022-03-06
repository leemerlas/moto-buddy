import express from "express";
import fetch from "node-fetch";
import { readFile } from 'fs/promises';
import querystring from 'querystring';
const configData = JSON.parse(await readFile(new URL('../../configs.json', import.meta.url)));

const router = express.Router();

router.get('/gas-price', async(req, res) => {
    try {
        let response = await fetch("https://www.globalpetrolprices.com/Philippines/gasoline_prices/");
        let body = await response.text();
        body = body.toString();
        let responseBody = body.match(/(\<td height="\d+" align="[a-z]+">\d+\.\d+<\/td>)/g)
        responseBody = responseBody.toString()
        let currentPrice = parseFloat(responseBody.match(/(\d+\.\d+)/g)[0])
        currentPrice = Math.round(currentPrice * 100) / 100
        
        res.json({
            gasPrice: currentPrice
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({  
            message: "Server error",
            error: error.message
        })
    }
})

router.get('/news', async(req, res) => {
    try {
        let response = await fetch("https://newsapi.org/v2/everything?domains=motorcycle.com&apiKey=8fe1a2d0cee8406da93431debf421f6c")
        let news = await response.json();

        let newsIndex = news.articles.length;
        newsIndex = Math.floor((Math.random()*newsIndex) + 1); 

        let newsContent = news.articles[newsIndex-1]
        newsContent['description'] = newsContent['description'].split(" more")[0]

        res.json(newsContent)
    } catch (error) {
        console.error(error);
        res.status(500).json({  
            message: "Server error",
            error: error.message
        })
    }
})

// router.post('/spotify-token', async(req, res) => {
//     let redirect_uri = 'http://localhost:5000/api/v1/extras/callback';

//     res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//         response_type: 'code',
//         client_id: configData.SPOTIFY_CLIENT,
//         redirect_uri: redirect_uri,
//         scope: "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state"
//     }));
// })

// router.get('/callback', async(req, res) => {
//     let redirect_uri = 'http://localhost:5000/api/v1/extras/callback';
//     let code = req.query.code || null;
//     console.log(code);
//     let state = req.query.state || null;

//     if (state === null) {
//         console.log('here');
//         res.redirect('/#' +
//           querystring.stringify({
//             error: 'state_mismatch'
//           }));
//     } else {
//         let authOptions = {
//             url: 'https://accounts.spotify.com/api/token',
//             form: {
//               code: code,
//               redirect_uri: redirect_uri,
//               grant_type: 'authorization_code'
//             },
//             headers: {
//               'Authorization': 'Basic ' + (new Buffer(configData.SPOTIFY_CLIENT + ':' + configData.SPOTIFY_SECRET).toString('base64'))
//             },
//             json: true
//         };
//     }

//         // let details = {
//         //     code: code,
//         //     grant_type: 'authorization_code',
//         //     redirect_uri: redirect_uri
//         // };

//         // let formBody = [];
//         // for (let property in details) {
//         //     let encodedKey = encodeURIComponent(property);
//         //     let encodedValue = encodeURIComponent(details[property]);
//         //     formBody.push(encodedKey + "=" + encodedValue);
//         // }

//         // formBody = formBody.join("&");

//         // fetch(`https://accounts.spotify.com/api/token`, {
//         //     method: 'POST',
//         //     headers: {
//         //         'Accept': '*/*',
//         //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         //         'Authorization': 'Basic ' + (new Buffer(configData.SPOTIFY_CLIENT + ':' + configData.SPOTIFY_SECRET).toString('base64'))
//         //     },
//         //     body: formBody,
//         // })
//         // .then(res => console.log(res))
//         // // .then(data => {
//         // //     console.log(data);
//         // // })
// })


export default router;
