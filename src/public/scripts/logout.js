function logout() {
    fetch("/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                window.location.href = "/views/login.html";
            } else {
                alert("An error occurred while logging out.");
            }
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred while logging out.");
        });
}