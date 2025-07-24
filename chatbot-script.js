let debugEnabled = false;

// --- SVG حركة المشي ---
const svgWalk = `
<svg width="115" height="256" viewBox="0 0 112 256">
  <ellipse id="bot-glow" cx="56" cy="246" rx="32" ry="10" fill="#00d4ff" opacity="0.24" style="filter: blur(6px);" />
  <g id="bot-body">
    <rect x="40" y="208" width="14" height="28" rx="5" fill="#232323"/>
    <rect x="68" y="210" width="14" height="28" rx="5" fill="#232323"/>
    <rect x="44" y="130" width="8" height="90" rx="7" fill="#232323"/>
    <rect x="68" y="130" width="8" height="87" rx="7" fill="#232323"/>
    <rect x="35" y="85" width="44" height="58" rx="16" fill="#232323"/>
    <rect x="50" y="78" width="14" height="13" rx="6" fill="#404040"/>
    <rect x="23" y="93" width="14" height="58" rx="8" fill="#232323"/>
    <g id="right-arm" class="walking-arm">
      <rect x="79" y="63" width="14" height="58" rx="8" fill="#232323"/>
      <ellipse cx="92" cy="67" rx="7" ry="8" fill="#f4e6d9"/>
    </g>
    <rect x="54" y="67" width="12" height="19" rx="6" fill="#d8cfc1"/>
    <ellipse cx="60" cy="44" rx="28" ry="28" fill="#e9eaea"/>
    <ellipse cx="60" cy="46" rx="22" ry="23" fill="#f4e6d9"/>
    <ellipse cx="60" cy="62" rx="13" ry="5" fill="#bfa987" opacity="0.35"/>
    <rect x="44" y="34" width="10" height="3" rx="2" fill="#232323"/>
    <rect x="66" y="34" width="10" height="3" rx="2" fill="#232323"/>
    <ellipse cx="50" cy="50" rx="4" ry="5" fill="#fff"/>
    <ellipse cx="70" cy="50" rx="4" ry="5" fill="#fff"/>
    <ellipse cx="50" cy="53" rx="1.6" ry="2" fill="#232323"/>
    <ellipse cx="70" cy="53" rx="1.6" ry="2" fill="#232323"/>
    <ellipse cx="60" cy="59" rx="2.3" ry="3.7" fill="#e2cbb0"/>
    <path d="M52 66 Q60 96 68 90" stroke="#a57a5d" stroke-width="2" fill="none"/>
    <ellipse cx="32" cy="48" rx="3" ry="5" fill="#f4e6d9"/>
    <ellipse cx="88" cy="48" rx="3" ry="5" fill="#f4e6d9"/>
  </g>
</svg>`;

// --- SVG وضعية الجلوس ---
const svgSit = `
<svg width="115" height="256" viewBox="0 0 112 256">
  <ellipse id="bot-glow-sit" cx="56" cy="243" rx="32" ry="12" fill="#00d4ff" opacity="0.31" style="filter: blur(7px);" />
  <g id="bot-body">
    <rect x="40" y="207" width="14" height="28" rx="6" fill="#232323"/>
    <rect x="69" y="219" width="14" height="17" rx="6" fill="#232323"/>
    <rect x="44" y="165" width="8" height="54" rx="8" fill="#232323" transform="rotate(13 44 165)"/>
    <rect x="71" y="171" width="8" height="45" rx="8" fill="#232323" transform="rotate(27 71 171)"/>
    <rect x="35" y="110" width="44" height="58" rx="20" fill="#232323"/>
    <rect x="50" y="98" width="14" height="18" rx="7" fill="#404040"/>
    <rect x="23" y="123" width="14" height="38" rx="8" fill="#232323"/>
    <g id="right-arm" class="sitting-arm">
      <rect x="80" y="119" width="13" height="38" rx="8" fill="#232323"/>
      <ellipse cx="92" cy="136" rx="7" ry="8" fill="#f4e6d9"/>
    </g>
    <rect x="54" y="91" width="12" height="19" rx="6" fill="#d8cfc1"/>
    <ellipse cx="60" cy="70" rx="28" ry="28" fill="#e9eaea"/>
    <ellipse cx="60" cy="72" rx="22" ry="23" fill="#f4e6d9"/>
    <ellipse cx="60" cy="90" rx="13" ry="5" fill="#bfa987" opacity="0.33"/>
    <rect x="44" y="60" width="10" height="3" rx="2" fill="#232323"/>
    <rect x="66" y="60" width="10" height="3" rx="2" fill="#232323"/>
    <ellipse cx="50" cy="76" rx="4" ry="5" fill="#fff"/>
    <ellipse cx="70" cy="76" rx="4" ry="5" fill="#fff"/>
    <ellipse cx="50" cy="79" rx="1.6" ry="2" fill="#232323"/>
    <ellipse cx="70" cy="79" rx="1.6" ry="2" fill="#232323"/>
    <ellipse cx="60" cy="84" rx="2.3" ry="3.7" fill="#e2cbb0"/>
    <path d="M52 90 Q60 96 68 90" stroke="#a57a5d" stroke-width="2" fill="none"/>
    <ellipse cx="32" cy="74" rx="3" ry="5" fill="#f4e6d9"/>
    <ellipse cx="88" cy="74" rx="3" ry="5" fill="#f4e6d9"/>
  </g>
</svg>`;

