const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const app = express();
let db;

app.listen(3000, () => {
  console.log('Done');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let connectionString =
  'mongodb+srv://khalid:k123456k@cluster0.u3q7z.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoClient
  .connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((client) => {
    console.log('Database client connected');
    db = client.db('test');
    const quotesCollection = db.collection('quotes');
  })
  .catch((err) => {
    console.log(err);
  });

app.post('/quotes', (req, res) => {
  console.log(req.body);

  db.collection('quotesCollection')
    .insertOne(req.body)
    .then((result) => {
      console.log('Added');
      res.redirect('/');
    })
    .catch((error) => console.error(error));
});

app.get('/', (req, res) => {
  db.collection('quotesCollection')
    .find()
    .toArray()
    .then((results) => {
      res.render('index.ejs', { data: results });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put('/quotes', (req, res) => {
  db.collection('quotesCollection')
    .findOneAndUpdate(
      { name: 'khalid' },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote,
        },
      },
      { upsert: true }
    )
    .then((result) => {
      res.json('success');
    })
    .catch((err) => {
      console.log(err);
    });
});
