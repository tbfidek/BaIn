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