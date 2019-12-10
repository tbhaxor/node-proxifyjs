# NODE-PROXIFYJS ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/tbhaxor/node-proxify) ![GitHub package.json version](https://img.shields.io/github/package-json/v/tbhaxor/node-proxify) ![GitHub](https://img.shields.io/github/license/tbhaxor/node-proxify) ![GitHub last commit](https://img.shields.io/github/last-commit/tbhaxor/node-proxify) ![npm](https://img.shields.io/npm/dw/node-proxifyjs)

**node-proxifyjs** is a promise based handy module for nodejs developers to find fresh and working free proxies from https://free-proxy-list.net/ by calling only one function

## Requirements

1. node.js
2. npm

## Install and Use

1. Install from npm

   ```sh
   $ npm i node-proxifyjs
   ```

2. Use

   ```ts
   import proxify from "node-proxifyjs";

   (async () => {
     let data = await proxify(); // this will return all 300 proxies
     console.log(data);
   })();
   ```

   Importing with _require_ is quite different

   ```js
   const proxify = require("node-proxifyjs").default;
   ```

## API

### Filtering Parameters

- **Fetching `n` proxies**

  pass an object property `count` to the function, only _number_

  ```ts
  import proxify from "node-proxifyjs";

  (async () => {
    let data = await proxify({ count: 20 }); // this will return first 20 proxies
    console.log(data);
  })();
  ```

* **Fetching `google` proxies**

  pass an object property `google` to the function, only _boolean_

  ```ts
  import proxify from "node-proxifyjs";

  (async () => {
    let data = await proxify({ google: true }); // pass google: false if you dont want google proxies
    console.log(data);
  })();
  ```

- **Fetching `https` proxies**

  pass an object property `https` to the function, only _boolean_

  ```ts
  import proxify from "node-proxifyjs";

  (async () => {
    let data = await proxify({ https: true }); // pass https: false if you dont want https proxies
    console.log(data);
  })();
  ```

- **Fetching `country` specific proxies**

  pass an object property `country` to the function, only `{code?: string, name?: Regrex String}`

  **Note:** Either `code` or `name` will work, both of them at same time will not work

  ```ts
  import proxify from "node-proxifyjs";

  (async () => {
    let data = await proxify({ country: { code: "US" } }); // pass the name property instead of code if you want to perform regexp search
    console.log(data);
  })();
  ```

- **Fetching proxies by `type`**

  pass an object property `type` to the function, only _string_

  ```ts
  import proxify from "node-proxifyjs";

  (async () => {
    let data = await proxify({ type: "elite proxy" }); // type can be either 'transparent', 'anonymous' or 'elite proxy' only
    console.log(data);
  })();
  ```

**Note:** None, one, some or all filtering predicates can be used at once

```ts
proxify({ count: 30, country: { code: "IN" }, type: "elite proxy" });
```

### Returns

```ts
interface ICountry {
  code: string; // country code
  name: string; // country name
}

interface IResult {
  host: string; // the ip
  port: number; // port numbeer
  country: ICountry; // country from above interface
  type: string; // type of proxy (elite, anonymous, transparent)
  google: boolean; // is google
  https: boolean; // is https ssl signed
  lastChecked: string; // last checked for working
}
```

## Contribution

### Rules

- Pull requests must be made from another branch, not the master branch
- Add valid commit message
- Describe the change in pull request

### Scope

- Documentation
- Bugs / Suggestions / Feature Requests

## License

**node-proxifyjs** is licensed under [Apache-2.0](https://github.com/tbhaxor/node-proxifyjs/blob/master/LICENSE) license

## Contact Info

Email: tbhaxor@gmail.com <br>
Instagram: [@bootagorira](https://instagram.com/bootagorira)  <br>
Twitter: [@tbhaxor](https://twitter.com/tbhaxor) <br>
Linkedin: [gurkirat--singh](https://linkedin.com/in/gurkirat--singh)
