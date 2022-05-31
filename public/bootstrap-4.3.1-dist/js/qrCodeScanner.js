const qrCode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");

let scanning = false;

qrCode.callback = res => {
  if (res) {
    var resData = JSON.parse(res);
    var d = new Date();
    window.location = `/record/${resData.sn}/${d.getTime()}/${resData.total}/${resData.tid}/${resData.items.join('_')}`;
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
  }
};

window.addEventListener('load', () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "user" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true);
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
});

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrCode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
