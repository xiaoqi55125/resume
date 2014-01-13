#!/bin/bash
#-*- utf-8 -*-

#Created by : yanghua
#Date       : 13/1/2014
#Desc       : a script to install mongodb at ubuntu server

#Configure Package Management System (APT)
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update

#Install Packages
sudo apt-get install mongodb-10gen