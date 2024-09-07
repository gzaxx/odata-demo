module.exports = {
  "/api/users": {
    target: process.env["services__user-api__http__0"],
    pathRewrite: {
      "^/api": "",
    },
  },
};
