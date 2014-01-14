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
  Desc: the router of urls
 */

var resumeCtrller = require("./controller/resume");
var resumeRender  = require('./controller/render');

module.exports = function (app) {

    /************************************************************************/
    /*                Resful: URI Represent a Resource!!!                   */
    /************************************************************************/

    //page
    app.get("/",resumeRender.index);

    //api 
    app.post("/resume/query", resumeCtrller.query);
    
    //can't mapping router
    app.get("*", resumeRender.fourofour);
};