const osamaBotInner = document.getElementById('osama-bot-inner');
const botBubble = document.getElementById('bot-bubble');
const miniChatBar = document.getElementById('miniChatBar');
const chatbotModal = document.getElementById('chatbot-modal');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
const chatbotMinBtn = document.getElementById('chatbotMinBtn');
const unrecognizedQuestionsInput = document.getElementById('unrecognizedQuestions'); // العنصر الجديد

let isResizing = false;
let botMoved = false;

// مباشرة: البوت يظهر فوراً عند تحميل الصفحة
runBotSequence();

function runBotSequence() {
  botMoved = true;
  osamaBotInner.innerHTML = svgWalk;
  osamaBotInner.className = "walk-to-center";
  setTimeout(() => {
    osamaBotInner.classList.remove('walk-to-center');
    osamaBotInner.classList.add('walk-back-corner');
    setTimeout(() => {
      osamaBotInner.innerHTML = svgSit;
      osamaBotInner.className = "sitting";
      botBubble.style.display = 'block';
      setTimeout(() => { botBubble.style.opacity = 1; }, 80);
    }, 1700);
  }, 2400);
}

// عند الضغط على البوت الجالس
osamaBotInner.addEventListener('click', function(e) {
  chatbotModal.classList.add('active');
  firstWelcomeMsgs();
  setTimeout(() => userInput.focus(), 450);
});
chatbotModal.addEventListener('click', function(e) {
  if (e.target === this) {
    chatbotModal.classList.remove('active');
  }
});
chatbotCloseBtn.onclick = function() {
  chatbotModal.classList.remove('active');
};
chatbotMinBtn.onclick = function() {
  chatbotModal.classList.remove('active');
  miniChatBar.style.display = 'flex';
};
miniChatBar.onclick = function() {
  chatbotModal.classList.add('active');
  miniChatBar.style.display = 'none';
  firstWelcomeMsgs();
};
document.addEventListener('keydown', function(e){
  if(e.key === "Escape") {
    chatbotModal.classList.remove('active');
    miniChatBar.style.display = 'none';
  }
});

// إعادة تحجيم النافذة
chatbotModal.querySelector('.chatbot-box').addEventListener('mousedown', function(e) {
    const box = this;
    const rect = box.getBoundingClientRect();
    const tolerance = 15;

    const clickedOnResizeHandle = (e.clientX > rect.right - tolerance && e.clientX < rect.right + tolerance) ||
                                  (e.clientY > rect.bottom - tolerance && e.clientY < rect.bottom + tolerance);

    if (clickedOnResizeHandle) {
        isResizing = true;
        box.style.userSelect = 'none';
        box.style.webkitUserSelect = 'none';
        box.style.MozUserSelect = 'none';
    }
});

chatbotModal.querySelector('.chatbot-box').addEventListener('mouseup', function() {
    if (isResizing) {
        isResizing = false;
        this.style.userSelect = '';
        this.style.webkitUserSelect = '';
        this.style.MozUserSelect = '';
    }
});

