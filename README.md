# NWWS-OI to a Websocket
Basically this takes the messages from xmpp chatroom from NWWS-OI and sends it through a websocket


## Setup (docker)
1. In a docker compose file (`compose.yml`)
```
services:
  nws-ws:
    image: ghcr.io/coopeeo/nws-xmpp-ws:prod-main
    env_file:
      - .env.xmpp
    ports:
      - "5222:5222"
```
2. in `.env.xmpp` add the contents of `.env.example` in this repo
3. fill out the fields and yeah
4. run `docker compose up`
5. ur running

## Setup
1. clone the repo `git clone https://github.com/coopeeo/nws-xmpp-ws`
2. run `npm i`
3. copy `.env.example` to `.env`
4. fill out fields
5. do `npm run start`
6. ur running!