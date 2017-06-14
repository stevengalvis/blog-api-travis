const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const blogPostsRouter = require('./blogPostsRouter');

const {BlogPosts} = require('./model');



const jsonParser = bodyParser.json();
const app = express();
app.use(morgan('common'));

app.use('/blog-posts', blogPostsRouter);
//both runServer and closeServer need to access the same
//server object, so we decalre server here,
//when runServer runs, it assigns a value
let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve(server);
        }).on('error', err => {
            reject(err)
        });
    });
}

function closeServer() {
    return new Promise((resolve ,reject) => {
        console.log(`Closing Server`);
        server.close(err => {
            if(err) {
                reject(err);
                return
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
