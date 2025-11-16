// Dropdown toggle
document.querySelectorAll('.dropbtn').forEach(button => {
  button.addEventListener('click', () => {
    const dropdown = button.nextElementSibling;

    // Close other dropdowns
    document.querySelectorAll('.dropdown-content').forEach(menu => {
      if (menu !== dropdown) menu.style.display = 'none';
    });

    // Toggle current dropdown
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
});

// Close dropdowns if clicking outside
window.addEventListener('click', (e) => {
  if (!e.target.matches('.dropbtn')) {
    document.querySelectorAll('.dropdown-content').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});
