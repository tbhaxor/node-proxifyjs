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

          if (!filter) {
            resolve(output);
          }
          // check if count is passed
          else if (filter.count) {
            // if requested for more than 300
            if (filter.count > 300)
              // reject the request
              reject(new Error("Proxies limit can't exceed 300"));
            else {
              // if passed https with count, filter out the https
              if (filter.https !== undefined)
                output = output.filter(v => v.https == filter.https);
              // slice and send it
              resolve(output.slice(0, filter.count));
            }
          }
          // if count is not passed, but https is passed
          else if (filter.https !== undefined) {
            // filtering out https
            output = output.filter(v => v.https == filter.https);
            // send it
            resolve(output);
          } else {
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
