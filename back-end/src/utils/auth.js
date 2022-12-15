export var loginCookieConfig = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
};
