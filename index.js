const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// database info
// user: mydbuser1
// password: Y6ZILRyhKUfKaMNC

const uri = "mongodb+srv://mydbuser1:Y6ZILRyhKUfKaMNC@cluster0.swoyo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// OLD STYLE

// client.connect(err => {
//   const collection = client.db("foodMaster").collection("users");
//   console.log('Hitting the database', req.body);
//   const user = {name: 'Opu Biswas', email: 'opu@gmail.com'}
//   collection.insertOne(user)
//     .then(() => {
//       console.log('insert success');
//     })
  

//   // client.close();
// });

// NEW STYLE

async function run() {
  try {
    await client.connect();
    const database = client.db('foodMaster');
    const usersCollection = database.collection('users');

    // GET API

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users)
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const user = await usersCollection.findOne(query);
      console.log('load user with id', id);
      res.send(user);
    })

    // POST API

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser)
      console.log('got new user', req.body);
      console.log('added user', result);
      res.json(result);
    })

    // DELETE API

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      console.log(req.params.id);
      console.log('deleting user with id', result);

      res.json(result);
    })
  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Running my CRUD Server');
})

app.listen(port, () => {
  console.log('Listening to port', port);
})