"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function TString(optional) {
    return new TType("string", optional === true);
}
exports.TString = TString;
function TNumber(optional) {
    return new TType("number", optional === true);
}
exports.TNumber = TNumber;
function TBoolean(optional) {
    return new TType("boolean", optional === true);
}
exports.TBoolean = TBoolean;
function TArray(nestedSchema, optional) {
    return new TType("array", optional === true, nestedSchema);
}
exports.TArray = TArray;
function TAny(optional) {
    return new TType("any", optional === true);
}
exports.TAny = TAny;
function TObject(optional) {
    return new TType("object", optional === true);
}
exports.TObject = TObject;
class TType {
    constructor(type, optional, nestedSchema) {
        this.typeName = type;
        this.optional = optional;
        this.nestedSchema = nestedSchema;
    }
}
exports.TType = TType;
//# sourceMappingURL=Types.js.map