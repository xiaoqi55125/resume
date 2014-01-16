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
  Created with Sublime Text 3.
  Date: Jan 14, 2014
  Time: 1:35 PM
 */
/**
 * do the resume search 
 * @return {null} 
 */
function resumeSearch () {
  //without check
  $.ajax({
    url:'/resume/query',
    type:'POST',
    data:$('form.resumeSearchForm').serialize(),
    success:function (data) {
      if (data.statusCode === 0) {
        changeListView(data.data);
        changeMainTextValue(data.data[0]);
      }
    }
  })
}

function changeListView (data) {
  $("#listView").html("");
  for (var i = 0; i < data.length; i++) {
    $("#resumeList").fadeIn(600);
    var link = $("<a href='javascript:void(0);' class='list-group-item'>"+data[i].userName+"</a>");
    link.click(tdCont.listClick(data[i]._id,data[i]));
    $("#listView").append(link);
  };
}

function changeMainTextValue (data) {
  $("#uName").html(data.userName);
  $("#sex").html(data.sex);
  $("#mobile").html(data.mobile);
  $("#birth").html(data.birthday);
  $("#rFrom").html(data.source);
  //college
  $("#college").html(data.education.college);
  $("#degree").html(data.education.degree);
  $("#graduatedTime").html(data.education.graduatedTime);
  $("#speciality").html(data.education.speciality);

  //experience
  $("#experienceAttr").html("");
  for (var i = 0; i < data.experiences.length; i++) {
      var cellData = data.experiences[i];
      var cnt = i+1;
      var temp  = "<tr><td>"+
                cnt+"</td><td>"+
                cellData.position+"</td><td>"+
                cellData.company+"</td><td>"+
                cellData.time+"</td></tr>";
      $("#experienceAttr").append(temp);
  }; 
}

function listClickFunc (id,data) {
  $("#resumeDetail").hide();
  $("#resumeDetail").fadeIn(600);
  changeMainTextValue(data);
}
var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  listClick: function(id,data) {
    return function() {
      listClickFunc(id,data);
    }
  }
}