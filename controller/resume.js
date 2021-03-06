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
var execSync = require("execSync");

/**
 * query resume with conditions
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.query = function(req, res, next) {
    debugCtrller("/controller/resume/query");

    var conditions   = {};
    conditions.query = {};

    try {
        if (req.body.userName) {
            var userName = sanitize(sanitize(req.body.userName).trim()).xss();
            conditions.query.userName = new RegExp(userName, "i");
        }

        if (req.body.college) {
            var college = sanitize(sanitize(req.body.college).trim()).xss();
            conditions.query["education.college"] = new RegExp(college, "i");
        }

        if (req.body.company) {
            var company = sanitize(sanitize(req.body.company).trim()).xss();
            conditions.query["experiences.company"] = new RegExp(company, "i");
        }

        if (req.body.pageSize && req.body.pageIndex) {

            var pageSize  = req.body.pageSize || config.default_page_size;
            var pageIndex = req.body.pageIndex || 1;
            pageSize      = sanitize(sanitize(pageSize).trim()).xss();
            pageIndex     = sanitize(sanitize(pageIndex).trim()).xss();

            conditions.pagingInfo           = {};
            conditions.pagingInfo.pageSize  = pageSize;
            conditions.pagingInfo.pageIndex = pageIndex;
        }

    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    async.series({
        query: function(callback) {
            Resume.getResumeWithConditions(conditions, function(err, result) {
                if (err) {
                    return callback(new DBError(), null);
                }

                callback(null, result);
            });
        },
        count: function(callback) {
            Resume.getResumeCountWithConditions(conditions, function(err, result) {
                if (err) {
                    return callback(new DBError(), null);
                }

                callback(null, result);
            });
        }
    }, function(err, results) {
        if (err) {
            debugCtrller(err);
            return res.send(resUtil.generateRes(null, err.statusCode));
        }

        var data = {};
        data.query = results.query;
        data.total = results.count;

        return res.send(resUtil.generateRes(data, config.statusCode.STATUS_OK));

    });

};

/**
 * upload resume
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.upload = function(req, res, next) {
    debugCtrller("/controller/resume/upload");

    var fn = req.files.file_source.name || "";
    var tmp_path = req.files.file_source.path || "";
    res.setHeader('content-type', 'text/html');

    try {
        check(fn).notEmpty();
        check(tmp_path).notEmpty();
        fn = sanitize(sanitize(fn).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var ext = path.extname(fn);
    var fileName = fn;
    if (ext.indexOf("zip") != -1) {
        fileName = path.basename(fileName, path.extname(fileName)) + "_" + Date.now() + path.extname(fileName);
        debugCtrller(fileName);
    }

    var uploadFilePath = path.resolve(__dirname, "../upload/", fileName);
    var transferFilePath = path.resolve(__dirname, "../", config.resume_dest_path, fileName);

    async.series({
            renameUploadFile: function(callback) {
                debugCtrller("step renameUploadFile");
                fs.rename(tmp_path, uploadFilePath, function(err) {
                    if (err) {
                        debugCtrller(err);
                        return callback(new ServerError(), null);
                    }

                    callback(null, null);
                });
            },
            pipeHtmlFile: function(callback) {
                debugCtrller("step pipeHtmlFile");
                debugCtrller(uploadFilePath);
                debugCtrller(transferFilePath);
                if (!ext || (ext.indexOf("htm") != -1 || ext.indexOf("html") != -1)) {
                    var content = fs.readFileSync(uploadFilePath);
                    fs.writeFileSync(transferFilePath, content);

                    return callback(null, null);
                } else if (ext.indexOf("zip") != -1) {
                    var dirName         = path.basename(fileName, path.extname(fileName));
                    var originalDirName = path.basename(fn, path.extname(fn));
                    var uncompressPath  = path.resolve(__dirname, "../", config.uncompress_file_path + "/" + dirName + "/");

                    if (uncompressPath === "/") {
                        return callback(null, null);
                    }

                    debugCtrller(uncompressPath);
                    var resumeDestPath  = path.resolve(__dirname, "../", config.resume_dest_path);
                    debugCtrller(resumeDestPath);
                    debugCtrller("LANG=C 7z e {0} -o{1}".format(uploadFilePath, uncompressPath + "/"));
                    var unzipResult     = execSync.exec("LANG=C 7z e {0} -o{1}".format(uploadFilePath, uncompressPath + "/"));
                    debugCtrller("do conver encoding :" + "convmv -f cp936 -t utf8 -r --notest -- {0}/*".format(uncompressPath));
                    var convmvCmd       = execSync.exec("convmv -f cp936 -t utf8 -r --notest -- {0}/*".format(uncompressPath));
                    debugCtrller("delete empty dirs :" + "find  {0}/ -type d -empty -delete".format(uncompressPath));
                    var delEmptyDirCmd  = execSync.exec("find  {0}/ -type d -empty -delete".format(uncompressPath));
                    debugCtrller("mv {0}/* {1} ".format(uncompressPath, resumeDestPath + "/"));
                    var mvResult = execSync.exec("mv {0}/* {1} ".format(uncompressPath, resumeDestPath + "/"));

                    if (unzipResult.stderr || mvResult.stderr) {
                        return callback(new ServerError(), null);
                    } else {
                        return callback(null, null);
                    }

                } else {
                    return callback(new InvalidParamError(), null);
                }
            },
            runShell: function(callback) {
                debugCtrller("step runShell");
                var mainAnalysisScript = path.resolve(__dirname, "../", config.analysis_mainscript_path);
                var result             = execSync.exec("python {0}".format(mainAnalysisScript));

                if (result.stderr) {
                    return callback(new ServerError(), null);
                } else if (result.stdout) {
                    var filePath = result.stdout.replace(/[\r\n]/g, "");
                    return callback(null, filePath);
                } else {
                    return callback(null, null);
                }
            }
        },
        function(err, results) {
            debugCtrller("enter callback");
            if (err || !results) {
                return res.send(resUtil.generateRes(null, err.statusCode));
            }

            if (results.runShell) {
                var filePathStr = results.runShell;
                debugCtrller(filePathStr);
                var pathObj = handlerStdoutFilePath(filePathStr);
                var contentObj = {
                    err: [],
                    dup: []
                };

                if (pathObj && pathObj.err && fs.existsSync(pathObj.err)) {
                    var content = fs.readFileSync(pathObj.err, {
                        encoding: "utf8"
                    });
                    contentObj.err = reformatFileContent(content);
                }

                if (pathObj && pathObj.dup && fs.existsSync(pathObj.dup)) {
                    var content = fs.readFileSync(pathObj.dup, {
                        encoding: "utf8"
                    });
                    contentObj.dup = reformatFileContent(content);
                }


                return res.send(resUtil.generateRes(contentObj, config.statusCode.STATUS_OK));
            }

            return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
        });

};

/**
 * send resume's source file
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}
 */
