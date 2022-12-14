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
