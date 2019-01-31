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

  updateProgress(startTime, source);
}

function updateProgress(startTime, source) {
  let length = buffer.duration;

  let update = setTimeout(() => {
    let progress = (context.currentTime - startTime) / length * 100;
    progressBar.value = progress;

    console.log(progressBar.value);

    if (progress < 100) {
      updateProgress(startTime, source);
    }
    else {
      clearTimeout(update);
    }
  }, 100);
}
