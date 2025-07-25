document.addEventListener('DOMContentLoaded', () => {
  const aiLogo = document.getElementById('aiLogo');
  const aiPortal = document.getElementById('aiPortal');
  const aiPortalVideo = document.getElementById('aiPortalVideo');
  const aiPortalMsg = document.getElementById('aiPortalMsg');
  const portalSound = document.getElementById('portalSound');
  const portalCloseSound = document.getElementById('portalCloseSound');

  var messageTimeout;
  var portalVideoTimeout;
  var isTouching = false;
  var userInteracted = false; // متغير لتتبع تفاعل المستخدم مع الصفحة لتمكين الصوت

  // دالة لتهيئة الصوت والفيديو بعد أول تفاعل للمستخدم
  function initAudioAndVideo() {
      if (!userInteracted) {
          if (aiPortalVideo) {
              aiPortalVideo.muted = true; // التأكد أنه مكتوم في البداية لتجاوز قيود المتصفح
              aiPortalVideo.play().then(() => {
                  aiPortalVideo.pause();
                  aiPortalVideo.currentTime = 0;
                  aiPortalVideo.muted = false; // نجعله غير مكتوم استعداداً للتشغيل الحقيقي
              }).catch(error => {
                  console.warn("فشل التشغيل الأولي للفيديو المكتوم:", error);
              });
          }
          if (portalSound) {
              portalSound.muted = true;
              portalSound.play().then(() => {
                  portalSound.pause();
                  portalSound.currentTime = 0;
                  portalSound.muted = false; // نجعله غير مكتوم استعداداً للتشغيل الحقيقي
              }).catch(error => {
                  console.warn("فشل التشغيل الأولي للصوت المكتوم:", error);
              });
          }
          userInteracted = true;
          document.body.removeEventListener('click', initAudioAndVideo);
          document.body.removeEventListener('touchstart', initAudioAndVideo);
      }
  }

  document.body.addEventListener('click', initAudioAndVideo, { once: true });
  document.body.addEventListener('touchstart', initAudioAndVideo, { once: true });


  // دالة لعرض الرسالة ثم البوابة والفيديو
  function activatePortal() {
      clearTimeout(messageTimeout);
      clearTimeout(portalVideoTimeout);

      // إزالة الوميض الأصلي
      aiLogo.classList.remove('pulsing');
      // إضافة إضاءة ثابتة وتأثير الاهتزاز
      aiLogo.classList.add('message-active');

      aiPortalMsg.style.display = 'block';
      aiPortalMsg.classList.add('show-msg');

      if(portalSound && userInteracted) {
           portalSound.currentTime = 0;
           portalSound.play();
      }

      portalVideoTimeout = setTimeout(function() {
          aiPortal.style.display = 'block';
          setTimeout(() => {
              aiPortal.classList.add('show');
              if(aiPortalVideo) {
                  if (userInteracted) {
                      aiPortalVideo.muted = false;
                  }
                  aiPortalVideo.currentTime = 0;
                  aiPortalVideo.play();
              }
          }, 50);
      }, 2000); // 2 ثانية
  }

  // دالة لإخفاء الرسالة والبوابة وإيقاف الفيديو
  function deactivatePortal() {
      clearTimeout(messageTimeout);
      clearTimeout(portalVideoTimeout);

      aiPortalMsg.classList.remove('show-msg');
      aiPortalMsg.style.display = 'none';
      aiPortal.classList.remove('show');

      aiLogo.classList.remove('message-active'); // إزالة إضاءة ثابتة
      aiLogo.classList.add('pulsing'); // إعادة الوميض الأصلي

      if(portalCloseSound && userInteracted) {
          portalCloseSound.currentTime = 0;
          portalCloseSound.play();
      }

      if(aiPortalVideo) {
          aiPortalVideo.pause();
          aiPortalVideo.currentTime = 0;
          aiPortalVideo.muted = true;
      }

      setTimeout(function() {
          aiPortal.style.display = 'none';
      }, 500);
  }

  // الكمبيوتر (hover)
  aiLogo.addEventListener('mouseenter', function() {
      if (!isTouching) {
          activatePortal();
      }
  });
  aiLogo.addEventListener('mouseleave', function() {
      if (!isTouching) {
          deactivatePortal();
      }
  });

  // الجوال (touch)
  aiLogo.addEventListener('touchstart', function(e) {
      e.preventDefault();
      isTouching = true;
      activatePortal();
  }, { passive: false });

  aiLogo.addEventListener('touchend', function() {
      deactivatePortal();
      isTouching = false;
  });

  aiLogo.addEventListener('touchcancel', function() {
      deactivatePortal();
      isTouching = false;
  });

  // لمنع بقاء البوابة مفتوحة إذا قام المستخدم بالسحب بعيدًا أثناء اللمس
  document.addEventListener('touchmove', function(e) {
      if (isTouching) {
          var touch = e.touches[0];
          var targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

          if (targetElement && (targetElement === aiLogo || aiLogo.contains(targetElement) || targetElement === aiPortal || aiPortal.contains(targetElement) || targetElement === aiPortalMsg || aiPortalMsg.contains(targetElement))) {
              // ما زال داخل منطقة التفاعل، لا تفعل شيئاً
          } else {
              // خرج الإصبع من منطقة التفاعل
              deactivatePortal();
              isTouching = false;
          }
      }
  }, { passive: false });

  // عند تحميل الصفحة، تأكد من أن الأيقونة تومض في البداية
  aiLogo.classList.add('pulsing');


  // Language Switcher Logic (Updated for persistence and cards)
  const langToggleBtn = document.getElementById('langToggle');
  let currentLang = localStorage.getItem('currentLang') || document.documentElement.lang;

  function updateContent(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-ar]').forEach(element => {
      if (element.hasAttribute('data-ar') && element.hasAttribute('data-en')) {
        element.textContent = (lang === 'ar') ? element.getAttribute('data-ar') : element.getAttribute('data-en');
      }
    });

    document.querySelectorAll('[data-ar-placeholder]').forEach(element => {
        if (element.hasAttribute('data-ar-placeholder') && element.hasAttribute('data-en-placeholder')) {
            element.placeholder = (lang === 'ar') ? element.getAttribute('data-ar-placeholder') : element.getAttribute('data-en-placeholder');
        }
    });

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

    langToggleBtn.textContent = (lang === 'ar') ? 'English' : 'العربية';
    currentLang = lang;
    localStorage.setItem('currentLang', lang);
  }

  updateContent(currentLang);

  langToggleBtn.addEventListener('click', () => {
    const newLang = (currentLang === 'ar') ? 'en' : 'ar';
    updateContent(newLang);
  });

  function openInstagram() {
    const username = "0alaswad";
    const appLink = `instagram://user?username=${username}`;
    const webLink = `https://www.instagram.com/${username}`;
    window.location.href = appLink;
    setTimeout(() => {
      window.location.href = webLink;
    }, 1500);
  }
  window.openInstagram = openInstagram;

});