import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/env.config.js";
import { AuthException } from "../exceptions/index.js";

const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: user.userId,
      iat: Date.now(),
    };

    const expiresIn = jwtConfig.accessTokenExpiresIn;

    jwt.sign(
      payload,
      jwtConfig.accessTokenSecret,
      { expiresIn, algorithm: "HS256" },
      (err, token) => {
        if (err) {
          console.error("Error signing access token: ", err.message);
          reject(new Error("Failed to sign access token!"));
          return;
        }
        resolve(token);
      },
    );
  });
};

const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtConfig.accessTokenSecret, (err, payload) => {
      if (err) {
        // throw new AuthException("unauthorized", "auth");
        // reject(new Error("Failed to verify access token!"));
        // return;
      }
      resolve(payload);
    });
  });
};

export { signAccessToken, verifyAccessToken };
