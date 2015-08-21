"use strict";

var RUG = require("../dist");

var rug = new RUG();

rug.getOne(function (user) {
  console.log(user);
});

