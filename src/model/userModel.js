import pool from "../database.js";
import { getFile, uploadImage } from "../services/s3client.js";
import crypto from "crypto";

export async function retrieveUserDataModel(userId) {
    const userQuery = {
        text: "SELECT * FROM users WHERE user_id = $1",
        values: [userId],
    };

    const childrenQuery = {
        text: `
            SELECT c.account_id AS child_id, c.name AS child_name
            FROM child_accounts AS c
            JOIN users_child_accounts AS uca ON c.account_id = uca.account_id
            WHERE uca.user_id = $1
        `,
        values: [userId],
    };

    try {
        const [userResult, childrenResult] = await Promise.all([pool.query(userQuery), pool.query(childrenQuery)]);

        if (userResult.rows.length === 0) {
            return null;
        }

        const user = userResult.rows[0];
        const url = await getFile(user.profile_image);
        const children = childrenResult.rows;

        const userData = {
            id: userId,
            name: user.name,
            email: user.email,
            children: children,
            profile_image: url,
        };

        return userData;
    } catch (err) {
        console.error(err);
        throw new Error("Database error");
    }
}

export function updateUserNameModel(userId, name) {
    const query = {
        text: "UPDATE users SET name = $1 WHERE user_id = $2",
        values: [name, userId],
    };

    return pool.query(query);
}

export function updateUserEmailModel(userId, email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return Promise.reject(new Error("Invalid email format"));
    }

    const checkQuery = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email],
    };

    return pool.query(checkQuery).then((result) => {
        if (result.rows.length > 0) {
            return Promise.reject(new Error("Email already exists"));
        }

        const updateQuery = {
            text: "UPDATE users SET email = $1 WHERE user_id = $2",
            values: [email, userId],
        };

        return pool.query(updateQuery);
    });
}

export function updateUserPasswordModel(userId, password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const combinedPassword = password + salt;

    const hashedPassword = crypto.createHash("sha256").update(combinedPassword).digest("hex");

    const query = {
        text: "UPDATE users SET password = $1, salt = $2 WHERE user_id = $3",
        values: [hashedPassword, salt, userId],
    };

    return pool.query(query);
}

export async function updatePictureModel(userId, file) {
    const image = await uploadImage(file);

    const query = {
        text: "UPDATE users SET profile_image = $1 WHERE user_id = $2",
        values: [image, userId],
    };

    return pool.query(query);
}
