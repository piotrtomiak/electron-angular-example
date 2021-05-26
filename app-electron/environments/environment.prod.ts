import * as path from "path";

export default {
  enableDevTools: false,
  application: {
    contents: {
      protocol: "file:",
      path: path.join(__dirname, "../app-frontend/index.html")
    }
  }
};
