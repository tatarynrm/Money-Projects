const { Telegraf, Markup, Composer, Scenes } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

const { startMain } = require("../main-menu/mainManu");
const { masterCreate } = require("../services/userService");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const yesUndefined = (name) => (typeof name === "undefined" ? "" : name);
const categories = require("../categories/categories");
// console.log(categories);
const category = categories.map((item) => {
  return [Markup.button.callback(`${item.title}`, `${item.data}`)];
});

const startStep = new Composer();
startStep.on("text", async (ctx) => {
  console.log(masterCreate);
  startMain(bot);
  try {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.userName = ctx.message.from.username;
    ctx.wizard.state.data.firstName = ctx.message.from.first_name;
    ctx.wizard.state.data.lastName = ctx.message.from.last_name;
    await ctx.replyWithHTML("Заповніть вашу заявку", {
      reply_markup: { remove_keyboard: true },
    });
    await ctx.replyWithHTML(
      `<b>Вкажіть ваше прізвище та ім'я:</b>
<i>У форматі: ' Іванов Юрій '</i>`
    );
    return ctx.wizard.next();
  } catch (er) {
    console.log(er);
  }
});

const nameStep = new Composer();
nameStep.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data.value1 = ctx.message.text;
    await ctx.replyWithHTML(
      `<b>Вкажіть ваш номер телефону:</b>
<i>У форматі: ' +380ХХХХХХХ '</i>`
    );
    return ctx.wizard.next();
  } catch (er) {
    console.log(er);
  }
});
const cityStep = new Composer();
cityStep.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data.value2 = ctx.message.text;
    await ctx.replyWithHTML(
      `<b>Вкажіть ваше місто:</b>
<i>У форматі: ' Львів '</i>`
    );
    return ctx.wizard.next();
  } catch (er) {
    console.log(er);
  }
});
const categoryStep = new Composer();
categoryStep.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data.value3 = ctx.message.text;
    await ctx.replyWithHTML(
      `<b>Вкажіть вид ваших послуг:</b>`,
      // Markup.inlineKeyboard(category)
      {
        reply_markup: {
          keyboard: [...category],
          resize_keyboard: true,
        },
      }
    );

    return ctx.wizard.next();
  } catch (er) {
    console.log(er);
  }
});
// const actions = categories.map((item) => item.data);
const prePhotoStep = new Composer();
prePhotoStep.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data.value4 = ctx.message.text;
    await ctx.replyWithHTML(`<b>Завантажте лише 1 фото:</b>`, {
      reply_markup: { remove_keyboard: true },
    });

    return ctx.wizard.next();
  } catch (er) {
    console.log(er);
  }
});

const photoStep = new Composer();
photoStep.on("message", async (ctx) => {
  console.log(ctx);
  try {
    if (
      // ctx.update.message.video ||
      // ctx.update.message.text ||
      // ctx.update.message.animation
      !ctx.update.message.photo
    ) {
      ctx.reply("Завантажуйте лише ФОТО у форматі .jpeg / .png ");
      return prePhotoStep.on("text", async (ctx) => {
        try {
          ctx.wizard.state.data.lol = ctx.message.text;
          await ctx.replyWithHTML(`<b>Завантажте фото:</b>`, {
            reply_markup: { remove_keyboard: true },
          });
        } catch (er) {
          console.log(er);
        }
      });
    }
    // ctx.wizard.state.data.value5 = ctx.message.text; -- фотка
    ctx.wizard.state.data.value5 = `http://localhost:5000/scenes/images/${ctx.update.message.from.id}/${ctx.update.message.from.id}.jpg`;
    ctx.reply("Вільний час ?");
    console.log(ctx.update.message);
    const fileId = ctx.update.message.photo.pop().file_id;
    // const fileId = ctx.update.message.photo.file_id;
    console.log(fileId);
    const dir = `${__dirname}/images/${ctx.update.message.from.id}`;
    ctx.telegram.getFileLink(fileId).then((url) => {
      axios({ url, responseType: "stream" }).then((response) => {
        return new Promise((resolve, reject) => {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          response.data
            .pipe(
              fs.createWriteStream(`${dir}/${ctx.update.message.from.id}.jpg`)
            )
            .on("finish", () => console.log(this))
            .on("error", (e) => console.log(e));
        });
      });
    });
    return ctx.wizard.next();
  } catch (er) {
    console.log(er);
  }
});
const conditionStep = new Composer();
conditionStep.on("text", async (ctx) => {
  const user = ctx.message.from;
  // const values = "master";
  // masterCreate(user, values);
  try {
    ctx.wizard.state.data.value6 = ctx.message.text;
    const wizardData = ctx.wizard.state.data;
    console.log(wizardData);
    // await ctx.replyWithHTML(`<b>${wizardData.title}</b> \n${wizardData.city}`);
    await ctx.replyWithPhoto({ url: `${wizardData.value5}` });
    await ctx.replyWithHTML(
      `<b>${wizardData.value1}</b> \n${wizardData.value2}\n${wizardData.value3}\n${wizardData.value4}\n${wizardData.value6}`
    );
    wizardData.role = "master";
    masterCreate(user, wizardData);
    await ctx.replyWithHTML(
      "Ваша анкета заповнена!Після модерації,-анкета буде доступна для клієнтів.",
      {
        reply_markup: { remove_keyboard: true },
      }
    );
    await ctx.reply("Головне меню", {
      reply_markup: {
        keyboard: [[{ text: `✂ Я майстер` }, { text: `👩 Я клієнт` }]],
        resize_keyboard: true,
      },
    });
    return ctx.scene.leave();
  } catch (er) {
    console.log(er);
  }
});
const masterScene = new Scenes.WizardScene(
  "masterWizard",
  startStep,
  nameStep,
  cityStep,
  categoryStep,
  prePhotoStep,
  photoStep,
  conditionStep
);

module.exports = masterScene;
