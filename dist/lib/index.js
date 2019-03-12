"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TConfig_1 = require("./TConfig");
var Types_1 = require("./Types");
exports.TNumber = Types_1.TNumber;
exports.TBoolean = Types_1.TBoolean;
exports.TString = Types_1.TString;
exports.TArray = Types_1.TArray;
exports.TObject = Types_1.TObject;
exports.TAny = Types_1.TAny;
var TypeGenerator_1 = require("./TypeGenerator");
exports.generateTypes = TypeGenerator_1.default;
exports.TConfig = TConfig_1.default;
exports.default = exports.TConfig;
//# sourceMappingURL=index.js.map