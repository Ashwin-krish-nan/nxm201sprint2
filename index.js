const express = require("express")
const {connection} = require("./config/db")
const {user_route} = require("./route/user.route")
const {authenticate} = require("./middleware/auth.middleware")
const {authorise} = require("./middleware/authorise.middleware")
const fs = require("fs")

const app = express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("WELCOME")
})

app.use("/",user_route)

app.use(authenticate)

app.get("/products",(req,res)=>{
    res.send("products")
})

app.get("/addproducts",authorise(["seller"]),(req,res)=>{
    res.send("addedproducts")
})

app.get("/deleteproducts", authorise(["seller"]),(req,res)=>{
    res.send("deletedproducts")
})

app.get("/logout",(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];
    const blacklisted_data = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    blacklisted_data.push(token)
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisted_data))
    res.send("Logout successful")
})

app.listen(3000,async ()=>{
    try {
        await connection
        console.log("DB connected");
    } catch (error) {
        console.log(error);
        console.log("DB dose not connected");
    }
    console.log("Port @ localhost:3000");
})