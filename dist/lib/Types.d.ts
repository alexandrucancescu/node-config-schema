export declare function TString(optional?: boolean): TType;
export declare function TNumber(optional?: boolean): TType;
export declare function TBoolean(optional?: boolean): TType;
export declare function TArray(nestedSchema?: TTypeDescriptor, optional?: boolean): TType;
export declare function TAny(optional?: boolean): TType;
export declare function TObject(optional?: boolean): TType;
declare type TTypeFunction = (...any: any[]) => TType;
declare type TTypeName = "string" | "array" | "number" | "boolean" | "any" | "object";
export declare class TType {
    readonly typeName: TTypeName;
    readonly optional: boolean;
    readonly nestedSchema?: TTypeDescriptor;
    constructor(type: TTypeName, optional: boolean, nestedSchema?: TTypeDescriptor);
}
declare type TArrayDescriptor = [TType | TTypeFunction | TSchema | TArrayDescriptorArray];
interface TArrayDescriptorArray extends Array<TArrayDescriptor> {
}
export declare type TTypeDescriptor = TType | TTypeFunction | TSchema | TArrayDescriptor | TArrayDescriptorArray;
export declare type TResult = {
    [s: string]: any;
};
export declare type TSchema = {
    [s: string]: TTypeDescriptor;
};
export {};
