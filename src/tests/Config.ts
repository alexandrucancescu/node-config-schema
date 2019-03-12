import  TConfig,{TBoolean, TNumber, TObject, TString} from "../lib"
import {join} from "path";

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


TConfig.create({
	gets: [{x: [[TNumber]]}],
	puts:TObject,
	database: {
		host: TString,
		credentials: {
			does: TBoolean,
			auth: TBoolean,
			user: TString,
			pass: TString,
		}
	}
},join(__dirname,"../cc"));

TConfig.instance.parseConfig();

