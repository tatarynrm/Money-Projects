const { Telegraf, Markup } = require("telegraf");
const categories = require("../categories/categories");
const cities = require("../cities/cities");

// export const categoriesButtons = categories.map((item) => {
//   return [{ text: item.text }];
// });
// export const citiesButtons = cities.map((item) => {
//   return [{ text: item.text }];
// });
module.exports = {
  categoriesButtons: categories.map((item) => {
    return [{ text: item.text }];
  }),
  citiesButtons: cities.map((item) => {
    return [{ text: item.text }];
  }),
  loadMore: (data) => {},
};
