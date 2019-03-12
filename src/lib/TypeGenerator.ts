import {TBoolean, TNumber, TSchema, TString, TType, TTypeDescriptor} from "./Types";

class TypeGenerator{
	private getValueOf(type:TType){
		if(["number","string","boolean","any"].indexOf(type.typeName)>-1){
			return type.typeName
		}else if(type.typeName==="object"){
			return {"[s:string]":"any"};
		}else if(type.typeName==="array"){
			if((!type.nestedSchema) || (typeof type.nestedSchema==="object" && !(type.nestedSchema instanceof TType) && Object.keys(type.nestedSchema).length<1) ){
				return [];
			}else{
				return [this.figureStrategy(type.nestedSchema)];
			}
		}
	}

	private figureStrategy(type:TTypeDescriptor){
		if(typeof type==="function"){
			return this.getValueOf(type());
		}else if(typeof type==="object"){
			if(type instanceof TType){
				return this.getValueOf(type)
			}else if(Array.isArray(type)){
				const nested=type[0]||undefined;
				const realType=new TType("array",false,nested);
				return this.getValueOf(realType);
			}else{
				return this.parse(type)
			}
		}else{
			throw Error(`Property has an invalid type`);
		}
	}

	private parse(schema){
		const obj={};
		for(let key of Object.keys(schema)){
			obj[key]=this.figureStrategy(schema[key]);
		}
		return obj;
	}

	private beautifyField(key:string|undefined,value:any,level:number){
		const tabs= key===undefined ? "" : "\t".repeat(level);
		const lbreak= key===undefined ? "" : ",\n";
		const keyStr= key===undefined ? "" : `${key}: `;
		if(typeof value==="string"){
			return `${tabs}${keyStr}${value}${lbreak}`
		}else if(typeof value==="object" && !Array.isArray(value)){
			return `${tabs}${keyStr}${this.beautify(value,level+1)}${lbreak}`;
		}else if(typeof value==="object" && Array.isArray(value)){
			return `${tabs}${keyStr}[${this.beautifyField(undefined,value[0],level)}]${lbreak}`
		}else if(!value){
			return "";
		}
	}

	private beautify(object:any,level:number){
		let str="{\n";
		for(let key of Object.keys(object)){
			const value=object[key];
			str+=this.beautifyField(key,value,level);
		}
		str+=`${"\t".repeat(level-1)}}`;
		return str;
	}

	public generateSchemaTypes(schema:TSchema,withDef?:boolean):string{
		const schemaType=this.parse(schema);
		const beauty=this.beautify(schemaType,1);
		if(withDef){
			return `type ConfigType=${beauty};`;
		}else{
			return beauty;
		}
	}
}

const typeGenerator=new TypeGenerator();

export default function generate(schema:TSchema,withDef?:boolean):string{
	return typeGenerator.generateSchemaTypes(schema,withDef);
}
