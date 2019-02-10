const { Command } = require('discord.js-commando');
const Canvas = require('canvas-prebuilt');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const path = require('path');

module.exports = class TriggeredCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'triggered',
            group: 'fun',
            memberName: 'triggered',
            description: 'Put an avatar on a "Triggered" sign.',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to trigger?',
                    type: 'user'
                }
            ]
        });
    }

    async run(msg, args) {
        //if (msg.channel.type !== 'dm')
            //if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
               // return msg.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const avatarURL = user.avatarURL;
        if (!avatarURL) return msg.say('This user has no avatar.');
        try {
            const Image = Canvas.Image;
            const canvas = new Canvas(320, 371);
            const ctx = canvas.getContext('2d');
            const base = new Image();
            const avatar = new Image();
            const generate = () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 320, 371);
                ctx.drawImage(avatar, 0, 0, 320, 320);
                const imgData = ctx.getImageData(0, 0, 320, 320);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.max(255, data[i]);
                }
                ctx.putImageData(imgData, 0, 0);
                ctx.drawImage(base, 0, 0);
            };
            base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'images', 'triggered.png'));
            const { body } = await snekfetch.get(avatarURL);
            avatar.src = body;
            generate();
            var buf = canvas.toBuffer()
            var toSend = fs.writeFileSync("test.png", buf);
            return msg.say('', {file: 'test.png'})
                .catch(err => msg.say(`${err.name}: ${err.message}`));
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
