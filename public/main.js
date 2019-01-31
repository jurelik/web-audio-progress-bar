const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

let buffer;
const progressBar = document.getElementById('progress-bar');

fetch('warble.mp3').then(res => {
  return res.arrayBuffer();
}).then(res => {
  context.decodeAudioData(res).then(decoded => {
    buffer = decoded;
    console.log('decoded');
    console.log(buffer);
  }).catch(error => {
    console.log(error);
  });
}).catch(error => {
  console.log(error);
});

function play() {
  let source = context.createBufferSource();
  let startTime = context.currentTime;

  source.buffer = buffer;
  source.connect(context.destination);
  source.start();

  updateProgress(startTime);
}

function updateProgress(startTime) {
  let length = buffer.duration;

  setTimeout(() => {
    let progress = (context.currentTime - startTime) / length * 100;
    progressBar.value = progress;

    console.log(progressBar.value);
    updateProgress(startTime);
  }, 500);
}