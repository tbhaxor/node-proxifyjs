import * as https from "https";
import { IResult, ICountry, IFilter } from "./interfaces";

/**
 * function to format the raw output
 *
 * @param {string} input
 * @returns {IResult}
 */
function format(input: string): IResult {
  let output: IResult = {
    host: "",
    country: { code: "", name: "" },
    google: false,
    https: false,
    port: 0,
    lastChecked: "",
    type: "",
  };
  output.host = input.split("<tr><td>")[1].split("</td><td>")[0];
  output.port = parseInt(input.split("</td><td>")[1]);
  output.google =
    input.split("</td><td class='hm'>")[2].split("</td>")[0] == "yes";
  output.https = input.split("<td class='hx'>")[1].split("</td>")[0] == "yes";
  output.lastChecked = input.split("</td></tr>")[0].split("<td class='hm'>")[3];
  output.type = input.split("</td><td>")[3].split("</td>")[0];
  output.country.code = input.split("</td><td>")[2].split("</td>")[0];
  output.country.name = input.split("<td class='hm'>")[1].split("</td>")[0];
  return output;
}

/** Utility function to check whether data is RegExp instance or not */
function isRegex(data: any): data is RegExp {
  return data instanceof RegExp;
}

/** Utility function to check whether data is string instance or not */
function isString(data: any): data is string {
  return typeof data === "string";
}

/**
 * function to find proxies
 *
 * @export
 * @param {IFilter} filter
 * @returns {Promise<IResult[]>}
 */
export default function (filter: IFilter): Promise<IResult[]> {
  return new Promise<IResult[]>((resolve, reject) => {
    // making https request
    https
      .get("https://free-proxy-list.net/", (resp) => {
        resp.setEncoding("utf8");

        let data = "";
        // getting all response body
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // when response is over
        resp.on("end", () => {
          // splitted by row
          const raw = data.match(
            /<tr><td>[^<]*<\/td><td>[^<]*<\/td><td>[^<]*<\/td><td class='hm'>[^<]*<\/td><td>[^<]*<\/td><td class='hm'>[^<]*<\/td><td class='hx'>[^<]*<\/td><td class='hm'>[^<]*<\/td><\/tr>/gi
          );
          if (!raw) throw new SyntaxError("Unable to parse the response");

          // getting the output
          let output: IResult[] = raw.map(format);

          // check if no filter passed
          if (!filter || Object.keys(filter).length == 0) {
            return resolve(output);
          }

          // check if https flag is set or not
          if (typeof filter.https !== "undefined") {
            output = output.filter((v) => v.https == filter.https);
          }

          // check if google flag is set or not
          if (typeof filter.google !== "undefined") {
            output = output.filter((v) => v.google == filter.google);
          }

          // check if country flag is set or not
          if (
            typeof filter.country !== "undefined" &&
            filter.country instanceof Object &&
            Object.keys(filter.country).length > 0
          ) {
            const { code, name } = filter.country;
            if (code) {
              output = output.filter((v) => v.country.code === code);
            } else if (name) {
              if (isRegex(name)) {
                output = output.filter((v) => name.test(v.country.name));
              } else if (isString(name)) {
                output = output.filter((v) => v.country.name === name);
              }
            }
          }

          // check if valid type passed
          if (
            filter.type &&
            ["anonymous", "elite proxy", "transparent"].includes(filter.type)
          ) {
            output = output.filter((v) => v.type == filter.type);
          }

          // check if count is passed
          if (
            typeof filter.count === "undefined" ||
            filter.count > 300 ||
            filter.count < 1
          ) {
            return resolve(output);
          } else {
            return resolve(output.slice(0, filter.count));
          }
        });
      })
      .on("error", (err) => {
        // on https error reject with reason
        reject(err);
      });
  });
}
