const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this allows should style syntax
const should = chai.should();

// this lets us make Http requests
chai.use(chaiHttp);

describe('Blog API', function () {

    //activate the server
    before(function() {
        return runServer();
    });

    //close the server
    after(function() {
        return closeServer();
    });

    it('should list blog posts on GET', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');

            res.body.length.should.be.at.least(1);
            const expectedKeys = ['title', 'author', 'content'];
            res.body.forEach(function(item) {
                item.should.be.a('object');
                item.should.include.keys(expectedKeys);
            });
        });
    });

    it('should add a blog post on POST', function() {
        const newItem = {title: 'Ruby is cool', content: 'Ruby is a great language to code in', author: 'Matz'};
        return chai.request(app)
        .post('/blog-posts')
        .send(newItem)
        .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'title', 'content', 'author');
            res.body.id.should.not.be.null;
            // response should be deep equal to `newItem`
            res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id, publishDate: res.body.publishDate}));
        });
    });

    it('should update items on PUT', function() {
        const updateData = {
            title: 'Python is awesome',
            content: 'We should all learn Python'
        };

        return chai.request(app)
        // first get an object to update
        .get('/blog-posts')
        .then(function(res) {
            updateData.id = res.body[0].id;
            updateData.publishDate = res.body[0].publishDate;
            return chai.request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData);
        })
        //prove that the PUT request has right status code
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.deep.equal(updateData);
        });
    });

    it('should delete items on DELETE', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
            res.should.have.status(204);
        });
    });
})
