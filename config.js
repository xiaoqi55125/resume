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
  Time: 10:03 AM
  Desc: the config definition
 */

exports.config = {

    /**************************web config****************************/

    debug               : true,
    name                : "简历管理系统",
    description         : "Fixed Asset Manager",
    version             : "0.0.1",

    port                : 8088,

    site_headers        : [
        '<meta name="author" content="freedom" />',
    ],

    site_static_host    : "",
    mini_assets         : false,

    session_secret      : "Fixed_Asset_0987654321",

    mail_opts           : {
        host  : "smtp.163.com",
        port  : 25,
        auth  : {
            user  : "wisasset@163.com",
            pass  : "adminn"
        }
    },

    mailDefault_TO      : [
        "huayang@wisedu.com",
        "zcliu@wisedu.com"
    ],

    networkIsOk         : 1,

    //five field: ss mm hh dd MM day-of-week
    // * - match all
    // / - pre field
    // eg : "00 00 9 */7 *" means run once every 7 days at 9:00 am
    limitCronPattern         : "00 00 10 * * 1-5",

    backupCronPattern        : "00 00 23 * * *",

    backupPushCronPattern    : "00 30 23 */3 * *",


    /******************************system config **************************/
    default_page_size : 50,

    db                : "mongodb://172.16.206.16/resume",

    statusCode        : {
        STATUS_OK                 : 0,
        STATUS_NOTFOUND           : 1,        //means data not found not url request
        STATUS_SERVER_ERROR       : 2,
        STATUS_INVAILD_PARAMS     : 3,
        STATUS_DBERROR            : 4
        //....
    },

};

