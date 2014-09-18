#!/bin/bash
#-*- utf-8 -*-

#Created by : yanghua
#Date       : 16/1/2014
#Desc       : a script to install resume

#for convert encoding
sudo apt-get install convmv

sudo apt-get install p7zip-full

#for node_module -> canvas 
sudo apt-get update

sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

cd ~

rm -R resume

git clone https://github.com/xiaoqi55125/resume.git

cd resume

sudo chmod u+x bin/combo

git clone https://github.com/yangyraaron/resumeanalysis  bin/resumeanalysis

python bin/resumeanalysis/install.py

#pip install -r bin/resumeanalysis/requirements.txt

mkdir bin/resumeanalysis/files

npm install

#generate assets for static resource
make build

#give the uploads dir the write premission
# sudo chmod o+w uploads

#give the backup dir the other user write premission
# sudo chmod o+w backup

#global install pm2@0.6.5
sudo npm install -g pm2@0.6.5

pm2 kill
#make sure you have setted 'NODE_ENV'
#more detail see: docs/node_install_ubuntu.sh
NODE_ENV=$NODE_ENV pm2 start app.js -x -f

#if connect error, make sure :
#mongodb host and port(allow)
#has `resume` db in mongodb 
#if it not exists : 
#`use resume`
#`db.users.insert({'name':'test'});`
#
#if can not connect , pls check mongodb config file (at /etc/mongod.conf)
#eidt the config item :bind_ip 
#from 
#127.0.0.1
#to
#current visiable ip
#

#if web server has be started, but can not login
#pls create a `logininfos` db
#and init a super administrator account
#`use logininfos`
#db.logininfos.insert({'userName':'a', 'salt':'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'encryPwd':'5d12dc5a67ea2f58163feceacaa146af633b1a828bfafcbc8669d80c178e50d98b966a9b86bd7eabf0954020c47d869cb169fa697115451db12933ca9af7cac9', 'lastLoginTime':''});

#change config file list below:
#/rootDir/config.js
#/rootDir/bin/resumeanalysis/setting.py