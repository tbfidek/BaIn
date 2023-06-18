function applyThemeFromLocalStorage() {
    const element = document.body;
    const userPreference = localStorage.getItem("theme");

    if (userPreference === "dark") {
        element.classList.add("dark-theme");
    } else {
        element.classList.remove("dark-theme");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    applyThemeFromLocalStorage();
});

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const credentials = {
        email: email,
        pw: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(response => {
            if (response.ok) {
                window.location.replace( "/views/main.html");
            } else {
                alert('Wrong credentials! Try Again');
            }
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred');
        });
}

const loginButton = document.querySelector('span');
loginButton.addEventListener('click', login);