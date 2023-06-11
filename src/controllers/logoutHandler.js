import jwt from "jsonwebtoken";

export function handleLogout(req, res) {
    res.statusCode = 302;
    res.setHeader("Location", "http://localhost:3000/views/login.html");
    const loggedToken = jwt.sign({ logged: false }, "secretKey", { expiresIn: "30d" });
    const loggedCookie = `loggedToken=${loggedToken}; Path=/; HttpOnly; Secure`;
    const idToken = jwt.sign({ userId: -1 }, "secretKey", { expiresIn: "30d" });
    const tokenCookie = `idToken=${idToken}; Path=/; HttpOnly; Secure`;



    res.setHeader("Set-Cookie", [loggedCookie, tokenCookie]);
    res.end();
}
