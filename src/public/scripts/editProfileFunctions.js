let user_info = null;
const image_input = document.querySelector("#profile-pic");
var uploaded_image = "";

function removeChildElement(event) {
    event.preventDefault();
    const parentDiv = event.target.closest('div');
    parentDiv.remove();
}

document.addEventListener('DOMContentLoaded', () => {
    const removeButtons = document.querySelectorAll('.remove-child');
    removeButtons.forEach((button) => {
        button.addEventListener('click', removeChildElement);
    });
});


function populateInfo() {
    fetch('/editProfile')
        .then(response => response.json())
        .then(userData => {
            user_info = userData;
            const infoParentDiv = document.getElementById('info-parent');
            infoParentDiv.innerHTML = `
                <h2>${userData.name}</h2>
                <h3>${userData.email}</h3>
            `;

            document.querySelector("#pfp").src = userData.profile_image;

            const childListDiv = document.querySelector('.child-list');
            childListDiv.innerHTML = '';

            userData.children.forEach(child => {
                const childDiv = document.createElement('div');
                childDiv.innerHTML = `      
                    <button class="remove-child" onclick="deleteConnectionToChild(${child.child_id})"><span class="material-symbols-rounded">close</span></button>  
                    <button class="registered-child">${child.child_name}</button>
                    <button class="id">ID: ${child.child_id}</button>    
                `;
                childListDiv.appendChild(childDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function updateName() {
    const nameInput = document.getElementById('nameInput');
    const newName = nameInput.value;

    const data = { name: newName };

    fetch('/updateName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Failed to update name. Please try again.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('An error occurred');
        });
}

function updateEmail() {
    const nameInput = document.getElementById('emailInput');
    const newEmail = nameInput.value;

    const data = { email: newEmail };

    fetch('/updateEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Failed to update email. Please try again.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('An error occurred');
        });
}

function updatePassword() {
    const passwordInput = document.getElementById('passwordInput');
    const newPassword = passwordInput.value;
    if (newPassword === '') {
        alert('Password cannot be empty');
        return;
    }
    const data = { password: newPassword };

    fetch('/updatePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                alert("Password changed");
            } else {
                alert('Failed to update password. Please try again.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('An error occurred');
        });
}

function updateProfilePicture() {

    const formData = new FormData();
    const photo = document.querySelector('#profile-pic');
    formData.append('photo', photo.files[0]);
    console.log(photo.files[0]);
    fetch('/updatePicture', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        body: formData
    })
        .then((response) => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Failed to update picture. Please try again.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('An error occurred');
        });
}

function addChild() {
    const codeInput = document.getElementById('codeInput');
    const childCode = codeInput.value;

    const data = { "child_id": childCode, "parent_id": user_info.id };


    fetch('/addchildtoparent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                alert("Child added");
            } else {
                alert('Failed to add child. Please try again.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('An error occurred');
        });
}

function deleteConnectionToChild(childCode) {

    const data = { code: childCode };

    fetch('/removeChild', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                alert("Deleted child connection");
            } else {
                alert("Failed to delete connection. Please try again.");
            }
        })
        .catch((error) => {
            console.error(error);
            alert('An error occurred');
        });
}

window.addEventListener('load', () => {
    populateInfo();

    const pollingInterval = 5000;

    setInterval(populateInfo, pollingInterval);
});

