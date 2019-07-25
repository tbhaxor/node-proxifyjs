`# NODE-PROXIFY

**node-proxify** is a promise based handy module for nodejs developers to find fresh and working free proxies from https://free-proxy-list.net/ by calling only one function

## Requirements

## Install and Use

1. Install from npm

   ```sh
   $ npm i @tbhaxor/proxify
   ```

2. Use

   ```ts
   const proxify = require("@tbhaxor/proxify");

   (async () => {
     let data = await proxify(); // this will return
     console.log(data);
   })();
   ```

## API

- **fetching `n` proxies**

  pass an object property `count` to the function

  ```ts
  const proxify = require("@tbhaxor/proxify");

  (async () => {
    let data = await proxify({ count: 20 }); // this will return first 20 proxies
    console.log(data);
  })();
  ```

- **returns**

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

- Adding more filter
  - filter by **country**
  - filter by **https**
  - filter by **google**
  - filter by **type**
- Documentation
- Bugs / Suggestions / Feature Requests

## License

**node-proxify** is licensed under [Apache-2.0](https://github.com/tbhaxor/node-proxifyjs/blob/master/LICENSE) license
