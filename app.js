"use strict"

const PORT = 8080
const DATA_PATH = "/data/scores.json"

const fs = require("fs")

const express = require('express')
const app = module.exports = express()
app.set("x-powered-by",false)
app.use(express.json())
app.use(require('cors')())

var scores = []

if(fs.existsSync(DATA_PATH))
{
    scores = JSON.parse( fs.readFileSync(DATA_PATH) )
}

app.get('/',(req,res)=>{
    res.json(scores)
})

app.get('/top/:number',(req,res)=>{
    res.json(scores.slice(0,req.params.number))
})

app.post('/score',(req,res)=>{
    if(req.body.name && req.body.score && typeof req.body.name == "string" && req.body.name.length > 3 && req.body.name.length < 15 && Number.isInteger(req.body.score) )
    {
        scores.push({
            'name': req.body.name,
            'score': parseInt(req.body.score),
            'timestamp': (new Date()).toJSON()
        })
        scores = scores.sort((first,second)=>{
            return second.score - first.score
        })
        fs.writeFile(DATA_PATH, JSON.stringify(scores), (err)=>{})
        res.sendStatus(200)
    }
    else
    {
        res.sendStatus(400)
    }
    
})

app.listen(PORT, () => {
    console.log(`Scoreboard started on port ${PORT}`)
})