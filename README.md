Live-Chat
==============

### 运行系统
- Linux(推荐)
- Windows7/Windows8

### 运行环境  
- node: `v >= 0.10.32` [安装](http://blog.fens.me/nodejs-enviroment/) 
      - 如果没有git，先安装git
        - `sudo apt-get install git`
      - 从github下载nodejs源代码
        - `git clone git://github.com/joyent/node.git`
      - 进入node目录
        - `cd node`
        - `pwd`
      - 切换最新的release的版本v0.11.2-release
        - `git checkout v0.11.2-release`
      - 进行安装
        - `./configure`
        - `make`
        - `sudo make install`
      - 安装完成，查看node版本
        - `node -v`

- npm：直接输入 `sudo apt-get install npm`安装npm

- MongoDB: `v >= 2.4.9` [安装](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)
      - Import the public key used by the package management system：
         - `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`             
      - Create a list file for MongoDB：
        - `echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list`
      - Reload local package database:
        - `sudo apt-get update`      
      - Install the MongoDB packages：
         - `sudo apt-get install -y mongodb-org`
         - `sudo apt-get install -y mongodb-org=2.6.1 mongodb-org-server=2.6.1 mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-org-tools=2.6.1`
      - Pin a specific version of MongoDB：
         - `echo "mongodb-org hold" | sudo dpkg --set-selections`
         - `echo "mongodb-org-server hold" | sudo dpkg --set-selections`
         - `echo "mongodb-org-shell hold" | sudo dpkg --set-selections`
         - `echo "mongodb-org-mongos hold" | sudo dpkg --set-selections`
         - `echo "mongodb-org-tools hold" | sudo dpkg --set-selections`
      - 测试是否安装成功： 
        - `mongo`(Linux)

### 运行命令
- `cd Live-Chat`
- `npm install`
- `grunt`
