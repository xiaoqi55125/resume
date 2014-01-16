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
var path     = require("path");
var async    = require("async");
var fs       = require("fs");
var exec     = require("child_process").exec;

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

/**
 * upload resume
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.upload = function (req, res, next) {
    debugCtrller("/controller/resume/upload");

    var fileName  = req.files.file_source.name || "";
    var tmp_path  = req.files.file_source.path || "";

    try {
        check(fileName).notEmpty();
        check(tmp_path).notEmpty();
        fileName = sanitize(sanitize(fileName).trim()).xss();
        if (path.extname(fileName).indexOf("zip") === -1) {
            throw new InvalidParamError();
        }
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var uploadFilePath = path.resolve(__dirname, "../upload/", fileName);
    var transferFilePath = path.resolve(__dirname, "../bin/", fileName);

    async.series({
        renameUploadFile  : function (callback) {
            fs.rename(tmp_path, uploadFilePath, function (err) {
                if (err) {
                    debugCtrller(err);
                    return callback(new ServerError(), null);
                }

                callback(null, null);
            });
        },
        pipeHtmlFile      : function (callback) {
            var htmlStream = fs.createReadStream(uploadFilePath);
            var newHtmlStream = fs.createWriteStream(transferFilePath);
            htmlStream.pipe(newHtmlStream);
        },
        // uncompress        : function (callback) {
        //     exec("unzip {0}".format(config.uncompress_file_path), function (err, stdout, stderr) {
        //          if (err || stderr) {
        //               debugCtrller(err || stderr || "");
        //               return callback(new ServerError(), null);
        //          }

        //          callback(null, null);
        //     });
        // },
        runShell          : function (callback) {
            //todo
        }
    },
    function (err, results) {
        if (err) {
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });

    
};
