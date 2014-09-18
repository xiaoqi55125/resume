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
  Date: Jan 20, 2014
  Time: 3:50 PM
  Desc: the proxy of login
 */

var models    = require("../model");
var LoginInfo = models.loginInfo;

/**
 * get user auth info by user name
 * @param  {userName}   user name
 * @param  {Function} callback call back
 * @return {null}            
 */
exports.getUserAuthInfoByUserName = function(userName, callback) {
    debugProxy("/proxy/login/getUserAuthInfoByUserName");
    
    var query = LoginInfo.findOne({ userName : userName }).select();
    query.exec(callback);
};

/**
 * create a account
 * @param  {Object}   accountEntity the entity of LoginInfo
 * @param  {Function} callback      the cb func
 * @return {null}                 
 */
exports.createAccount = function (accountEntity, callback) {
    debugProxy("/proxy/login/createAccount");
    accountEntity.save(callback);
};