import { config } from "dotenv";

import logger from "./utils/logger.js";
import { app } from "./api.js";
import { connectToDB } from "./utils/db.js";

if (process.env.NODE_ENV != "production") config();

// Connect to database
connectToDB();

// Start server
(function listenToPort() {
  var port = process.env.PORT || 8000;

  app.listen(port, function initApp() {
    logger.info(`API is available on http://localhost:${port}/api/v1`);
  });
})();
