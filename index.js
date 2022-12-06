const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.port || 4000;

app.use(cors());
app.use(express.json());

// trickbd trickbd

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://trickbd:trickbd@cluster0.fbzlx1v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const collection = client.db("trickBD").collection("blogs");
    // Blog Post API
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await collection.insertOne(blog);
      res.send(blog);
    });

    // All Blog Read API
    app.get("/blogs", async (req, res) => {
      // const sercetitle = req.query.title;
      // if (sercetitle) {
      //   const filter = { title: sercetitle };
      //   const serceBlogs = await collection.find(filter).toArray();
      //   return res.send(serceBlogs);
      // }
      const cursor = collection.find({});
      const blogs = (await cursor.toArray()).reverse();
      res.send(blogs);
    });

    // All Blog sort by view Read API
    app.get("/topBlogs", async (req, res) => {
      const cursor = collection.find({}).sort({ view: -1 });
      const blogs = await cursor.limit(5).toArray();
      res.send(blogs);
    });

    // Singel Blog Read API
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await collection.findOne(query);
      res.send(user);
    });

    // Singel Blog Read API
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.send(result);
    });

    //  Update Blog View
    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateView = req.body;

      const options = { upsert: true };
      const updatedUser = {
        $set: {
          view: updateView.updateView,
        },
      };
      const result = await collection.updateOne(filter, updatedUser, options);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
