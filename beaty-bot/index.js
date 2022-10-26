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
const {
  createIfNotExist,
  getList,
  getUserRole,
} = require("./services/userService");
const categories = require("./categories/categories");
const cities = require("./cities/cities");
const { categoriesButtons } = require("./buttons/buttons");
const { citiesButtons } = require("./buttons/buttons");
console.log(categoriesButtons);
app.use(cors());

app.use("/scenes", express.static("scenes"));
const masterScene = require("./scenes/master");
const { remove } = require("./models/UserModel");
const { startMain } = require("./main-menu/mainManu");
mongoose
  .connect(
    "mongodb+srv://tataryn:Aa527465182@cluster0.pn7og9i.mongodb.net/beauty?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB is ok"))
  .catch((error) => console.log("Error", error));

const stage = new Scenes.Stage([masterScene]);
bot.use(session());
bot.use(stage.middleware());
bot.hears("✂ Я майстер", (ctx) => {
  ctx.scene.enter("masterWizard");
});

// const axios = require("axios");
// const path = require("path");

// const message = ctx.message.id;
const subCategories = [
  { face: [{ text: "Комбінована чистка обличчя", data: "Face clean" }] },
  {
    skin: [
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
      { text: "Атравматична чистка обличчя", data: "Atraumtic face clean" },
    ],
  },
];

// const faceKeyboard = Keyboard.make([
// //   subCategories.forEach((item) => {
// //     return [`${item.text}`, `${item.text}`];
// //   }),
// for (let i = 0; i < subCategories.length; i++) {
//     const element = subCategories[i];

// }

//     [("Button 1", "Button 2")], // First row
//     ["Button 3", "Button 4"], // Second row
// ]);
const key = subCategories.map((item) => {
  return [Markup.button.callback(`${item.text}`, `${item.data}`)];
});

