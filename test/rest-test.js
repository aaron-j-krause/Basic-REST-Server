require('../index');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var fs = require('fs');

describe('REST tests', function(){
  var server = 'localhost:3000';
  before(function(){
    var file = JSON.stringify({firstName:'Randy', lastName:'Savage', snapsInto:'Slim Jim'});
    count = fs.readdirSync('./data').length;
    fs.writeFileSync('./data/testFile.json', file, 'utf-8');

  })
  after(function(){
    fs.unlinkSync('./data/testFile.json');
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
      .put('/user/testFile')
      .send({oh:'YEAH'})
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.contain('YEAH');
        expect(fs.readFileSync('./data/testFile.json', 'utf8')).to.contain('Randy')
        done();
      });
  })
})
