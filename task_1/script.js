const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const toggleIcon = document.getElementById('toggleIcon');
const logo = document.getElementById('logo');
const logoInput = document.getElementById('logoInput');
const logoImg = document.getElementById('logoImg');

logo.addEventListener('click', () => {
  logoInput.click();
});

logoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      logoImg.src = evt.target.result;
      logoImg.style.display = 'block';
      // Optionally hide the placeholder icon:
      logo.classList.add('has-photo');
    };
    reader.readAsDataURL(file);
  }
});

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  if (sidebar.classList.contains('collapsed')) {
    toggleIcon.classList.remove('fa-angle-left');
    toggleIcon.classList.add('fa-angle-right');
  } else {
    toggleIcon.classList.remove('fa-angle-right');
    toggleIcon.classList.add('fa-angle-left');
  }
});