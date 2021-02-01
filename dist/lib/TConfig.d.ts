import { TResult, TSchema } from "./Types";
declare class TConfig {
    private readonly configLib;
    private readonly schema;
    private _config;
    private constructor();
    parseConfig(): TResult;
    private getValueOf;
    private figureStrategy;
    private parse;
    get config(): any;
    private static _instance;
    static create(schema: TSchema, configDir?: string): any;
    static get instance(): TConfig;
}
export default TConfig;
