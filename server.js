const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection; //open collaborative database Leon created so we can all contribute to the project

const url = "mongodb+srv://sherrellprimo_db_user:1GLQTaDPIc2ogRAB@cluster0.wajnrkv.mongodb.net/?appName=Cluster0";
const dbName = "demo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs') //ejs is the presentation layer- templates for HTML & CSS
app.use(bodyParser.urlencoded({extended: true})) //app.use means the server is using middle i.e express
app.use(bodyParser.json()) //getting information from the body, turns it into json *not important*
app.use(express.static('public')) //things in the public folder don't need to be routed

app.get('/', (req, res) => { //app.get is getting information for localhost3000 on pageload b/c of '/'
  db.collection('cookies').find().toArray((err, result) => { //this line of code gets data from the messages collection 
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})
// app.post is also called an API endpoint or a route. req- allows you to get info from the user entry, res- allows you to get a response from the server.
app.post('/createCookieContribution', (req, res) => { //post is creating new data or new record to the database
db.collection('cookies')
  .findOneAndUpdate({name: req.body.name}, { //whatever we pass into the parameter, it grabs that info .(findOneandUpdate is specific to Mongo db) to make an update
    
    $inc: {
      thumbDown: 1
    }
  }, {
    sort: {_id: -1},
    upsert: true //upsert means modifying an existing record if you find one, or creating a new one
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/') //redirect tells the browser ti go to a different page
  })

  // name, msg is from the input section in the index.ejs line 32-33
  // db.collection('cookies').insertOne({ 
  //   name: req.body.name, 
  //   dietary: req.body.dietary, 
  //   thumbUp: 0,
  //   thumbDown:1
  //   }, (err, result) => {
  //   if (err) return console.log(err)
  //   console.log('saved to database')
  //   res.redirect('/')
  // })
})

// Create (POST), Read (GET), Update (UPDATE), Delete (DELETE)
app.put('/messages', (req, res) => { //updating changes/data. Changing something that already exists
console.log(req.body) 


db.collection('cookies')
  .findOneAndUpdate({name: req.body.name}, { //whatever we pass into the parameter, it grabs that info .(findOneandUpdate is specific to Mongo db) to make an update
    
    $inc: {
      thumbDown: -1
    }
  }, {
    sort: {_id: -1},
    // upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => { //deleting from the Mongodb database
  db.collection('cookies').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

// Completed with the help from Mentor Cory Rahman