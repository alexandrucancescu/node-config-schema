"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
class TConfig {
    constructor(schema, configDir) {
        this.schema = schema;
        this.config = {};
        if (configDir) {
            process.env.NODE_CONFIG_DIR = configDir;
        }
        this.configLib = require("config");
    }
    parseConfig() {
        if (!this.config) {
            this.config = this.parse(this.schema, []);
        }
        return this.config;
    }
    getValueOf(type, hierarchy) {
        const key = hierarchy.join(".");
        if (!this.configLib.has(key)) {
            if (type.optional) {
                return undefined;
            }
            else {
                throw Error(`Missing property ${key}`);
            }
        }
        let value = this.configLib.get(key);
        if (["number", "string", "boolean"].indexOf(type.typeName) > -1) {
            if (typeof value !== type.typeName) {
                throw Error(`Property ${key} should be a ${type.typeName}, but it is a ${typeof value} equal to ${value}`);
            }
        }
        else if (type.typeName === "array" && !Array.isArray(value)) {
            throw Error(`Property ${key} should be an array.`);
        }
        else if (type.typeName === "object" && typeof value !== "object") {
            throw Error(`Property ${key} should be an object, but it is a ${typeof value} equal to ${value}`);
        }
        if (type.typeName === "array" && type.nestedSchema) {
            if (typeof type.nestedSchema === "object" && !(type.nestedSchema instanceof Types_1.TType) && Object.keys(type.nestedSchema).length < 1) {
            }
            else {
                const array = [];
                for (let i = 0; i < value.length; i++) {
                    array[i] = this.figureStrategy(type.nestedSchema, [...hierarchy, i]);
                }
                return array;
            }
        }
        return value;
    }
    figureStrategy(type, hierarchy) {
        if (typeof type === "function") {
            return this.getValueOf(type(), hierarchy);
        }
        else if (typeof type === "object") {
            if (type instanceof Types_1.TType) {
                return this.getValueOf(type, hierarchy);
            }
            else if (Array.isArray(type)) {
                const nested = type[0] || undefined;
                const realType = new Types_1.TType("array", false, nested);
                return this.getValueOf(realType, hierarchy);
            }
            else {
                return this.parse(type, hierarchy);
            }
        }
        else {
            throw Error(`Property ${hierarchy.join(".")} has an invalid type`);
        }
    }
    parse(schema, hierarchy) {
        const object = {};
        for (let key of Object.keys(schema)) {
            object[key] = this.figureStrategy(schema[key], [...hierarchy, key]);
        }
        return object;
    }
    static create(schema, configDir) {
        if (this._instance !== undefined) {
            throw Error("TConfig can only be created once!");
        }
        this._instance = new TConfig(schema, configDir);
        return this._instance;
    }
    static get instance() {
        return this._instance;
    }
}
exports.default = TConfig;
//# sourceMappingURL=TConfig.js.map