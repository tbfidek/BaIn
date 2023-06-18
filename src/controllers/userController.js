import { decryptId } from "./cookieDecrypt.js";
import { retrieveUserDataModel } from "../model/userModel.js";
import { updateUserNameModel, updateUserEmailModel, updateUserPasswordModel, updatePictureModel } from "../model/userModel.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({storage});

export function retrieveUserData(req, res) {
    const userId = decryptId(req, res);

    retrieveUserDataModel(userId)
        .then((userData) => {
            if (!userData) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "User not found" }));
                return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(userData));
        })
        .catch((err) => {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Server error" }));
        });
}

//update account

export function updateUserName(req, res) {
    const userId = decryptId(req, res);
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const { name } = JSON.parse(body);

        updateUserNameModel(userId, name)
            .then(() => {
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Name updated successfully" }));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Server error" }));
            });
    });
}

export function updateUserEmail(req, res) {
    const userId = decryptId(req, res);
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const { email } = JSON.parse(body);

        updateUserEmailModel(userId, email)
            .then(() => {
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Email updated successfully" }));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Server error" }));
            });
    });
}

export function updateUserPassword(req, res) {
    const userId = decryptId(req, res);
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const { password } = JSON.parse(body);

        updateUserPasswordModel(userId, password)
            .then(() => {
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Password updated successfully" }));
            })
            .catch((err) => {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Server error" }));
            });
    });
}

export function updatePicture(req, res) {
    const userId = decryptId(req, res);

    upload.single("photo")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: err.message }));
        } else if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error uploading file." }));
        } else {
            updatePictureModel(userId, req.file)
                .then(() => {
                    res.statusCode = 201;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: "Picture updated successfully" }));
                })
                .catch((err) => {
                    console.error(err);
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: "Server error" }));
                });
        }
    });
}
