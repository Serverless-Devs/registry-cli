# Serverless Registry 开发者工具


本工具是一款基于 Serverless Devs Component 的 Serverless Registry 管理工具，通过本工具可以做到：

- [登陆 Serverless Registry](#登陆功能login)
- [发布 Package 到默认的 Serverless Registry 平台](#发布-pacakge-publish)
- [查看当前登陆账号发布过的 Package](#查看-pacakge-列表list)
- [查看某个 Package 的版本信息](#查看某-package-的版本信息versions)
- [查看某个 Package 指定版本信息](#查看某-package-指定版本信息detail)
- [删除某个指定版本的 Package](#删除-packagedelete)
- [对登陆 token 进行更新](#对-token-进行更新retoken)

> 关于如何开发 Package 可以参考相关的问题：
> - [组件 Component 的开发文档](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/zh/package_dev.md#%E7%BB%84%E4%BB%B6%E5%BC%80%E5%8F%91%E8%AF%B4%E6%98%8E)
> - [应用 Application 的开发文档](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/zh/package_dev.md#%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E8%AF%B4%E6%98%8E)    
> -----
> 1. 关于 Serverless Pacakge 和 Serverless Devs 以及 Serverless Registry的关系，可以参考[ SDM 规范文档](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/spec/readme.md)    
> 2. 关于什么是 Serverless Registry 以及 Serverless Registry 模型规范，可以参看[ SRM 规范文档](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/zh/0.0.1/serverless_registry_model)
> -----
> * 需要额外说明的是，本工具仅支持将 Package 发布到默认的 Registry (registry.devsapp.cn/simple)，如果想要发布到其他的 Registry，可以参考：
>    - 如果是 Github 或者 Gitee 源，只需要创建一个仓库，发布一个版本即可，例如在 Github 的 devsapp 组织下创建了一个 demo 的仓库，并发布了一个 Release，此时就可以直接[切换源到 Github 源](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/zh/command/set.md#set-registry-%E5%91%BD%E4%BB%A4) ，并且将组件写成`组织名/仓库名`即可，例如`devsapp/demo`，系统就可以自动检测并加载相关组件； 
>    - 如果是其他符合 [ SRM 规范](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/zh/0.0.1/serverless_registry_model) 的 Registry，可以根据提供该 Registry 的平台进行相关工具的确定；


## 登陆功能：login

在对 Registry 进行操作之前，需要有身份校验的逻辑（例如，你只能更新属于你的 Package 等），所以在使用 Registry 功能之前，需要进行登录相关操作。

登陆有两种模式：

- 模式1：已经拥有了登陆后的`token`信息，此时可以使用`s cli registry login --token <token>`直接进行`token`的配置；
- 模式2：没有登陆后的`token`信息，或者还没有注册过 Serverless Registry，此时可以通过`s cli registry login`直接打开浏览器，按照操作提示进行登录授权，当页面显示如下，即表示登陆成功：
    ![图片alt](https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1642670881564_20220120092801848109.png)
    此时可以在客户端也可以看到成功的提醒：
    ![图片alt](https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1642671050946_20220120093051343877.png)
    
> * 需要额外注意的是，Serverless Registry 不提供额外的注册功能，只会依靠 Github 授权操作进行用户身份的识别，如果您在后期使用过程中有任何问题欢迎发送邮件到 service@52exe.cn 进行沟通交流。


> todo: 由于 China 打开 Github 会受到网络的考验，所以在 login 的环节有优化的空间


## 发布 Pacakge ：publish

> 此操作需要在完成[登陆环节](#登陆功能login) 之后进行。

在符合 [Serverless Pacakge](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/zh/0.0.1/serverless_package_model) 的规范的项目下，可以通过 `publish` 命令，进行组件的发布。

例如可以直接执行：`s cli registry publish`

> 关于 Package 的目录结构以及相关取值和规范，请参考[Pacakge 模型](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/spec/zh/0.0.1/serverless_package_model/3.package_model.md) ;

## 查看 Pacakge 列表：list

> 此操作需要在完成[登陆环节](#登陆功能login) 之后进行。

通过 `list` 命令可以查看当前登陆到 Serverless Registry 账号所发布的组件，例如：`s cli registry list`:

```
$ s cli registry list
- package: ros-test
  description: 通过阿里云 ROS 部署项目
  version: 0.0.10
  zipball_url: https://registry.devsapp.cn/simple/ros-test/zipball/0.0.10
- package: fc-core
  description: FC公共组件
  version: 0.0.7
  zipball_url: https://registry.devsapp.cn/simple/fc-core/zipball/0.0.7
- package: fc
  description: 阿里云函数计算基础组件
  version: 0.1.38
  zipball_url: https://registry.devsapp.cn/simple/devsapp/fc/zipball/0.1.38
```

## 查看某 Package 的版本信息：versions

通过 `versions` 命令可以查看指定 Package 的有效版本信息。

该命令有一个参数：

- `name`: 表示 Pacakge 名字

操作示例：`s cli registry versions --name fc`:

```
$ s cli registry versions --name fc
PackageName: fc
Versions:
  - tag_name: 0.1.38
    published_at: '2022-01-18T03:32:08.511Z'
    zipball_url: https://registry.devsapp.cn/simple/fc/zipball/0.1.38
  - tag_name: 0.1.37
    published_at: '2022-01-07T07:57:17.327Z'
    zipball_url: https://registry.devsapp.cn/simple/fc/zipball/0.1.37
  - tag_name: 0.1.36
    published_at: '2022-01-04T13:53:16.579Z'
    zipball_url: https://registry.devsapp.cn/simple/fc/zipball/0.1.36
  - tag_name: 0.1.35
    published_at: '2021-12-30T07:30:11.873Z'
    zipball_url: https://registry.devsapp.cn/simple/fc/zipball/0.1.35
```

## 查看某 Package 指定版本信息：detail

通过 `detail` 命令可以查看指定版本 Package 的信息。

该命令有一个参数：

- `name-version`: Pacakge 的名称和版本，通过`@`符号进行连接，例如：`demo@0.0.1`

操作示例：`s cli registry detail --name-version fc-builda@0.0.1`:

```
$ s cli registry detail --name-version fc-builda@0.0.1
tag_name: 0.0.1
published_at: '2022-01-21T03:58:55.316Z'
zipball_url: https://registry.devsapp.cn/simple/fc-builda/zipball/0.0.1
```

## 删除 Package：delete

> 此操作需要在完成[登陆环节](#登陆功能login) 之后进行。

通过 `delete` 命令可以删除指定 Package 的指定版本。例如在某些情况下，发布版本出现故障，可以通过删除该版本进行回退操作。

> 此处需要注意的是，版本是唯一存在的，即使在这里被删除了，也不能再发布改版本号的 Package 了。例如，由于某些情况，删除了 demo 组件的 0.0.3 版本，完成删除后，重新发布新的版本时，版本号需要大于 0.0.3;

该命令有两个参数：

- `name-version`: Pacakge 的名称和版本，通过`@`符号进行连接，例如：`demo@0.0.1`
- `type`：Package 类型，取值为 `Component` 或 `Application`

操作示例：`s cli registry delete --name-version wordpress@0.0.1 --type Component`

```
$ s cli registry delete --name-version wordpress@0.0.1 --type Component
result: Succeed
```

## 对 Token 进行更新：retoken

> 此操作需要在完成[登陆环节](#登陆功能login) 之后进行。

如果因为某些情况，导致 Serverless Registry 的 Token 信息泄漏，此时可以通过 `retoken` 命令进行重置。例如：`s cli registry retoken`

执行效果：

```
$ s cli registry retoken
Serverless Registry login token reset succeeded.
End of method: retoken
```

------
Package 开发最佳实践：
- https://github.com/Serverless-Devs/Serverless-Devs/discussions/62
- https://github.com/Serverless-Devs/Serverless-Devs/discussions/407
------

# 交流社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Issues](https://github.com/serverless-devs/serverless-devs/issues) 和 [Discussions](https://github.com/serverless-devs/serverless-devs/discussions) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 Serverless Devs 的最新动态，您可以通过以下渠道进行：

<p align="center">

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="200px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="200px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="200px" > |
|--- | --- | --- |
| <center>关注微信公众号：`serverless`</center> | <center>联系微信小助手：`xiaojiangwh`</center> | <center>加入钉钉交流群：`33947367`</center> | 

</p>

