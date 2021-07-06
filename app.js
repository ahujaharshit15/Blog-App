const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//DATABASE
mongoose.connect("mongodb://localhost:27017/blog", { useNewUrlParser: true, useUnifiedTopology: true })
const blogSchema = new mongoose.Schema({
    title: String,
    details: String
});
const BlogDB = mongoose.model("post", blogSchema);


app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.set('useFindAndModify', false);


app.get("/", function (req, res) {
    res.render("home")
})

app.get("/create", function (req, res) {
    res.render("create")
})

app.get("/view", function (req, res) {

    BlogDB.find({}, function (err, docs) {
        if (err) {
            console.log(err)
            res.render("error");
        }
        else if (docs.length === 0) {
            res.render("noPosts")
        }
        else {
            res.render("view", { post: docs })
        }
    })
})


app.get("/confirmed", function (req, res) {
    res.render("confirmed")
})

app.post("/create", function (req, res) {

    const { title, details } = req.body;

    const newPost = new BlogDB({ title: title, details: details });
    newPost.save(function () {
        console.log("New post added to the database.")
    })

    res.redirect("/confirmed")
})

app.post("/deleteOne", function (req, res) {
    BlogDB.findOneAndRemove({ _id: req.body.deleteID }, function () {
        console.log("Post with id '" + req.body.deleteID + "' deleted successfully.");
        res.redirect("/view")
    })
})



app.get("*", function (req, res) {
    res.render("error")
})

const port = 3021;
app.listen(port, () => {
    console.log("The server has been started at port " + port)
})