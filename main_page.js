function themeToggle() {
    const element = document.body;
    element.classList.toggle("dark-theme");
}

// dc nu merge :(((
function removeChild(element) {
    const section = element.parentElement.parentElement;
    section.remove();
}


function addNewSection() {
    const newSection = document.createElement('section');

    const content =`<h2>Baby </h2>
                            <span onclick='removeChild(this)' class='material-symbols-rounded'>person_remove</span>`;
    newSection.innerHTML = content;

    document.getElementById("babyID").appendChild(newSection);
}




