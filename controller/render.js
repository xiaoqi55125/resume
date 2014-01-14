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
  Time: 3:55 PM
  Desc: the controller for render page
  */

/**
 * 404 error controller
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
 exports.fourofour=function (req, res, next){
  debugCtrller("/controller/render/fourofour");
  res.render('error/404');
};

exports.index = function (req, res, next) {
  debugCtrller("/controller/render/index");
  res.render('subview/index');
}

exports.upload = function (req, res, next) {
  debugCtrller("/controller/render/upload");
  res.render('subview/upload');
}
