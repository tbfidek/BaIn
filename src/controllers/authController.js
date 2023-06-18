import {uploadImage} from "../services/s3client.js";
import multer from "multer";
import * as userModel from "../model/loginModel.js";

const storage = multer.memoryStorage();
const upload = multer({storage});

export function handleSignUp(req, res) {
    upload.single('photo')(req, res, async err => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred during the upload
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
        }
        else if (err) {
            // An unknown error occurred during the upload
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({ message: 'Error uploading file.' })
            );
        }
        else{
            const { username, email, password } = req.body;
            let image = await uploadImage(req.file);
            let user = {
                username: username,
                email: email,
                password: password,
                image: image
            };
            //email validation regex pattern
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            console.log(email);
            if (!emailPattern.test(email)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: "Invalid email format" }));
                return;
            }

            let data = await userModel.addUser(user);
            if(data.message === "User created successfully"){
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: data.message, id: data.id}));
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: data.message}));
            }
        }
    });

}

export function handleLogin(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        const { email, pw } = JSON.parse(body);
        const user = {
            email: email,
            pw: pw
        }

        let data = await userModel.checkLogin(user);
        console.log(JSON.stringify(data));
        if(data.message != "Invalid credentials" && data.message != "Server error" && data.message != "Add your credentials"){
            res.statusCode = 302;
            res.setHeader("Location", "/views/main.html");
            res.setHeader("Set-Cookie", [data.loggedCookie, data.tokenCookie]);
            res.end();
        } else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: data.message}));
        }
    });
}

export function handleLogout(req, res) {

    let data = userModel.logout();
    res.statusCode = 302;
    res.setHeader("Location", "/views/login.html");
    res.setHeader("Set-Cookie", [data.loggedCookie, data.tokenCookie]);
    res.end();
}