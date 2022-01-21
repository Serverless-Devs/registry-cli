import { InputProps } from './common/entity';
export default class Platform {
    _getToken(): Promise<any>;
    _getContent(fileList: any): Promise<any>;
    generateCodeIngore(baseDir: string, codeUri: string, runtime: string): Promise<Function | null>;
    zipCode(baseDir: string, codeUri: string, tempFileName: string, runtime: string): Promise<any>;
    /**
     * demo 登陆
     * @param inputs
     * @returns
     */
    login(inputs: InputProps): Promise<any>;
    /**
     * demo 删除版本
     * @param inputs
     * @returns
     */
    delete(inputs: InputProps): Promise<any>;
    detail(inputs: InputProps): Promise<{
        tag_name: any;
        published_at: any;
        zipball_url: any;
    }>;
    /**
     * demo 发布Package
     * @param inputs
     * @returns
     */
    publish(inputs: InputProps): Promise<any>;
    /**
     * demo 获取发布的列表
     * @param inputs
     * @returns
     */
    list(inputs: InputProps): Promise<any[]>;
    /**
     * demo 获取某个组件的版本
     * @param inputs
     * @returns
     */
    versions(inputs: InputProps): Promise<{
        PackageName: any;
        Versions: any[];
    }>;
    /**
     * demo 更新token信息
     * @param inputs
     * @returns
     */
    retoken(inputs: InputProps): Promise<any>;
}
