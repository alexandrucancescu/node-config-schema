# node-config-schema

## Features

*   Define schema for configuration files
*   Validate configuration files for type errors
*   Recursive check, allowing any nested level
*   Generates type declaration for typescript and injects them into your code

## Install

```shell
$ npm install --save node-config-schema
```

## Introduction

**node-config-schema** lets you define a schema for your configuration files.
This ensures that you have no surprises in your application during runtime, any property with the wrong
type is caught during the initialization of the app.

Furthermore **node-config-schema** can **generate** typescript type definitions for your schema and even 
**inject** them into your code, keeping them up to date.

It wraps around the popular node package [config](https://www.npmjs.com/package/config) so
it offers all the customization of it such as:
* Merging multiple config files
* Loading config files based on the environment
* Config files written in **.yml .yaml .xml .coffee .cson .properties .json, .json5 .hjson .ts .js**

## Quick Start

This guide assumes you are already familiar with [config](https://www.npmjs.com/package/config)
package and know how it works. If not, you should read their quick guide first.

This guide is also written in typescript, but can be easily adjusted for js.

```javascript
import  TConfig,{TBoolean, TNumber, TObject, TString,TAny} from "node-config-schema"

TConfig.create({
    admins:TObject,
    conf:TAny,
    database: {
        hosts: [TString],
        credentials: {
            auth: TBoolean,
            user: TString,
            pass: TString,
        }
    },
    //Array of objects with a property 'x' that is an array of arrays of numbers
    matrix: [{x:[[TNumber]]}],
});

const config=TConfig.instance.parseConfig();
```
##### Import JS:

```javascript
const {TConfig,TNumber,TBoolean,TAny}=require("node-config-schema");
```

#### How:
1. First you need to initialize TConfig by calling ```TConfig.create``` and passing it your schema.
2. Retrieve the singleton instance using `TConfig.instance`
3. Start the parsing process with `parseConfig()`
4. `parseConfig()` returns your configuration object, just as **config** would have, type checked and
validated. No surprises!

TConfig will parse the config files using **config** package and
check each property of each object and each item of each array, making
sure they fulfill the schema defined by you.

#### How to define a schema:

A schema is defined using a combination of nested objects and `TTypes`.

TTypes include:
`TNumber,TBoolean,TString,TArray,TObject,TAny`

These `TTypes` are functions that can be passed to the schema as they are such as:

```javascript
{
    x: TNumber,
}
```
Or pass the result of the function.
```javascript
{
    x: TNumber(),
    y: TString(true),
}
```

Every `TType` function has an optional `optional` parameter.
If this parameter is set to true, `TConfig` will treat the config
property as optional, and will not throw an error if this is
undefined.

For simplicity `TArray` can be passed to the schema as an
array ```[]```, with the only item of this array being the optional nested
schema ```[TSchema]```.


```javascript
{
    x: TString,
    same as
    x: TString(),
    same as
    x: TString(false),
    
    y: Array,
    same as
    y: [],
    same as 
    y: Array()
   
   z:Array(false,TNumber),
   same as
   z:[TNumber]
}
```

**Read API Documentation** for more examples.

---
#### NOTE:

**node-config-schema** is designed using the singleton design, meaning there can only be
one instance of it, that will be created using the `create` method.
This design choice has been made due to the nature of the **config** package.

## API DOCUMENTATION

### TConfig

This is the base singleton class.

##### Methods:

`create(schema: TSchema, configDir?: string)`

This method initializes the TConfig class with the given `schema`.
Optionally you can pass the path to the dir of the configuration files.
It will be passed to the **config** package using `process.env`.

`parseConfig()`

Parses and returns the configurations object. Will throw an error on the first
occurrence of a property that does not fulfill the schema.

`instance`

Retrieve the TConfig instance. This is a getter.

### TSchema

Definition of schema type. 

### TNumber,TBoolean,TString

`TType(optional?: boolean)`

Functions describing the type of the key they are assigned to.
Can be passed as functions, or the result of their call can be passed.

Every `TType` function has an optional `optional` parameter.
If this parameter is set to true, `TConfig` will treat the config
property as optional, and will not trow an error if this is
undefined.

### TObject,TAny

Same as the other `TTypes`.

`TObject` can be any object, including an array or an empty object `{}`.

`TAny` can be anything except null and undefined
### TArray

`TArray(optional?: boolean,nestedSchema?: TSchema)`

Same as the other `TTypes` except this type has an additional
optional parameter describing it's nested schema. Every member of the array
is checked to fulfill this schema. If `nestedSchema` is omitted, TConfig
will only check that this is an array.

For simplicity `TArray` can be passed to the schema as an
array, with the only item of this array being the optional nested
schema.

```javascript
{
    x:TArray(false,TNumber),
    
    //Same as:
    
    x:[TNumber]
    
    
    x:TArray(false,TArray(false,{x:TString})),
    
    //same as
    
    x:[[{x:TString}]]
}
```  

## Injecting type definitions for typescript 

**node-config-schema** can also generate type definitions for your
schema and inject them into your code. This is important
for typescript developers, as they can benefit from
IDE functions when the IDE can understand the types your schema
returns.

Setting this up is straight-forward.

File `src/Config.ts`
```javascript
import  TConfig,{TBoolean, TNumber, TObject, TString,TAny} from "node-config-schema"

//config_types

TConfig.create({
	database: {
		hosts: [TString],
		credentials: {
			auth: TBoolean,
			user: TString,
			pass: TString,
		}
	}
});

TConfig.instance.parseConfig();
```

File `package.json`
```json
{
  "name": "your-project",
  "scripts": {
    "inject-types": "tconfig-inject inject ./src/Config.ts",
    "print-types": "tconfig-inject print ./src/Config.ts"
  },
  ....
}
```

Terminal:
```shell
$ npm run inject-types
```

The lib will attempt to find your schema, interpret it and
inject it bellow `//config_types` comment as follows:

```javascript
//config_types
type ConfigType={
	database: {
		hosts: [string],
		credentials: {
			auth: boolean,
			user: string,
			pass: string,
		},
	},
};
...
```

The script attempts to replace a previous versions of the types
first. If it cannot find one it will inject the new types bellow the
`//config_types` comment. If the comment is absent, it will inject the types
at the end of the file.

### API
`tconfig-inject cmd filePath`

**cmd**
*   `print` only prints type definitions
*   `inject` attempts to inject them

**filePath** can be relative to the project root using `./relative-path`
or absolute.

### NOTICE

In order to find your schema declaration the script tries to find
the string sequence `TConfig.create(`. If you import `TConfig` under
a different name the parser will not be able to find your declaration.

Also the parser finds the old version of your type declaration
by searching for `type ConfigType=` so don't modify it either.

### LICENSE

#### MIT








 