document.addEventListener('mousemove', function() {
    if (isResizing) {
        // لا شيء هنا، الكود الأصلي كان يحتوي على سطر معلق هنا
    }
});

document.addEventListener('touchmove', function() {
    if (isResizing) {
        // لا شيء هنا، الكود الأصلي كان يحتوي على سطر معلق هنا
    }
});

// --- الشات بوت الذكي ---

// متغير لتخزين الردود التي سيتم جلبها من ملف JSON
let botResponses = {};

// دالة لجلب الردود من ملف JSON
async function fetchBotResponses() {
    try {
        const response = await fetch('bot-responses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        botResponses = await response.json();
        console.log('Bot responses loaded successfully:', botResponses);
        // بعد تحميل الردود، يمكننا تهيئة رسائل الترحيب الأولية
        firstWelcomeMsgs();
    } catch (error) {
        console.error('Error loading bot responses:', error);
        // رد احتياطي إذا فشل تحميل الردود
        addBotMsg("عذراً، لا يمكنني تحميل قاعدة بياناتي حالياً. يرجى المحاولة لاحقاً.");
    }
}

// استدعاء الدالة لجلب الردود عند تحميل السكربت
fetchBotResponses();


// رسالة ترحيبية أولى
function firstWelcomeMsgs() {
  chatMessages.innerHTML = '';
  // تأكد من استخدام botResponses.greetings هنا
  if (botResponses.greetings && botResponses.greetings.length > 0) {
      addBotMsg(botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)]);
  } else {
      addBotMsg("مرحباً بك! أنا هنا للمساعدة.");
  }
}

// إضافة رسالة من البوت
function addBotMsg(msg, debugInfo = null) {
  const div = document.createElement('div');
  div.className = 'chatbot-bubble';
  div.textContent = msg;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (debugEnabled && debugInfo && document.getElementById('debug-box')) {
    const box = document.getElementById('debug-box');
    box.innerHTML = `🔍 من أين؟ ${debugInfo.source}
⏱️ المدة: ${debugInfo.time.toFixed(2)} ثانية
🧠 السؤال: ${debugInfo.question}
💬 الرد: ${msg}`;
    box.style.display = 'block';
  }
}

