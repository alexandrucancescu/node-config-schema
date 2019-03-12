import { TResult, TSchema } from "./Types";
declare class TConfig {
    private readonly configLib;
    private readonly schema;
    private config;
    private constructor();
    parseConfig(): TResult;
    private getValueOf;
    private figureStrategy;
    private parse;
    private static _instance;
    static create(schema: TSchema, configDir?: string): any;
    static readonly instance: TConfig;
}
export default TConfig;
