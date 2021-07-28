const TeleBot = require('telebot');
require('dotenv').config();

const token = process.env.BOT_TOKEN;

//ini isi sm bot token klen yh, bkin file .env aj
const bot = new TeleBot(token);

//apikey hubungi ak
const apikey = '';
const color = require('../utils');
const { instagram, igstory } = require('../lib/functions');
const axios = require('axios');
const emojiUnicode = require('emoji-unicode');

bot.on(['/start', '/hello'], (msg) => {
  msg.reply.text(
    `Hai ${msg.chat.first_name}!✨
Saya adalah bot yang dibuat oleh @bdrsmsdn untuk memenuhi salah satu Tugas Besar Mata Kuliah Aplikasi Teknologi Online.

Ketik /help untuk melihat menu.`,
    { asReply: true }
  );
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/start`), 'from', color(`${msg.chat.first_name}`));
});

// bot.on('text', (msg) => {
//   msg.reply.text(`${msg.text} ${msg.chat.first_name}`);
// });

bot.on(['/help', '/menu'], (msg) => {
  msg.reply.text(
    `Halo, berikut adalah beberapa menu yang tersedia:
1. /downloader untuk melihat list menu Downloader
2.
3.
4.`,
    { asReply: true }
  );
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/help`), 'from', color(`${msg.chat.first_name}`));
});

bot.on('/downloader', (msg) => {
  msg.reply.text(
    `Halo, berikut adalah list menu downloader:
1. /ig link
2. /igstory username
3. /tiktok link
4.`,
    { asReply: true }
  );
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/downloader`), 'from', color(`${msg.chat.first_name}`));
});

bot.on('edit', (msg) => {
  return msg.reply.text('Terdeteksi melakukan pengeditan pesan!', { asReply: true });
});

// bot.on('location', (msg) => {
//   var location = msg.location;
//   return msg.reply.text(`Ini adalah lokasimu: ${location.latitude} dan ${location.longitude}`);
// });

bot.on('/cat', (msg) => {
  const chatId = msg.chat.id;
  axios
    .get('https://api.vhtear.com/randomcat?apikey=' + apikey)
    .then((response) => {
      bot.sendPhoto(chatId, response.data.result.url);
    })
    .catch((error) => {
      const errorText = `Error!`;
      bot.sendMessage(chatId, errorText, { parse_mode: 'HTML', asReply: true });
    });
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/cat`), 'from', color(`${msg.chat.first_name}`));
});

bot.on(/^\/tiktok (.+)$/, (msg, link) => {
  const chatId = msg.chat.id;
  const uri = link.match[1];
  axios
    .get(`https://api.vhtear.com/tiktok_no_wm?link=${uri}&apikey=` + apikey)
    .then((response) => {
      return bot.sendVideo(chatId, response.data.result.video);
    })
    .catch((error) => {
      const errorText = `Error!`;
      bot.sendMessage(chatId, errorText, { parse_mode: 'HTML' });
    });
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/tiktok`), 'from', color(`${msg.chat.first_name}`));
});

bot.on(/^\/ig (.+)$/, (msg, link) => {
  const chatId = msg.chat.id;
  const uri = link.match[1];
  instagram(uri)
    .then(async (res) => {
      for (let i = 0; i < res.post.length; i++) {
        if (res.post[i].type == 'image') {
          bot.sendPhoto(chatId, res.post[i].urlDownload);
        } else if (res.post[i].type == 'video') {
          bot.sendVideo(chatId, res.post[i].urlDownload);
        }
      }
    })
    .catch((err) => {
      console.log(err);
      bot.reply(chatId, 'Error!');
    });
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/ig`), 'from', color(`${msg.chat.first_name}`));
});

bot.on(/^\/igstory (.+)$/, (msg, link) => {
  const chatId = msg.chat.id;
  const uri = link.match[1];
  igstory(uri)
    .then(async (res) => {
      for (let i = 0; i < res.itemlist.length; i++) {
        if (res.itemlist[i].type == 'image') {
          bot.sendPhoto(chatId, res.itemlist[i].urlDownload);
        } else if (res.itemlist[i].type == 'video') {
          bot.sendVideo(chatId, res.itemlist[i].urlDownload);
        }
      }
    })
    .catch((err) => {
      console.log(err);
      bot.reply(chatId, 'Error!');
    });
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/igstory`), 'from', color(`${msg.chat.first_name}`));
});

bot.on(/^\/say (.+)$/, (msg, props) => {
  const text = props.match[1];
  return bot.sendMessage(msg.from.id, text, { replyToMessage: msg.message_id });
});

bot.start();