// إضافة رسالة من المستخدم
function addUserMsg(msg) {
  const div = document.createElement('div');
  div.className = 'chatbot-bubble user';
  div.textContent = msg;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// الرد الذكي حسب الكلمات
chatForm.onsubmit = async function(e) {
  e.preventDefault();
  const startTime = performance.now();
  const txt = userInput.value.trim();

  if (txt.toLowerCase() === 'debug on') {
    debugEnabled = true;
    const box = document.getElementById('debug-box');
    if (box) box.style.display = 'block';
    userInput.value = ''; // مسح الإدخال
    return;
  }
  if (txt.toLowerCase() === 'debug off') {
    debugEnabled = false;
    const box = document.getElementById('debug-box');
    if (box) box.style.display = 'none';
    userInput.value = ''; // مسح الإدخال
    return;
  }
  if (!txt) return; // لا تفعل شيئا إذا كان الإدخال فارغاً

  addUserMsg(txt);
  userInput.value = '';

  const lowerTxt = txt.toLowerCase();

  const found = await findLocalBotResponse(lowerTxt);
  if (found) {
    const duration = (performance.now() - startTime) / 1000;
    addBotMsg(found, { source: '📁 قاعدة البيانات', time: duration, question: txt });
    return;
  }

  // إضافة رسالة انتظار قبل استدعاء Groq API
  const waitingMsgDiv = document.createElement('div');
  waitingMsgDiv.className = 'chatbot-bubble bot-waiting';
  waitingMsgDiv.textContent = 'لحظة من فضلك، أبحث عن أفضل رد...';
  chatMessages.appendChild(waitingMsgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const groqReply = await fetch("/.netlify/functions/groq-handler", {
      method: "POST",
      body: JSON.stringify({ message: txt })
    });

    let data;
    try {
      data = await groqReply.json();
    } catch (parseError) {
      console.error("خطأ في قراءة رد Groq:", parseError);
      waitingMsgDiv.remove(); // إزالة رسالة الانتظار عند الخطأ
      addBotMsg("عذرًا، لم أفهم رد المساعد الذكي. حاول مرة أخرى.");
      return;
    }
    waitingMsgDiv.remove(); // إزالة رسالة الانتظار عند تلقي الرد بنجاح
    const duration = (performance.now() - startTime) / 1000;
    addBotMsg(data.reply || "لم أتمكن من فهم سؤالك من خلال الذكاء الاصطناعي الخارجي. هل يمكنك إعادة صياغته أو سؤالي عن موضوع آخر؟", { source: '🤖 Groq API', time: duration, question: txt });
  } catch (error) {
    console.error("Groq API error:", error);
    waitingMsgDiv.remove(); // إزالة رسالة الانتظار عند الخطأ
    addBotMsg("حدث خطأ أثناء الاتصال بالمساعد الذكي. حاول لاحقاً.");
  }

  // حفظ السؤال الذي لم يتم التعرف عليه (فقط إذا لم يتم الرد محليًا أو من Groq)
  if (unrecognizedQuestionsInput && !found) { // تم إضافة شرط !found للتأكد من حفظ غير المعروف فقط
    const timestamp = new Date().toLocaleString('ar-SA');
    const entry = `[${timestamp}] ${txt}\n`;
    unrecognizedQuestionsInput.value += entry;
  }
};

async function findLocalBotResponse(lowerTxt) {
  const profaneWordsRegex = /\b(أحمق|غبي|أبله|سافل|فاشل|كاذب|احمق|تبا|لعنة|حمار|كلب|سخيف|قذر|وقح|مغفل|حقير|تخلف|غباء|حماقة|مزعج|سامج)\b/i;

  // 0. (جديد) أولوية مطلقة لكلمة "اقتباس" لتجنب أي تداخل
  if (lowerTxt === 'اقتباس') {
    const arr = [...botResponses.motivation, ...botResponses.quotes];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  // 1. التعامل مع الألفاظ البذيئة أو المسيئة ثانياً (بعد الاقتباس)
  else if (profaneWordsRegex.test(lowerTxt)) {
    return random(botResponses.profaneOrInsulting);
  }
  // 2. أسئلة عن أسامة (المطور) - أولوية أعلى
  else if (/(من هو أسامة|أسامة|اسامة|الاسود|صاحب الموقع|مطور الموقع)/i.test(lowerTxt)) {
      return random(botResponses.aboutOsama);
  }
  // 3. التحفيز أو اقتباس
  else if (/(حفز|تحفيز|كلمة تحفيزية|قول حكيم|نصيحة|امل|تفاؤل|حكمة|motivation|inspire|quote|ألهمني|تشجيع|شجعني|امل|تفاؤل|حكمة|اجعلني افضل|ابداعات|النجاح|الصبر|الاصرار|التحدي|الامل|التغيير|طورني|شجعني|عبارة ملهمة|قوة إرادة|عزيمة|إيجابية|طموح|أهداف|كلام جميل|كلمات ايجابية|كن قويا|لا تستسلم|ابذل قصارى جهدك|ثق بنفسك|تجاوز التحديات|الانتصار|القوة|الحماس|الالهام|الدعم)/i.test(lowerTxt)) {
    return random([...botResponses.motivation, ...botResponses.quotes]);
  }
  // 4. أسئلة شخصية للبوت
  else if (/(من انت|أنت مين|مين انت|اسمك|تعرفني|مين وراك|ما وظيفتك|هل أنت انسان|ما قصتك|هل أنت بوت|من بناك|كيف صنعت|ما هدفك|من مطورك|ما اسمك|اسمك ايه|كم عمرك|هل انت حي|هل لديك وعي|ماهيتك|طبيعتك|لماذا خلقت|من خلقك|هل لديك جسد|هل تأكل|هل تنام|هل تحبني|ما مشاعرك|أين تسكن|ما هي وظيفتك الحقيقية|هل أنت ذكي|هل أنت سعيد|هل أنت حزين|هل أنت روبوت|هل أنت برنامج|ما هو شعورك|هل لديك روح|هل تشعر|هل أنت حي|من صنعك|لماذا انت هنا|هل يمكن ان تفشل|هل يمكن ان تخطئ|كيف تفكر|ماذا تفعل في وقت فراغك|هل لديك عائلة|هل تشعر بالبرد|هل تشعر بالحر)/i.test(lowerTxt)) {
    return random(botResponses.personalQuestionsAboutUser);
  }
  // 5. التحية أو السلام أو الترحيب
  else if (/(سلام|أهلاً|مرحبا|السلام عليكم|هاي|هلا|هلاو|hi|hello|hey|صباح الخير|مساء الخير|كيف الحال|شلونك|يا هلا|مساء النور|صباح النور|عساك طيب|شخبارك|أخبار؟|كيفك|تمام|مرحباً|أهلاً بك|يسعد صباحك|يسعد مساك|أهلاً وسهلاً|كيف حالك اليوم|كيفك اليوم|تمام التمام|شلون الأمور|شو الأخبار|كيف الدنيا|يا مرحبا|اهلين|مسا النور|صباح النور|شو أخبارك|شعلومك|شو مسوي|عساك بخير|الحمد لله|طيبين|كل عام وانتم بخير|عيدكم مبارك|عيد سعيد|جمعة مباركة|كيف أمضيت يومك|أهلاً وسهلاً بك|كيف أمورك|ما الجديد|هل من جديد|مساء الورد|صباح الفل|يا صباح الخير|يا مساء الخير)/i.test(lowerTxt)) {
    return random(botResponses.greetings);
  }
  // 6. عن الموقع (تم تعديل الكلمات المفتاحية لتجنب تكرار أسئلة أسامة)
  else if (/(الموقع|عن الموقع|هذا الموقع|ما هذا الموقع|من صمم الموقع|مالك الموقع|ما هو osama-ai.netlify.app|netlify|نيتفلاي|بوابة المستقبل|موقعك|صفحتك|صفحة أسامة|ماذا يهدف الموقع|معلومات عن الموقع|فكرة الموقع|لمن هذا الموقع|هل أسامة موجود هنا|هل يمكنني التواصل مع أسامة)/i.test(lowerTxt)) {
    return random(botResponses.websiteInfo);
  }
  // 7. عن علم النفس أو الدعم النفسي
  else if (/(علم النفس|الدعم النفسي|نصيحة نفسية|مشاعر|حزين|ضيق|قلق|توتر|اكتئاب|علاج نفسي|مرشد نفسي|مشورة نفسية|كيف أتعامل مع|تعامل مع الحزن|تعامل مع التوتر|كيف أكون قوي نفسيًا|شخصيتي|صحة نفسية|وعي ذاتي|تنمية ذاتية|تفاؤل|سعادة|إيجابية|علاج سلوكي|علاج معرفي|صدمة نفسية|ضغط نفسي|طاقة إيجابية|كيف أسيطر على مشاعري|هل أنا بخير|أشعر بالوحدة|أنا مكتئب|ساعدني نفسياً|علم الاجتماع|العقل الباطن|السلوك البشري|تطوير الذات|الصحة العقلية|التفكير الإيجابي|ادارة الغضب|كيف اكون سعيد|نصيحة للحياة|التعاطف|التسامح|الغفران|العلاقات الانسانية|التأمل|اليقظة الذهنية|العادات الصحية|التوازن النفسي|الضغط العصبي|الاحتراق الوظيفي|قوة العقل|الذكاء العاطفي|التفكير الإيجابي|الحالة النفسية|علم النفس الإيجابي|علم نفس النمو|علم نفس المعرفي|القلق الاجتماعي|الخوف|الاجهاد|السلام الداخلي|التسامح مع الذات|تطوير المهارات الاجتماعية|التفكير النقدي|الصمود النفسي|إدارة الوقت|الثقة بالنفس|تقدير الذات|التأقلم|التكيف)/i.test(lowerTxt)) {
    return random(botResponses.psychologyInfo);
  }
  // 8. عن الذكاء الاصطناعي أو التقنية أو البرمجة
  else if (/(ما\s+هو|ماذا\s+يعني|عرف|تعريف|ايش\s+هو|ذكاء\s*اصطناعي|تقنية|تكنولوجيا|برمجة|تطوير\s+ويب|AI|ai|machine\s+learning|robot|technology|coding|كود|اكواد|الروبوتات|المستقبل|الفضاء|علوم|علم\s+الحاسوب|امن\s+سايبر|شبكات|هندسة\s+برمجيات|تطبيقات|مواقع|انترنت|سايبر|ويب|برامج|داتا|بيانات|خوارزميات|تعلم عميق|معالجة لغة طبيعية|روبوت|ذكاء|GPT|ChatGPT|نموذج لغة|مطور ويب|مصمم مواقع|لغات برمجة|بايثون|جافا سكريبت|أتمتة|معلوماتية|تحليل بيانات|بيانات كبيرة|واقع افتراضي|واقع معزز|تطور تقني|روبوتات الدردشة|البيانات الضخمة|إنترنت الأشياء|الحوسبة السحابية|تعلم تقني|دروس برمجة|أمن المعلومات|الرؤية الحاسوبية|الذكاء العام|المساعدات الصوتية|نظم الخبراء|أتمتة العمليات|البيانات الضخمة|الذكاء الاصطناعي التوليدي|أخلاقيات الذكاء الاصطناعي|الكمبيوتر|الحاسوب|التشفير|بلوكتشين|تطوير برمجيات|UX|UI|تجربة المستخدم|واجهة المستخدم|برمجيات مفتوحة المصدر|الخوارزميات|الذكاء البشري|الذكاء العاطفي الاصطناعي|الروبوتات المتنقلة|الواقع المختلط|الحوسبة الكمومية|الطباعة ثلاثية الابعاد|النانo تكنولوجيا|تعلم الالة|بيج داتا|الذكاء التنافسي|الشبكات العصبية)/i.test(lowerTxt)) {
    return random(botResponses.aiReplies);
  }
  // 9. أسئلة عن الوقت والتاريخ والموقع
  else if (/(الوقت|الساعة|تاريخ|تأريخ|تاريخ اليوم|ساعة كم|كم الساعة|اليوم|التاريخ|التاريخ اليوم|وين أنا|وين مكاني|موقعك|في أي بلد|بلدك|مكانك|كم الوقت|ما هو الوقت|ما هو التاريخ|متى اليوم|في اي دولة|اين انت|من اين انت)/i.test(lowerTxt)) {
    // Get current time and format for Kuwait
    const now = new Date();
    // Options for Kuwait time zone (GMT+3) and desired format
    const options = {
        timeZone: 'Asia/Kuwait',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour12: false // Use 24-hour format
    };
    const formatter = new Intl.DateTimeFormat('ar-KW', options);
    const formattedDate = formatter.format(now);
    
    const timeOnly = formattedDate.split(' ')[formattedDate.split(' ').length - 2];
    const dateOnly = formattedDate.substring(0, formattedDate.lastIndexOf(' '));
    return `الساعة الآن في الكويت هي ${timeOnly} يوم ${dateOnly}.`;
  }
  // 10. أسئلة غريبة/فلسفية/غير منطقية
  else if (/(لو كنت|لو أنك|لو أصبحت|تخيل|افترض|سؤال غريب|ماذا لو|وش يصير لو|ايش يصير لو|هل تتوقع|لماذا لا|ليش لا|ليش|ليش كذا|غريب|سؤال غير منطقي|شيء غريب|مستحيل|خيال|فضائي|جن|ما وراء الطبيعة|هل لديك مشاعر|الاكوان الموازية|ماذا بعد الموت|ما معنى الحياة|هل تؤمن بـ|هل يوجد كائنات فضائية|الأشباح|الخوارق|الكون|المجرات|الفلسفة|ما هو الوجود|هدف الحياة|ماهو الغبي|ماهو الاحمق|ما هو الزمن|هل المستقبل حقيقي|هل الماضي يمكن تغييره|هل يوجد سحر|ما هو العدم|ما هو الوعي|ما هي الحقيقة|هل يمكن أن تطير|هل يمكن أن تتكلم|هل يمكنك السفر عبر الزمن|ماذا لو انتهى العالم)/i.test(lowerTxt)) {
    return random(botResponses.strangeQuestions);
  }
  return null; // مهم جدًا ليرسل لـ Groq إذا لم يجد شيئًا محليًا
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}