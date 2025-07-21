import { WebSocketServer } from 'ws';
import { client, xml } from '@xmpp/client';
import dotenv from 'dotenv';
import { XMLParser } from 'fast-xml-parser';


dotenv.config();

const xmpp = client({
  domain: 'nwws-oi.weather.gov',
  service: 'xmpp://nwws-oi.weather.gov:5222',
  resource: 'nwws',
  username: process.env.XMPP_USERNAME,
  password: process.env.XMPP_PASSWORD,
});

const wss = new WebSocketServer({ port: process.env.PORT || 5222 });

xmpp.on('error', (err) => {
  console.error('[XMPP]', err);
});

xmpp.on('status', (status) => {
  console.debug('[XMPP]', status);
});

xmpp.on('online', async () => {
  console.info('[XMPP] client is online!');
  const presence = xml('presence', { 
    to: `nwws@conference.nwws-oi.weather.gov/${process.env.XMPP_USERNAME}`
  });
  await xmpp.send(presence);
});

xmpp.on('stanza', async (stanza) => {
  if (stanza.is('message') && stanza.getChild('x') && stanza.attrs.type === 'groupchat' && stanza.getChild('x').attrs.awipsid.substring(0, 3) == "CAP") {

    const from = await stanza.attrs.from;
    const bodyXml = "<?xml" +(await stanza.getChild('x').text().split('<?xml')[1]);
    const parser = new XMLParser();
    
    let body = parser.parse(bodyXml);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(body));
      }
    });
  }
});

(async () => {
  try {
    await xmpp.start();
  } catch (error) {
    console.error('Failed to start XMPP client:', error);
  }
})();