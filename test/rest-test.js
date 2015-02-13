require('../index');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var fs = require('fs');

describe('REST tests', function(){
  var server = 'localhost:3000';
  var count = fs.readdirSync('./data').length + 1;
  beforeEach(function(){
    var file = JSON.stringify({firstName:'Randy', lastName:'Savage', snapsInto:'Slim Jim'});
    fs.writeFileSync('./data/testFile.json', file, 'utf-8');
  })
  after(function(){
    fs.unlinkSync('./data/testFile.json');
    fs.unlinkSync('./data/' + count + '.json')
  })
  it('should get a directory for GET', function(done){
    chai.request(server)
      .get('/user')
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.contain('files');
        done()
      })
  })
  it('should get single file for GET with param', function(done){
    chai.request(server)
      .get('/user/testFile')
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.contain('Slim Jim');
        done();
      })
  })
  it('should modify test file for PATCH', function(done){
    chai.request(server)
      .patch('/user/testFile')
      .send({oh:'YEAH'})
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(fs.readFileSync('./data/testFile.json', 'utf8')).to.contain('YEAH')
        done();
      });
  })
  it('should replace test file for PUT', function(done){
    chai.request(server)
      .put('/user/testFile')
      .send({firstName:'Hulk', lastName:'Hogan', hates:'machomanrandysavage'})
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(fs.readFileSync('./data/testFile.json', 'utf8')).to.contain('machomanrandysavage');
        done();
      })
  })
  it('should create a new file for POST', function(done){
    chai.request(server)
      .post('/user')
      .send({firstName:'Iron', lastName:'Sheik', move:'Camel Clutch'})
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(fs.readFileSync('./data/' + count + '.json', 'utf8')).to.contain('Camel Clutch')
        done();
      })
  })
})
