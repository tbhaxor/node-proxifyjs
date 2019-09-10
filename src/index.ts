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
    type: ""
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

/**
 * function to find proxies
 *
 * @export
 * @param {IFilter} filter
 * @returns {Promise<IResult[]>}
 */
export default function(filter: IFilter): Promise<IResult[]> {
  return new Promise<IResult[]>((resolve, reject) => {
    // making https request
    https
      .get("https://free-proxy-list.net/", resp => {
        resp.setEncoding("utf8");

        let data = "";
        // getting all response body
        resp.on("data", chunk => {
          data += chunk;
        });

        // when response is over
        resp.on("end", () => {
          // splitted by row
          let raw = data.match(
            /<tr><td>[^<]*<\/td><td>[^<]*<\/td><td>[^<]*<\/td><td class='hm'>[^<]*<\/td><td>[^<]*<\/td><td class='hm'>[^<]*<\/td><td class='hx'>[^<]*<\/td><td class='hm'>[^<]*<\/td><\/tr>/gi
          );
          // getting the output
          let output: IResult[] = raw.map(format);

          // check if no filter passed
          if (!filter || Object.keys(filter).length == 0) {
            // send all results
            resolve(output);
          }
          console.log(1);
          // check if https flag is set or not
          if (filter.https !== undefined)
            // filter out by the user input
            output = output.filter(v => v.https == filter.https);

          // check if google flag is set or not
          if (filter.google !== undefined)
            // filter out by the user input
            output = output.filter(v => v.google == filter.google);

          // check if country flag is set or not
          if (filter.country !== undefined) {
            // check if country sub flag is set or not
            if (Object.keys(filter.country).length == 0)
              // send the error
              reject(new Error("Insufficient filter predicates"));
            else {
              // filter either by code
              if (filter.country.code !== undefined) {
                // filter out by the user input
                output = output.filter(
                  v => v.country.code == filter.country.code
                );
              }
              // or by name with regex
              else if (filter.country.name !== undefined) {
                // make the regexp
                let r = new RegExp(filter.country.name, "i");
                // filter out by the user input
                output = output.filter(v => r.test(v.country.name));
              }
            }
          }

          // check if valid type passed
          if (
            ["anonymous", "elite proxy", "transparent"].includes(filter.type)
          ) {
            // filter out by the user input
            output = output.filter(v => v.type == filter.type);
          }

          // check if count is passed
          if (filter.count === undefined) {
            // send previous
            resolve(output);
          }
          // check if user wants more than 300
          else if (filter.count > 300) {
            // reject with the error
            reject(new Error("Count of proxies can not exceed 300"));
          } else {
            // slice the proxy
            output = output.slice(0, filter.count);
            // send it <3
            resolve(output);
          }
        });
      })
      .on("error", err => {
        // on https error reject with reason
        reject(err);
      });
  });
}
