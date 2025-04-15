import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

const targetBotMention = 'mafiauabot'; // без @ для зручності порівняння

const tips = [
    '💡 Дійте обдумано. У перші дні гри утримайтесь від хаотичних голосувань. Рандомні рішення можуть призвести до загибелі мирного жителя або зробити вас легкою мішенню.',
    '🟢 Будьте активними. Навіть якщо вам випала мирна роль, не ігноруйте гру. Ваша відсутність послаблює команду і може призвести до програшу.',
    '🕵️ Якщо ви Слідчий. При перевірці мирного гравця повідомляйте лише про його "мирний" статус, не розкриваючи конкретну роль.',
    '🕵️ Якщо ви Слідчий. Слідкуйте за рахунком, тримайте під контролем кількість мафії. У критичних моментах дійте швидко й рішуче.',
    '🕵️ Якщо ви Слідчий. Та виявили мафіозі, краще повідомити про це самостійно, а не через інших гравців.',
    '💉 Якщо ви Лікар. Пріоритет у лікуванні — відкриті активні ролі, особливо ті, що надають критично важливу інформацію для міста.',
    '💉 Якщо ви Лікар. Та одночасно відкрилися Слідчий та Журналістка, обирайте для захисту Слідчого — наявність пістолету грає ключову роль.',
    '💉 Якщо ви Лікар. Уникайте постійного лікування одного гравця допоки не відкриті активні ролі — мафія може використати це для відволікання. (РИЗИКОВАНО!)',
    '🧥 Якщо ви Волоцюга. Та когось побачили в одного з гравців, перш ніж ділитися інформацією, переконайтесь, хто був УБИТИЙ ВНОЧІ.',
    '🧥 Якщо ви Волоцюга. У разі смерті Лікаря краще пропустити першу ніч з візитом до Слідчого, щоб спробувати прийти в наступну. (РИЗИКОВАНО!)',
    '👠 Якщо ви Повія. Та вас вбили, обов’язково повідомте, кого ви блокували під час гри, але уникайте розкриття активних мирних ролей.',
    '👠 Якщо ви Повія. Використовуйте свою здатність стратегічно — інколи краще заблокувати підозрілого гравця, ніж просто дотримуватися інтуїції.',
    '📰 Якщо ви Журналістка. Уникайте безглуздих перевірок. Пам\'ятайте: в грі є три сторони — мирні, мафія та нейтрали.',
    '📰 Якщо ви Журналістка. Використовуйте свої перевірки стратегічно — ваша інформація допоможе місту зрозуміти загальну картину.',
    '📰 Якщо ви Журналістка. Будьте уважні та знайдіть надійного мирного гравця, щоб робити з ним подальші перевірки.',
    '⚖️ Якщо ви Адвокат або Баламут. Пильно стежте за діями Слідчого. Його рішення часто формуються на основі реакцій інших гравців під час голосувань.',
    '🔪 Якщо ви Джек-Різник. Якщо вам вночі відомо, хто є Мафією або Доном, зосередьте пошуки Повії серед них — їй потрібно блокувати їм хід.',
    '🤐 Тримайте інформацію при собі. Якщо до вас прийшов Лікар, Слідчий або Повія, не повідомляйте про це публічно.',
    '💀 Використовуйте останнє слово. Якщо вас убили, залиште повідомлення з корисною інформацією про перевірених гравців.',
    '🌙 Якщо вночі не сталося вбивства, це може свідчити про кілька речей: мафія або маніяк пропустили хід, або Лікар вчасно вилікував жертву, або Повія заблокувала дію мафіозі.',
    '🧠 Якщо ви Мафія або Дон. Та вас перевірив Слідчий, дійте швидко й імпровізуйте, щоб ввести місто в оману.',
    '📚 Щаслива порада — читайте, грайте, навчайтесь. Досвід ваш найцінніший ресурс!'
];


let timeout: NodeJS.Timeout | null = null;
let remainingTime = 120 * 1000;
let startTime = Date.now();
let initiatorId: number | null = null;

const resetTimer = (ctx: any) => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    ctx.reply(`! ${randomTip}\n\n[Moonlight Escort Mafia](https://t.me/+JjjF-m8cPs1kNTUy) | [Bot](https://t.me/mlesmafia_bot)`, { parse_mode: 'Markdown', disable_web_page_preview: true});

    if (timeout) clearTimeout(timeout);
    timeout = null;
    remainingTime = 120 * 1000;
    initiatorId = null;
};

const launchTimer = async (ctx: any) => {
    if (timeout) {
        resetTimer(ctx);
        return;
    }

    initiatorId = ctx.from.id;
    startTime = Date.now();

    console.log('🔁 Очікуємо 2 хв... Напишіть "/extend @mafiagamebot" щоб подовжити.');

    timeout = setTimeout(() => {
        resetTimer(ctx);
    }, remainingTime);
};

const cancelTimer = () => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
        remainingTime = 120 * 1000;
        initiatorId = null;
        console.log('❌ Очікування скасовано.');
    } else {
        console.log('⚠️ Немає активного таймера.');
    }
};

const extractCommand = (text: string) => {
    const tokens = text.trim().split(/\s+/);
    const fullCommand = tokens[0].toLowerCase(); // наприклад, "/start@MafiaUaBot"
    const baseCommand = fullCommand.split('@')[0]; // "/start"
    const mention = fullCommand.includes('@') ? fullCommand.split('@')[1] : null;
    const value = parseInt(tokens[1]) || null;

    return { baseCommand, mention, value };
};


const isFromAllowedUser = async (ctx: any) => {
    const fromId = ctx.from.id;

    if (fromId === initiatorId) return true;

    const chatId = ctx.chat.id;
    try {
        const admins = await ctx.getChatAdministrators();
        return admins.some((admin: any) => admin.user.id === fromId);
    } catch (error) {
        console.log('⚠️ Не вдалося отримати список адміністраторів чату');
        return false;
    }
};

bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    const { baseCommand, mention, value } = extractCommand(text);

    // якщо згадка є — і вона НЕ @mafiagamebot → ігноруємо
    if (mention && mention.toLowerCase() !== targetBotMention) return;

    const allowed = await isFromAllowedUser(ctx);
    if (!allowed) {
        console.log(`🚫 Користувач ${ctx.from.username || ctx.from.id} не має прав`);
        return;
    }

    switch (baseCommand) {
        case '/start':
        case '/game':
            await launchTimer(ctx);
            break;

        case '/extend':
            if (!timeout) {
                console.log('⏱️ Немає активного таймера. Напишіть /start.');
                return;
            }

            const addTime = value ? value * 1000 : 30 * 1000;
            const elapsed = Date.now() - startTime;
            remainingTime = Math.max(0, remainingTime - elapsed + addTime);
            startTime = Date.now();

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                resetTimer(ctx);
            }, remainingTime);

            console.log(`⏳ Таймер подовжено. Нова затримка: ${Math.floor(remainingTime / 1000)} сек.`);
            break;

        case '/stop':
            cancelTimer();
            break;

        default:
            break;
    }
});
bot.launch();
console.log('✅ Бот запущено');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
