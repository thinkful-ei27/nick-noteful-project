'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
  
});
  
describe('404 handler', function () {
  
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
  
});

describe('Get /API/notes test', function () {
    
  it('should respond with an array of 10 objects with keys content, id, and title', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res.body.length).to.equal(10);
        expect(res.body).to.be.an('array');
        for(let x = 0; x < res.body.length; x++){
          expect(res.body[x]).to.be.an('object');
          expect(res.body[x]).to.have.keys(['content', 'id', 'title']);
        }
        //Does not check for correct search results or return an empty array
      });
  });
});

describe('Get /api/notes/:id', function(){

  it('should return the correct note object with id, title, and content', function(){
    return chai.request(app)
      .get('/api/notes/1007')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(['content', 'id', 'title']);
        expect(res.body.id).to.equal(1007);
      });
  });
  it('should return 404 as the id does not exist', function() {
    return chai.request(app)
      .get('/api/notes/1111')
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });
});

describe('Post api/notes', function(){

  it('should create and return new item with location header when provided valid data', function(){
    const testItem = {'title': 'Meowfing but trouble', 'content': 'Horror Noir for Cats'};
    return chai.request(app)
      .post('/api/notes')
      .send(testItem)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res.body).to.have.keys(['content', 'id', 'title']);
        expect(res.body.title).to.equal(testItem.title);
        expect(res.body.content).to.equal(testItem.content);
      });
  });
  it('should return an object with a message "Missing Title" in request body when missing title', function(){
    const testItem ={'content': 'I forgot a title!'};
    return chai.request(app)
      .post('/api/notes')
      .send(testItem)
      .then(function(res){
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('Put /api/notes/:id', function(){

  it('should update and return a note object when given valid data', function(){
    const testItem = {'title': 'I updated the title', 'content': 'I updated the content'};
    return chai.request(app)
      .put('/api/notes/1002')
      .send(testItem)
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(['content', 'id', 'title']);
        expect(res.body.content).to.equal('I updated the content');
        expect(res.body.title).to.equal('I updated the title');
        expect(res.body.id).to.equal(1002);
      });
  });

  it('should respond with 404 status when given an invalid id', function(){
    const testItem = {'title': 'test title', 'content': 'test content'};
    return chai.request(app)
      .put('/api/notes/1111')
      .send(testItem)
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });

  it('should respond with a message "missing title in request body" when that is true', function(){
    const testItem = {'content': 'test content'};
    return chai.request(app)
      .put('/api/notes/1002')
      .send(testItem)
      .then(function(res){
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});