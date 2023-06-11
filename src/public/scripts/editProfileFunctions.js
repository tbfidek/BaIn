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
            const infoParentDiv = document.getElementById('info-parent');
            infoParentDiv.innerHTML = `
                <h3>${userData.name}</h3>
                <h3>${userData.email}</h3>
            `;

            const childListDiv = document.querySelector('.child-list');
            childListDiv.innerHTML = '';

            userData.children.forEach(child => {
                const childDiv = document.createElement('div');
                childDiv.innerHTML = `
                    <button class="registered-child">${child.child_name}</button>
                    <button class="remove-child"><span class="material-symbols-rounded">close</span></button>
                `;
                childListDiv.appendChild(childDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


window.onload = populateInfo;
