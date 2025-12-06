let mediaRecorder;
let audioChunks = [];
let audioURL;

// الحصول على العناصر من HTML
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const listenBtn = document.getElementById('listenBtn');
const resultBox = document.getElementById('resultBox');
const checkPopup = document.getElementById('checkPopup');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

// الحالة الابتدائية
stopBtn.style.display = "none";   // زر الإيقاف مخفي بالبداية
listenBtn.disabled = true;        // زر الاستماع معطل بالبداية

// --- زر ابدأي التسميع ---
startBtn.addEventListener('click', async () => {
  resultBox.textContent = "";
  audioChunks = [];

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    stopBtn.style.display = "inline-block"; // إظهار زر الإيقاف
    listenBtn.disabled = true;              // التأكد من تعطيل زر الاستماع أثناء التسجيل

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      audioURL = URL.createObjectURL(audioBlob);

      stopBtn.style.display = "none";      // إخفاء زر الإيقاف بعد التوقف
      listenBtn.disabled = false;          // تفعيل زر الاستماع
    };

  } catch (error) {
    alert("المايكروفون غير مفعل! الرجاء السماح للتطبيق.");
  }
});

// --- زر إيقاف التسجيل ---
stopBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
});

// --- زر الاستماع للتسجيل ---
listenBtn.addEventListener('click', () => {
  if (!audioURL) return;

  const audio = new Audio(audioURL);
  audio.play();

  audio.onended = () => {
    checkPopup.style.display = "block"; // إظهار السؤال بعد الاستماع
  };
});

// --- زر نعم بعد السؤال ---
yesBtn.addEventListener('click', () => {
  resultBox.textContent = "ما شاء الله! تسميعك صحيح 🌸";
  checkPopup.style.display = "none";
});

// --- زر لا بعد السؤال ---
noBtn.addEventListener('click', () => {
  resultBox.textContent = "كل مرة تعيدي فيها التسميع تقوّي حفظك 💪";
  checkPopup.style.display = "none";
  listenBtn.disabled = true;
  audioURL = null;
});
