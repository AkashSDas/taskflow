import { createLogger, format, transports } from "winston";

var baseFormat = format.printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp} ${message}`;
});

// ===============================
// Logger functions
// ===============================

function developmentLogger() {
  return createLogger({
    level: "debug",
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: "HH:mm:ss" }),
      baseFormat
    ),
    transports: [new transports.Console({})],
  });
}

function productionLogger() {
  return createLogger({
    level: "info",
    // We want server timestamp for production
    format: format.combine(format.timestamp(), baseFormat),
    transports: [
      new transports.Console({}),
      new transports.File({ filename: "./logs/error.log", level: "error" }),
    ],
  });
}

if (process.env.NODE_ENV == "production") var logger = productionLogger();
else var logger = developmentLogger();

export default logger;
