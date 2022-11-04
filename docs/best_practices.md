# Serverless Devs Registry 最佳实践

## 如何配置“开发版本”


当我们开发完成 Package 时，需要根据[规范](https://docs.serverless-devs.com/sdm/serverless_package_model/package_model)配置 Version 字段。一般情况下 Version 字段由三段组成，例如：`0.0.1`。

在 Serverless Devs Model 中，有规范：

1. Version 每次发布都要是更高的版本；
2. Version 字段需要符合版本格式规范，并且在服务端会进行校验；

那么，我们在日常开发+测试过程中，是要不断版本+1去进行测试么？当然不是，在 Serverless Devs Model 中有一个特殊的版本，叫做 `dev`，这个版本可以无限次重写，而无需像正式版一样，每次都要版本增加。

所以，在 publish.yaml 中配置 Version 字段时，可根据需要配置`0.0.1`，`0.0.2`，`1.0.0` ... 的同时，还可以配置开发字段`dev`，以便开发阶段的测试等；

## 如何进行组件/应用测试

组件/应用开发完成如何进行测试呢？其实有三种方法：

- 方法1：如果是组件的话，可以直接引用本地路径进行测试，在对应的`s.yaml`中，配置`component`时，直接配置组件对应的路径，即可实现测试；
- 方法2：推送到 Github 代码仓库，并 release。之后可以根据`orgName/projectName`进行使用，例如`fc`组件的仓库名是`fc`，所在组织是`devsapp`，那么在release之后，进行组件测试的时候就可以写`devsapp/fc`，这样客户端工具就会从默认的registry查找，查找不到回来到Github进行查找；应用也同样，可以用`s init orgName/projectName`进行初始化。
- 方法3：可以用 dev 版本，发到 registry，并强行指定版本进行测试，例如`devsapp/start-zip-oss`，想要测试指定的`dev`版本：
  - 客户端本地初始化：`s init devsapp/start-zip-oss@dev` 
  - 组件饮用：`component: devsapp/start-zip-oss@dev`

## 如何与流水线进行集成

> 参考文档：[Serverless Devs 与流水线集成](https://docs.serverless-devs.com/serverless-devs/cicd)

在日常开发过程中，会考虑到讲应用/组件推送到代码仓库，然后由代码触发构建，发布流程，进行进一步的操作。此时也是非常简单的，只需要三个核心步骤就行：

1. 安装工具：`npm install -g @serverless-devs/s`，当然如果没有安装npm等工具的，需要提前安装好；
2. 配置 registry token：`s cli registry login --token <token>` ，这里的 `<token>` 可以让发布者通过 `s cli registry token` 获取；
3. 进行发布操作：`s cli registry publish`



## 如何进行多人协作

在生产过程中，往往一个 Package 并不是由一个人去维护的，所以此时可能需要多个人协作。由于 Serverless Registry 并不支持授权他人进行相关发布操作，所以这里推荐通过代码仓库+流水线模式进行多人协作。主要流程：
1. 注册公共Serverless Registry账号（通过Github授权，例如：`s cli registry login`）
2. 配置公共账号的token到流水线中
3. 大家协作向代码仓库提交代码，最终发布的时候，走流水线进行发布
