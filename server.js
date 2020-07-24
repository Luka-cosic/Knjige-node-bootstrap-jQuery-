const express = require('express')
const data = require('./data.json')





const app = express()

app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.json())

app.get('/',(req,res) => {
    res.render('index',{data:data, title:"Knjige"})
})


app.post('/search',(req,res) => {
    let searchVal = req.body.search
    let search = data.filter((el)=> {return el.pisac == searchVal})
    res.send(search)

})

app.post('/get_id',(req,res) => {
    let id = req.body.id;
    let filtered = data.filter(function (el) {
        return el.id == id;
    })
    res.send(filtered)   
})

app.post('/modal',(req,res) => {
    let id = req.body.id;
    let one = data.filter(el=>el.id == id)[0]
    res.send(one)
}
)



app.listen(3000,() => {
    console.log('Listening to port 3000');
    
}
)