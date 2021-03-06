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
var loginCtrller  = require("./controller/login");

module.exports = function (app) {

    /************************************************************************/
    /*                Resful: URI Represent a Resource!!!                   */
    /************************************************************************/

    //page
    app.get("/",resumeRender.index);
    app.get("/upload",resumeRender.upload);
    app.get("/resume/source/:fileName", resumeCtrller.sourceFile);
    app.get("/login",resumeRender.showLogin);
    app.get("/addUser",resumeRender.addUser);
    

    //api 
    app.post("/resume/query", resumeCtrller.query);
    app.post("/resume/upload", resumeCtrller.upload);
    app.get("/captchaImg", loginCtrller.captchaImg);
    app.post("/signin", loginCtrller.signIn);
    app.post("/signup", loginCtrller.signUp);
    app.get("/signout", loginCtrller.signOut);
    
    //can't mapping router
    app.get("/404", resumeRender.fourofour);
    app.get("*", resumeRender.fourofour);
};