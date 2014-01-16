#!/bin/bash
#-*- utf-8 -*-

#Created by : yanghua
#Date       : 16/1/2014
#Desc       : a script to install resume

cd ~

rm -R resume

git clone https://github.com/xiaoqi55125/resume.git

cd resume

git clone https://github.com/yangyraaron/resumeanalysis  bin/resumeanalysis

pip install -r bin/resumeanalysis/requirements.txt

npm install

#generate assets for static resource
make build

#give the uploads dir the write premission
# sudo chmod o+w uploads

#give the backup dir the other user write premission
# sudo chmod o+w backup

pm2 kill
#make sure you have setted 'NODE_ENV'
#more detail see: docs/node_install_ubuntu.sh
NODE_ENV=$NODE_ENV pm2 start app.js -x -f

