var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

mongoose.connect(`mongodb+srv://ozgdmir38:${process.env.MONGO_PASSWORD}@cluster0.wbaeibs.mongodb.net/?retryWrites=true&w=majority`);

const postSchema = mongoose.Schema({
    content: String
});

const Post = mongoose.model("Post", postSchema);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/posts', async (req, res) => {
    console.log("Received a GET request");
    const posts = await Post.find();
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    console.log("Received a POST request");
    let content = req.body.content;
    if(content) {
        const newPost = new Post({
            content: content
        });
        const doc = await newPost.save();
        res.send(doc);
    }
});

app.put('/posts/:id', async (req, res) => {
    console.log("Received a PUT request");
    const doc = await Post.findByIdAndUpdate(req.params.id, {content: req.body.content});
    res.send(doc);
});

app.delete('/posts/:id', async (req, res) => {
    console.log("Received a DELETE request");
    await Post.findByIdAndDelete(req.params.id);
    res.send("Succesfully deleted post.");
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});