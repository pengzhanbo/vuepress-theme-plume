---
title: Jenkins 使用
lang: zh-CN
createTime: 2018/09/16 11:15:27
permalink: /article/bmtl5ah4
author: pengzhanbo
tags: 
  - 工具
top: false
type: null
---

[Jenkins](https://jenkins.io/) 是一款功能强大的应用程序，允许持续集成和持续交付项目。这里记录一些 Jenkins 使用的方法。

<!-- more -->

_以下基于 `CentOS` 系统。_

### 安装
安装详见 官网 [Jenkins 安装](https://jenkins.io/download/) 流程，各个系统如何安装均有说明。

环境依赖： `java`

CentOS 下安装：
``` bash
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
yum install jenkins
```

- __默认安装目录__ : `/var/lib/jenkins`
- __默认日志目录__ ：`/var/log/jenkins`
- __默认缓存目录__ : `/var/cache/jenkins`
- __默认admin密码文件__ : `/var/lib/jenkins/secrets/initialAdminPassword`
- __配置文件__ : `/etc/sysconfig/jenkins`

### 运行
``` bash
# 启动 Jenkins
service jenkins start
# 重启 Jenkins
service jenkins restart
# 停止 Jenkins
service jenkins stop
```
默认运行在 `8080` 端口， 本机可通过 `localhost:8080` 访问。

### 卸载
``` bash
service jenkiins stop
yum clean all
yum remove jenkins
rm -rf /var/lib/jenkins
rm -rf /var/cache/jenkins
rm -rf /var/log/jenkins
```

### 修改端口
1. 打开`Jenkins` 配置文件
``` bash
vim /etc/sysconfig/jenkins
```
2. 修改 `$HTTP_PORT`
``` bash
$HTTP_PORT="8080"
```

### 获取root用户权限
1. 打开`Jenkins` 配置文件
``` bash
vim /etc/sysconfig/jenkins
```
2. 修改 `HTTP_PORT`
``` bash
$JENKINS_USER="root"
```
3. 修改`Jenkins` 相关目录权限
``` bash
chown -R root:root /var/lib/jenkins
chown -R root:root /var/log/jenkins
chown -R root:root /var/cache/jenkins
```
4. 重启`Jenkins`并验证
``` bash
service jenkins restart
ps -ef|grep jenkins
# 若显示为root用户，则表示修改完成
```

### 开机自启
``` bash
chkconfig jenkins on
```

### 全局工具配置
全局工具配置可以 配置相关工具如`Maven`、`GIT`等工具的路径、或者安装新的不同版本的工具。

配置该设置需要获取 `admin`权限，进入`系统管理 > 全局工具配置`。

如：配置全局 GIT：

![](/images/jenkins_globalconfig.png)

### 用户管理以及用户权限
- 使用`admin`权限的账号，进入`系统管理 > 用户管理`, 可以添加/修改/删除 用户。
- 进入`系统管理 > 全局安全配置` 中，勾选 __启用安全__。访问控制选择 __Jenkins专有用户数据库__，使用 __项目矩阵授权策略__, 可以为每个用户分配全局权限。
- 进入项目配置中，权限 __启用项目安全__ 可以单独为该项目分配用户权限。 从而确保每个项目的安全性。

### Git Parameter
为项目添加 `git`分支/标签选择参数构建配置，从而方便通过不同分支构建项目。

项目配置：
![](https://wiki.jenkins-ci.org/download/attachments/58917601/image2018-9-20_22-0-7.png?version=1&modificationDate=1537473611000&api=v2)

参数化构建：
![](https://wiki.jenkins-ci.org/download/attachments/58917601/image2018-9-20_22-2-47.png?version=1&modificationDate=1537473769000&api=v2)

基础`pipeline`配置：
``` groovy
// Using git without checkout 
pipeline {
  agent any
  parameters {
    gitParameter branchFilter: 'origin/(.*)', defaultValue: 'master', name: 'BRANCH', type: 'PT_BRANCH'
  }
  stages {
    stage('Example') {
      steps {
        git branch: "${params.BRANCH}", url: 'https://github.com/jenkinsci/git-parameter-plugin.git'
      }
    }
  }
}
```

[阅读插件原文（git-parameter）](https://plugins.jenkins.io/git-parameter)

### 其他
相关工具以及项目配置，都只是小问题而已...
