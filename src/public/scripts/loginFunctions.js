
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
                window.location.href =  "/views/main.html";
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