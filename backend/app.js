// https://discordapp.com/oauth2/authorize?&client_id=586975468989972493&scope=bot&permissions=36767744

require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Discord = require("discord.js");
const path = require("path");

const crypto = require("crypto");

const hostname = process.env.HOST;

// app.use(express.static(path.join(__dirname, "dist")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

http.listen(process.env.PORT || 8080, function () {
  console.log(`listening on *:${this.address().port}`);
});

io.on("connection", socket => {
  socket.once("join", msg => {
    socket.join(msg.room);
  });
});

const client = new Discord.Client();
const token = process.env.DISCORD_BOT_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(() => {
    const message = `${hostname} / ${client.voice.connections.size} Connections`;
    client.user.setActivity(message, { type: "WATCHING" });
  }, 1000);
});

client.on("message", async msg => {
  if (!msg.mentions.has(client.user)) {
    return;
  }

  if (msg.content.endsWith("join")) {
    if (!msg.member.voice.channel) {
      msg.reply("ボイスチャットに入った状態でコマンドを入力して下さい");
      return;
    }

    const voiceChannel = msg.member.voice.channel;

    if (voiceChannel.members.has(client.user.id)) {
      msg.reply("すでにボイスチャットに参加済みです");
      return;
    }

    const connection = await voiceChannel.join().catch(console.log);
    const guildRoom = crypto
      .createHash("md5")
      .update(`${msg.guild.id}`, "binary")
      .digest("hex");
    const dashboardUrl = `http://${hostname}:2345/#/dash/${guildRoom}`;

    console.log("[joined]", voiceChannel.guild.name, voiceChannel.guild.id, dashboardUrl);
    msg.reply(`ダッシュボードのURLはこちらです：\n${dashboardUrl}`);

    connection.play("assets/join.ogg", { volume: 0 })

    connection.on("speaking", (user, speaking) => {
      try {
        const room = crypto
          .createHash("md5")
          .update(`${msg.guild.id}/${user.id}`, "binary")
          .digest("hex");

        if (speaking.bitfield) {
          const audioStream = connection.receiver.createStream(user, { mode: "pcm" });
          audioStream.on("data", chunk => {
            const buff = new Int16Array(chunk.buffer).filter(
              (v, i) => i % 80 == 0
            );
            io.to(room).emit("data", buff.buffer);
          })
        } else {
          io.to(room).emit("data", 0);
        }
      }
      catch (e) {
        console.error(e);
      }
    })

    const intervalId = setInterval(() => {
      if (
        voiceChannel.members.every(m => m.user.bot) ||
        !voiceChannel.members.has(client.user.id)
      ) {
        connection.channel.leave();
        return;
      }

      const members = Array.from(voiceChannel.members)
        .filter(([id, m]) => id != client.user.id)
        .map(([id, m]) => ({
          room: crypto
            .createHash("md5")
            .update(`${msg.guild.id}/${m.user.id}`, "binary")
            .digest("hex"),
          name: m.nickname || m.user.username,
          avatarURL: m.user.displayAvatarURL()
        }));

      io.to(guildRoom).emit("data", members);
    }, 1000);

    connection.on("disconnect", () => {
      console.log(
        "[leaved]",
        voiceChannel.guild.name,
        voiceChannel.guild.id
      );
      clearInterval(intervalId);
    });
  }
});

client.on("error", console.error);

client.login(token);
