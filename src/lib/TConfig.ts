import {IConfig} from "config"
import { TResult, TSchema, TType, TTypeDescriptor} from "./Types";

class TConfig{
	private readonly configLib:IConfig;
	private readonly schema:TSchema;
	private _config:TResult;

	private constructor(schema:TSchema,configDir?:string){
		this.schema=schema;
		if(configDir){
			process.env.NODE_CONFIG_DIR=configDir;
		}
		this.configLib=require("config");
	}

	public parseConfig():TResult{
		if(!this._config){
			this._config=this.parse(this.schema,[]);
		}
		return this._config;
	}

	private getValueOf(type:TType,hierarchy:(string|number)[]){
		const key=hierarchy.join(".");
		if(!this.configLib.has(key)){
			if(type.optional){
				return undefined;
			}else{
				throw Error(`Missing property ${key}`);
			}
		}

		let value=this.configLib.get<any>(key);
		if(["number","string","boolean"].indexOf(type.typeName)>-1){
			if(typeof value!==type.typeName){
				throw Error(`Property ${key} should be a ${type.typeName}, but it is a ${typeof value} equal to ${value}`);
			}
		}else if(type.typeName==="array" && !Array.isArray(value)){
			throw Error(`Property ${key} should be an array.`);
		}else if(type.typeName==="object" && typeof value!=="object"){
			throw Error(`Property ${key} should be an object, but it is a ${typeof value} equal to ${value}`);
		}

		if(type.typeName==="array" && type.nestedSchema){
			if(typeof type.nestedSchema==="object" && !(type.nestedSchema instanceof TType) && Object.keys(type.nestedSchema).length<1){

			}else{
				const array=[];
				for(let i=0;i<value.length;i++){
					array[i]=this.figureStrategy(type.nestedSchema,[...hierarchy,i])
				}
				return array;
			}
		}

		return value;
	}

	private figureStrategy(type:TTypeDescriptor,hierarchy:(string|number)[]){
		if(typeof type==="function"){
			return this.getValueOf(type(),hierarchy);
		}else if(typeof type==="object"){
			if(type instanceof TType){
				return this.getValueOf(type,hierarchy)
			}else if(Array.isArray(type)){
				const nested=type[0]||undefined;
				const realType=new TType("array",false,nested);
				return this.getValueOf(realType,hierarchy);
			}else{
				return this.parse(type,hierarchy)
			}
		}else{
			throw Error(`Property ${hierarchy.join(".")} has an invalid type`);
		}
	}

	private parse(schema:TSchema,hierarchy:(string|number)[]):any{
		const object={};
		for(let key of Object.keys(schema)){
			object[key]=this.figureStrategy(schema[key],[...hierarchy,key]);
		}
		return object;
	}

	public get config():any{
		return this._config;
	}

	//Singleton stuff
	private static _instance:TConfig;

	public static create(schema:TSchema,configDir?:string):any{
		if(this._instance!==undefined){
			throw Error("TConfig can only be created once!");
		}
		this._instance=new TConfig(schema,configDir);
		return this._instance;
	}

	public static get instance():TConfig{
		return this._instance;
	}
}

export default TConfig;
