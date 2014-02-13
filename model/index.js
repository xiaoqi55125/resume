/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 freedom Inc. All Rights Reserved.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ---
  Created with Sublime Text 2.
  Date: Jan 13, 2014
  Time: 2:38 PM
  Desc: the list of model's definition
 */

var mongoose = require("mongoose");
var config   = require("../config").config;

mongoose.connect(config.db, function (err) {
    if (err) {
        debugOther("an error occured at model/index.js. msg: %s", err);
        process.exit(1);
    }
});

require("./user");
require("./login");

exports.users     = mongoose.model("users");
exports.loginInfo = mongoose.model("loginInfos");
