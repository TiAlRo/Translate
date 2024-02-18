# TranslateSpeech #
This project contains
- a client that records audio from a microphone and sends it to the server
- a server that recognizes the incoming speech and sends the translation to interested clients

## Prerequisites ##

Node.js must be installed on both the client and the server.

## Usage ##

To start the server on Windows, type the following line into a cmd:

`set TLS_KEY_PATH=<Path to TLS Key>& set TLS_CERT_PATH=<Path to TLS Certificate>& node Server/index `

## Restrictions ##

Currently, speech is translated only from `de-CH` to `uk`.