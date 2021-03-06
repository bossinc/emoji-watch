const { json } = require('micro');
const axios = require('axios');

const CHANNEL = process.env.CHANNEL || 'GQ565R7T8';

module.exports = async (req, res) => {
    const { event, challenge} = await json(req);

    if (challenge) {
        res.writeHead(200);
        return res.end(challenge);
    }

    if (event.subtype === 'add' && event.name) {
        await axios({
            method: 'post',
            url: 'https://slack.com/api/chat.postMessage',
            headers: {'Authorization': `Bearer ${process.env.SLACK_TOKEN}`},
            data: {
                channel: CHANNEL,
                text: `:alert:` + `:${event.name}: `.repeat(5) + `:alert:`
            }
        });

        res.writeHead(200);
        return res.end();
    }

    if (event.subtype === 'remove' && event.names) {
        await axios({
            method: 'post',
            url: 'https://slack.com/api/chat.postMessage',
            headers: {'Authorization': `Bearer ${process.env.SLACK_TOKEN}`},
            data: {
                channel: CHANNEL,
                text: event.names.map(name => `:alert-blue:` + `:${name}: `.repeat(5) + `:alert-blue:`).join("\n")
            }
        });

        res.writeHead(200);
        return res.end();
    }

    res.writeHead(200);
    res.end();
};
