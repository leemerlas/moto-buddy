import express from "express";
import fetch from "node-fetch";

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

        // console.log();

        let newsContent = news.articles[newsIndex-1]
        console.log(newsContent['description']);
        console.log(newsContent['description'].split(" more"));  
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


export default router;
