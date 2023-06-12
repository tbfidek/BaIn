
let last_child_id = 1;
let child_ids = [];
let parent_ids = [];

function handleRadioClick(displayValue) {
    const signupForm = document.querySelector('.family-options');
    signupForm.style.display = displayValue;
}

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
            let {id, message} = obj;
            parent_ids.push(id);
        });
    await new Promise(r => setTimeout(r, 500));
}


async function createRelations(){
    await new Promise(r => setTimeout(r, 1000));
    parent_ids.forEach(element =>{
        child_ids.forEach(child =>{
            postRelation(element, child);
        })
    });
}

async function registerAccount() {
    var form = document.getElementById("signupform");
    var familytype = document.querySelector('input[name="family-type"]:checked');
    if (familytype == null) {
        alert("Please select a family type.");
        return;
    }

    if (form.elements[2].value === "" || form.elements[3].value === "" || form.elements[4].value === "") {
        alert("Please fill in all fields.");
        return;
    }
    if (familytype.value === "1" && (form.elements[5].value === "" || form.elements[6].value === "")) {
        alert("Please fill in all fields for the second person.");
        return;
    }
    postAccount(form.elements[2].value, form.elements[3].value, form.elements[4].value)
        .then((parent_id) => {
            console.log(parent_id);
            child_ids.forEach((child_id) => {
                postRelation(parent_id, child_id);
            });
            return parent_id;
        })
        .then((parent_id) => {
            createRelations();
            return parent_id;
        })
        .then((parent_id) => {
            window.location.href = "http://localhost:3000/views/main.html";
            return parent_id;
        })
        .catch((error) => {
            console.error(error);
        });
}