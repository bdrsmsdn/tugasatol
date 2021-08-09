const TeleBot = require('telebot');
require('dotenv').config();

const token = process.env.BOT_TOKEN;

//ini isi sm bot token klen yh, bkin file .env aj
const bot = new TeleBot(token);
///////////////////////
//apikey hubungi ak
const apikey = 'K2021fuckoff789';
const color = require('../utils');
const { instagram, igstory } = require('../lib/functions');
const axios = require('axios');
const emojiUnicode = require('emoji-unicode');
const base64 = require('base64topdf');
const mess = {
  wait: 'Silakan tunggu sebentar.',
};

bot.on(['/start', '/hello'], (msg) => {
  msg.reply.text(
    `Hai ${msg.chat.first_name}!✨
Saya adalah Aksa-BOT yang dibuat oleh t.me/bdrsmsdn untuk memenuhi salah satu Tugas Besar Mata Kuliah Aplikasi Teknologi Online. Saya dibuat menggunakan bahasa Node.js dengan bantuan framework dari Telebot. Saya memiliki banyak fitur seperti mengetahui ketinggian suatu daerah berdasar lokasi yang anda kirim, memberi tahu zona iklim dan tanaman apa yang cocok dibudayakan di lokasi tersebut, dll. API yang digunakan di bot ini antara lain:

1. https://core.telegram.org/api
2. https://api.open-elevation.com/api/v1/lookup
3. https://badra.my.id/api/agro
4. https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse
5. https://api-sekolah-indonesia.herokuapp.com/sekolah
6. https://api.vhtear.com

Ketik /help untuk melihat menu.`,
    { asReply: true }
  );
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/start`), 'from', color(`${msg.chat.first_name}`));
});

// bot.on('text', (msg) => {
//   msg.reply.text(`${msg.text} ${msg.chat.first_name}`);
// });

bot.on(['/help', '/menu'], (msg) => {
  msg.reply.text(`Halo, silakan ketik /sekolah atau /agro untuk memulai. BTW kita punya fitur downloader juga ko, langsung saja ketik /downloader yaa.`, { asReply: true });
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/help`), 'from', color(`${msg.chat.first_name}`));
});

