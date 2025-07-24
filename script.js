var aiLogo = document.getElementById('aiLogo');
var aiPortal = document.getElementById('aiPortal');
var aiPortalMsg = document.getElementById('aiPortalMsg');
var aiPortalVideo = document.getElementById('aiPortalVideo');
var portalSound = document.getElementById('portalSound');
var portalCloseSound = document.getElementById('portalCloseSound');

var messageTimeout;
var portalVideoTimeout;
var isTouching = false;
var userInteracted = false; // متغير لتتبع تفاعل المستخدم

// دالة لتهيئة الصوت والفيديو بعد أول تفاعل للمستخدم
function initAudioAndVideo() {
    if (!userInteracted) {
        // محاولة تشغيل صوت بسيط أو تشغيل/إيقاف الفيديو لـ "فتح" مسار الصوت
        if (aiPortalVideo) {
            // محاولة تشغيل الفيديو بشكل صامت أولاً لتهيئة مسار الصوت
            aiPortalVideo.muted = true;
            aiPortalVideo.play().then(() => {
                aiPortalVideo.pause();
                aiPortalVideo.currentTime = 0;
                // بعد التشغيل الناجح والإيقاف، يمكننا الآن التحكم في كتم الصوت بحرية
                aiPortalVideo.muted = false;
            }).catch(error => {
                console.warn("فشل التشغيل الأولي للفيديو المكتوم:", error);
                // إذا فشل (مثلاً بسبب بيئة بدون دعم للفيديو)، استمر لكن الصوت قد لا يعمل تلقائياً
            });
        }
        if (portalSound) {
            // محاولة تشغيل الصوت بشكل صامت أولاً
            portalSound.muted = true;
            portalSound.play().then(() => {
                portalSound.pause();
                portalSound.currentTime = 0;
                portalSound.muted = false;
            }).catch(error => {
                console.warn("فشل التشغيل الأولي للصوت المكتوم:", error);
            });
        }
        userInteracted = true;
        // إزالة مستمع الحدث بعد أول تفاعل ليعمل مرة واحدة فقط
        document.body.removeEventListener('click', initAudioAndVideo);
        document.body.removeEventListener('touchstart', initAudioAndVideo);
    }
}

// إضافة مستمعي أحداث للنقرة الأولى/اللمسة الأولى على الصفحة كلها
// { once: true } يضمن أن مستمع الحدث يعمل مرة واحدة فقط ثم يزال تلقائياً
document.body.addEventListener('click', initAudioAndVideo, { once: true });
document.body.addEventListener('touchstart', initAudioAndVideo, { once: true });


// دالة لعرض الرسالة ثم البوابة والفيديو
function activatePortal() {
    clearTimeout(messageTimeout);
    clearTimeout(portalVideoTimeout);

    aiPortalMsg.style.display = 'block';
    aiPortalMsg.classList.add('show-msg');

    aiLogo.classList.add('active');
    aiLogo.classList.add('message-active'); // تفعيل أنميشن التوهج الجديد هنا

    // تشغيل صوت الفتح - سيتم التشغيل فقط إذا تم تفعيل الصوت بواسطة تفاعل المستخدم
    if(portalSound && userInteracted) {
         portalSound.currentTime = 0;
         portalSound.play();
    } else if (portalSound) {
        // console.log("الصوت لم يتم تفعيله بعد بواسطة تفاعل المستخدم.");
    }

    // بعد ثانيتين (يمكنك تعديل هذا التأخير): عرض البوابة وتشغيل الفيديو
    portalVideoTimeout = setTimeout(function() {
        aiPortal.style.display = 'block';
        setTimeout(() => {
            aiPortal.classList.add('show');
            if(aiPortalVideo) {
                if (userInteracted) {
                    aiPortalVideo.muted = false; // إلغاء كتم الصوت هنا للسماح بتشغيله
                }
                aiPortalVideo.currentTime = 0;
                aiPortalVideo.play();
            }
        }, 50); // تأخير بسيط جدًا لضمان تطبيق 'display: block' قبل إضافة الكلاس 'show'
        aiLogo.classList.remove('message-active'); // إزالة الكلاس عندما يبدأ الفيديو
    }, 2000); // 2000 مللي ثانية = 2 ثانية
}

