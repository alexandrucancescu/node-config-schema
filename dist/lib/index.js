"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TConfig = exports.generateTypes = exports.TAny = exports.TObject = exports.TArray = exports.TString = exports.TBoolean = exports.TNumber = void 0;
const TConfig_1 = require("./TConfig");
var Types_1 = require("./Types");
Object.defineProperty(exports, "TNumber", { enumerable: true, get: function () { return Types_1.TNumber; } });
Object.defineProperty(exports, "TBoolean", { enumerable: true, get: function () { return Types_1.TBoolean; } });
Object.defineProperty(exports, "TString", { enumerable: true, get: function () { return Types_1.TString; } });
Object.defineProperty(exports, "TArray", { enumerable: true, get: function () { return Types_1.TArray; } });
Object.defineProperty(exports, "TObject", { enumerable: true, get: function () { return Types_1.TObject; } });
Object.defineProperty(exports, "TAny", { enumerable: true, get: function () { return Types_1.TAny; } });
var TypeGenerator_1 = require("./TypeGenerator");
Object.defineProperty(exports, "generateTypes", { enumerable: true, get: function () { return TypeGenerator_1.default; } });
exports.TConfig = TConfig_1.default;
exports.default = exports.TConfig;
//# sourceMappingURL=index.js.map