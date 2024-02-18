# TranslateSpeech #
This project contains
- a client that records audio from a microphone and sends it to the server
- a server that recognizes the incoming speech and sends the translation to interested clients

To start the server on Windows, type the following line into a cmd:

`set TLS_KEY_PATH=<Path to TLS Key>& set TLS_CERT_PATH=<Path to TLS Certificate>& node Server/index `
