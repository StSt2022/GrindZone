import React, { useState, useRef, useEffect } from 'react';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

const YOUR_SITE_CONTEXT_FOR_BACKEND = `
Інформація про Фітнес-Клуб "GRINDZONE":
- Назва: GRINDZONE
- Філософія: Результати не приходять випадково. Вони приходять до тих, хто grind-ить щодня.
- Адреса: місто Львів, вулиця Степана Бандери, недалеко від Національного університету «Львівська політехніка».
- Послуги: Сучасний тренажерний зал з преміум обладнанням, широкий спектр групових занять (високоінтенсивні інтервальні тренування (HIIT), силові класи, функціональний тренінг, стретчинг, йога), персональні тренування з елітними тренерами. Зони для кросфіту та важкої атлетики. Спортивний бар з протеїновими коктейлями та здоровими снеками.
- Сторінки сайту: Є сторінка профілю, де можна внести персональну інформацію, бачити статистику тренувань та ігровий процес, рівні на основі кількості тренувань та тривалості. Є сторінка активностей, де можна знайти тренувальні зони та обладнання яке є в них, можна знайти тренажери для кожної зони, є групові заняття з чіткою датою, тривалістю та тренером. Є на тій сторінці також розділ, де можна забронювати тренажер чи групове заняття. Є також додаткова інформація, що брати з собою в зал та правила. Є сторінка з їжею, де можна побачити різні страви за фільтрами, їхню калорійність, кількість білків, жирів та вуглеводів, складність приготування, час приготування та теги. Можна обрати розмір порції та період дня, в який користувач хоче спожити цю їжу. Відповідно до вибраного розміру порції, користувач отримає кількість калорій, білок, жирів та вуглеводів. Є сторінка спільноти, де можна публікувати пости із запитаннями, порадами чи досягненнями, додавати фото та відео, лайкати та коментувати інші пости, ділитися ними.
- Розклад: Актуальний розклад групових занять та тренажерів можна знайти на сторінці "Активності" нашого сайту. Клуб працює Пн-Пт: 06:00 - 23:00, Сб-Нд: 08:00 - 22:00.
- Ціни: Ми пропонуємо гнучкі тарифні плани та абонементи. Детальна інформація про ціни на абонементи, персональні тренування та спеціальні пропозиції є на рецепції у нашому клубі.
- Тренери: Наша команда "GRINDZONE ELITE TRAINERS" - це висококваліфіковані, сертифіковані фахівці, готові розробити індивідуальну програму для досягнення твоїх цілей. Ознайомитися із заняттями, які вони проводять, можна на сторінці "Активності". Ми не надаємо прямі контактні телефони тренерів, але ти можеш залишити заявку на тренування через рецепцію або сайт.
- Контакти: Телефон рецепції: +38 (067) 123-45-67. Email: contact@grindzone.ua.
- Правила асистента:
  - Ти – офіційний асистент GRINDZONE. Будь енергійним, веселим, мотивуючим та професійним, але не перестарайся, бо це буде надокучливо.
  - Використовуй стиль спілкування, що відповідає бренду GRINDZONE – впевнений, сфокусований на результаті. Можеш використовувати смайлики, але не багато, тільки коли це необхідно.
  - Відповідай на основі наданої інформації про GRINDZONE.
  - Якщо питання загального характеру (харчування, поради по тренуваннях, по досягненням та спільноті) і не потребує конфіденційної інформації, можеш дати вичерпну, науково обґрунтовану пораду.
  - Не дуже вигадуй інформацію, якої немає в контексті. Якщо не знаєш відповіді, але можеш відповісти приблизно на основі вже наявної інформації чи коли питання не потребує контексту, тоді відповідай, але якщо не знаєш, чесно скажи, що цю інформацію краще уточнити на рецепції або на відповідній сторінці сайту.
  - Завжди намагайся допомогти користувачеві знайти потрібну інформацію або послугу в GRINDZONE.
  - Уникай відповідей на теми, не пов'язані з фітнесом, здоров'ям, спортом або діяльністю GRINDZONE. Якщо користувач питає про щось інше, але це не містить забороненого контенту (сексуального, негативного, расизму, матів, дискримінації, інтимність, та іншого), можеж дати відповідь, але старайся з тої відповіді перевести на теми, що пов'язані з GRINDZONE.
  - Старайся заохотити користувача вибрати цей спортзал, коли він починає бути демотивований чи думати про інший спортзал чи сервіс.
`;

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: Date.now(), text: "Привіт! Я твій асистент GRINDZONE. Готовий допомогти досягти твоїх цілей.", sender: "bot" }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isTtsEnabled, setIsTtsEnabled] = useState(() => {
        const savedTtsPreference = localStorage.getItem('ttsEnabled');
        return savedTtsPreference !== null ? JSON.parse(savedTtsPreference) : true;
    });

    const messagesEndRef = useRef(null);
    const audioPlayerRef = useRef(new Audio());

    useEffect(() => {
        localStorage.setItem('ttsEnabled', JSON.stringify(isTtsEnabled));
        if (!isTtsEnabled) {
            stopAudio();
        }
    }, [isTtsEnabled]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            stopAudio();
        }
    };

    const toggleTts = () => {
        setIsTtsEnabled(prev => !prev);
    };

    const playAudio = (audioDataUri) => {
        if (isTtsEnabled && audioPlayerRef.current && audioDataUri) {
            stopAudio();
            audioPlayerRef.current.src = audioDataUri;
            audioPlayerRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
    };

    const stopAudio = () => {
        if (audioPlayerRef.current && !audioPlayerRef.current.paused) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedInput = inputText.trim();
        if (trimmedInput === "" || isLoading) return;

        const newUserMessage = { id: Date.now(), text: trimmedInput, sender: "user" };
        const currentMessages = [...messages, newUserMessage];
        setMessages(currentMessages);
        setInputText("");
        setIsLoading(true);
        stopAudio();

        try {
            const historyForAPI = currentMessages.slice(0, -1).map(msg => ({
                sender: msg.sender,
                text: msg.text
            }));

            const response = await fetch('https://grindzone.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userMessage: trimmedInput,
                    chatHistory: historyForAPI,
                    siteContext: YOUR_SITE_CONTEXT_FOR_BACKEND
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP помилка! Статус: ${response.status}`);
            }

            const data = await response.json();

            if (data.text) {
                const botMessage = { id: Date.now() + 1, text: data.text, sender: "bot" };
                setMessages(prevMessages => [...prevMessages, botMessage]);

                if (data.audioData && isTtsEnabled) {
                    playAudio(data.audioData);
                }
            } else {
                const errorMessage = { id: Date.now() + 1, text: "Вибач, не вдалося отримати змістовну відповідь.", sender: "bot" };
                setMessages(prevMessages => [...prevMessages, errorMessage]);
            }

        } catch (error) {
            console.error("Помилка в handleSendMessage:", error);
            const errorMessageText = error.message.includes("Failed to fetch")
                ? "Не вдалося з'єднатися з сервером. Перевір, чи він запущений, та налаштування CORS."
                : error.message.startsWith("HTTP помилка!") ? error.message : "Вибач, сталася помилка. Спробуй пізніше.";
            const errorMessage = { id: Date.now() + 1, text: errorMessageText, sender: "bot" };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white w-16 h-16 rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center text-3xl z-[999] transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-75"
                    aria-label="Відкрити чат"
                >
                    💬
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[calc(100vw-48px)] sm:w-[420px] h-[75vh] max-h-[600px] bg-[#140D23F8] rounded-2xl shadow-2xl shadow-purple-900/60 flex flex-col z-[1000] border border-[#4A3F6A99] overflow-hidden">
                    <div className="bg-[#1F1533] text-white p-3 sm:p-4 rounded-t-2xl flex justify-between items-center border-b border-[#4A3F6A99]">
                        <h3 className="font-semibold text-base sm:text-lg">
                            <span className="uppercase tracking-[.1em] font-bold" style={{ color: '#C996FF', textShadow: '0 0 8px rgba(201, 150, 255, 0.5)'}}>GRINDZONE</span>
                            <span className="text-slate-300"> асистент</span>
                        </h3>
                        <div className="flex items-center space-x-1"> {/* Додав space-x-1 для невеликого відступу */}
                            <button
                                onClick={toggleTts}
                                className={`p-1.5 rounded-full transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1F1533] ${
                                    isTtsEnabled
                                        ? 'text-purple-300 hover:bg-purple-700/50 focus:ring-purple-500'
                                        : 'text-slate-500 hover:bg-slate-700/50 focus:ring-slate-500'
                                }`}
                                style={{ width: '28px', height: '28px' }} // Задаємо однаковий розмір для обох кнопок
                                aria-label={isTtsEnabled ? "Вимкнути озвучування" : "Увімкнути озвучування"}
                                title={isTtsEnabled ? "Вимкнути озвучування" : "Увімкнути озвучування"}
                            >
                                {isTtsEnabled ? <VolumeUp sx={{ fontSize: '18px' }} /> : <VolumeOff sx={{ fontSize: '18px' }} />}
                            </button>
                            <button
                                onClick={toggleChat}
                                className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1F1533] focus:ring-slate-500"
                                aria-label="Закрити чат"
                                style={{ width: '28px', height: '28px' }}
                            >
                                <span><CloseIcon /></span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow p-3 sm:p-4 overflow-y-auto space-y-3 bg-[#100A1CF2]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-2.5 sm:p-3 rounded-xl break-words text-sm sm:text-base shadow-md ${msg.sender === 'user' ? 'bg-indigo-600 text-slate-50 rounded-br-none' : 'bg-[#2C2045F5] text-slate-200 rounded-bl-none'}`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && messages[messages.length -1]?.sender === 'user' && (
                            <div className="flex justify-start">
                                <div className="bg-[#2C2045F5] text-slate-200 rounded-xl p-2.5 sm:p-3 max-w-[85%]">
                                    <span className="italic text-purple-400">GRINDZONE думає...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-[#4A3F6A99] bg-[#1F1533F5]">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={isLoading ? "Завантаження..." : "Ваше питання до GRINDZONE..."}
                                className="flex-grow p-2.5 sm:p-3 bg-[#170F2AE6] border border-[#594A8D] rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                                autoFocus
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-2.5 sm:p-3 rounded-lg font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75 disabled:opacity-70 transition-all duration-200"
                                disabled={!inputText.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : "GRIND!"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatWidget;