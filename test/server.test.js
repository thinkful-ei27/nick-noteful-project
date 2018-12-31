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