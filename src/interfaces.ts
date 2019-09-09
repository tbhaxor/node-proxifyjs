export interface ICountry {
  code: string;
  name: string;
}

export interface IResult {
  host: string;
  port: number;
  country: ICountry;
  type: string;
  google: boolean;
  https: boolean;
  lastChecked: string;
}

export interface IFilterCountry {
  name?: string;
  code?: string;
}

export interface IFilter {
  count?: number;
  https?: boolean;
  google?: boolean;
  country?: IFilterCountry;
  type?: "anonymous" | "elite proxy" | "transparent";
}
