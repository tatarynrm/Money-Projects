require("dotenv").config();
const { Telegraf, Scenes, Markup, session } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const needle = require("needle");
const path = require("path");
const { Keyboard } = require("telegram-keyboard");
const { createIfNotExist } = require("./services/userService");

function client(ctx) {
  bot.telegram.sendMessage(ctx.chat.id, `Привіт ${ctx.message.from.username}`, {
    reply_markup: {
      keyboard: [
        [{ text: "Косметологія обличчя" }, { text: "Татуаж" }],
        [{ text: "Оформлення брів та вій" }, { text: "Макіяж" }],
        [{ text: "Масаж і SPA" }, { text: "Корекція фігури" }],
        [{ text: "Догляд за шкірою тіла" }, { text: "Видалення волосся" }],
        [{ text: "Тату та пірсинг" }, { text: "Фарбування волосся" }],
        [
          { text: "Стрижка та укладка волосся" },
          { text: "Виправлення,завивка та нарощування" },
        ],
        [
          { text: "Реконструкція та догляд" },
          { text: "Догляд за нігтями рук" },
        ],
        [{ text: "Догляд за ногами", data: "Sorry" }],
        [
          {
            text: "Повернутись в головне меню",
            callback_data: "back-client",
          },
        ],
      ],
      resize_keyboard: true,
    },
  });

  bot.hears(`${arr}`);
}
