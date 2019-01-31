const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
let buffer;

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

function play() {
  let source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
}