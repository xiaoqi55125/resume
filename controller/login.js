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
  Desc: the controller of login
 */


var Login      = require("../proxy/login");
var captchagen = require('captchagen');
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;
var SHA256     = require("crypto-js/sha256");
var AES        = require("crypto-js/aes");
var resUtil    = require("../lib/resUtil");
var LoginInfo  = require("../model").loginInfo;

/**
 * handler sign in
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.signIn = function (req, res, next) {
    debugCtrller("controllers/login/signIn");
    var captchaCode = req.body.auth.captchaCode || "";
    var userId      = req.body.auth.userId || "";
    var passwd      = req.body.auth.passwd || "";

    try {
        check(captchaCode).notEmpty();
        check(userId).notEmpty();
        check(passwd).notEmpty();
        captchaCode = sanitize(sanitize(captchaCode).trim()).xss();
        userId      = sanitize(sanitize(userId).trim()).xss();
        passwd      = sanitize(sanitize(passwd).trim()).xss();
    } catch (e) {
        return res.send("5");
    }

    if (!req.session || !req.session.captchaCode || 
       captchaCode != req.session.captchaCode) {
        return res.send("4");
    }

    Login.getUserAuthInfoByUserId(userId, function (err, userAuthInfo) {
        if (err) {
            return res.send("3");
        }

        if (!userAuthInfo) {
            return res.send("2");
        }

        //check
        if (userId === userAuthInfo.uid && passwd === userAuthInfo.pwd) {
            var user         = {};
            user.userId      = userId;
            user.uName       = userAuthInfo.uName; 
            req.session.user = user;

            return res.send("1");
        } else {
            return res.send("0");
        }
    });

};

/**
 * sign up a new user
 * @param  {Object}   req  the instance of request
 * @param  {Object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.signUp = function (req, res, next) {
    debugCtrller("/controller/login/signUp");

    var userName, hashedPwd;

    try {
        check(req.body.userName).notEmpty();
        check(req.body.password).notEmpty();
        userName = sanitize(sanitize(req.body.userName).trim()).xss();
        hashedPwd = sanitize(sanitize(req.body.password).trim()).xss();
    } catch (e) {
        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_INVAILD_PARAMS));
    }

    var pwdInfo = processPassword(userName, hashedPwd);

    var account = new LoginInfo({
        userName  : userName,
        salt      : pwdInfo.salt,
        encryptPwd: pwdInfo.encryptPwd
    });

    Login.createAccount(account, function (err) {
        if (err) {
            return res.send(resUtil.generateRes(null, config.statusCode.STATUS_DBERROR));
        }

        return res.send(resUtil.generateRes(null, config.statusCode.STATUS_OK));
    });
}

/**
 * generate captcha image
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.captchaImg = function (req, res, next) {
    debugCtrller("controller/login/captchaImg");
    var captcha     = captchagen.create({ text : randomNumberWithBitNum(6) });
    var captchaCode = captcha.text();

    debugCtrller(captchaCode);
        
    if (captchaCode) {
        req.session.captchaCode = captchaCode;
    }

    //generate
    captcha.generate();

    res.send(captcha.buffer());
};

/**
 * generate random number with bit num
 * @param  {Number} bitNum the random number's bit num
 * @return {String}        the string of random number's set
 */
function randomNumberWithBitNum (bitNum) {
    var bn, num = "";
    if (typeof bitNum === undefined) {
        bn = 6;
    } else {
        bn = bitNum;
    }

    for (var i = 0; i < bn; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}

/**
 * process password (add salt then encrypt)
 * @param  {String} userName  the user name
 * @param  {String} hashedPwd hashed password
 * @return {Object}           an object that packaged salt and encrypt pwd
 */
function processPassword (userName, hashedPwd) {
    if (!userName || !hashedPwd) {
        return null;
    }

    var salt       = AES(userName);
    var encryptPwd = SHA256(salt + hashedPwd);

    return {
        salt        : salt,
        encryptPwd  : encryptPwd
    };
}