export function TString(optional?:boolean):TType{
	return new TType("string", optional===true);
}

export function TNumber(optional?:boolean):TType{
	return new TType("number",optional===true);
}

export function TBoolean(optional?:boolean):TType{
	return new TType("boolean",optional===true);
}

export function TArray(nestedSchema?:TTypeDescriptor,optional?:boolean):TType{
	return new TType("array",optional===true,nestedSchema);
}

export function TAny(optional?:boolean):TType{
	return new TType("any",optional===true);
}

export function TObject(optional?:boolean):TType{
	return new TType("object",optional===true);
}

type TTypeFunction=(...any)=>TType

type TTypeName="string"|"array"|"number"|"boolean"|"any"|"object";

export class TType{
	public readonly typeName:TTypeName;
	public readonly optional:boolean;
	public readonly nestedSchema?:TTypeDescriptor;

	constructor(type: TTypeName, optional: boolean,nestedSchema?:TTypeDescriptor){
		this.typeName = type;
		this.optional = optional;
		this.nestedSchema=nestedSchema;
	}

}

type TArrayDescriptor=[TType|TTypeFunction|TSchema|TArrayDescriptorArray];

interface TArrayDescriptorArray extends Array<TArrayDescriptor>{}

export type TTypeDescriptor=TType|TTypeFunction|TSchema|TArrayDescriptor|TArrayDescriptorArray;

export type TResult={
	[s:string] : any
}

export type TSchema={
	[s:string]: TTypeDescriptor
}