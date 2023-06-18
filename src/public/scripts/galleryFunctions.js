function populateGallery() {
    const formData = new FormData();
    formData.append('id', selected_child.id);

    fetch('/populateGallery', {
        method: 'POST',
        body: JSON.stringify({
            child_id: selected_child.id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            const galleryContainer = document.getElementById("gallery");
            galleryContainer.innerHTML = "";

            if (data.images && data.images.length > 0) {
                data.images.forEach((mediaUrl, index) => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");
                    if (data.type[index] === 'video') {
                        const videoElement = document.createElement("video");
                        videoElement.src = mediaUrl;
                        videoElement.controls = true;
                        videoElement.classList.add("gallery-video");
                        galleryItem.appendChild(videoElement);
                    } else {
                        console.log("da cf");
                        const imageElement = document.createElement("img");
                        imageElement.src = mediaUrl;
                        imageElement.classList.add("gallery-image");
                        galleryItem.appendChild(imageElement);
                    }

                    //descriere
                    const descriptionElement = document.createElement("div");
                    descriptionElement.classList.add("gallery-description");
                    descriptionElement.innerText = data.desc[index];
                    galleryItem.appendChild(descriptionElement);

                    const dateElement = document.createElement("div");
                    dateElement.classList.add("gallery-date");
                    dateElement.innerText = data.date[index];
                    galleryItem.appendChild(dateElement);

                    const buttonsContainer = document.createElement("div");
                    buttonsContainer.classList.add("share");

                    galleryContainer.appendChild(galleryItem);
                });
            } else {
                console.log("No images found.");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