// bot.action(`${categoriesData}`, (ctx) => {
//   ctx.reply("Hair");
// });
bot.start(async (ctx) => {
  const user = ctx.message.from;
  createIfNotExist(user);

  getUserRole(user).then((res) => {
    if (res.userRole === "user") {
      bot.telegram.sendMessage(
        ctx.chat.id,
        `Привіт ${ctx.message.from.username} 
Бот салонів краси бла бла бла `,
        {
          reply_markup: {
            keyboard: [
              [{ text: `✂ Я майстер` }, { text: `👩 Я клієнт` }],
              //   [{ text: `Збір коштів на допомогу армії` }],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    bot.telegram.sendMessage(
      ctx.chat.id,
      `Привіт ${ctx.message.from.username} 
Бот салонів краси бла бла бла `,
      {
        reply_markup: {
          keyboard: [
            [{ text: `✂ Я майстер` }, { text: `👩 Я клієнт` }],
            [{ text: `⚙ Особистий кабінет` }],
            //   [{ text: `Збір коштів на допомогу армії` }],
          ],
          resize_keyboard: true,
        },
      }
    );
  });
});

bot.command("/start", (ctx) => {
  const user = ctx.message.from;

  // createIfNotExist(user);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Привіт ${ctx.message.from.username} 
Бот салонів краси бла бла бла `,
    {
      reply_markup: {
        keyboard: [
          [{ text: `✂ ✂ Я майстер` }, { text: `👩 Я клієнт` }],
          [{ text: `⚙ Особистий кабінет` }],
          //   [{ text: `Збір коштів на допомогу армії` }],
        ],
        resize_keyboard: true,
      },
    }
  );
});
// bot.on("ok", (ctx) => ctx.reply("OK"));
function master(ctx) {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Привіт ${ctx.message.from.username}.
Обери,ти Обама чи Ні ?`,
    {
      reply_markup: {
        keyboard: [[{ text: `Зареєструватись` }]],
        resize_keyboard: true,
      },
    }
  );
}
// function client(ctx) {
//   const fetch = {
//     userService: "",
//     userCity: "",
//   };

//   bot.telegram.sendMessage(
//     ctx.chat.id,
//     `Привіт ${ctx.message.from.username}
//         цей телеграм бот показує статистику втрат рашистів`,
//     {
//       reply_markup: {
//         keyboard: [
//           [{ text: "Перукарські послуги" }, { text: "Татуаж" }],
//           [{ text: "Оформлення брів та вій" }, { text: "Макіяж" }],
//           [{ text: "Масаж і SPA" }, { text: "Корекція фігури" }],
//           [{ text: "Догляд за шкірою тіла" }, { text: "Видалення волосся" }],
//           [{ text: "Тату та пірсинг" }, { text: "Фарбування волосся" }],
//           [
//             { text: "Стрижка та укладка волосся" },
//             { text: "Виправлення,завивка та нарощування" },
//           ],
//           [
//             { text: "Реконструкція та догляд" },
//             { text: "Догляд за нігтями рук" },
//           ],
//           [{ text: "Догляд за ногами", data: "Sorry" }],
//           [
//             {
//               text: "Повернутись в головне меню",
//               callback_data: "back-client",
//             },
//           ],
//         ],
//         resize_keyboard: true,
//       },
//     }
//   );
//   bot.hears("Перукарські послуги", (ctx) => {
//     const text = ctx.update.message.text;
//     fetch.userService = text;
//     console.log("22222222222222222222", fetch);
//     ctx.replyWithHTML("Оберіть місто", {
//       reply_markup: {
//         keyboard: [
//           [{ text: `Львів` }, { text: `👩 Я клієнт` }],
//           [{ text: `⚙ Особистий кабінет` }],
//           //   [{ text: `Збір коштів на допомогу армії` }],
//         ],
//         resize_keyboard: true,
//       },
//     });
//   });
//   bot.hears("Львів", (ctx) => {
//     const text = ctx.update.message.text;
//     fetch.userCity = text;

//     const array = [];
//     getList(fetch).then((res) => {
//       console.log(res);
//       res.map((item) => {
//         // ctx.replyWithPhoto({ url: `${item.userPhoto}` });
//         // ctx.reply(`${item.userId}`);
//         console.log(item.userPhoto);
//         // bot.telegram.sendPhoto(ctx.from.id, `${item.userPhoto}`, {
//         //   caption: `${item.userService}`,
//         // });
//       });
//     });
//   });

//   // bot.telegram.sendMessage(ctx.chat.id, "12311321", (ctx) => {
//   //   const text = ctx.update.message.text;
//   //   fetch.userCity = text;
//   //   console.log("------------------------", fetch);

//   //   getList(fetch);
//   //   console.log(getList);
//   // });
//   // bot.telegram.sendMessage(
//   //   ctx.chat.id,
//   //   `Привіт ${ctx.message.from.username}
//   //     цей телеграм бот показує статистику втрат рашистів`,
//   //   {
//   //     reply_markup: {
//   //       keyboard: [
//   //         [{ text: "CERFFF" }, { text: "Татуаж" }],
//   //         [{ text: "Оформлення брів та вій" }, { text: "Макіяж" }],
//   //         [{ text: "Масаж і SPA" }, { text: "Корекція фігури" }],
//   //         [
//   //           { text: "Догляд за шкірою тіла" },
//   //           { text: "Видалення волосся" },
//   //         ],
//   //         [{ text: "Тату та пірсинг" }, { text: "Фарбування волосся" }],
//   //         [
//   //           { text: "Стрижка та укладка волосся" },
//   //           { text: "Виправлення,завивка та нарощування" },
//   //         ],
//   //         [
//   //           { text: "Реконструкція та догляд" },
//   //           { text: "Догляд за нігтями рук" },
//   //         ],
//   //         [{ text: "Догляд за ногами", data: "Sorry" }],
//   //         [
//   //           {
//   //             text: "Повернутись в головне меню",
//   //             callback_data: "back-client",
//   //           },
//   //         ],
//   //       ],
//   //       resize_keyboard: true,
//   //     },
//   //   }
//   // )
// }

// function goBack(ctx) {}
// // bot.hears("✂ Я майстер", (ctx) => {
// //   const messageId = ctx.update.message.message_id;
// //   master(ctx);
// //   ctx.deleteMessage(messageId);
// // });
// // bot.hears("👩 Я клієнт", (ctx) => {
// //   client(ctx);
// //   console.log(ctx);
// //   ctx.deleteMessage(ctx.chat.id, message);
// // });

const mapCategories = subCategories.map((x) => [
  { text: x.text },
  { data: x.data },
]);

bot.hears("я", async (ctx) => {
  try {
    await ctx.replyWithMarkdownV2(
      "Оберіть категорію",
      Markup.inlineKeyboard(
        key
        // Markup.button.callback("Coke", "Coke"),
        // Markup.button.callback("Dr Pepper", "Dr Pepper"),
        // Markup.button.callback("Pepsi", "Pepsi"),
      )

      // Markup.button.callback('USDT / EUR', 'EURUSDT')
    );
  } catch (er) {
    console.log(er);
  }
});
bot.hears("q", async (ctx) => {
  try {
    await ctx.replyWithMarkdownV2(
      "Оберіть категорію",
      Markup.inlineKeyboard([
        Markup.button.callback("Coke", "Sorry"),
        Markup.button.callback("Dr Pepper", "Help"),
        Markup.button.callback("Pepsi", "Pepsi"),
      ])

      // Markup.button.callback('USDT / EUR', 'EURUSDT')
    );
  } catch (er) {
    console.log(er);
  }
});

bot.action("Face clean", (ctx) => ctx.reply("Face clean"));
bot.action("Atraumtic face clean", (ctx) => ctx.reply("Atraumtic face clean"));
const act = ["Sorry", "Help"];
const act1 = act.map((item) => item);
bot.action(act1, (ctx) => {
  ctx.reply("Face");
});
const arr = [
  {
    face: "Косметологія обличчя",
  },
  {
    face: "Косметологія лиця",
  },
];

// FILE UPLOADS

// bot.on("message", async (ctx) => {
//   const fileId = ctx.update.message.photo.pop().file_id;
//   const dir = `${__dirname}/public/images/${ctx.update.message.from.id}`;
//   ctx.telegram.getFileLink(fileId).then((url) => {
//     axios({ url, responseType: "stream" }).then((response) => {
//       return new Promise((resolve, reject) => {
//         if (!fs.existsSync(dir)) {
//           fs.mkdirSync(dir);
//         }
//         response.data
//           .pipe(
//             fs.createWriteStream(`${dir}/${ctx.update.message.from.id}.jpg`)
//           )
//           .on("finish", () => console.log(this))
//           .on("error", (e) => console.log(e));
//       });
//     });
//   });
//   console.log("1");
// });
// bot.hears("h1", (ctx) => ctx.reply("x"));
// bot.on("text", (ctx) => {
//   const text = ctx.message.text;
//   console.log(text);
// });
// bot.on("document", async (ctx) => {
//   const fileURL = await bot.getFileLink(data.document.file_id);
//   //   console.log(fileURL);
//   needle.get(
//     `https://api.telegram.org/${process.env.BOT_TOKEN}/getFile?file_id=${picture}`,
//     function (error, response) {
//       if (!error && response.statusCode == 200)
//         console.log(response.body.result);
//     }
//   );
// });
const clientData = {
  userCity: "",
  userService: "",
};
bot.hears("👩 Я клієнт", async (ctx) => {
  const text = ctx.message.text;
  console.log(text);
  ctx.replyWithHTML("Категорії", {
    reply_markup: {
      keyboard: categoriesButtons,
      resize_keyboard: true,
    },
  });
});
for (let i = 0; i < categories.length; i++) {
  const el = categories[i].text;
  bot.hears(el, (ctx) => {
    const text = ctx.message.text;
    clientData.userService = text;
    console.log(clientData);
    ctx.replyWithHTML("Оберіть місто", {
      reply_markup: {
        keyboard: citiesButtons,
        resize_keyboard: true,
      },
    });
  });
}
let dataData = [];
let start = 0;
let end = 10;
for (let i = 0; i < cities.length; i++) {
  const el = cities[i].text;
  bot.hears(el, (ctx) => {
    const text = ctx.message.text;
    clientData.userCity = text;
    console.log(clientData);
    ctx.replyWithHTML("Ваші результати: ", {
      reply_markup: {
        keyboard: [
          [{ text: "Завантажити ще" }],
          [{ text: `✂ Я майстер` }, { text: `👩 Я клієнт` }],
          [{ text: `⚙ Особистий кабінет` }],
        ],
        resize_keyboard: true,
      },
    });

    getList(clientData).then((data) => {
      console.log(data);
      dataData.push(...data);
      if (data.length === 0) {
        ctx.reply("За вашим запитом нажаль ще немає активних анкет.");
      }
      data.slice(start, end).map((item) => {
        ctx.replyWithPhoto(
          {
            source: `./scenes/images/${item.userId}/${item.userId}.jpg`,
          },
          { caption: `${item.userFullName}` }
        );
      });
      console.log("Data-Data", dataData);
    });
  });
}

bot.hears("Завантажити ще", (ctx) => {
  console.log("start", start);
  console.log("end", end);
  dataData.slice(start + end, end + end).map((item) => {
    ctx.replyWithPhoto(
      {
        source: `./scenes/images/${item.userId}/${item.userId}.jpg`,
      },
      { caption: `${item.userFullName}` }
    );
  });
  console.log(dataData.slice(start + end, end + end).length);
  if (dataData.slice(start + end, end + end).length < end) {
    ctx.reply("На даний момент,більше немає активних оголошень 👀", {
      reply_markup: {
        keyboard: [
          [{ text: `✂ Я майстер` }, { text: `👩 Я клієнт` }],
          [{ text: `⚙ Особистий кабінет` }],
        ],
        resize_keyboard: true,
      },
    });
  }
});

// for (let i = 0; i < categories.length; i++) {
//   const el = categories[i].text;
//   console.log(el);
//   bot.hears(el, (ctx) => {
//     ctx.replyWithHTML("Оберіть місто", {
//       reply_markup: {
//         keyboard: [citiesButtons],
//         resize_keyboard: true,
//       },
//     });
//   });
// }
// bot.hears(
//   categories.map((item) => item.text),
//   (ctx) => {}
// );

// const userFetch = [];
// bot.hears("Львів", (ctx) => {
//   const text = ctx.update.message.text;
//   userFetch.push(...userFetch, text);
//   console.log(userFetch);
//   ctx.replyWithHTML("Оберіть категорію", {
//     reply_markup: {
//       keyboard: [
//         [{ text: `Візаж` }, { text: `Стрижки` }],
//         [{ text: `Тернопіль` }],
//         [{ text: `Івано-Франківськ` }],
//         [{ text: `Рівне` }],
//         // [{ text: `⚙ Особистий кабінет` }],
//         //   [{ text: `Збір коштів на допомогу армії` }],
//       ],
//       resize_keyboard: true,
//     },
//   });
// });
// bot.hears("Візаж", (ctx) => {
//   const text = ctx.update.message.text;
//   userFetch.push(...userFetch, text);
//   console.log(userFetch);
//   ctx.reply("Ось ваші категорії");
//   ctx.reply(`${userFetch[0]} - ${userFetch[1]}`);
// });
bot.hears("ВИЙТИ В ГОЛОВНЕ МЕНЮ", (ctx) => {
  ctx.reply("LOX");
  return ctx.scene.leave("super-wizard");
  return bot.start(async (ctx) => {
    const user = ctx.message.from;

    createIfNotExist(user);
    bot.telegram.sendMessage(
      ctx.chat.id,
      `Привіт ${ctx.message.from.username} 
  Бот салонів краси бла бла бла `,
      {
        reply_markup: {
          keyboard: [
            [{ text: `✂ Я майстер` }, { text: `👩 Я клієнт` }],
            [{ text: `⚙ Особистий кабінет` }],
            //   [{ text: `Збір коштів на допомогу армії` }],
          ],
          resize_keyboard: true,
        },
      }
    );
  });
});

const screenKeyboard = Markup.inlineKeyboard([
  Markup.button.callback("Yes", "Yes"),
  Markup.button.callback("No", "No"),
]);
bot.command("/leaveScene", (ctx) => {
  // ctx.deleteMessage(ctx.update.message.message_id);
  console.log(ctx.update.message.message_id + 1);
  ctx.reply("OK", screenKeyboard);

  bot.action("Yes", (ctx) => {
    // ctx.answerCbQuery("TАK BITCH", { cache_time: 7 });
    ctx.answerCbQuery();
    ctx.reply("You clicked yes Button");
  });
});
bot.on();
bot.launch();
app.listen(5000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server Ok`);
});
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
