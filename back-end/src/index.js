import { config } from "dotenv";

import logger from "./utils/logger.js";
import { app } from "./api.js";

if (process.env.NODE_ENV != "production") config();

// Start server
(function listenToPort() {
  var port = process.env.PORT || 8000;

  app.listen(port, function initApp() {
    logger.info(`API is available on http://localhost:${port}/api/v1`);
  });
})();
