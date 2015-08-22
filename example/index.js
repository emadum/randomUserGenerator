"use strict";

var RandomUserGenerator = require("../lib");

var randomUserGenerator = new RandomUserGenerator();

randomUserGenerator.getOne(function (user) {
  console.log(user);
});