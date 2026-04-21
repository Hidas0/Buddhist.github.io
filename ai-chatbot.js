// ========== OPENROUTER AI ЧАТ-БОТ (БЕСПЛАТНЫЕ МОДЕЛИ) ==========

const OPENROUTER_API_KEY = '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';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatSend = document.getElementById('chatSend');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

let isTyping = false;
let messageHistory = [];
const CHAT_STORAGE_KEY = 'dharmaAiChatMessages';
const HISTORY_STORAGE_KEY = 'dharmaAiMessageHistory';

// АКТУАЛЬНЫЕ БЕСПЛАТНЫЕ МОДЕЛИ (из официальной коллекции OpenRouter)
const FREE_MODELS = [
    'openrouter/free',  // АВТОМАТИЧЕСКИЙ ВЫБОР ЛУЧШЕЙ БЕСПЛАТНОЙ МОДЕЛИ
    'nvidia/nemotron-3-super:free',
    'arcee-ai/trinity-large-preview:free',
    'z-ai/glm-4.5-air:free',
    'nvidia/nemotron-3-nano-30b-a3b:free',
    'arcee-ai/trinity-mini:free',
    'minimax/minimax-m2.5:free',
    'qwen/qwen3-coder-480b-a35b-instruct:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
    'openai/gpt-oss-120b:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'openai/gpt-oss-20b:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'liquid/lfm2.5-1.2b-thinking:free'
];

async function sendMessage() {
    const question = chatInput.value.trim();
    if (!question || isTyping) return;
    
    addMessage(question, 'user');
    chatInput.value = '';
    messageHistory.push({ role: 'user', content: question });
    saveChatState();
    showTypingIndicator();
    
    try {
        let reply = null;
        
        // Пробуем каждую модель по очереди
        for (const model of FREE_MODELS) {
            try {
                console.log(`Пробуем модель: ${model}`);
                
                const response = await fetch(OPENROUTER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'Put Dharamy'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: 'system',
                                content: `Ты — буддийский наставник и учитель Дхармы. 
                                Отвечай мудро, спокойно, на русском языке.
                                Будь добрым и сострадательным.
                                Используй эмодзи для украшения ответов.
                                
                                Ты знаешь о буддизме, медитации, Четырех Благородных Истинах, 
                                Восьмеричном Пути, мантрах, традициях Калмыкии, 
                                праздниках Зул и Цаган Сар, калмыцком чае Джомба,
                                карме, перерождении, Будде Шакьямуни и Далай-ламе.`
                            },
                            ...messageHistory.slice(-5)
                        ],
                        temperature: 0.7,
                        max_tokens: 2600
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        reply = data.choices[0].message.content;
                        console.log(`✅ Модель ${model} успешно ответила!`);
                        break;
                    }
                } else {
                    const errorData = await response.json();
                    console.log(`Модель ${model} ошибка ${response.status}:`, errorData.error?.message || 'Неизвестная ошибка');
                    
                    // Если ошибка 429 (превышен лимит), пробуем следующую модель
                    if (response.status === 429) {
                        console.log(`Модель ${model} превысила лимит, пробуем следующую...`);
                        continue;
                    }
                }
            } catch (e) {
                console.log(`Модель ${model} ошибка:`, e.message);
            }
        }
        
        removeTypingIndicator();
        
        if (reply) {
            addMessage(reply, 'bot');
            messageHistory.push({ role: 'assistant', content: reply });
            saveChatState();
        } else {
            // Если ни одна модель не сработала, используем локальный ответ
            const localAnswer = getLocalAnswer(question);
            addMessage(localAnswer, 'bot');
            messageHistory.push({ role: 'assistant', content: localAnswer });
            saveChatState();
        }
        
        if (messageHistory.length > 20) messageHistory = messageHistory.slice(-20);
        
    } catch (error) {
        console.error('Ошибка:', error);
        removeTypingIndicator();
        const localAnswer = getLocalAnswer(question);
        addMessage(localAnswer, 'bot');
        messageHistory.push({ role: 'assistant', content: localAnswer });
        saveChatState();
    }
}

