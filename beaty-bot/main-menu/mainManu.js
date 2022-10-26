const startMain = (bot) => {
  bot.start(async (ctx) => {
    const user = ctx.message.from;

    bot.telegram.sendMessage(
      ctx.chat.id,
      `Привіт ${ctx.message.from.username} 
      Бот салонів краси бла бла бла `,
      {
        reply_markup: {
          keyboard: [
            [{ text: `✂ Я майстер` }, { text: `👩 Я клієнт` }],
            [{ text: `⚙ Особистий кабінет` }],
          ],
          resize_keyboard: true,
        },
      }
    );
  });
};
module.exports = {
  startMain,
};
