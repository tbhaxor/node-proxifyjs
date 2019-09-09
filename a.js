const profixy = require("./dist").default;

(async () => {
  let data = await profixy({ count: 3, country: { name: "india" } });
  console.log(data);
})();
