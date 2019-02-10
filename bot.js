const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
// set bot prefix
const prefix = "!";
const request = require("superagent");
const Canvas = require("canvas");
const path = require("path");
const getProp = require("dotprop");
const snekfetch = require("snekfetch");
require("dotenv").config();

const key = process.env.API_KEY;

const unames = JSON.parse(
  fs.readFileSync("./uname.json", "utf8", function(err) {
    if (err) console.log("error", err);
  })
);

client.on("ready", () => {
  console.log("Ready!");
});
// read messages
client.on("message", async msg => {
  // get args and command
  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  // register username command
  if (command === "register") {
    let username = args[0];
    let toId = msg.author.id;
    if (!unames[msg.author.id]) {
      unames[msg.author.id] = {
        username: username
      };

      fs.writeFile("./uname.json", JSON.stringify(unames), err => {
        if (err) console.error(err);
      });
      msg.channel.send("Registered!");
    }
  }
  // fm image command
  else if (command === "fmi") {
    if (!unames[msg.author.id]) {
      msg.channel.send(
        `@${
          msg.author.id
        }, you don't seem to have your username set! Type !register *username* to set it!`
      );
    } else {
      let cover;
      //async function doIt(){
      //var trackStream = lastfm.stream(`${unames[message.author.id].username}`);
      const result = request.get(
        `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=firstcomrade17&api_key=1336029958418997879ebb165f5fbb3f&format=json&limit=1`
      );
      result.then(res => {
        //parseString(res.text, (err, obj) => {
        const track = res.body.recenttracks.track[0];
        console.log(track.image[1]["#text"]);
        //const track = tracks[0];
        let artist = track.artist["#text"];
        let trackName = track.name;
        //let timestamp = new Date().getTime();
        let album = track.album["#text"];
        cover = track.image[1]["#text"];
      });
      //})
      /*
          const resultTwo = request.get(`http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=firstcomrade17&api_key=1336029958418997879ebb165f5fbb3f&format=json`);
          resultTwo.then((res) => {
            //parseString(res.text, (err, obj) => {
          
          let image = res.body.user.image[1]['#text'];
            })*/
      //})

      //const Image = Canvas.Image;
      const canvas = Canvas.createCanvas(600, 150);
      const ctx = canvas.getContext("2d");
      const base = await Canvas.loadImage("base.png");
      //const userAvatar = await new Image();
      const { body: buffer } = await snekfetch.get(cover);
      const albumCover = Canvas.loadImage(buffer);
      //const generate = () => {
      //ctx.drawImage(userAvatar, 530, 80, 590, 140);
      ctx.drawImage(albumCover, 15, 15, 132, 132);
      ctx.fillText(artist, 148, 80, 246);
      ctx.fillText(trackName, 148, 40, 246);
      ctx.fillText(album, 148, 120, 246);
      const imgData = ctx.getImageData(530, 80, 590, 140);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(255, data[i]);
      }
      ctx.putImageData(imgData, 0, 0);
      ctx.drawImage(base, 0, 0);
      //};

      //userAvatar.src = await userImage.image[1]['#text'];
      //generate();
      //var buf = await canvas.toBuffer()
      // var toSend = await fs.writeFileSync("test.png", buf);
      //setTimeout(function(){msg.channel.send('', {file: 'test.png'})}, 3000);
      //const attachment = new Discord.Attachment(await buf, 'test.png');
      const attachment = new Discord.Attachment(canvas.toBuffer(), "test.png");

      channel.send(attachment);
      //setTimeout(function(){channel.send(attachment);}, 3000)
      console.log("test");
    }
    /*
    doIt().then(v => {
        console.log("lol");  
      });*/
  }
});
// bot token
client.login(process.env.BOT_TOKEN);
