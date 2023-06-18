import jwt from "jsonwebtoken";

export function decryptLogin(req, res) {
  const cookie = req.headers.cookie;

  if (!cookie || !cookie.includes("loggedToken")) {
    res.statusCode = 302;
    res.setHeader("Location", "/views/login.html");
    res.end();
    return;
  }
  const token = cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("loggedToken="))
    .split("=")[1];

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Invalid token" }));
      return;
    }
    const logged = decoded.logged;
    if (logged === false) {
      res.statusCode = 302;
      res.setHeader("Location", "/views/login.html");
      res.end();
      return;
    }
  });
}

export function decryptId(req, res) {
  const cookie = req.headers.cookie;
  let id;
  const token = cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("idToken="))
    .split("=")[1];

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Invalid token" }));
      return;
    }
    id = decoded.userId;
  });
  return id;
}

export function getLoggedStatus(req, res){
  const cookie = req.headers.cookie;
  if(cookie != null) {
    const token = cookie
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("loggedToken="))
        .split("=")[1];

    jwt.verify(token, "secretKey", (err, decoded) => {
      if (err) {
        return;
      }
      const logged = decoded.logged;
      if(logged === true){
        res.statusCode = 302;
        res.setHeader("Location", "/views/main.html");
        res.end();
      }
    });
  }
}