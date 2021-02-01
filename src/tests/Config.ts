import  TConfig,{TBoolean, TNumber, TObject, TString} from "../lib"

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
},"./config");

TConfig.instance.parseConfig();

