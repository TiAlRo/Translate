const fs = require('fs')
const http2 = require('http2')
const {
  HTTP2_HEADER_PATH
} = http2.constants
const { Translate } = require('@google-cloud/translate').v2
const speech = require('@google-cloud/speech')
const { Transform, finished } = require('stream')

class TranslateStream extends Transform {
  constructor(opt) {
    super(Object.assign({}, { writableObjectMode: true }, opt))
  }

  async _transform(chunk, _, callback) {
    const translate = new Translate()
    const [translation] = await translate.translate(chunk.results[0].alternatives[0].transcript, 'uk')
    this.push(`${translation}
`)
    callback()
  }
}

let translatedSpeechStream
let audioStream
const translationClients = []
let timerId
let recognizeStream

function createTranslatedSpeechStream() {
  // audioStream.unpipe(recognizeStream) gibt Fehler. Rufen mehrere recognizeStream ohne unpipe ständig die API auf? Ziel von unpipe: Warnung für viele EventListener vermeiden
  if (translatedSpeechStream) {
    translatedSpeechStream.end()
  }
  console.log('creating TranslatedSpeechStream')
  const speechClient = new speech.SpeechClient()
  recognizeStream = speechClient.streamingRecognize({ config: { encoding: speech.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16, languageCode: 'de-CH', sampleRateHertz: 16000 } }).on('data', data =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : '\n\nReached transcription time limit, press Ctrl+C\n'
    ))

  const translateStream = new TranslateStream()
  const recognizedSpeechStream = audioStream.pipe(recognizeStream)
  translatedSpeechStream = recognizedSpeechStream.pipe(translateStream)
  translationClients.forEach((client) => { translatedSpeechStream.pipe(client, { end: false }) })
  timerId = setTimeout(createTranslatedSpeechStream, 10000)
}

function setAudioStream(readableStream) {
  console.log('incoming audio')
  clearTimeout(timerId)
  audioStream = readableStream
  finished(audioStream, () => {
    clearTimeout(timerId)
  })
  createTranslatedSpeechStream()
}

function pipeTranslatedSpeechStream(writableStream) {
  console.log('incoming translation request')
  writableStream.respond({
    'content-type': 'text/event-stream; charset=utf-8'
  })
  translationClients.push(writableStream)
  if (translatedSpeechStream) {
    translatedSpeechStream.pipe(writableStream, { end: false })
  }
}

const pfx = fs.readFileSync(process.env.PFX_PATH)
const server = http2.createSecureServer({pfx, passphrase: 'password!'})
server.on('stream', (stream, headers) => {
  switch (headers[HTTP2_HEADER_PATH]) {
    case '/sendAudio': setAudioStream(stream)
      break
    case '/getTranslation': pipeTranslatedSpeechStream(stream)
  }
})
server.listen(8443)
console.log('Listening, press Ctrl+C to stop.')
