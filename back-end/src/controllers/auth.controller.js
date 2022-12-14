import User from "../models/user.schema.js";
import { loginCookieConfig } from "../utils/auth.js";

/**
 * Signup a new user and login
 * @route POST /api/v1/auth/signup
 * @remark email and password are required
 * @remark access token will be sent in response cookie and body
 */
export async function signup(req, res) {
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
export async function login(req, res) {
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
