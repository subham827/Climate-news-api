const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const articles  = [];
const articles1 = [];
const articles2 = [];
let u =0;
// set limit for articles to be scraped
app.use(cors());
const newspapers =[
{
    name: 'guardian',
    url: 'https://www.theguardian.com/environment/climate-crisis',
    base : ""
},
{
    name : 'telegraph',
    url : 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk'
}
]
app.get('/', (req, res) => {
    res.json('Welcome');
})
app.get('/news',(req,res)=>{
    newspapers.forEach((newspaper)=>{
        axios.get(newspaper.url).then((response)=>{
            const html = response.data;
            const $ = cheerio.load(html);
            $('a:contains("limate")',html).each(function(){
                const title = $(this).text().replace("\n","").trim();
                const link = $(this).attr('href');
                articles.push({
                    title,
                    link : newspaper.base + link,
                    source : newspaper.name
                })
            })
        })
    })
    res.json(articles);
    console.log(articles.length);
    u = articles.length;
    for(let i=0;i<articles.length;i++){
        articles2[i] = articles[i];
    }
})
app.get('/news/:newspaperid', async(req,res)=>{
    if(req.params.newspaperid == 'guardian'){
        const url = 'https://www.theguardian.com/environment/climate-crisis';
        const html = await axios.get(url);
        const $ = cheerio.load(html.data);
        $('a:contains("limate")',html.data).each(function(){
            const title = $(this).text().replace("\n","").trim();
            const link = $(this).attr('href');
            articles1.push({
                title,
                link ,
                source : 'guardian'
            })
        })
        res.json(articles1);
    }
    else{
        const url = 'https://www.telegraph.co.uk/climate-change';
        const html = await axios.get(url);
        const $ = cheerio.load(html.data);
        $('a:contains("limate")',html.data).each(function(){
            const title = $(this).text().replace("\n","").trim();
            const link = $(this).attr('href');
            articles1.push({
                title,
                link  : 'https://www.telegraph.co.uk' + link,
                source : 'telegraph'
            })
        })
        res.json(articles1);
    }
})
console.log(articles2.length);
app.get('/news/pages/:pageno', (req,res)=>{
    const pageno = req.params.pageno;
    // convert string to integer
    const page = parseInt(pageno);
    for (let index = (page-1)*10; index < articles2.length; index++) {
        const element = articles2[index];
        res.json(element);
        
    }
})

app.listen(5000, ()=> console.log("5000"))