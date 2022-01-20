import * as core from '@serverless-devs/core';
import ProgressBar from 'progress';
import path from 'path';
import crypto from 'crypto';
import _ from 'lodash';
import Table from 'tty-table';

const { fse, colors, inquirer } = core;
const { green, white } = colors;

export function createProgressBar(format, options) {
  const opts = Object.assign({
    complete: green('█'),
    incomplete: white('█'),
    width: 20,
    clear: true,
  }, options);
  const bar = new ProgressBar(format, opts);
  const old = bar.tick;
  const loadingChars = ['⣴', '⣆', '⢻', '⢪', '⢫'];
  // @ts-ignore
  bar.tick = (len, tokens) => {
    const newTokens = Object.assign({
      loading: loadingChars[Math.random() * 5],
    }, tokens);
    old.call(bar, len, newTokens);
  };
  return bar;
}

export function hasHttpPrefix(s: string): boolean {
  return s.startsWith('http://');
}

export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function extract(regex, endpoint, idx) {
  const matchs = endpoint.match(regex);
  if (matchs) {
    return matchs[idx];
  }
  return null;
}

export function generateResourceName(serviceName: string, region: string, accountID: string) {
  const prefix = serviceName.slice(0, 6);

  const md5Uid = crypto.createHmac('md5', accountID).update(serviceName).digest('hex');
  return `${prefix}-${md5Uid.slice(0, 7)}-${region}`;
}

export function formatArgs(args: string): string | null {
  // 去除 args 的行首以及行尾的空格
  return (args ? args.replace(/(^\s*)|(\s*$)/g, '') : '');
}

/**
 * 检测 build 是否可用
 * @param serviceName 服务名称
 * @param functionName 函数名称
 */
export async function checkBuildAvailable(serviceName: string, functionName: string, baseDir = process.cwd()) {
  const statusId = `${serviceName}-${functionName}-build`;
  const statusPath = path.join(baseDir, '.s', 'fc-build');
  const { status } = await core.getState(statusId, statusPath) || {};
  if (status === 'unavailable') {
    throw new Error(`${serviceName}/${functionName} build status is unavailable.Please re-execute 's build'`);
  }
}

/**
 * 获取缓存文件保存的路径（需要和core.setState的路径实现保持一致）
 * @param id stateId
 * @param dirPath 保存路径
 * @returns 缓存文件路径
 */
export function getStateFilePath(id: any, dirPath?: string): string {
  const { templateFile } = process.env;
  const spath = fse.existsSync(templateFile)
    ? path.join(path.dirname(templateFile), '.s')
    : path.join(process.cwd(), '.s');
  fse.ensureDirSync(spath);
  const temp = dirPath ? path.resolve(spath, dirPath) : spath;
  return path.join(temp, `${id}.json`);
}


export const tableShow = (data, showKey) => {
  const options = {
    borderStyle: 'solid',
    borderColor: 'blue',
    headerAlign: 'center',
    align: 'left',
    color: 'cyan',
    width: '100%',
  };
  const header_option = {
    headerColor: 'cyan',
    color: 'cyan',
    align: 'left',
    width: 'auto',
    formatter: (value) => value,
  };

  const header = showKey.map((value) => (!_.isString() ? ({
    ...header_option,
    value,
  }) : ({ ...header_option, ...value })));

  // eslint-disable-next-line no-console
  console.log(Table(header, data, options).render());
};

export async function promptForConfirmOrDetails(message: string): Promise<boolean> {
  const answers: any = await inquirer.prompt([{
    type: 'list',
    name: 'prompt',
    message,
    choices: ['yes', 'no'],
  }]);

  return answers.prompt === 'yes';
}

export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export function transfromTriggerConfig(triggerConfig, region, accountId) {
  const {
    name,
    type,
    config,
    qualifier,
    role,
    sourceArn,
  } = triggerConfig;
  if (_.isString(sourceArn) && !_.isNil(sourceArn)) {
    return {
      triggerName: name,
      triggerType: type,
      triggerConfig: config,
      invocationRole: role,
      qualifier,
      sourceArn,
    };
  }
  let arn;

  if (type === 'oss') {
    arn = `acs:oss:${region}:${accountId}:${config.bucketName}`;
  } else if (type === 'log') {
    arn = `acs:log:${region}:${accountId}:project/${config.logConfig.project}`;
  } else if (type === 'mns_topic') {
    arn = `acs:mns:${config.region ? config.region : region}:${accountId}:/topics/${config.topicName}`;
  } else if (type === 'cdn_events') {
    arn = `acs:cdn:*:${accountId}`;
  } else if (type === 'tablestore') {
    arn = `acs:ots:${region}:${accountId}:instance/${config.instanceName}/table/${config.tableName}`;
  }

  return {
    triggerName: name,
    triggerType: type,
    triggerConfig: config,
    invocationRole: role,
    qualifier,
    sourceArn: arn,
  };
}

export function getTargetTriggers(sourceTriggers: any[], onlyDelpoyTriggerName: string | string[]) {
  let needDeployTriggers = [];
  if (_.isString(onlyDelpoyTriggerName)) {
    needDeployTriggers = sourceTriggers.filter(({ name }) => name === onlyDelpoyTriggerName);
    if (_.isEmpty(needDeployTriggers)) {
      throw new Error(`Not found trigger: ${onlyDelpoyTriggerName}`);
    }
  } else {
    const needDeployTriggersName = [];
    for (const triggerConfig of sourceTriggers) {
      if (onlyDelpoyTriggerName.includes(triggerConfig.name)) {
        needDeployTriggers.push(triggerConfig);
        needDeployTriggersName.push(triggerConfig.name);
      }
    }
    const xor = _.xor(needDeployTriggersName, onlyDelpoyTriggerName);
    if (!_.isEmpty(xor)) {
      throw new Error(`Not found trigger: ${xor.toString()}`);
    }
  }
  return needDeployTriggers;
}

/**
 * 深度遍历转化为字符串类型
 * @param source object
 * @returns object
 */
export function objectDeepTransfromString(source) {
  if (_.isArray(source)) {
    return source.map((value) => {
      if (typeof value === 'object') {
        return objectDeepTransfromString(value);
      }
      return value?.toString();
    });
  }

  if (_.isObject(source)) {
    return _.mapValues(source, (value) => {
      if (typeof value === 'object') {
        return objectDeepTransfromString(value);
      }
      // @ts-ignore 不是 object 类型尝试 toString 强制转换为字符串
      return value?.toString();
    });
  }

  return source;
}
