import jwt from "jsonwebtoken";

import logger from "../utils/logger.js";
import User from "../models/user.schema.js";

export async function verifyJwt(req, res, next) {
  {
    // Check for the access token

    let tokenSignature =
      req.cookies?.accessToken ||
      req.body?.accessToken ||
      req.headers?.authorization ||
      req.headers?.Authorization;

    if (!tokenSignature) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    var token = tokenSignature.split(" ")[1];
  }

  try {
    // Get the user from the token
    let decodedJwt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedJwt) return res.status(400).json({ message: "Unauthorized" });
    let user = await User.findOne({ email: decodedJwt.email });
    if (!user) return res.status(400).json({ message: "Unauthorized" });
    res.locals.user = user;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Unauthorized" });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: "Token expired" });
    }

    logger.error(`[auth.middleware.js] ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}
