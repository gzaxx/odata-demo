module.exports = {
  "/api": {
    target: process.env["services__user-api__http__0"],
    pathRewrite: {
      "^/api": "",
    },
    logLevel: "debug",
  },
};
