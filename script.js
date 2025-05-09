const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const icon = toggle.querySelector('i');

toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
});

//Open modal
document.querySelectorAll('.btn:not(.external-link)').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const modal = document.getElementById(targetId);
        modal.classList.add('show');
    });
});

//Close modal on background click
window.addEventListener('click', function (event) {
    document.querySelectorAll('.modal.show').forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
});

//Close modal from close button
function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('show');
}

document.querySelectorAll('.thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
      const mainImage = document.getElementById('main-image');
      mainImage.src = this.src;
  
      document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
  
  // Additional functionality for 'main-image-two'
document.querySelectorAll('.thumbnail-two').forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
        const mainImageTwo = document.getElementById('main-image-two');
        mainImageTwo.src = this.src;

        document.querySelectorAll('.thumbnail-two').forEach(thumb => {
            thumb.classList.remove('active');
        });
        this.classList.add('active');
    });
});