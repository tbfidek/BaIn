async function postAccount(username, email, password){
    fetch("http://localhost:3000/signup", {
        method: "POST",
        body: JSON.stringify({
            "username": username,
            "email": email,
            "password": password
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((json) => {
            var obj = JSON.parse(JSON.stringify(json));
            let {message} = obj;
            if(message === "User created successfully"){
                window.location.href = "http://localhost:3000/views/main.html";
            }
            else{
                alert(message);
            }
        });
    await new Promise(r => setTimeout(r, 500));
}

async function registerAccount() {
    var form = document.getElementById("signupform");
    if (form.elements[0].value === "" || form.elements[1].value === "" || form.elements[2].value === "") {
        alert("Please fill in all fields.");
        return;
    }
    postAccount(form.elements[0].value, form.elements[1].value, form.elements[2].value)
        .then((parent_id) => {
            return parent_id;
        })
        .catch((error) => {
            console.error(error);
        });
}