// تعريف العناصر
const startBtn = document.getElementById('startBtn');      // ابدئي التسميع
const stopBtn = document.getElementById('stopBtn');        // إيقاف التسجيل
const listenBtn = document.getElementById('listenBtn');    // اسمعي تلاوتك
const resultBox = document.getElementById('resultBox');
const checkPopup = document.getElementById('checkPopup');  // السؤال بعد الاستماع
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

let mediaRecorder;
let audioChunks = [];
let audioURL;

stopBtn.style.display = "none"; // إخفاء زر الإيقاف بالبداية
listenBtn.disabled = true;      // زر الاستماع معطل بالبداية

// ----------------- ابدأي التسميع ------------------
startBtn.addEventListener('click', async () => {
  resultBox.textContent = "";
  audioChunks = [];

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();

    startBtn.disabled = true;
    stopBtn.style.display = "inline-block";  // إظهار زر الإيقاف
    listenBtn.disabled = true;

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      audioURL = URL.createObjectURL(audioBlob);

      startBtn.disabled = false;
      stopBtn.style.display = "none";       // إخفاء زر الإيقاف
      listenBtn.disabled = false;           // تفعيل زر الاستماع
    };

  } catch (error) {
    alert("المايكروفون غير مسموح! الرجاء تفعيل الإذن.");
  }
});

// ----------------- إيقاف التسجيل ------------------
stopBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
});

// ----------------- الاستماع للتسجيل ------------------
listenBtn.addEventListener('click', () => {
  if (!audioURL) return;

  const audio = new Audio(audioURL);
  audio.play();

  audio.onended = () => {
    checkPopup.style.display = "block"; // إظهار السؤال بعد الاستماع
  };
});

// ----------------- زر نعم ------------------
yesBtn.addEventListener('click', () => {
  resultBox.textContent = "ما شاء الله! تسميعك صحيح 🌸";
  checkPopup.style.display = "none";
});

// ----------------- زر لا ------------------
noBtn.addEventListener('click', () => {
  resultBox.textContent = "كل مرة تعيدي فيها التسميع تقوّي حفظك 💪";
  checkPopup.style.display = "none";
  listenBtn.disabled = true;
  audioURL = null;
});
