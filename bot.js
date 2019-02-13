const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
// set bot prefix
const prefix = "!";
const request = require("request-promise");
const { promisifyAll } = require('tsubaki');

const Canvas = require("canvas");
const path = require("path");
const snekfetch = require("snekfetch");
require("dotenv").config();

const key = process.env.API_KEY;
const baseURL = process.env.BASEURL;
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
      const track = await request({
        uri: `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=firstcomrade17&api_key=1336029958418997879ebb165f5fbb3f&limit=1&format=json`
      })
      //console.log(track)
      console.log(JSON.parse(track))
      let lastTrack = JSON.parse(track)
      //const lastTrack = track.recenttracks.track
      const artist = lastTrack.recenttracks.track[0].artist["#text"]
      const trackName = lastTrack.recenttracks.track[0].name
      const album = lastTrack.recenttracks.track[0].album["#text"]
      const cover = lastTrack.recenttracks.track[0].image[1]["#text"]
      
      const info = await request({
        uri: `http://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=firstcomrade17&api_key=1336029958418997879ebb165f5fbb3f&format=json`
      })
      let toUser = JSON.parse(info)
      const toImage = toUser.user.image[2]['#text']
     


      let toBase = await fs.readFileAsync("base.png");
     
      
      const canvas = Canvas.createCanvas(600, 150);
      const ctx = canvas.getContext("2d");
      const base = Canvas.loadImage(toBase);
      const userAvatar = Canvas.loadImage(toImage);
      const albumCover = Canvas.loadImage(cover);
      const generate = () => {
        ctx.drawImage(base, 0, 0);

        //ctx.createLinearGradient(0,0,600,150)
        userAvatar.onload = function() {
          ctx.drawImage(userAvatar, 530, 80, 590, 140);
        };
        albumCover.onload = function() {
          ctx.drawImage(albumCover, 15, 15, 132, 132);
        };
        ctx.fillText(artist, 148, 80, 246);
        ctx.fillText(trackName, 148, 40, 246);
        ctx.fillText(album, 148, 120, 246);
        const imgData = ctx.getImageData(530, 80, 590, 140);
        const data = imgData.data;
        /*for (let i = 0; i < data.length; i += 4) {
                 data[i] = Math.max(255, data[i]);
             }*/
        ctx.putImageData(imgData, 530, 80);
      };

      //userAvatar.src = await userImage.image[1]['#text'];
      generate();
      var buf = canvas.toBuffer();
      var toSend = fs.writeFileSync("test.png", buf);
      return msg.channel
        .send("", { file: "test.png" })
        .catch(err => msg.channel.send(`${(err, name)}: ${err.message}`));
    }
    }

  
});
// bot token
client.login(process.env.BOT_TOKEN);
