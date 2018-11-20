const NodeCrunker = require('node-crunker');
const audio = new NodeCrunker();

const beats = require('./beats')

const EXAMPLE =
  'https://media.simplecast.com/episodes/audio/229926/react-podcast-29_mixdown.mp3';

async function getInputDuration(audioUrl) {
  try {
    const audioFile = await audio.fetchAudio(audioUrl);
    const duration = await audio._maxDuration(audioFile);
    return { duration, audioFile };
  } catch (err) {
    console.log('err getInputDuration', err);
  }
}

function generateBeatsList(duration) {
  const beatsLists = []
  let beatsDuration = 0
  while(beatsDuration < duration) { 
    const randomBeat = beats[Math.floor(Math.random() * beats.length)]
    beatsDuration += randomBeat.duration
    beatsLists.push(randomBeat.audioUrl)
 } 
 return beatsLists;
}

async function getBeats(duration) {
  try {
    const beats = generateBeatsList(duration)
    const audioBuffers = await audio.fetchAudio(...beats);
    return await audio.concatAudio(audioBuffers, duration);
  } catch (err) {
    console.log('err getBeats', err);
  }
}

async function init() {
  try {
    const inputFile = await getInputDuration(EXAMPLE);
    console.log(inputFile.duration);
    const beatsBuffer = await getBeats(inputFile.duration);
    const mergedBufers = await audio.mergeAudio([
      inputFile.audioFile[0],
      beatsBuffer
    ]);
    await audio.export(mergedBufers, 'merged.mp3');
  } catch (err) {
    console.log(err);
  }
}

init();
