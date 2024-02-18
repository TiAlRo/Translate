const http2 = require('http2')
const {
    HTTP2_HEADER_PATH, HTTP2_HEADER_METHOD, HTTP2_METHOD_POST
} = http2.constants
const recorder = require('node-record-lpcm16')

const client = http2.connect('https://localhost:8443')
const recording = recorder.record()
const request = client.request({
    [HTTP2_HEADER_PATH]: '/sendAudio',
    [HTTP2_HEADER_METHOD]: HTTP2_METHOD_POST
})
const recordingStream = recording.stream()
recordingStream.pipe(request)
