const fs = require('fs')
const http2 = require('http2')
const {
  HTTP2_HEADER_PATH
} = http2.constants
const { Translate } = require('@google-cloud/translate').v2
const speech = require('@google-cloud/speech')
const { Transform } = require('stream')

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

function createTranslatedSpeechStream(readableStream) {
  console.log('incoming audio')
  const speechClient = new speech.SpeechClient()
  const recognizeStream = speechClient.streamingRecognize({ config: { encoding: speech.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16, languageCode: 'de-CH', sampleRateHertz: 16000 } })
  const translateStream = new TranslateStream()
  const recognizedSpeechStream = readableStream.pipe(recognizeStream)
  translatedSpeechStream = recognizedSpeechStream.pipe(translateStream)
}

function pipeTranslatedSpeechStream(writableStream) {
  console.log('incoming translation request')
  writableStream.respond({
    'content-type': 'text/event-stream; charset=utf-8'
  })
  translatedSpeechStream.pipe(writableStream)
}

const tlsKey = fs.readFileSync(process.env.TLS_KEY_PATH)
const tlsCert = fs.readFileSync(process.env.TLS_CERT_PATH)
const server = http2.createSecureServer({
  key: tlsKey,
  cert: tlsCert
})
server.on('stream', (stream, headers) => {
  switch (headers[HTTP2_HEADER_PATH]) {
    case '/sendAudio': createTranslatedSpeechStream(stream)
      break
    case '/getTranslation': pipeTranslatedSpeechStream(stream)
  }
})
server.listen(8443)
console.log('Listening, press Ctrl+C to stop.')
