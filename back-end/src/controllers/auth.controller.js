import logger from "../utils/logger.js";
import User from "../models/user.schema.js";
import { loginCookieConfig } from "../utils/auth.js";
import jwt from "jsonwebtoken";

/**
 * Signup a new user and login
 * @route POST /api/v1/auth/signup
 * @remark email and password are required
 * @remark access token will be sent in response cookie and body
 */
export async function signupController(req, res) {
  var { email, password } = req.body;
  var user = await User.create({ email, passwordDigest: password });
  if (!user) throw new BaseApiError(500, "Failed to create user");

  // Login user
  {
    let accessToken = user.generateAccessToken();
    let refreshToken = user.generateRefreshToken();
    res.cookie("refreshToken", refreshToken, loginCookieConfig);
    user.passwordDigest = undefined; // remove password from response
    res.status(200).json({ user, accessToken });
  }
}

/**
 * Login user with email and password
 * @route POST /api/v1/auth/login
 * @remark access token will be sent in response cookie and body
 */
export async function loginController(req, res) {
  var { email, password } = req.body;
  var user = await User.findOne({ email }).select("+passwordDigest");
  if (!user) return res.status(404).json({ message: "User not found" });

  {
    // Verify password
    let isMatch = await user.verifyPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });
  }

  {
    // Login user
    let accessToken = user.generateAccessToken();
    let refreshToken = user.generateRefreshToken();
    res.cookie("refreshToken", refreshToken, loginCookieConfig);
    user.passwordDigest = undefined; // remove password from response
    return res.status(200).json({ user, accessToken });
  }
}

/**
 * Get a new access token using refresh token
 * @route GET /api/v1/auth/access-token
 * @remark throwning an error inside the callback of jwt.verify was not working
 * and there was a timeout error. So, I sent a response instead of throwing an error
 * and it working fine. Follow the test cases regarding this.
 */
export async function accesssTokenController(req, res) {
  var refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(400).json({ message: "Unauthorized" });

  // Get a new access token
  async function getNewAccessToken(err, decoded) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    } else if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user from database
    var user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    var accessToken = user.generateAccessToken();
    return res.status(200).json({ user, accessToken });
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      getNewAccessToken
    );
  } catch (error) {
    logger.error(`[auth.controller.js] accesssToken: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Logout user
 * @route GET /api/v1/auth/logout
 */
export async function logoutController(req, res) {
  if (req.cookies?.refreshToken) {
    res.clearCookie("refreshToken", loginCookieConfig);
  }

  return res.status(200).json({ message: "Logged out" });
}