// دالة لإخفاء الرسالة والبوابة وإيقاف الفيديو
function deactivatePortal() {
    clearTimeout(messageTimeout);
    clearTimeout(portalVideoTimeout);

    aiPortalMsg.classList.remove('show-msg');
    aiPortalMsg.style.display = 'none';
    aiPortal.classList.remove('show');

    aiLogo.classList.remove('message-active'); // تعطيل أنميشن التوهج

    // تشغيل صوت الإغلاق
    if(portalCloseSound && userInteracted) {
        portalCloseSound.currentTime = 0;
        portalCloseSound.play();
    }

    if(aiPortalVideo) {
        aiPortalVideo.pause();
        aiPortalVideo.currentTime = 0; // إعادة الفيديو للبداية
        aiPortalVideo.muted = true; // كتم الصوت مرة أخرى عند الإيقاف استعدادًا للتشغيل التالي
    }

    setTimeout(function() {
        aiPortal.style.display = 'none';
        aiLogo.classList.remove('active');
    }, 500); // يجب أن تتوافق هذه القيمة مع مدة انتقال الأوباسيتي في CSS
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
    e.preventDefault(); // منع سلوك اللمس الافتراضي (مثل التمرير)
    isTouching = true; // وضع علامة بأننا في وضع اللمس
    activatePortal();
});

aiLogo.addEventListener('touchend', function() {
    deactivatePortal();
    isTouching = false; // إزالة علامة وضع اللمس
});

aiLogo.addEventListener('touchcancel', function() { // إذا تم إلغاء اللمس (مثلاً مكالمة واردة)
    deactivatePortal();
    isTouching = false;
});

// لمنع بقاء البوابة مفتوحة إذا قام المستخدم بالسحب بعيدًا أثناء اللمس
document.addEventListener('touchmove', function(e) {
    if (isTouching) {
        var touch = e.touches[0];
        var targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

        // يشمل الأيقونة، البوابة، والرسالة
        if (targetElement && (targetElement === aiLogo || aiLogo.contains(targetElement) || targetElement === aiPortal || aiPortal.contains(targetElement) || targetElement === aiPortalMsg || aiPortalMsg.contains(targetElement))) {
            // ما زال داخل منطقة التفاعل
        } else {
            // خرج الإصبع من منطقة التفاعل
            deactivatePortal();
            isTouching = false;
        }
    }
});


// ------------ وظائف تبديل اللغة ------------
const langToggleBtn = document.getElementById('langToggle');
const heroTitle = document.querySelector('.hero-title');
const heroDesc = document.querySelector('.hero-desc');
const aiPortalMsgElement = document.getElementById('aiPortalMsg'); // العنصر الكامل للرسالة
const instaUsernameSpan = document.querySelector('.insta-username'); // للحصول على سبان اسم المستخدم
const instaFollowSpan = document.querySelector('.insta-follow'); // للحصول على سبان تابعني/Follow me
const instaCard = document.getElementById('instaLink'); // للحصول على عنصر <a> للفوتر
const instaSvg = instaCard ? instaCard.querySelector('svg') : null; // للحصول على SVG الأيقونة
const instaTextGroup = instaCard ? instaCard.querySelector('.insta-text-group') : null; // للحصول على مجموعة النصوص


const instaAccountName = '@0alaswad'; // اسم حساب الانستجرام الثابت

let currentLang = 'ar'; // اللغة الافتراضية

