# TranslateSpeech #
This project contains
- a client that records audio from a microphone and sends it to the server
- a server that recognizes the incoming speech and sends the translation to interested clients

## Prerequisites ##

Node.js must be installed on both the client and the server. Google Cloud Speech-to-Text and Translation AI have to be available from the server, i.e., the credentials to access these API must be accessible from node (see Google Cloud's [Set up Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc)).

## Usage ##

To start the server on Windows, type the following line into a cmd:

`set TLS_KEY_PATH=<Path to TLS Key>& set TLS_CERT_PATH=<Path to TLS Certificate>& node Server`

To start the client, type `node Client` into a cmd.

## Restrictions ##

Currently, the server is reachable from the client only via the URL https://localhost:8443 and speech is translated only from `de-CH` to `uk`.