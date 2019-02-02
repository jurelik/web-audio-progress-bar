const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

let buffer;
let bufferReverse;
let source;
let currentOffset = 0;
const progressBar = document.getElementById('progress-bar');

fetch('warble.mp3').then(res => {
  return res.arrayBuffer();
}).then(res => {
  context.decodeAudioData(res).then(decoded => {
    buffer = decoded;
    console.log('decoded');
  }).catch(error => {
    console.log(error);
  });
}).catch(error => {
  console.log(error);
});

fetch('warble.mp3').then(res => {
  return res.arrayBuffer();
}).then(res => {
  context.decodeAudioData(res).then(decoded => {
    bufferReverse = decoded;
    bufferReverse.getChannelData(0).reverse();
    bufferReverse.getChannelData(1).reverse();
    console.log('decoded');
  }).catch(error => {
    console.log(error);
  });
}).catch(error => {
  console.log(error);
});

function play() {
  source = context.createBufferSource();
  let startTime = context.currentTime;

  source.buffer = buffer;
  source.playbackRate = 1.0;
  source.connect(context.destination);
  source.start(context.currentTime, currentOffset);
  
  updateProgress(startTime);
}

function playRev() {
  let source = context.createBufferSource();
  let startTime = context.currentTime;

  source.buffer = bufferReverse;
  source.connect(context.destination);
  source.start(context.currentTime);
  
  updateProgress(startTime);
}

function stop() {
  let slowDown = setTimeout(() => {
    source.playbackRate.value -= 0.01;
    console.log(source.playbackRate);
    stop();
  }, 1);

  if (source.playbackRate.value < 0) {
    source.stop()
    clearTimeout(slowDown);
  }
};

function updateProgress(startTime) {
  let length = buffer.duration;

  source.onended = () => {
    clearTimeout(update);
    currentOffset += context.currentTime - startTime;
  };

  let update = setTimeout(() => {
    let progress = (context.currentTime - startTime + currentOffset) / length * 100;
    progressBar.value = progress;

    console.log(progressBar.value);

    updateProgress(startTime);
  }, 100);
}
