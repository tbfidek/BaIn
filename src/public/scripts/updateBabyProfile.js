function updateChild(name, birthday, weight, height, gender, profile_image){
    //info necesare -> child id si toate atributele (name, birthday, weight, etc)
    console.log(birthday);
    fetch("/editChildData", {
        method: "POST",
        body: JSON.stringify({
            child_id: selected_child.id,
            new_name: name,
            new_birthday: birthday,
            new_weight: weight,
            new_height: height,
            new_gender: gender,
            new_profile_image: profile_image
        }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((json) => {
            alert(json.message);
            populateChildData(selected_child.id);
        });
}

function updateProfilePicture() {

    const formData = new FormData();
    const photo = document.querySelector('#profile-pic');
    formData.append('photo', photo.files[0]);
    formData.append('id',selected_child.id);
    console.log(photo.files[0]);
    fetch('/updateBabyPicture', {
        method: 'POST',
        body: formData
    })
        .then((response) => response.json())
        .then((json) => {
            alert(json.message);
            populateChildData(selected_child.id);
        });
}
