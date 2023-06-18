
async function registerAccount() {
    const formData = new FormData();

    const inputs = document.querySelectorAll("input");
    console.log(inputs);
    for(const input of inputs){
        if(input.name !== 'photo'){
            if(!input.value){
                alert("Please fill in all fields.");
                return;
            }
            formData.append(input.name, input.value);
        }
    }

    const photo = document.querySelector('#profile-pic');
    formData.append('photo', photo.files[0]);

    for(const form of formData.values()){
        console.log(form);
    }
    fetch("/signup", {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((json) => {
            var obj = JSON.parse(JSON.stringify(json));
            let {message} = obj;
            if(message === "User created successfully"){
                window.location.href = "/views/login.html";
                // return parent_id;
            }
            else{
                alert(message);
            }
        });
}

