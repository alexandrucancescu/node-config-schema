"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
class TypeGenerator {
    getValueOf(type) {
        if (["number", "string", "boolean", "any"].indexOf(type.typeName) > -1) {
            return type.typeName;
        }
        else if (type.typeName === "object") {
            return { "[s:string]": "any" };
        }
        else if (type.typeName === "array") {
            if ((!type.nestedSchema) || (typeof type.nestedSchema === "object" && !(type.nestedSchema instanceof Types_1.TType) && Object.keys(type.nestedSchema).length < 1)) {
                return [];
            }
            else {
                return [this.figureStrategy(type.nestedSchema)];
            }
        }
    }
    figureStrategy(type) {
        if (typeof type === "function") {
            return this.getValueOf(type());
        }
        else if (typeof type === "object") {
            if (type instanceof Types_1.TType) {
                return this.getValueOf(type);
            }
            else if (Array.isArray(type)) {
                const nested = type[0] || undefined;
                const realType = new Types_1.TType("array", false, nested);
                return this.getValueOf(realType);
            }
            else {
                return this.parse(type);
            }
        }
        else {
            throw Error(`Property has an invalid type`);
        }
    }
    parse(schema) {
        const obj = {};
        for (let key of Object.keys(schema)) {
            obj[key] = this.figureStrategy(schema[key]);
        }
        return obj;
    }
    beautifyField(key, value, level) {
        const tabs = key === undefined ? "" : "\t".repeat(level);
        const lbreak = key === undefined ? "" : ",\n";
        const keyStr = key === undefined ? "" : `${key}: `;
        if (typeof value === "string") {
            return `${tabs}${keyStr}${value}${lbreak}`;
        }
        else if (typeof value === "object" && !Array.isArray(value)) {
            return `${tabs}${keyStr}${this.beautify(value, level + 1)}${lbreak}`;
        }
        else if (typeof value === "object" && Array.isArray(value)) {
            return `${tabs}${keyStr}[${this.beautifyField(undefined, value[0], level)}]${lbreak}`;
        }
        else if (!value) {
            return "";
        }
    }
    beautify(object, level) {
        let str = "{\n";
        for (let key of Object.keys(object)) {
            const value = object[key];
            str += this.beautifyField(key, value, level);
        }
        str += `${"\t".repeat(level - 1)}}`;
        return str;
    }
    generateSchemaTypes(schema, withDef) {
        const schemaType = this.parse(schema);
        const beauty = this.beautify(schemaType, 1);
        if (withDef) {
            return `type ConfigType=${beauty};`;
        }
        else {
            return beauty;
        }
    }
}
const typeGenerator = new TypeGenerator();
function generate(schema, withDef) {
    return typeGenerator.generateSchemaTypes(schema, withDef);
}
exports.default = generate;
//# sourceMappingURL=TypeGenerator.js.map