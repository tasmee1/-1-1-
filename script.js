let mediaRecorder;
let audioChunks = [];
let audioURL;

const startBtn = document.getElementById('startBtn');
const listenBtn = document.getElementById('listenBtn');
const resultBox = document.getElementById('resultBox');

// بدء التسميع
startBtn.addEventListener('click', async () => {
  resultBox.textContent = "";
  audioChunks = [];

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();
    startBtn.textContent = "جاري التسجيل... اضغطي هنا لإيقافه";
    startBtn.disabled = false; // يمكنهم الضغط لإيقاف التسجيل

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      audioURL = URL.createObjectURL(audioBlob);
      listenBtn.disabled = false;
      startBtn.textContent = "ابدئي التسميع";
      alert("تم تسجيل تلاوتك! يمكنك الآن الاستماع.");
      
      // إعادة تعيين الحدث للضغط لإعادة التسجيل في المستقبل
      startBtn.onclick = startTasmii;
    };

    // السماح للمستخدم بإيقاف التسجيل عند الضغط على نفس الزر
    startBtn.onclick = () => {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };

  } catch (error) {
    alert("الميكروفون غير مفعل! الرجاء السماح للتطبيق باستخدامه.");
  }
});

// الاستماع للتسجيل
listenBtn.addEventListener('click', () => {
  if (!audioURL) return;
  const audio = new Audio(audioURL);
  audio.play();

  audio.onended = () => {
    const correct = confirm("هل كان تسميعك صحيحًا؟");

    if (correct) {
      resultBox.textContent = "ما شاء الله! تسميعك صحيح 🌸";
    } else {
      resultBox.textContent = "حاولي مرة أخرى من البداية";
      listenBtn.disabled = true;
      audioURL = null;
    }
  };
});

// إعادة استخدام الدالة عند إعادة الضغط على زر التسميع مستقبلاً
function startTasmii() {
  startBtn.click();
}