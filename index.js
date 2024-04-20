const { MongoClient, ServerApiVersion, ObjectId, MongoUnexpectedServerResponseError } = require('mongodb');
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gry2hbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const userCollection = client.db("brandDB").collection("user");
        const brandsCollection = client.db("brandDB").collection("brands");
        const productCollection = client.db("brandDB").collection("products");

        const options = { ordered: true };
        // await productCollection.insertMany(products, options);

        app.get("/products", async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
            // console.log(result);
        })
        app.get("/brands", async (req, res) => {
            const cursor = brandsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
            // console.log(result);
        });
        app.get("/brands/:brandName", async (req, res) => {
            try {
                const name = req.params.brandName;
                //   console.log(name)
                const query = { brandName: name };

                const result = await productCollection.find(query).toArray();
                //   console.log(result)
                res.send(result);
            } catch (error) {
                console.error("Error fetching products:", error);
                res.status(500).send({ error: "Internal Server Error" }); // Send a generic error response
            }
        });
        app.get("/brands/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            // console.log(result)
            res.send(result);
        })

        app.post("/addproduct", async (req, res) => {
            const newProduct = req.body;
            // console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const product = {
                $set: {
                    image: updatedCoffee.image,
                    name: updatedCoffee.name,
                    brandName: updatedCoffee.brandName,
                    type: updatedCoffee.type,
                    price: updatedCoffee.price,
                    shortDescription: updatedCoffee.shortDescription,
                    rating: updatedCoffee.rating
                }
            }
            const result = await productCollection.updateOne(filter, product, options);
            // console.log(result)
            res.send(result)
        })
        app.post("/users", async (req, res) => {
            const newUser = req.body;
            // console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })
        app.put("/users", async (req, res) => {
            const user = req.body;
            // console.log(user);
            const userId = user.uid;
            const filter = { uid: userId };
            const options = { upsert: true };
            const update = { $set: {} }; // Initialize update object

            // Build the update object dynamically based on user object properties
            for (const key in user) {
                if (key !== 'uid') { // Exclude uid from update (optional)
                    update.$set[key] = user[key];
                }
            }
            const result = await userCollection.updateOne(filter, update, options);
            res.send(result);
        })
        app.put("/user/login", async(req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const options = {upsert: true};
            const latest = {
                $set: {
                    lastLoginAt: user.lastLoginAt
                }
            }
            const result = await userCollection.updateOne(filter, latest, options);
            res.send(result);
            console.log(user.lastLoginAt);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Brand Shop server running");
});

app.listen(port, () => {
    console.log("Server is Running on port: ", port);
})