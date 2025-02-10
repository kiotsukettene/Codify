import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Professor } from "../models/professor.model.js";
import dotenv from "dotenv";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Professor.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
