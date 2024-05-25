import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.isAuthenticated() && req.user.tokens) {
      const accessToken = req.user.tokens;

      await axios.post("https://accounts.google.com/o/oauth2/revoke", null, {
        params: {
          token: accessToken,
          token_type_hint: "access_token",
        },
      });
    }
    // Destroy the server-side session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/");
    });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
