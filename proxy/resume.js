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
  Time: 4:20 PM
  Desc: the proxy of resume
 */

var models = require("../model");
var Users  = models.users;

/**
 * get resume with query conditions
 * @param  {Object}   conditions the query's conditions
 * @param  {Function} callback   the cb func
 * @return {null}              
 */
exports.getResumeWithConditions = function (conditions, callback) {
    debugProxy("/proxy/resume/getResumeWithConditions");
    var query = Users.find(conditions.query).select();

    if (conditions.pagingInfo) {
        if (conditions.pagingInfo.pageSize && conditions.pagingInfo.pageIndex) {
            debugProxy("enter paging logic");
            query.skip((conditions.pagingInfo.pageIndex - 1) * conditions.pagingInfo.pageSize);
            query.limit(conditions.pagingInfo.pageSize);
        }
    }

    query.exec(callback);
};

/**
 * get resume count with query condition
 * @param  {Object}   conditions the query conditions
 * @param  {Function} callback   the cb func
 * @return {null}              
 */
exports.getResumeCountWithConditions = function (conditions, callback) {
    debugProxy("/proxy/resume/getResumeCountWithConditions");

    Users.count(conditions.query, callback);
};