function setLanguage(lang) {
    if (lang === 'ar') {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        heroTitle.textContent = heroTitle.dataset.ar;
        heroDesc.textContent = heroDesc.dataset.ar;
        aiPortalMsgElement.innerHTML = `أنا لا أستطيع قراءة أفكارك،<br>
                                        لكن يمكنني أن أريك لمحة من المستقبل...
                                        <span class="ai-year">عام 2060!</span>`;
        
        // تحديث الفوتر للغة العربية
        if (instaCard && instaSvg && instaTextGroup) {
            instaCard.classList.remove('en-layout');
            instaCard.classList.add('ar-layout'); // تطبيق ترتيب العناصر للعربي
            
            // ترتيب العناصر داخل insta-card للغة العربية: [أيقونة] [تابعني!] [@0alaswad]
            // الأيقونة أولاً ثم مجموعة النصوص
            instaSvg.style.order = '1';
            instaTextGroup.style.order = '2';
        }
        if (instaUsernameSpan && instaFollowSpan && instaTextGroup) {
            // تحديث النصوص
            instaUsernameSpan.textContent = instaAccountName;
            instaFollowSpan.textContent = instaFollowSpan.dataset.ar || 'تابعني!';

            // ترتيب النصوص داخل insta-text-group للغة العربية: [تابعني!] [@0alaswad]
            instaTextGroup.style.flexDirection = 'row'; /* لجعل "تابعني!" قبل "@0alaswad" لأننا نكتب من اليمين لليسار لكن ترتيب العناصر في الفلكس بوكس هو LTR */
            instaFollowSpan.style.order = '1';
            instaUsernameSpan.style.order = '2';

            // ضبط الهوامش في وضع RTL
            instaFollowSpan.style.marginRight = '0';
            instaFollowSpan.style.marginLeft = '7px'; /* مسافة بين "تابعني!" و "@0alaswad" */
            instaUsernameSpan.style.marginRight = '0';
            instaUsernameSpan.style.marginLeft = '0'; /* لا حاجة لهامش يسار هنا */

        }
        
        langToggleBtn.textContent = 'English';
        currentLang = 'ar';

    } else { // lang === 'en'
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        heroTitle.textContent = heroTitle.dataset.en;
        heroDesc.textContent = heroDesc.dataset.en;
        aiPortalMsgElement.innerHTML = `I can't read your thoughts,<br>
                                        but I can show you a glimpse of the future...
                                        <span class="ai-year">Year 2060!</span>`;
        
        // تحديث الفوتر للغة الإنجليزية
        if (instaCard && instaSvg && instaTextGroup) {
            instaCard.classList.remove('ar-layout');
            instaCard.classList.add('en-layout'); // تطبيق ترتيب العناصر للإنجليزي
            
            // ترتيب العناصر داخل insta-card للغة الإنجليزية: [@0alaswad] [Follow me!] [أيقونة]
            instaSvg.style.order = '3'; // الأيقونة في أقصى اليمين
            instaTextGroup.style.order = '2'; // مجموعة النصوص في المنتصف
        }
        if (instaUsernameSpan && instaFollowSpan && instaTextGroup) {
            // تحديث النصوص
            instaUsernameSpan.textContent = instaAccountName;
            instaFollowSpan.textContent = instaFollowSpan.dataset.en || 'Follow me!';

            // ترتيب النصوص داخل insta-text-group للغة الإنجليزية: [@0alaswad] [Follow me!]
            instaTextGroup.style.flexDirection = 'row'; /* لجعل "@0alaswad" قبل "Follow me!" */
            instaUsernameSpan.style.order = '1';
            instaFollowSpan.style.order = '2';

            // ضبط الهوامش في وضع LTR
            instaUsernameSpan.style.marginRight = '7px'; /* مسافة بين "@0alaswad" و "Follow me!" */
            instaUsernameSpan.style.marginLeft = '0';
            instaFollowSpan.style.marginRight = '0';
            instaFollowSpan.style.marginLeft = '7px'; /* مسافة بين "Follow me!" والأيقونة */
        }
        
        langToggleBtn.textContent = 'العربية';
        currentLang = 'en';
    }
    // تحديث رابط انستجرام بعد تغيير اللغة
    updateInstagramLink();
}

// دالة لتحديث رابط انستجرام لفتح التطبيق أولاً
function updateInstagramLink() {
    const username = '0alaswad'; // اسم المستخدم الخاص بك
    const appUrl = `instagram://user?username=${username}`;
    const webUrl = `https://instagram.com/${username}`;

    if (instaCard) {
        // نحاول فتح رابط التطبيق
        instaCard.href = appUrl;

        // إذا لم يفتح التطبيق، نفتح رابط الويب بعد تأخير قصير
        // هذا يسمح للمتصفح بمحاولة فتح التطبيق أولاً
        instaCard.onclick = function(e) {
            e.preventDefault(); // منع سلوك الـ href الافتراضي مؤقتًا
            const openApp = setTimeout(() => {
                window.location.href = webUrl;
            }, 250); // تأخير 250 مللي ثانية (يمكن تعديله)

            // محاولة فتح التطبيق مباشرة
            window.location.href = appUrl;
        };
    }
}


// تعيين اللغة الافتراضية عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    setLanguage('ar'); // ابدأ باللغة العربية
    // تحديث سنة حقوق النشر تلقائيا في الفوتر
    // ملاحظة: لم أجد عنصر "currentYear" في HTML الأصلي، إذا كنت تريد هذا، ستحتاج لإضافته.
    // مثال: <span id="currentYear"></span>
    // document.getElementById('currentYear').textContent = new Date().getFullYear();
    updateInstagramLink(); // تحديث الرابط عند تحميل الصفحة
});

langToggleBtn.addEventListener('click', () => {
    if (currentLang === 'ar') {
        setLanguage('en');
    } else {
        setLanguage('ar');
    }
});