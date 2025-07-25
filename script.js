document.addEventListener('DOMContentLoaded', () => {
  const aiLogo = document.getElementById('aiLogo');
  const aiPortal = document.getElementById('aiPortal');
  const aiPortalVideo = document.getElementById('aiPortalVideo');
  const aiPortalMsg = document.getElementById('aiPortalMsg');
  const portalSound = document.getElementById('portalSound');
  const portalCloseSound = document.getElementById('portalCloseSound');

  let portalOpenTimer;
  let messageDisplayTimer;

  function openPortal() {
    clearTimeout(portalOpenTimer);
    clearTimeout(messageDisplayTimer);
    aiPortal.style.display = 'block';
    aiPortal.classList.add('show');
    aiLogo.classList.add('active');
    portalSound.play();

    portalOpenTimer = setTimeout(() => {
      aiLogo.classList.add('message-active'); // Add special glow effect for AI icon
      aiPortalMsg.classList.add('show-msg'); // Show AI message
      // Play a subtle sound for the message if available
    }, 1200); // After 1.2s portal opens, show message
  }

  function closePortal() {
    clearTimeout(portalOpenTimer);
    clearTimeout(messageDisplayTimer);
    aiPortal.classList.remove('show');
    aiLogo.classList.remove('active');
    aiLogo.classList.remove('message-active');
    aiPortalMsg.classList.remove('show-msg');
    portalCloseSound.play();

    setTimeout(() => {
      aiPortal.style.display = 'none';
      aiPortalVideo.pause();
      aiPortalVideo.currentTime = 0;
    }, 500); // .5s matches opacity transition
  }

  aiLogo.addEventListener('click', () => {
    if (aiPortal.classList.contains('show')) {
      closePortal();
    } else {
      openPortal();
    }
  });

  // Language Switcher Logic (Updated for persistence and cards)
  const langToggleBtn = document.getElementById('langToggle');
  let currentLang = localStorage.getItem('currentLang') || document.documentElement.lang; // Read from localStorage or default

  function updateContent(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // Update all elements with data-ar and data-en attributes
    document.querySelectorAll('[data-ar]').forEach(element => {
      if (element.hasAttribute('data-ar') && element.hasAttribute('data-en')) {
        element.textContent = (lang === 'ar') ? element.getAttribute('data-ar') : element.getAttribute('data-en');
      }
    });

    // Update placeholder attributes if they exist
    document.querySelectorAll('[data-ar-placeholder]').forEach(element => {
        if (element.hasAttribute('data-ar-placeholder') && element.hasAttribute('data-en-placeholder')) {
            element.placeholder = (lang === 'ar') ? element.getAttribute('data-ar-placeholder') : element.getAttribute('data-en-placeholder');
        }
    });

    // Update insta-card layout
    const instaCard = document.getElementById('instaLink');
    if (instaCard) {
        if (lang === 'ar') {
            instaCard.classList.remove('en-layout');
            instaCard.classList.add('ar-layout');
        } else {
            instaCard.classList.remove('ar-layout');
            instaCard.classList.add('en-layout');
        }
    }

    // Update button text
    langToggleBtn.textContent = (lang === 'ar') ? 'English' : 'العربية';
    currentLang = lang;
    localStorage.setItem('currentLang', lang); // Save to localStorage
  }

  // Initialize language on page load
  updateContent(currentLang);

  langToggleBtn.addEventListener('click', () => {
    const newLang = (currentLang === 'ar') ? 'en' : 'ar';
    updateContent(newLang);
  });

  // Function to open Instagram (already exists)
  function openInstagram() {
    const username = "0alaswad";
    const appLink = `instagram://user?username=${username}`;
    const webLink = `https://www.instagram.com/${username}`;
    window.location.href = appLink;
    setTimeout(() => {
      window.location.href = webLink;
    }, 1500);
  }
  window.openInstagram = openInstagram; // Make it globally accessible

});