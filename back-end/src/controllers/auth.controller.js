import User from "../models/user.schema.js";
import { loginCookieConfig } from "../utils/auth.js";

/**
 * Signup a new user and login
 * @route POST /api/v1/auth/signup
 * @remark email and password are required
 */
export async function signup(req, res) {
  var { email, password } = req.body;
  var user = await User.create({ email, password });
  if (!user) throw new BaseApiError(500, "Failed to create user");

  // Login user
  {
    let accessToken = user.generateAccessToken();
    let refreshToken = user.generateRefreshToken();
    res.cookie("refreshToken", refreshToken, loginCookieConfig);
    user.password = undefined; // remove password from response
    res.status(200).json({ user, accessToken });
  }
}
