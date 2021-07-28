const chalk = require('chalk');
const moment = require('moment');

/**
 * Get text with color
 * @param  {String} text
 * @param  {String} color
 * @return  {String} Return text with color
 */
const color = (text, color) => {
  return !color ? chalk.blueBright(text) : chalk.keyword(color)(text);
};

module.exports = color;