// Локальная база знаний (на случай если API недоступен)
function getLocalAnswer(question) {
    const q = question.toLowerCase();
    
    if (q.includes('четыре благородные истины') || (q.includes('четыре') && q.includes('истины'))) {
        return `🪷 **Четыре Благородные Истины** — основа учения Будды:

1️⃣ **Страдание существует** — жизнь несовершенна, есть болезни, старость, смерть, разлука с приятным.

2️⃣ **У страдания есть причина** — желания, привязанности и неведение.

3️⃣ **Страдание можно прекратить** — достичь Ниббаны, освобождения.

4️⃣ **Есть путь к прекращению** — Восьмеричный Путь.`;
    }
    
    if (q.includes('восьмеричный путь') || q.includes('8 путь')) {
        return `🛤️ **Благородный Восьмеричный Путь:**

**Мудрость:** Правильные взгляды и намерение
**Нравственность:** Правильная речь, действие, образ жизни
**Сосредоточение:** Правильное усилие, осознанность, сосредоточение`;
    }
    
    if (q.includes('медитац') || q.includes('медитировать')) {
        return `🧘‍♂️ **Как начать медитировать:**

1. Сядьте удобно, спина прямая
2. Сосредоточьтесь на дыхании
3. Наблюдайте мысли, не вовлекаясь
4. Начните с 5-10 минут ежедневно

✨ *Регулярность важнее длительности!*`;
    }
    
    if (q.includes('калмык') || q.includes('калмыкия')) {
        return `🏔️ **Традиции Калмыкии:**

**Праздники:** Зул (Новый год), Цаган Сар (Белый месяц), Ур Сар
**Традиции:** Джомба (чай с молоком и солью), вращение кюрде, подношение хадака

Калмыкия — единственный буддийский регион Европы!`;
    }
    
    if (q.includes('ом мани') || q.includes('мантр')) {
        return `🕉️ **Мантра «Ом Мани Падме Хум»**

- **Ом** — тело, речь, ум
- **Мани** — драгоценность (сострадание)
- **Padme** — лотос (мудрость)
- **Хум** — единство метода и мудрости

*Мантра развивает сострадание и очищает ум.*`;
    }
    
    if (q.includes('привет') || q.includes('здравствуй')) {
        return `🙏 **Здравствуйте!**

Я буддийский наставник. Могу рассказать о:
• Четырех Благородных Истинах
• Восьмеричном Пути
• Медитации
• Мантрах
• Традициях Калмыкии
• Карме и перерождении

Задавайте любой вопрос! 🪷`;
    }
    
    return `🌿 **О буддизме:**

Буддизм — путь к освобождению от страданий.

**Спросите меня о:**
• Четырех Благородных Истинах
• Восьмеричном Пути
• Медитации
• Мантрах
• Калмыкии
• Карме
• Далай-ламе

Задайте конкретный вопрос! 🙏`;
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `<div class="message-content">${formattedText}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveChatState() {
    try {
        const domMessages = Array.from(chatMessages.querySelectorAll('.message:not(.typing-indicator)')).map((item) => {
            const sender = item.classList.contains('user') ? 'user' : 'bot';
            const content = item.querySelector('.message-content')?.innerText?.trim() || '';
            return { sender, content };
        }).filter((item) => item.content);

        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(domMessages));
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messageHistory.slice(-20)));
    } catch (error) {
        console.warn('Не удалось сохранить историю чата:', error);
    }
}

function restoreChatState() {
    try {
        const savedMessagesRaw = localStorage.getItem(CHAT_STORAGE_KEY);
        const savedHistoryRaw = localStorage.getItem(HISTORY_STORAGE_KEY);

        if (savedHistoryRaw) {
            const parsedHistory = JSON.parse(savedHistoryRaw);
            if (Array.isArray(parsedHistory)) {
                messageHistory = parsedHistory.slice(-20);
            }
        }

        if (!savedMessagesRaw) return;
        const savedMessages = JSON.parse(savedMessagesRaw);
        if (!Array.isArray(savedMessages) || savedMessages.length === 0) return;

        chatMessages.innerHTML = '';
        savedMessages.forEach((msg) => {
            if (msg && typeof msg.content === 'string' && (msg.sender === 'user' || msg.sender === 'bot')) {
                addMessage(msg.content, msg.sender);
            }
        });
    } catch (error) {
        console.warn('Не удалось восстановить историю чата:', error);
    }
}

function initChatIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function showTypingIndicator() {
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    isTyping = false;
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

restoreChatState();
initChatIcons();

console.log('✅ AI чат-бот загружен (бесплатные модели OpenRouter)');