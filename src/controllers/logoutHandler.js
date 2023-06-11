export function handleLogout(req, res) {
    res.statusCode = 302;
    res.setHeader("Location", "http://localhost:3000/views/login.html");
    res.setHeader("Set-Cookie", "loggedIn=false");
    res.end();
}
