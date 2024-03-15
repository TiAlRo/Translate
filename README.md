# TranslateSpeech #
This project contains
- an audio client that records audio from a microphone and sends it to the server
- a server that recognizes the incoming speech and sends the translation to interested translation clients

## Prerequisites ##

Node.js must be installed on both the audio client and the server. Google Cloud Speech-to-Text and Translation AI have to be available from the server, i.e., the credentials to access these API must be accessible from node (see Google Cloud's [Set up Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc)).

To install the dependencies, run `npm i` in both the server's and the client's directory.

On the client, [SoX](http://sox.sourceforge.net/) must be installed and it must be available in the `$PATH` environment variable:

For Mac OS:
`brew install sox`

For most linux disto's:
`sudo apt-get install sox libsox-fmt-all`

For Windows:
[download the binaries](http://sourceforge.net/projects/sox/files/latest/download)

## Usage ##

To start the server on Windows, type the following line into a cmd:

`set PFX_PATH=<Path to PFX file>& node Server`

To start the audio client, type `node Client` into a cmd.

Translations are available via HTTPS requests to the server's port 8443 at the path `/getTranslation` (e.g., via https://localhost:8443/getTranslation) from the translation clients.

## Restrictions ##

Currently, the server is reachable from the audio client only via the URL https://localhost:8443 and speech is translated only from `de-CH` to `uk`. The passphrase for the PFX file must be `password!`.