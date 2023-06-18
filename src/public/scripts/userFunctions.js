function populateUserData() {
    fetch("/retrieveUserData")
        .then((response) => response.json())
        .then((data) => {
            const mainTitle = document.querySelector(".main-title");
            user_id = data.id;

            const childList = document.getElementById("child-list");
            childList.innerHTML = "";
            data.children.forEach((child) => {
                const childDiv = document.createElement("div");
                childDiv.className = "child sidebutton text";
                childDiv.textContent = child.child_name;
                childDiv.id = child.child_id;
                childDiv.addEventListener("click", function () {
                    populateChildData(child.child_id);
                });
                childList.appendChild(childDiv);
            });

            if(data.profile_image){
                document.getElementById("main-profile-pic").src = data.profile_image;
                document.getElementById("mobile-main-profile-pic").src = data.profile_image;
            }


            const paragraph = document.createElement("p");
            paragraph.textContent = `Hello, ${data.name}! How is your baby today?`;

            mainTitle.innerHTML = "";
            mainTitle.appendChild(paragraph);
        })
        .catch((error) => {
            console.error(error);
        });
}
