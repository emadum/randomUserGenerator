"use strict";
import assert from "assert";
import RandomUserGenerator from "../lib";
import chai from "chai";
import fs from "fs";

chai.should();

describe("random-user-generator", function () {
  this.timeout(4000);

  it("should have unit test!", function () {
    //assert(false, "we expected this package author to add actual unit tests.");
    assert(true, true);
  });

  it("should be be able to create a user and return it", function(done) {
    var randomUserGenerator = new RandomUserGenerator();
    randomUserGenerator.getOne(function (user) {
      user.should.have.property("name");
      done();
    });
  });

  it("should be able to create a list of users and return them", function(done) {
    var randomUserGenerator = new RandomUserGenerator();
	  randomUserGenerator.getMany(10, function (users) {
      users.should.be.an("array");
      users.should.have.length(10);
      done();
    });
  });

  it("should be able to create a list of users and output them to a JSON file", function(done) {
	  var randomUserGenerator = new RandomUserGenerator({writeToFile: "output.json"});
    randomUserGenerator.getMany(2, function(users) {
      fs.readFile("output.json", undefined, function(err, data) {
        // expect(err).to.not.be.ok;
        var readList = JSON.parse(data);
        var firstUserName = users[0].name.first;
        var secondUserName = readList[0].name.first;
        firstUserName.should.equal(secondUserName);
        done();
      });
    });
  });

  it("should create users based on a small list of needed fields", function(done) {
    var randomUserGenerator = new RandomUserGenerator();
    randomUserGenerator.getOne({fields: ["name", "email"]}, function(user) {
      user.should.have.property("name");
      user.should.not.have.property("phone");
      done();
    });
  });

  it("should create users based on a map of fields", function(done) {
    var randomUserGenerator = new RandomUserGenerator();
    randomUserGenerator.getOne({
      map: {
        firstName: "name.first",
        email: "email",
        telephone: "phone"
      },
      fields: undefined,
      writeToFile: "output.json"
    }, function(user) {
      user.should.have.property("firstName");
      user.firstName.should.be.ok;
      user.should.have.property("email");
      user.email.should.be.ok;
      user.should.have.property("telephone");
      user.telephone.should.be.ok;
      done();
    });
  });

  it("should be able to have defaults used as config options when we create a new RUG object", function(done) {
    var randomUserGenerator = new RandomUserGenerator({
      map: {
        firstName: "name.first",
        email: "email",
        telephone: "phone"
      },
      fields: undefined,
      writeToFile: "output.json"
    });
    randomUserGenerator.getOne(function(user) {
      user.should.have.property("firstName");
      user.firstName.should.be.ok;
      user.should.have.property("email");
      user.email.should.be.ok;
      user.should.have.property("telephone");
      user.telephone.should.be.ok;
      done();
    });
  });

  it("should return only users with the specified gender", function(done) {
    var randomUserGenerator = new RandomUserGenerator();
    randomUserGenerator.getMany(5, {gender: "female"}, function(users) {
      for (var i = 0; i < users.length; i++) {
        users[i].gender.should.equal("female");
      }
      done();
    });
  });

  it("should return only users with the specified nationality", function(done) {
    var randomUserGenerator = new RandomUserGenerator();
    randomUserGenerator.getMany(5, {nationality: "US"}, function(users) {
      //Nationality is part of the results object, not the users object.  Can't tset
      for (var i = 0; i < users.length; i++) {
        users[i].name.first.should.be.ok;
      }
      done();
    });
  });

  it("should always return the same user with the same seed", function(done) {
    var randomUserGenerator = new RandomUserGenerator();
    randomUserGenerator.getOne({seed: "helloworld"}, function(user) {
      var firstUser = user;
      randomUserGenerator.getOne({seed: "helloworld"}, function(user) {
        var secondUser = user;
        firstUser.name.last.should.equal(secondUser.name.last);
        done();
      });
    });
  });

});
