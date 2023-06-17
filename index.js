const TelegramBot = require("node-telegram-bot-api");
const dotnev = require("dotenv");
dotnev.config();

const bot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});
console.log("Online");

bot.onText(/\/echotext/, async (msg) => {
  const chatId = msg.chat.id;
  const messgeId = msg.message_id;
  const userId = msg.from.id;

  if (msg.chat.type === "private") {
    bot.sendMessage(chatId, "Cant use this command in a PM", {
      reply_to_message_id: messgeId,
    });
  } else {
    bot.getChatMember(chatId, userId).then(async (chatMember) => {
      const isAdmin = ["creator", "administrator"].includes(chatMember.status);
      if (!isAdmin) {
        bot.sendMessage(
          chatId,
          "You are not an admin!\n Please refrain from using this command"
        );
      } else {
        const textq = await bot.sendMessage(
          msg.chat.id,
          "Please enter the text that I need to repeat!",
          {
            reply_markup: {
              force_reply: true,
            },
          }
        );
        bot.onReplyToMessage(chatId, textq.message_id, async (reply) => {
          if (reply.from.id === userId) {
            const text = reply.text;
            const timeq = await bot.sendMessage(
              chatId,
              "Ok cool now specify the duration in minutes",
              {
                reply_markup: {
                  force_reply: true,
                },
              }
            );
            bot.onReplyToMessage(chatId, timeq.message_id, async (rep) => {
              if (rep.from.id === userId) {
                const time = rep.text;
                bot.sendMessage(chatId, "Done! and Dusted!");

                setInterval(() => {
                  bot.sendMessage(chatId, text);
                }, time * 60000);
              }
            });
          }
        });
      }
    });
  }
});
