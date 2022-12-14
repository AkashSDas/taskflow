import { Schema, model } from "mongoose";
import argon2 from "argon2";
import { z } from "zod";
import jwt from "jsonwebtoken";

var userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => z.string().email().parse(email),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },

    passwordDigest: { type: String, select: false },
  },
  { timestamps: true }
);

// ===========================
// Hooks
// ===========================

userSchema.pre("save", async function preMongooseSave(next) {
  // Hash password if it has been modified
  if (this.isModified("passwordDigest")) {
    this.passwordDigest = await argon2.hash(this.passwordDigest, {
      salt: process.env.SALT,
    });
  }

  return next();
});

userSchema.post("save", function postMongooseSave(error, doc, next) {
  if (error.name == "MongoError" && error.code == 11000) {
    return next(new Error("Email already used"));
  }

  return next();
});

// ===========================
// Instance methods
// ===========================

userSchema.methods.verifyPassword = async function (password) {
  var hasMatched = await argon2.verify(this.passwordDigest, password);
  return hasMatched;
};

userSchema.methods.generateAccessToken = function () {
  var payload = { email: this.email };
  var token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  var payload = { email: this.email };
  var token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  return token;
};

var User = model("User", userSchema);
export default User;
