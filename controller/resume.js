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
  Date: Jan 10, 2014
  Time: 4:19 PM
  Desc: the controller of resume
 */

var Resume   = require("../proxy").Resume;
var check    = require("validator").check;
var sanitize = require("validator").sanitize;
var resUtil  = require("../lib/resUtil");
var config   = require("../config").config;

/**
 * query resume with conditions
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.query = function (req, res, next) {
    debugCtrller("/controller/resume/query");

    var conditions = {};
    try {
        if (req.body.userName) {
            var userName = sanitize(sanitize(req.body.userName).trim()).xss();
            conditions.userName = userName;
        }
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }
    

    //if (req.body.) {};
    
    Resume.getResumeWithConditions(conditions, function (err, result) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        debugCtrller(result);
        return res.send(resUtil.generateRes(result, config.statusCode.STATUS_OK));
    });
};
