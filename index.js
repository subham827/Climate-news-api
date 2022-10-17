const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const articles  = [];

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
newspapers.forEach((newspaper)=>{
    axios.get(newspaper.url).then((response)=>{
        const html = response.data;
        const $ = cheerio.load(html);
        $('a:contains("limate")',html).each(function(){
            const title = $(this).text().replace("\n","").trim();
            const link = $(this).attr('href');
            // const image = $(this).find('img').attr('src');
            articles.push({
                title,
                link : newspaper.base + link,
                source : newspaper.name,
                
            })
        })
    })
})
app.get('/', (req, res) => {
    res.json('Welcome');
})
app.get('/news',(req,res)=>{
    res.json(articles);
    console.log(articles.length);
    u = articles.length;
   
})
app.get('/news/:newspaperid', async(req,res)=>{
    if(req.params.newspaperid == 'guardian'){
      res.json(articles.filter((article)=>article.source == 'guardian'));
    }
    else{
        res.json(articles.filter((article)=>article.source == 'telegraph'));
    }
})
console.log(articles2.length);
app.get('/news/pages/:pageno', (req,res)=>{
    const pageno = req.params.pageno;
    // convert string to integer
    const page = parseInt(pageno);
  // filter first 10 articles
    const first10 = articles.slice((page-1)*10,page*10);
    res.json(first10);

})

app.listen(5000, ()=> console.log("5000"));
