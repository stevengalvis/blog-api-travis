const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./model');


//add some blog posts so there's databases
BlogPosts.create(
                'Python is a great first language',
                'Python is a very good scripting language',
                'Guido van Rossum');
BlogPosts.create(
                'Java is not fun',
                'Java is the first language I learned and I did not like it',
                'James Gosling');
BlogPosts.create('Javascript is interesting',
                'I like JavaScript because its simpler than Java',
                'Brendan Eich');

// when the root of this router is calld with GET, return
// all current Blog Posts
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

// make sure when new blog post is posted required fields
// (title' 'author' and 'content') if not log an error and return a 400 status
// if okat add new item and return it with a 201
router.post('/', jsonParser, (req, res) => {
    //ensure title content and author are in request body
    const requiredFields = ['title', 'author', 'content'];
    for (let i=0; i<requiredFields; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(post);
});

// when delete request comes in with an id in path,
// try to delete that item from the BlogPosts
router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted shopping list item \`${req.params.id}\``);
    res.status(204).end();
});

// when PUT requst come in with updated post,
// make sure it has required fields and the item id in the url path
// matches the id in the updated item object.
router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'author', 'content', 'id'];
    for (let i=0; i<requiredFields.lenght; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating Blog Post item \`${req.params.id}\``);
    const updatedPost = BlogPosts.update({
        id: req.params.id,
        author: req.body.author,
        content: req.body.content,
        title: req.body.title
    });
    res.json(updatedPost);

});

module.exports = router;