bot.on('/downloader', (msg) => {
  msg.reply.text(
    `Halo, berikut adalah list menu downloader:
1. /ig link
2. /igstory username
3. /tiktok link`,
    { asReply: true }
  );
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/downloader`), 'from', color(`${msg.chat.first_name}`));
});

// bot.on('photo', (msg) => {
//   let str = base64.base64ToStr(msg.type.photo);
//   console.log(str);
// });

bot.on('/agro', (msg) => {
  msg.reply.text('Hai silakan kirim lokasi ya!', { asReply: true });
  while (
    bot.on('location', (msg) => {
      const chatId = msg.chat.id;
      var location = msg.location;
      console.log(`${location.latitude},${location.longitude}`);
      axios
        .get(`https://api.open-elevation.com/api/v1/lookup?locations=${location.latitude},${location.longitude}`)
        .then(function (response) {
          let res = response.data.results[0];
          var optio = {
            method: 'GET',
            url: `https://badra.my.id/api/agro?alt=${res.elevation}`,
          };
          axios
            .request(optio)
            .then(function (respons) {
              let resw = respons.data.results;
              let xi = `Anda berada pada ketinggian: ${res.elevation} mdpl, ${resw.zone}
  
${resw.description}
${resw.plant}
  `;
              bot.sendMessage(chatId, `${xi}`, { asReply: true });
            })
            .catch(function (error) {
              bot.sendMessage(chatId, `Terjadi kesalahan di API 2!`, { asReply: true });
            });
        })
        .catch(function (error) {
          bot.sendMessage(chatId, `Terjadi kesalahan di API Geocode!`, { asReply: true });
        });
      return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/agro`), 'from', color(`${msg.chat.first_name}`));
    })
  );
});

bot.on('/sekolah', (msg) => {
  msg.reply.text('Hai silakan kirim lokasi ya!', { asReply: true });
  while (
    bot.on('location', (msg) => {
      const chatId = msg.chat.id;
      var location = msg.location;
      console.log(`${location.latitude},${location.longitude}`);
      var options = {
        method: 'GET',
        url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse',
        params: {
          lat: `${location.latitude}`,
          lon: `${location.longitude}`,
          'accept-language': 'en',
          polygon_threshold: '0.0',
        },
        headers: {
          'x-rapidapi-key': '33cddd5088msh54605b0ab723661p1863b7jsn4a751612ee44',
          'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com',
        },
      };
      axios
        .request(options)
        .then(function (response) {
          let res = response.data.address;
          var optio = {
            method: 'GET',
            url: `https://api-sekolah-indonesia.herokuapp.com/sekolah/s?sekolah=${res.village}`,
          };
          axios
            .request(optio)
            .then(function (response) {
              let xi = `Informasi sekolah di sekitar lokasi ${res.village}\n\n`;
              let resw = response.data;
              let resq = resw.dataSekolah;
              for (let i = 1; i < resq.length; i++) {
                xi += `${i}. Nama sekolah: ${resq[i].sekolah}
  Status: ${resq[i].bentuk}${resq[i].status}
  Alamat: ${resq[i].alamat_jalan}
  NPSN: ${resq[i].npsn}
  Maps: https://www.google.co.id/maps/@${resq[i].lintang},${resq[i].bujur}
  \n========================\n`;
              }
              bot.sendMessage(chatId, `${xi}`, { asReply: true });
            })
            .catch(function (error) {
              bot.sendMessage(chatId, `Terjadi kesalahan di API Sekolah!`, { asReply: true });
            });
        })
        .catch(function (error) {
          bot.sendMessage(chatId, `Terjadi kesalahan di API Geocode!`, { asReply: true });
        });
      return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/sekolah`), 'from', color(`${msg.chat.first_name}`));
    })
  );
});

bot.on(/^\/tiktok (.+)$/, (msg, link) => {
  const chatId = msg.chat.id;
  const uri = link.match[1];
  msg.reply.text(mess.wait, { asReply: true });
  axios
    .get(`https://api.vhtear.com/tiktok_no_wm?link=${uri}&apikey=` + apikey)
    .then((response) => {
      return bot.sendVideo(chatId, response.data.result.video);
    })
    .catch((error) => {
      console.log(error);
      const errorText = `Error! ` + error;
      bot.sendMessage(chatId, errorText, { parse_mode: 'HTML' });
    });
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/tiktok`), 'from', color(`${msg.chat.first_name}`));
});

bot.on(/^\/ig (.+)$/, (msg, link) => {
  const chatId = msg.chat.id;
  const uri = link.match[1];
  msg.reply.text(mess.wait, { asReply: true });
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
      bot.sendMessage(chatId, 'Error!' + err);
    });
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/ig`), 'from', color(`${msg.chat.first_name}`));
});

bot.on(/^\/igstory (.+)$/, (msg, link) => {
  const chatId = msg.chat.id;
  const uri = link.match[1];
  msg.reply.text(mess.wait, { asReply: true });
  igstory(uri)
    .then(async (res) => {
      for (let i = 0; i < res.itemlist.length; i++) {
        if (res.itemlist[i].type == 'image') {
          bot.sendPhoto(chatId, res.itemlist[i].urlDownload);
        } else if (res.itemlist[i].type == 'video') {
          bot.sendMessage(chatId, res.itemlist[i].urlDownload);
        }
      }
    })
    .catch((err) => {
      console.log(err);
      bot.reply(chatId, 'Error!' + err);
    });
  return console.log(color('[EXEC]'), color(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('id'), 'yellow'), color(`/igstory`), 'from', color(`${msg.chat.first_name}`));
});

bot.on(/^\/say (.+)$/, (msg, props) => {
  const text = props.match[1];
  return bot.sendMessage(msg.from.id, text, { replyToMessage: msg.message_id });
});

bot.start();
