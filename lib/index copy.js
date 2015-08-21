// "use strict";

// var request = require("request");
// var fs = require("fs");

// var config = {
//   writeToFile: false
// };

// /**
//  * Constructor
//  * defaults: list of options to override the config object
//  **/
// var RUG = function (defaults) {
//   //constructor
//   this.API_URL = "randomuser.me/api";
//   this.LOGGER = true;

//   if (defaults && defaults.writeToFile !== undefined) {
//     config.writeToFile = defaults.writeToFile;
//   }
// };

// /**
//  * getOne
//  * This function will return a single user
//  * cb: A callback function that is called when the function is done
//  * The parameter of the function is the single user object
//  **/
// RUG.prototype.getOne = function (options, cb) {
//   //If there is no options, cb is the first param
//   if (cb === undefined && typeof options === "function") {
//     cb = options;
//     options = undefined;
//   }

//   this.log("Intiating getOne() function");
//   var self = this;

//   this.getMany(1, options, function (users) {    
//     if (config.writeToFile) {
//       self.outputToFile(users);
//     }

//     cb(users[0]);
//   });

//   return;
// };

// /**
//  * getMany
//  * This function returns a group of users
//  * howMany: A number indicating the number of users in the array
//  * cb: A callback function that is called when the function is done
//  * The parameter of the function is an array of users
//  **/
// RUG.prototype.getMany = function (howMany, options, cb) {
//   //If there is no options, cb is the first param
//   if (cb === undefined && typeof options === "function") {
//     cb = options;
//     options = undefined;
//   }

//   if (options === undefined) {
//     options = {};
//   }

//   if (typeof howMany !== "number") {
//     throw "The first parameter of getMany() should be a number";
//   }

//   this.log("Intiating getMany() function");
//   var self = this;

//   request.get("http://" + this.API_URL + "?results=" + howMany, function (error, response, body) {
//     if (error) {
//       throw "Could not reach server";
//     }

//     self.log("Got a valid response");

//     body = JSON.parse(body);

//     //If the API is down, it send an object with an error property
//     if (body.error) {
//       throw body.error;
//     }

//     var users = [];

//     for (var i = 0; i < howMany; i++) {
//       //Transform users
//       // var newUser = {};
//       // if (options && options.fields.length > 0) {
//       //   //Only specific fields
//       //   for (var j = 0; j < options.fields.length; j++) {
//       //     var selectedField = options.fields[j];
//       //     newUser[selectedField] = (body.results[i].user[selectedField]) ? body.results[i].user[selectedField] : undefined;
//       //   }
//       // } else if (options && options.map) {
//       //   //Map the fields
//       //   for (var field in options.map) {
//       //     var target = options.map[field];

//       //     //check for deep fields (ie name.first)
//       //     var fieldValue;
//       //     if (field.indexOf(".") > -1) {
//       //       var fields = field.split(".");
//       //       //according to the current documentation, it can't be deeper than 2 levels
//       //       fieldValue = body.results[i].user[fields[0]][fields[1]];
//       //     } else {
//       //       fieldValue = body.results[i].user[field];
//       //     }
//       //     //Add to the new User
//       //     newUser[target] = fieldValue;
//       //   }
//       // } else {
//       //   newUser = body.results[i].user;
//       // }
//       var newUser;
//       newUser = self.cherryPickFields(body.results[i].user, options.fields);

//       //Then push it
//       users.push(newUser);
//     }

//     //TODO Fix this code smell
//     if (config.writeToFile) {
//       self.outputToFile(users, function () {
//         cb(users);
//       });
//     } else {
//       cb(users);
//     }
//   });

//   return;
// };

// /**
//  * log
//  * A simple and naive console logger
//  * text: The text to be logged
//  **/
// RUG.prototype.log = function (text) {
//   if (this.LOGGER) {
//     console.log(text);
//   }

//   return true;
// };

// /**
//  * outputToFile
//  * This function outputs data to a filename that is specified in the config.writeToFile
//  * data: Data to write to file
//  * cb: The callback function
//  **/
// RUG.prototype.outputToFile = function (data, cb) {
//   var filename = config.writeToFile || "output.txt";

//   this.log("Outputting to file " + config.writeToFile);

//   fs.writeFile(filename, JSON.stringify(data), function (err) {
//     if (err) {
//       throw err;
//     }

//     cb(data);
//   }); 
// };

// RUG.transformUser = function(original, options) {
//   var user = original.user;
//   var newUser;

//   if (options && options.fields.length > 0) {
//     //Only specific fields
//     for (var j = 0; j < options.fields.length; j++) {
//       var selectedField = options.fields[j];
//       newUser[selectedField] = (user[selectedField]) ? user[selectedField] : undefined;
//     }
//   }

//   if (options && options.map) {

//   }

//   if (options === undefined || (options.fields.length <= 0 && !options.map)) {
//     newUser = user;
//   }

//   return user;
// };

// RUG.cherryPickFields = function(user, fields) {
//   var newUser;

//   if (fields === undefined) {
//     newUser = user;
//   }

//   for (var j = 0; j < fields.length; j++) {
//     var selectedField = fields[j];
//     newUser[selectedField] = (user[selectedField]) ? user[selectedField] : undefined;
//   }

//   return newUser;
// };

// export default RUG;
