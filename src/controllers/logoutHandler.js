export function handleLogout(req, res) {
    res.statusCode = 302;
    res.setHeader("Location", "http://localhost:3000/views/login.html");
    const loggedInCookie = `loggedIn=false; Path=/; HttpOnly; Secure`;
    const userIdCookie = `userId=-1; Path=/; HttpOnly; Secure`;

    res.setHeader("Set-Cookie", [loggedInCookie, userIdCookie]);
    res.end();
}
