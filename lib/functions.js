const axios = require('axios');
const apikey = 'K2021fuckoff789';

const instagram = async (url) =>
  new Promise(async (resolve, reject) => {
    const api = 'https://api.vhtear.com/instadl?link=' + url + '&apikey=' + apikey;
    axios
      .get(api)
      .then(async (res) => {
        const st = res.data.result;
        if (st.status === false) {
          resolve(`Media Tidak Di Temukan`);
        } else {
          resolve(st);
        }
      })
      .catch((err) => {
        console.log(err);
        resolve(`Maaf, Server Sedang Error`);
      });
  });

const igstory = async (query) =>
  new Promise(async (resolve, reject) => {
    const api = 'https://api.vhtear.com/igstory?query=' + query + '&apikey=' + apikey;
    axios
      .get(api)
      .then(async (res) => {
        const sta = res.data.result.story;
        if (sta.status === false) {
          resolve(`Media Tidak Di Temukan`);
        } else {
          resolve(sta);
        }
      })
      .catch((err) => {
        console.log(err);
        resolve(`Maaf, Server Sedang Error`);
      });
  });

const tiktok = async (url) =>
  new Promise(async (resolve, reject) => {
    const api = 'https://api.vhtear.com/tiktok_no_wm?link=' + url + '&apikey=' + apikey;
    axios
      .get(api)
      .then(async (res) => {
        const st = res.data.result;
        if (st.status === false) {
          resolve(`Media Tidak Di Temukan`);
        } else {
          resolve(st);
        }
      })
      .catch((err) => {
        console.log(err);
        resolve(`Maaf, Server Sedang Error`);
      });
  });

module.exports = { instagram, igstory, tiktok };
