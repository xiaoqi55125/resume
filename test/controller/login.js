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
  Date: Jan 22, 2014
  Time: 9:33 AM
  Desc: the test of login
 */

var request = require("supertest");
var should  = require("should");
var app     = require("../../app");

describe('test for /controller/login.js', function () {

    it('is testing func: /signup', function (done) {
        var param = {
            userName : "yd",
            password : "kajsdfkjalsdf"
        };

        request(app).post("/signup").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            done();
        });
        
    });

    it('is testing func: /signin', function (done) {
        var param = {
            auth  : {
                userName    : "yd",
                passwd      : "kajsdfkjalsdf",
                captchaCode : "asdf"
            }
        };

        request(app).post("/signin").send(param).expect(200).end(function (err, res) {
            if (err) {
                return done(err);
            }

            done();
        });
        
    });

});

