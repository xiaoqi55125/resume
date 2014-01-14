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
  Time: 4:09 PM
  Desc: the enter of the project
 */

var fs           = require("fs");
var path         = require("path");
var express      = require("express");
var router       = require("./router");
var common       = require("./common/error");
var AppConfig    = require("./config").config;
var Loader       = require("loader");
var errorHandler = require("./common/errorHandler");

var cronService  = require("./service/cron");

var assets = {};
if (AppConfig.mini_assets) {
    try {
        assets = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets.json')));
    } catch (e) {
        console.log('You must execute `make build` before start app when mini_assets is true.');
        throw e;
    }
}

var app          = express();

//config for all env
app.configure(function () {
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, 'view'));
    // app.set("view options", {layout : false});
    app.engine('html', require('ejs').renderFile);


    //middleware
    app.use(require('express-partials')());
    app.use(express.compress());
    app.use(express.favicon());

    app.use(express.query());
    app.use(express.bodyParser({ uploadDir : "./uploads"}));

    app.use(express.cookieParser());
    app.use(express.session({
        secret : AppConfig.session_secret,
        cookie : {
            maxAge  : 30 * 60 * 1000      //ms
        }
    }));
});

//custom middleware
// app.use(require("./controllers/login").commonProcess);

var maxAge = 3600000 * 24 * 30;
var staticDir = path.join(__dirname, 'public');

//set static, dynamic helpers
app.locals({
    config: AppConfig,
    Loader: Loader,
    assets: assets
});

//config for devp env
app.configure('development', function () {
    app.use(express.logger());
    app.use("/public", express.static(staticDir));
    app.use(express.errorHandler(
        { showStack : true, dumpException : true }
    ));
});

//config for production env
app.configure("production", function () {
    app.use('/public', express.static(staticDir, { maxAge: maxAge }));
    app.use(express.errorHandler());
    app.set('view cache', true);
});

//error hanlder
errorHandler.appErrorProcess(app);

router(app);

//launch it!
app.listen(AppConfig.port);
console.log("the app server run at port :%d in %s mode. ", AppConfig.port, app.settings.env);

module.exports = app;
