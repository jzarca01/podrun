const NodeCrunker = require('node-crunker');
const audio = new NodeCrunker();

const EXAMPLE =
  'https://media.proudmusiclibrary.com/en/file/stream/bbfa92ec6e571056a9332f96be97c12c/0/46524.mp3';

async function getInputDuration(audioUrl) {
  try {
    const audioFile = await audio.fetchAudio(audioUrl);
    const duration = await audio._maxDuration(audioFile);
    return { duration, audioFile };
  } catch (err) {
    console.log('err getInputDuration', err);
  }
}

async function getBeats(duration) {
  try {
    const audioBuffers = await audio.fetchAudio(
      'https://media.proudmusiclibrary.com/en/file/stream/bbfa92ec6e571056a9332f96be97c12c/0/75508.mp3',
      'https://media.proudmusiclibrary.com/en/file/stream/bbfa92ec6e571056a9332f96be97c12c/0/169886.mp3',
      'https://media.proudmusiclibrary.com/en/file/stream/bbfa92ec6e571056a9332f96be97c12c/0/26355.mp3',
      'https://media.proudmusiclibrary.com/en/file/stream/bbfa92ec6e571056a9332f96be97c12c/0/236563.mp3',
      'https://media.proudmusiclibrary.com/en/file/stream/bbfa92ec6e571056a9332f96be97c12c/0/169886.mp3'
    );
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
