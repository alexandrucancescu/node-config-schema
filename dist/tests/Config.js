"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
lib_1.default.create({
    gets: [{ x: [[lib_1.TNumber]] }],
    puts: lib_1.TObject,
    database: {
        host: lib_1.TString,
        credentials: {
            does: lib_1.TBoolean,
            auth: lib_1.TBoolean,
            user: lib_1.TString,
            pass: lib_1.TString,
        }
    }
}, "./config");
lib_1.default.instance.parseConfig();
//# sourceMappingURL=Config.js.map