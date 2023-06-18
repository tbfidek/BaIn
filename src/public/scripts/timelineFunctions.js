function populateTimeline() {
    const formData = new FormData();
    formData.append('id', selected_child.id);

    fetch('/populateTimeline', {
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
            const timelineContainer = document.getElementById("timeline");
            timelineContainer.innerHTML = "";

            const mediaContainer = document.createElement('div');
            mediaContainer.id = "trending-wrapper";
            timelineContainer.appendChild(mediaContainer);
            var r = document.querySelector(':root');
            r.style.setProperty('--no-of-slides', data.images.length);
            r.style.setProperty('--iteration-time', `${data.images.length*7}s`);

            if (data.images && data.images.length > 0 && data.date && data.date.length > 0) {
                data.images.forEach((mediaUrl, index) => {

                    const imageDate = new Date(data.date[index]);
                    const currentDate = new Date();
                    console.log(imageDate);
                    console.log(currentDate);

                    if (
                        imageDate.getMonth() === currentDate.getMonth() &&
                        imageDate.getDate() === currentDate.getDate()
                    ) {
                        console.log(data.type[index]);

                        const imgDiv = document.createElement('div');

                        if (data.type && data.type[index] === "video") {
                            const el = document.createElement("video");
                            el.src = mediaUrl;
                            el.controls = true;
                            el.classList.add("recommendation");

                            imgDiv.appendChild(el);
                        } else {
                            const el = document.createElement("img");
                            el.src = mediaUrl;
                            el.classList.add("recommendation");

                            imgDiv.appendChild(el);
                        }

                        const descriptionElement = document.createElement('p');
                        descriptionElement.textContent = data.desc[index];
                        descriptionElement.classList.add("recommendation");
                        imgDiv.appendChild(descriptionElement);

                        const dateElement = document.createElement('p');
                        dateElement.textContent = formatDate(imageDate);
                        dateElement.classList.add("recommendation");
                        imgDiv.appendChild(dateElement);
                        mediaContainer.appendChild(imgDiv);
                    }
                });

                timelineContainer.classList.add('timeline-row');
            } else {
                console.log("No images found.");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}


function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
