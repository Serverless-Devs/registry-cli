export declare function createProgressBar(format: any, options: any): any;
export declare function hasHttpPrefix(s: string): boolean;
export declare function capitalizeFirstLetter(s: string): string;
export declare function extract(regex: any, endpoint: any, idx: any): any;
export declare function generateResourceName(serviceName: string, region: string, accountID: string): string;
export declare function formatArgs(args: string): string | null;
/**
 * 检测 build 是否可用
 * @param serviceName 服务名称
 * @param functionName 函数名称
 */
export declare function checkBuildAvailable(serviceName: string, functionName: string, baseDir?: string): Promise<void>;
/**
 * 获取缓存文件保存的路径（需要和core.setState的路径实现保持一致）
 * @param id stateId
 * @param dirPath 保存路径
 * @returns 缓存文件路径
 */
export declare function getStateFilePath(id: any, dirPath?: string): string;
export declare const tableShow: (data: any, showKey: any) => void;
export declare function promptForConfirmOrDetails(message: string): Promise<boolean>;
export declare const sleep: (ms?: number) => Promise<unknown>;
export declare function transfromTriggerConfig(triggerConfig: any, region: any, accountId: any): {
    triggerName: any;
    triggerType: any;
    triggerConfig: any;
    invocationRole: any;
    qualifier: any;
    sourceArn: any;
};
export declare function getTargetTriggers(sourceTriggers: any[], onlyDelpoyTriggerName: string | string[]): any[];
/**
 * 深度遍历转化为字符串类型
 * @param source object
 * @returns object
 */
export declare function objectDeepTransfromString(source: any): any;
