# Serverless Registry Developer Tools

<center> <a href="readme.md">中文</a> ｜ English</center>

This tool is a Serverless Registry management tool based on Serverless Devs Component. With this tool, you can:

- [Login to Serverless Registry](#Login-function-login)
- [Publish Package to default Serverless Registry platform](#Publish-Pacakge-publish)
- [View Packages published by the current login account](#VView-the-list-of-Pacakge-list)
- [View the version information of a package](#View-the-version-information-of-a-package-versions)
- [View a package's specified version information](#View-the-specified-version-information-of-a-Package-detail)
- [Delete a package of a specified version](#Delete-Package-delete)
- [Update the login token](#Update-Token-retoken)
- [Search for the specified Package](Search-for-the-specified-Package-search)

> For how to develop Package, please refer to related questions:
> - [Development documentation for Component](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/en/package_dev.md#Component-development-instructions)
> - [Application Development Documentation](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/en/package_dev.md#Application-development-instructions)
> -----
> 1. For the relationship between Serverless Pacakge, Serverless Devs and Serverless Registry, please refer to [SDM Specification Document](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/spec/readme_en.md)
> 2. About what is Serverless Registry and Serverless Registry Model Specification, please refer to [SRM Specification Document](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/en/0.0.2/serverless_registry_model)
> -----
> * It should be noted that this tool only supports publishing packages to the default registry (registry.devsapp.cn/simple). If you want to publish to other registries, you can refer to:
> - If it is a Github or Gitee source, you only need to create a repository and release a version. For example, a demo repository is created under the devsapp organization of Github, and a Release is released. At this time, you can directly [switch the source to Github source](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/docs/en/command/set.md#set-registry-command) , and write the component as `organization name/repository name`, such as `devsapp/demo`, the system can automatically detect and load related components;
> - If it is another Registry that complies with the [SRM specification](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/en/0.0.2/serverless_registry_model), you can provide the Registry according to the The platform determines the relevant tools;


## Login function: login

Before operating the Registry, there needs to be an identity verification logic (for example, you can only update packages belonging to you, etc.), so before using the Registry function, you need to perform login-related operations.

There are two modes of login:

- Mode 1: You already have the `token` information after login, you can use `s cli registry login --token <token>` to directly configure the `token`;
- Mode 2: There is no `token` information after login, or the Serverless Registry has not been registered. At this time, you can directly open the browser through `s cli registry login`, and log in and authorize according to the operation prompts. When the page is displayed as follows, it means that Successful landing:
    ![picture alt](https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1642670881564_20220120092801848109.png)
    At this point, you can also see a successful reminder on the client side:
    ![picture alt](https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1642671050946_20220120093051343877.png)
    
> * It should be noted that Serverless Registry does not provide additional registration functions, and only relies on Github authorization operations for user identity identification. If you have any questions in the later use process, please send an email to service@52exe.cn for communication communicate with.


> todo: Since China opens Github, it will be tested by the network, so there is room for optimization in the login link


## Publish Pacakge: publish

> This operation needs to be done after completing the [login link](#Login-function-login).

Under the project that conforms to the specification of [Serverless Pacakge](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/en/0.0.2/serverless_package_model), you can pass the `publish` command, Publish the component.

For example, you can directly execute: `s cli registry publish`

> For the directory structure of Package and related values ​​and specifications, please refer to [Pacakge Model](https://github.com/Serverless-Devs/Serverless-Devs/blob/master/spec/en/0.0.2/serverless_package_model/3.package_model.md);

## View the list of Pacakge: list

> This operation needs to be done after completing the [login link](#Login-function-login).

Use the `list` command to view the components published by the currently logged in Serverless Registry account, for example: `s cli registry list`:

````
$ s cli registry list
- package: ros-test
  description: Deploy the project through Alibaba Cloud ROS
  version: 0.0.10
  zipball_url: https://registry.devsapp.cn/simple/ros-test/zipball/0.0.10
- package: fc-core
  description: FC public component
  version: 0.0.7
  zipball_url: https://registry.devsapp.cn/simple/fc-core/zipball/0.0.7
- package: fc
  description: Alibaba Cloud Function Computing Basic Components
  version: 0.1.38
  zipball_url: https://registry.devsapp.cn/simple/devsapp/fc/zipball/0.1.38
````

## View the version information of a package: versions

Use the `versions` command to view the valid version information of the specified package.

The command has one parameter:

- `name`: Indicates the Pacakge name

Operation example: `s cli registry versions --name fc`:

````
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
````

## View the specified version information of a Package: detail

Use the `detail` command to view information about a package of a specified version.

The command has one parameter:

- `name-version`: The name and version of the Pacakge, linked by the `@` symbol, for example: `demo@0.0.1`

Operation example: `s cli registry detail --name-version fc-builda@0.0.1`:

````
$ s cli registry detail --name-version fc-builda@0.0.1
tag_name: 0.0.1
published_at: '2022-01-21T03:58:55.316Z'
zipball_url: https://registry.devsapp.cn/simple/fc-builda/zipball/0.0.1
````

## Delete Package: delete

> This operation needs to be done after completing the [login link](#Login-function-login).

The `delete` command can delete the specified version of the specified package. For example, in some cases, the release version fails, and the rollback operation can be performed by deleting the version.

> It should be noted here that the version is the only one that exists. Even if it is deleted here, the package with the changed version number cannot be released. For example, due to some circumstances, the 0.0.3 version of the demo component is deleted. After the deletion is completed, when a new version is republished, the version number needs to be greater than 0.0.3;

The command has two parameters:

- `name-version`: the name and version of the Pacakge, linked by the `@` symbol, e.g. Such as: `demo@0.0.1`
- `type`: Package type, the value is `Component` or `Application`

Operation example: `s cli registry delete --name-version wordpress@0.0.1 --type Component`

````
$ s cli registry delete --name-version wordpress@0.0.1 --type Component
result: Succeed
````

## Update Token: retoken

> This operation needs to be done after completing the [login link](#Login-function-login).

If the Token information of the Serverless Registry is leaked due to some circumstances, you can reset it through the `retoken` command. For example: `s cli registry retoken`

Execution effect:

````
$ s cli registry retoken
Serverless Registry login token reset succeeded.
End of method: retoken
````

## Search for the specified Package: search

Use the `search` command to search for related package information.

The command has two parameters:

- `keyword`: search keyword
- `type`: Package type, the value is `Component` or `Application`, `Plugin`

Operation example: `s cli registry delete --name-version wordpress@0.0.1 --type Component`

````
$ s cli registry search --type plugin
-
  name: core
  description: Serverless Devs Demo
  version:
    tag_name: dev
    published_at: 2022-03-27T10:13:40.131Z
    zipball_url: https://registry.devsapp.cn/simple/core/zipball/dev
-
  name: fc-package
  description: demo
  version:
    tag_name: 0.0.3
    published_at: 2022-01-17T09:07:04.315Z
    zipball_url: https://registry.devsapp.cn/simple/fc-package/zipball/0.0.3
````

------
Package development best practices:
- https://github.com/Serverless-Devs/Serverless-Devs/discussions/62
- https://github.com/Serverless-Devs/Serverless-Devs/discussions/407
------

# Exchange community

If you have feedback about bugs or future expectations, you can post them in [Issues](https://github.com/serverless-devs/serverless-devs/issues) and [Discussions](https://github.com/serverless-devs/serverless-devs/discussions) for feedback and exchanges. If you'd like to join our discussion group or keep up to date with Serverless Devs, you can do so through the following channels:

<p align="center">

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="200px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="200px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="200px" > |
|--- | --- | --- |
| <center>Follow WeChat Official Account: `serverless`</center> | <center>Contact WeChat Assistant: `xiaojiangwh`</center> | <center>Join DingTalk Group: `33947367`</center> |

</p>