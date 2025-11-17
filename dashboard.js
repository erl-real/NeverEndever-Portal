// -----------------------------
// Supabase Auth Integration
// -----------------------------
const supabaseClient = supabase.createClient(
  "https://imqfnxtornlvglwvkspi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcWZueHRvcm5sdmdsd3Zrc3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzQyNjksImV4cCI6MjA3ODcxMDI2OX0.Is7G7NCKxTQDoefyitkfhREXAR8m8cBBTjohRiBKMs4"
);

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html"; // redirect if not logged in
  } else {
    document.getElementById("user-email").textContent = session.user.email;
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

document.getElementById("logout-btn")?.addEventListener("click", logout);
document.getElementById("logout-link")?.addEventListener("click", logout);

checkSession();

// -----------------------------
// Sidebar Active State
// -----------------------------
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
allSideMenu.forEach(item => {
  const li = item.parentElement;
  item.addEventListener('click', function () {
    allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
    li.classList.add('active');
  });
});

// -----------------------------
// Sidebar Toggle
// -----------------------------
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', () => sidebar.classList.toggle('hide'));

function adjustSidebar() {
  if (window.innerWidth <= 576) {
    sidebar.classList.add('hide');
    sidebar.classList.remove('show');
  } else {
    sidebar.classList.remove('hide');
    sidebar.classList.add('show');
  }
}
window.addEventListener('load', adjustSidebar);
window.addEventListener('resize', adjustSidebar);

// -----------------------------
// Search Toggle (mobile)
// -----------------------------
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
  if (window.innerWidth < 768) {
    e.preventDefault();
    searchForm.classList.toggle('show');
    if (searchForm.classList.contains('show')) {
      searchButtonIcon.classList.replace('bx-search', 'bx-x');
    } else {
      searchButtonIcon.classList.replace('bx-x', 'bx-search');
    }
  }
});

// -----------------------------
// Dark Mode Switch
// -----------------------------
const switchMode = document.getElementById('switch-mode');
if (localStorage.getItem('dark-mode') === 'enabled') {
  document.body.classList.add('dark');
  switchMode.checked = true;
}
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark');
  switchMode.checked = true;
}
switchMode.addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('dark-mode', 'enabled');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('dark-mode', 'disabled');
  }
});

// -----------------------------
// Categories Menu
// -----------------------------
const categoriesLink = document.getElementById('categoriesLink');
const categoriesMenu = document.getElementById('categoriesMenu');
categoriesLink.addEventListener('click', function (e) {
  e.preventDefault();
  categoriesMenu.classList.toggle('show');
  document.querySelector('.notification-menu').classList.remove('show');
  document.querySelector('.profile-menu').classList.remove('show');
});
window.addEventListener('click', function (e) {
  if (!e.target.closest('#categoriesLink') && !e.target.closest('.categories-menu')) {
    categoriesMenu.classList.remove('show');
  }
});

// -----------------------------
// Notification Menu
// -----------------------------
document.querySelector('.notification').addEventListener('click', function () {
  document.querySelector('.notification-menu').classList.toggle('show');
  document.querySelector('.profile-menu').classList.remove('show');
});

// -----------------------------
// Profile Menu
// -----------------------------
document.querySelector('.profile').addEventListener('click', function () {
  document.querySelector('.profile-menu').classList.toggle('show');
  document.querySelector('.notification-menu').classList.remove('show');
});
window.addEventListener('click', function (e) {
  if (!e.target.closest('.notification') && !e.target.closest('.profile')) {
    document.querySelector('.notification-menu').classList.remove('show');
    document.querySelector('.profile-menu').classList.remove('show');
  }
});

// -----------------------------
// Content Menus (todo items)
// -----------------------------
function toggleMenu(menuId) {
  var contentMenu = document.getElementById(menuId);
  var allMenus = document.querySelectorAll('.content-menu');
  allMenus.forEach(m => { if (m !== contentMenu) m.style.display = 'none'; });
  contentMenu.style.display = (contentMenu.style.display === 'block') ? 'none' : 'block';
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.content-menu').forEach(m => m.style.display = 'none');
});

// -----------------------------
// Todo Progress Bars
// -----------------------------
document.querySelectorAll('.todo-list li').forEach(item => {
  var progress = item.getAttribute('data-progress');
  item.style.setProperty('--progress-width', progress + '%');
});

// -----------------------------
// Menu Icons
// -----------------------------
document.querySelectorAll('.menu-icon').forEach(icon => {
  icon.addEventListener('click', function(e) {
    var menu = icon.querySelector('.content-menu');
    var isVisible = menu.style.display === 'block';
    document.querySelectorAll('.content-menu').forEach(otherMenu => {
      if (otherMenu !== menu) otherMenu.style.display = 'none';
    });
    menu.style.display = isVisible ? 'none' : 'block';
    e.stopPropagation();
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.content-menu').forEach(menu => menu.style.display = 'none');
});

// -----------------------------
// Todo Filters
// -----------------------------
function filterTodos(status) {
  const todos = document.querySelectorAll('.todo-list li');
  todos.forEach(todo => {
    if (status === 'all' || 
        (status === 'completed' && todo.classList.contains('completed')) || 
        (status === 'pending' && todo.classList.contains('not-completed'))) {
      todo.style.display = 'flex';
    } else {
      todo.style.display = 'none';
    }
  });
}

// -----------------------------
// Notifications
// -----------------------------
document.querySelectorAll('.notification-menu li').forEach(notification => {
  notification.addEventListener('click', function() {
    this.classList.add('read');
    updateNotificationCount();
  });
});
function updateNotificationCount() {
  const unread = document.querySelectorAll('.notification-menu li:not(.read)').length;
  document.querySelector('.notification .num').textContent = unread;
}

// -----------------------------
// Order Filters
// -----------------------------
document.getElementById('searchUser').addEventListener('input', filterOrders);
document.getElementById('filterStatus').addEventListener('change', filterOrders);

function filterOrders() {
  const searchText = document.getElementById('searchUser').value.toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;
  document.querySelectorAll('.order table tbody tr').forEach(row => {
    const user = row.querySelector('td:nth-child(2) span').textContent.toLowerCase();
    const status = row.querySelector('td:nth-child(4) .status').textContent.toLowerCase();
    const matchesSearch = user.includes(searchText);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
  });
}

