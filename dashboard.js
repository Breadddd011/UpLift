async function checkAuth() {
  const { data: { user } } = await client.auth.getUser()
  if (!user) {
    window.location.href = 'index.html';
    return false;
  }
  return user;
}

async function initDashboard() {
  const user = await checkAuth();
  if (!user) return;

  const username = localStorage.getItem('username') || user.email.split('@')[0];
  updateUserInfo(username);
}

function updateUserInfo(username) {
  const usernameElement = document.getElementById('usernameDisplay');
  if (usernameElement) {
    usernameElement.textContent = username;
  }

  const welcomeTitle = document.getElementById('welcomeTitle');
  if (welcomeTitle) {
    const firstname = username.split(' ')[0];
    welcomeTitle.textContent = `Welcome back, ${firstname}!`;
  }

  const userAvatar = document.getElementById('userAvatar');
  if (userAvatar) {
    const initial = username.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
    userAvatar.textContent = initial;
  }
}

function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      }
    });
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await client.auth.signOut();
      localStorage.removeItem('username');
      window.location.href = 'index.html';
    });
  }
}

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(link => {
    link.addEventListener('click', function() {
      // don't/doesn't(? idk basic english now) interfere with logout button
      if (this.classList.contains('logout-btn')) return;

      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function setupCourseButtons() {
  const continueButtons = document.querySelectorAll('.btn-continue');

  continueButtons.forEach(button => {
    button.addEventListener('click', function() {
      const courseCard = this.closest('.course-item');
      const courseName = courseCard.querySelector('h3').textContent;
      alert(`Continuing course: ${courseName}`);
    });
  });
}

function setupActionButtons() {
  const primaryBtn = document.querySelector('.btn-primary');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', function() {
      alert('Explore new courses feature coming soon!');
    });
  }
}

function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach(stat => {
    const finalValue = parseInt(stat.textContent);
    let currentValue = 0;
    const increment = finalValue / 30;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        stat.textContent = finalValue;
        clearInterval(timer);
      } else {
        stat.textContent = Math.floor(currentValue);
      }
    }, 30);
  });
}

function animateProgressBars() {
  const progressFills = document.querySelectorAll('.progress-fill');

  progressFills.forEach(fill => {
    const width = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = width;
    }, 100);
  });
}

function updateDateTime() {
  const now = new Date();
  console.log('Dashboard loaded at:', now.toLocaleString());
}

// DOM
document.addEventListener('DOMContentLoaded', async function() {
  await initDashboard();
  setupMobileMenu();
  setupLogout();
  setupNavigation();
  setupCourseButtons();
  setupActionButtons();
  setupUserMenu();
  animateStats();
  animateProgressBars();
  updateDateTime();

  console.log('UpLift Dashboard initialized successfully! 🚀');
});

window.addEventListener('resize', function() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth > 768 && sidebar) {
    sidebar.classList.remove('active');
  }
});
