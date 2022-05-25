---
id: usage
title: 安装
sidebar_position: 1
---

### cdn 安装

```html
<script src="https://webio-1258234669.cos.ap-guangzhou.myqcloud.com/lib/webio-1.0.1.js"></script>
```

### esm 安装（推荐）

推荐使用nrm，yrm管理源，方便记录以及切源

```javascript
// npm
npm i ruqi-webio -S --registry=http://npm.perseus.ruqimobility.com/
// yarn
yarn add ruqi-webio --registry=http://npm.perseus.ruqimobility.com/

```

## 使用方式

因为此插件是**基于`sentry`来收集相关的数据并且上报，所以需要项目预先接入`sentry`系统**。

如还没接入如祺`sentry`系统，请前往[sentry系统](https://poseidon-report.ruqimobility.com)

根据接入项目的框架选型，接下来大致讲解三种接入方式:

### react

``
