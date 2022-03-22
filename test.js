const r = require("./dist/index").default;

r({ count: 3, type: "anonymous", country: { name: /united|india/i } }).then(
  (data) => {
    console.log(data);
  }
);