exports.sourceFile = function(req, res, next) {
    debugCtrller("controller/resume/sourceFile");
    var prefixPath      = "./bin/resumeanalysis/log/exported/";
    var absoluteDirPath = path.resolve(__dirname, "../", prefixPath);

    var fileName = req.params.fileName;
    if (!fileName) {
        return next(new PageNotFoundError());
    }

    debugCtrller(fileName);

    var extArr = ["", ".htm", ".html"];

    var tmpFileNameArr = extArr.map(function(item) {
        return fileName + item;
    });

    var realName;

    for (var i = 0; i < tmpFileNameArr.length; i++) {
        var fullPath = absoluteDirPath + "/" + tmpFileNameArr[i];
        if (fs.existsSync(fullPath)) {
            realName = tmpFileNameArr[i];
            break;
        }
    }

    debugCtrller(realName);

    if (!realName) {
        return res.redirect("/404");
    }

    var originalFullPath = absoluteDirPath + "/" + realName;
    debugCtrller("originalFullPath :" + originalFullPath);

    var isFileExists = fs.existsSync(originalFullPath);
    if (isFileExists) {
        res.set({
            "Content-Type": "text/html"
        });
        // return res.send(fs.readFileSync(originalFullPath));
        // return res.send(fs.readFileSync(originalFullPath));
        return fs.createReadStream(originalFullPath).pipe(res);
    } else {
        return next(new PageNotFoundError());
    }

};

/**
 * handle resume analysis script's std out file path
 * @param  {String} stdout        the shell's stdout
 * @return {Object}     the process object
 */
function handlerStdoutFilePath(stdout) {
    if (!stdout) {
        return null;
    }

    var fileArr = stdout.split(" ");
    var result  = {};

    for (var i = 0; i < fileArr.length; i++) {
        if (fileArr[i].indexOf("err") != -1) {
            result.err = fileArr[i];
        }

        if (fileArr[i].indexOf("dup") != -1) {
            result.dup = fileArr[i];
        }
    }

    return result;
}

/**
 * reformat file content (split with \n)
 * @param  {String} content the content's str
 * @return {Array}         processed array
 */
function reformatFileContent(content) {
    var lines = content.split(/[\r\n]/g);

    if (!lines || lines.length === 0) {
        return null;
    }

    //process last line
    var lastLine = lines[lines.length - 1];
    if (lastLine || lastLine.length === 0) {
        lines.pop(); //remove
    }

    return lines.map(splitFieldPerLine);
}

/**
 * split fields per line
 * @param  {String} lineContent the content of every line
 * @return {Object}             the splited obj
 */
function splitFieldPerLine(lineContent) {
    if (!lineContent) {
        return {};
    }

    var splitedArr = lineContent.split(" ");

    if (splitedArr.length != 3) {
        return {};
    }

    return {
        dateTime: splitedArr[0] + " " + splitedArr[1],
        resumeName: removePrefixPath(splitedArr[2])
    };
}

/**
 * process resume path by removing resume's prefix path
 * @param  {String} resumePath resume file's path
 * @return {String}            resume file name
 */
function removePrefixPath(resumePath) {
    if (!resumePath) {
        return "";
    }

    var index = resumePath.lastIndexOf("/");
    if (index === -1) {
        return resumePath;
    }

    return resumePath.substring(index + 1, resumePath.length);
}