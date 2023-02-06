require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
const checkAuth = require("./middlewares/checkAuth")


const app = express();

app.use(express.json());
app.use(cors());


let client;
initializeDatabase = async ()=>{
    try {

        client = await  mongodb.connect(
            process.env.MONGO_URI,
            { useNewUrlParser: true, useUnifiedTopology: true }
          );
    
          console.log("db connected");


        /*commented code takes care of database initialization during development */ 

        //   let db = client.db("e-listings")

        // await db.collection("orders").deleteMany({})
        // let orderItems =  await csvtojson().fromFile("./data/olist_order_items_dataset.csv").then(csvData => { return csvData })
        // await db.collection("orders").insertMany(orderItems)
        
        // await db.collection("sellers").deleteMany({})
        // let sellers =  await csvtojson().fromFile("./data/olist_sellers_dataset.csv").then(csvData => { return csvData })
        // await db.collection("sellers").insertMany(sellers)
        
        // await db.collection("products").deleteMany({})
        // let products = await  csvtojson().fromFile("./data/olist_products_dataset.csv").then(csvData => { return csvData })
        // await db.collection("products").insertMany(products)
        
    } catch (error) {
        console.log(error.message);
    }   
};


initializeDatabase();


app.get("/order-items",checkAuth,async (req,res,next)=>{

    try {
        const { sort = "price", page = 1, limit = 20 } = req.query;
        const offset = (page-1)*limit;
        const count = await client.db("e-listings").collection("orders").countDocuments();
        const orders = await client.db("e-listings").collection("orders").find({seller_id:req.user.username}).sort({[sort]:1}).limit(limit * 1).skip(offset).toArray();

        res.json({orders,total:count,limit,offset,page});
        
    } catch (error) {
        res.status(500).send(error.message);
    }

});


app.delete("/order-items/:id",checkAuth,async (req,res,next)=>{
   

    try {

        const orderId = req.params.id;

        const result = await client.db("e-listings").collection("orders").deleteOne({order_id:orderId
        });

        res.status(204).send("");
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        }); 
    }

    
});


app.patch("/account",checkAuth,async (req,res,next)=>{
     const {seller_city,seller_state} = req.body;

    try {

        const result = await client.db("e-listings").collection("sellers").updateOne({seller_id:req.user.username
        },{ $set:{
            seller_city,seller_state

        }
        },{
            new:true
        });

        res.status(200).json({ seller_city,seller_state
        });
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        }); 
    }

    
});

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log("Server running on port 4000");
});



module.exports = app;
module.exports.client = client;