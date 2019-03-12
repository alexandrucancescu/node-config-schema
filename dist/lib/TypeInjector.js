"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const Types_1 = require("./Types");
const path_1 = require("path");
const TypeGenerator_1 = require("./TypeGenerator");
const fs_1 = require("fs");
const TO_REPLACE = `(${["TNumber", "TBoolean", "TString", "TArray", "TObject", "TAny"].join("|")})`;
const SEARCH_FOR_START = /(TConfig.create\()/;
const OLD_TYPES_REGEX = /(type ConfigType=)/;
function computeSchema(code) {
    const context = { TNumber: Types_1.TNumber, TBoolean: Types_1.TBoolean, TString: Types_1.TString, TArray: Types_1.TArray, TObject: Types_1.TObject, TAny: Types_1.TAny };
    let result;
    code = `result=${code}`.replace(new RegExp(TO_REPLACE, "g"), "context.$1");
    eval(code);
    return result;
}
var COMMAND;
(function (COMMAND) {
    COMMAND[COMMAND["PRINT"] = 0] = "PRINT";
    COMMAND[COMMAND["INJECT"] = 1] = "INJECT";
})(COMMAND || (COMMAND = {}));
let fileContent;
let filePath;
let cmd;
function parseCommand() {
    const command = process.argv.slice(-2)[0];
    if (command !== "print" && command !== "inject") {
        console.error(`Invalid command '${command}'`);
        process.exit(1);
    }
    cmd = command === "print" ? COMMAND.PRINT : COMMAND.INJECT;
}
function getFileFromArgs() {
    const fileArg = process.argv.slice(-1)[0];
    let file;
    if (!fileArg) {
        console.error("No file given as argument");
        process.exit(1);
    }
    if (fileArg.substring(0, 1) === ".") {
        file = path_1.join(process.cwd(), fileArg);
    }
    else {
        file = fileArg;
    }
    if (!fs_extra_1.pathExistsSync(file)) {
        console.error(`File ${file} does not exists`);
        process.exit(1);
    }
    filePath = file;
    return file;
}
function readFileContent() {
    const file = getFileFromArgs();
    try {
        fileContent = fs_extra_1.readFileSync(file, "utf-8");
        return fileContent;
    }
    catch (e) {
        console.error(`Could not read file: ${e}`);
        process.exit(1);
    }
}
function findBracesStartEnd(content) {
    let start;
    let end;
    let bracesOpen = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charAt(i);
        if (char === "{") {
            if (bracesOpen === 0) {
                start = i;
            }
            bracesOpen++;
        }
        else if (char === "}") {
            bracesOpen--;
            if (bracesOpen === 0) {
                end = i;
                break;
            }
        }
    }
    return { start, end };
}
function parseSchemaDeclaration() {
    const content = fileContent;
    const index = content.search(new RegExp(SEARCH_FOR_START));
    if (index < 0) {
        console.error(`Could not find any sequence 'TConfig.create(' in file provided`);
        process.exit(0);
    }
    const searchIn = content.substring(index + "TConfig.create(".length, content.length);
    const { start, end } = findBracesStartEnd(searchIn);
    if (typeof start !== "number" || typeof end !== "number") {
        console.error("Could not find schema declaration");
        process.exit(0);
    }
    return searchIn.substring(start, end + 1);
}
function indexOfOldTypes() {
    const content = fileContent;
    const start = content.search(new RegExp(OLD_TYPES_REGEX));
    if (start >= 0) {
        let { end } = findBracesStartEnd(content.substring(start));
        if (typeof end === "number") {
            end = end + start + 1;
            return { start, end: end };
        }
    }
    return null;
}
function replaceOldTypes(newTypes) {
    console.log("Trying to replace old types...");
    const indexes = indexOfOldTypes();
    if (!indexes) {
        return null;
    }
    // console.log(fileContent.substring(indexes.start,indexes.end));
    const before = fileContent.substring(0, indexes.start);
    const after = fileContent.substring(indexes.end + 1);
    return before + newTypes + after;
}
function injectUnderComment(newTypes) {
    console.log("Trying to inject under config comment...");
    const parts = fileContent.split("//config_types");
    if (parts.length < 2)
        return null;
    return `${parts[0]}//config_types\n${newTypes}${parts[1]}`;
}
function injectEnd(newTypes) {
    console.log("Injecting at end of file...");
    return `${fileContent}\n${newTypes}`;
}
function inject() {
    parseCommand();
    readFileContent();
    const schemaDeclaration = parseSchemaDeclaration();
    const schema = computeSchema(schemaDeclaration);
    const typeDeclarations = TypeGenerator_1.default(schema, true);
    if (cmd === COMMAND.INJECT) {
        let newContent = replaceOldTypes(typeDeclarations) ||
            injectUnderComment(typeDeclarations) ||
            injectEnd(typeDeclarations);
        fs_1.writeFileSync(filePath, newContent);
        console.log("DONE!");
    }
    else if (cmd === COMMAND.PRINT) {
        console.log(`${"-".repeat(10)}\n${typeDeclarations}\n${"-".repeat(10)}`);
    }
}
exports.default = inject;
//# sourceMappingURL=TypeInjector.js.map