import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

const allowedUserId = Number(process.env.ALLOWED_USER_ID);
const allowedChatId = Number(process.env.ALLOWED_CHAT_ID);

const tips = [
    // Загальні
    '💡 Думай, перш ніж діяти. Уникай хаотичних голосувань — це може зіграти на руку мафії.',
    '🟢 Будь активним, навіть як ти мирний — не мовчи, допомагай команді!',
    '👁️‍🗨️ Спостерігай за поведінкою гравців — нервозність або агресія можуть видати мафіозі.',
    // Слідчий
    '🕵️‍♂️ Слідчий: при перевірці мирного не розкривай його точну роль.',
    '🕵️‍♂️ Слідчий: якщо знайшов мафію — повідомляй сам, не через інших.',
    // Лікар
    '💉 Лікар: пріоритет — активні ролі, особливо Слідчий із пістолетом.',
    '💉 Лікар: не лікуй одного і того ж гравця постійно — це може грати проти вас.',
    // Волоцюга
    '🧥 Волоцюга: перед розкриттям інфи — переконайся, хто помер вночі.',
    // Повія
    '👠 Повія: якщо тебе вбили — обов’язково скажи, кого блокувала.',
    '👠 Повія: блокуй стратегічно, а не лише за інтуїцією.',
    // Журналістка
    '📰 Журналістка: уникай безглуздих перевірок — мисли стратегічно.',
    '📰 Журналістка: знайди надійного мирного для перевірок.',
    // Інше
    '🤐 Не розповідай публічно, хто до тебе приходив — це захищає активні ролі.',
    '💀 Якщо тебе вбили — залиш корисну інфу, але не викривай ролі.',
    '🌙 Немає вбивства вночі? Можливо, Лікар врятував або Повія заблокувала.',
    '🔄 Не зациклюйся на одній теорії — будь гнучким.',
    '🤝 Співпрацюй і координуйся з іншими — так ви переможете.',
    '🎲 Іноді ризик — це найкраща стратегія. Не бійся діяти!',
];

bot.on('text', (ctx) => {
    const message = ctx.message;
    const text = message.text.trim();

    const isFromAllowedUser = message.from.id === allowedUserId;
    const isInAllowedChat = message.chat.id === allowedChatId;
    const isStartCommand = text.startsWith('Гра розпочата!');
    const isTriggerCommand = text.startsWith('/start') || text.startsWith('/game');

    if (isTriggerCommand && isInAllowedChat) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        console.log(randomTip);
        ctx.reply("!" + randomTip);
    }
});

bot.launch();
console.log('Бот запущено ✅');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
