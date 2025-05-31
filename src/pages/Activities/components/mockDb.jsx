// src/data/mockDb.js

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SpaIcon from '@mui/icons-material/Spa'; // Yoga
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi'; // CrossFit / HIIT
import CheckroomIcon from '@mui/icons-material/Checkroom';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import DevicesIcon from '@mui/icons-material/Devices';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'; // Pilates/Yoga specific

// --- ZONES ---
export const mockZones = [
    {
        id: 'zone1',
        name: "Кардіозона",
        imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FyZGlvJTIwZXF1aXBtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=1000&q=80",
        description: "Сучасна зона, обладнана найкращими біговими доріжками, велотренажерами та еліптичними тренажерами для ефективних кардіо-навантажень та покращення витривалості.",
        equipmentIds: ["eq1", "eq2", "eq3", "eq10"],
        accentColor: '#42a5f5'
    },
    {
        id: 'zone2',
        name: "Зона Вільних Ваг",
        imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMHdlaWdodHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=80",
        description: "Простора зона з широким вибором гантелей, штанг, гирь та спеціалізованих лавок для силових тренувань будь-якої складності та інтенсивності.",
        equipmentIds: ["eq4", "eq5", "eq11"],
        accentColor: '#ff7043'
    },
    {
        id: 'zone3',
        name: "Зал Групових Занять",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltJTIwY2xhc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=80",
        description: "Великий та світлий зал, ідеально підходить для різноманітних групових програм: від аеробіки до силових класів. Оснащений необхідним інвентарем.",
        equipmentIds: [],
        accentColor: '#66bb6a'
    },
    {
        id: 'zone4',
        name: "Кросфіт-Зона",
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3Jvc3NmaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=80",
        description: "Спеціалізована зона для функціональних тренувань високої інтенсивності. Включає рами, канати, гирі, медболи та інше обладнання для кросфіту.",
        equipmentIds: ["eq6", "eq7", "eq8", "eq12"],
        accentColor: '#ef5350'
    },
    {
        id: 'zone5',
        name: "Йога та Пілатес Студія",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYSUyMHN0dWRpb3xlbnwwfHx8fHx8MA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        description: "Затишна та спокійна студія для практик йоги та пілатесу. Створена для гармонії тіла та духу, оснащена килимками, блоками та ременями.",
        equipmentIds: ["eq9"],
        accentColor: '#ab47bc'
    }
];

// --- EQUIPMENT ---
export const mockEquipment = [
    {
        id: 'eq1', name: "Бігова доріжка LifeFitness Pro", zoneId: "zone1",
        imageUrl: "https://images.unsplash.com/photo-1580261450048-120519933974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJlYWRtaWxsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        description: "Професійна бігова доріжка з різними режимами тренувань, моніторингом пульсу та великим дисплеєм.",
        specifications: ["Макс. швидкість: 20 км/г", "Кут нахилу: 0-15%", "Програми: 12+"]
    },
    {
        id: 'eq2', name: "Еліптичний тренажер Technogym Excite", zoneId: "zone1",
        imageUrl: "https://images.unsplash.com/photo-1610028003976-14dad004f4a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWxsaXB0aWNhbCUyMHRyYWluZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        description: "Еліптичний тренажер для комплексного кардіо-навантаження. Плавний хід та ергономічний дизайн.",
        specifications: ["Рівні навантаження: 25", "Довжина кроку: 50 см"]
    },
    {
        id: 'eq3', name: "Велотренажер Spirit Fitness XBU55", zoneId: "zone1",
        imageUrl: "https://images.unsplash.com/photo-1594909007349-4594c200758a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXhlcmNpc2UlMjBiaWtlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        description: "Надійний велотренажер з комфортним сидінням та різноманітними програмами для будь-якого рівня підготовки.",
        specifications: ["Маховик: 10 кг", "Дисплей: LCD"]
    },
    {
        id: 'eq10', name: "Степпер Matrix ClimbMill", zoneId: "zone1",
        imageUrl: "https://images.unsplash.com/photo-1533232740380-26c08158370c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3RlcHBlciUyMGV4ZXJjaXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        description: "Імітація підйому сходами для інтенсивного тренування ніг та сідниць.",
        specifications: ["Висота сходинки: 20 см", "Програми: 8"]
    },
    {
        id: 'eq4', name: "Лавка для жиму Hammer Strength", zoneId: "zone2",
        imageUrl: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVuY2glMjBwcmVzc3xlbnwwfHx8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        description: "Професійна лавка для жиму лежачи з регульованим кутом нахилу.",
        specifications: ["Макс. навантаження: 300 кг", "Регулювання: 0-90°"]
    },
    {
        id: 'eq5', name: "Стійка для присідань Rogue", zoneId: "zone2",
        imageUrl: "https://images.unsplash.com/photo-1584862994705-c37014546799?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3F1YXQlMjByYWNrfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        description: "Міцна силова рама для безпечного виконання присідань, жимів та інших вправ зі штангою.",
        specifications: ["Матеріал: Сталь", "Турнік: Вбудований"]
    },
    {
        id: 'eq11', name: "Набір гантелей (2-50 кг)", zoneId: "zone2",
        imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGR1bWJiZWxsc3xlbnwwfHx8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        description: "Повний набір професійних гантелей з різною вагою.",
        specifications: ["Крок ваги: 2-2.5 кг", "Покриття: Гума"]
    },
    {
        id: 'eq6', name: "TRX Pro Suspension Trainer", zoneId: "zone4",
        imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VFJYJTIwdHJhaW5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        description: "Система підвісних тренувань для розвитку сили, балансу, гнучкості та стабільності кора.",
        specifications: ["Матеріал: Нейлон, метал", "Макс. вага: 150 кг"]
    },
    {
        id: 'eq7', name: "Гребний тренажер Concept2 RowErg", zoneId: "zone4",
        imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm93aW5nJTIwbWFjaGluZXxlbnwwfHx8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        description: "Популярний гребний тренажер для комплексного тренування всього тіла.",
        specifications: ["Монітор: PM5", "Опір: Повітряний"]
    },
    {
        id: 'eq8', name: "Канат для кросфіту (Battle Rope)", zoneId: "zone4",
        imageUrl: "https://images.unsplash.com/photo-1593403937940-773660031079?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmF0dGxlJTIwcm9wZXxlbnwwfHx8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        description: "Важкий канат для інтенсивних тренувань на силу та витривалість верхньої частини тіла.",
        specifications: ["Довжина: 15 м", "Діаметр: 50 мм"]
    },
    {
        id: 'eq12', name: "Пліометричний бокс (Plyo Box)", zoneId: "zone4",
        imageUrl: "https://images.unsplash.com/photo-1620188526517-576d98972789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGx5byUyMGJveHxlbnwwfHx8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        description: "Бокс для стрибків, використовується для розвитку вибухової сили ніг.",
        specifications: ["Матеріал: Дерево/Піна", "Висоти: 50, 60, 75 см"]
    },
    {
        id: 'eq9', name: "Реформер для пілатесу Align-Pilates", zoneId: "zone5",
        imageUrl: "https://images.unsplash.com/photo-1604479167203-d0b33904cc8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGlsYXRlcyUyMHJlZm9ybWVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        description: "Професійний реформер для виконання широкого спектру вправ пілатесу.",
        specifications: ["Пружини: 5", "Матеріал: Клен"]
    },
];

// --- GROUP CLASSES ---
export const mockGroupClasses = [
    {
        id: 'gc1', title: "Power Pump", zoneId: "zone3", coach: "Олександр Коваленко",
        date: "2025-07-29", startTime: "18:00", endTime: "19:00", durationMinutes: 60,
        maxCapacity: 20, bookedUserIds: Array.from({length: 12}, (_,i) => `userP${i}`),
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltJTIwY2xhc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        description: 'Інтенсивне силове тренування з використанням штанги для всіх груп м\'язів.',
        difficulty: 'Середній', icon: <FitnessCenterIcon />
    },
    {
        id: 'gc2', title: "Hatha Yoga", zoneId: "zone5", coach: "Марина Демченко",
        date: "2025-07-30", startTime: "09:00", endTime: "10:00", durationMinutes: 60,
        maxCapacity: 15, bookedUserIds: Array.from({length: 8}, (_,i) => `userY${i}`),
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        description: 'Класична практика Хатха-йоги для покращення гнучкості, балансу та внутрішньої гармонії.',
        difficulty: 'Легкий', icon: <SpaIcon />
    },
    {
        id: 'gc3', title: "HIIT Blast", zoneId: "zone4", coach: "Віктор Петренко",
        date: "2025-08-03", startTime: "11:00", endTime: "11:45", durationMinutes: 45,
        maxCapacity: 18, bookedUserIds: Array.from({length: 17}, (_,i) => `userH${i}`),
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGlpdCUyMHdvcmtvdXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        description: 'Високоінтенсивне інтервальне тренування. Максимальне спалювання жиру та розвиток витривалості.',
        difficulty: 'Високий', icon: <SportsKabaddiIcon />
    },
    {
        id: 'gc4', title: "Cardio Burn", zoneId: "zone3", coach: "Анна Зайцева",
        date: "2025-07-29", startTime: "19:30", endTime: "20:15", durationMinutes: 45,
        maxCapacity: 25, bookedUserIds: Array.from({length: 10}, (_,i) => `userC${i}`),
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyZGlvJTIwd29ya291dHxlbnwwfHx8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        description: 'Енергійне кардіо тренування для зміцнення серцево-судинної системи та підвищення тонусу.',
        difficulty: 'Середній', icon: <DirectionsRunIcon />
    },
    {
        id: 'gc5', title: "Pilates Mat", zoneId: "zone5", coach: "Олена Василенко",
        date: "2025-07-31", startTime: "10:00", endTime: "11:00", durationMinutes: 60,
        maxCapacity: 12, bookedUserIds: ["userA", "userB", "userC"],
        imageUrl: 'https://images.unsplash.com/photo-1593811167565-4672e877de87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGlsYXRlcyUyMG1hdHxlbnwwfHx8fHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        description: 'Тренування на матах для зміцнення м\'язів кора, покращення постави та гнучкості.',
        difficulty: 'Легкий-Середній', icon: <AccessibilityNewIcon />
    },
    {
        id: 'gc6', title: "Functional Strength", zoneId: "zone4", coach: "Денис Іванов",
        date: "2025-07-30", startTime: "17:00", endTime: "18:00", durationMinutes: 60,
        maxCapacity: 15, bookedUserIds: [],
        imageUrl: 'https://images.unsplash.com/photo-1590560008990-276d23999608?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVuY3Rpb25hbCUyMHRyYWluaW5nJTIwZ3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        description: 'Розвиток функціональної сили та витривалості з використанням різноманітного обладнання.',
        difficulty: 'Середній', icon: <FitnessCenterIcon />
    },
    {
        id: 'gc7', title: "Zumba Fitness", zoneId: "zone3", coach: "Софія Мельник",
        date: "2025-08-01", startTime: "19:00", endTime: "20:00", durationMinutes: 60,
        maxCapacity: 30, bookedUserIds: Array.from({length: 15}, (_, i) => `userZ${i}`),
        imageUrl: 'https://images.unsplash.com/photo-1602797778930-87a9b501f3e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8enVtYmF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        description: 'Запальна танцювальна фітнес-програма під латиноамериканські та світові ритми.',
        difficulty: 'Легкий', icon: <SelfImprovementIcon />
    },
];

// --- INFO CARDS ---
export const mockInfoCards = [
    {
        id: 'info1', title: 'Що брати з собою?', iconName: 'Checkroom',
        content: `<ul><li>Зручний спортивний одяг та взуття.</li><li>Рушник (один для тренажерів, інший для душу).</li><li>Пляшка для води (у нас є кулери).</li><li>За бажанням: рукавички, особистий килимок.</li><li>Гарний настрій та мотивацію!</li></ul>`
    },
    {
        id: 'info2', title: 'Правила Залу GRINDZONE', iconName: 'RuleFolder',
        content: `<p>Для комфорту та безпеки всіх відвідувачів:</p><ul><li>Використовуйте рушник на тренажерах.</li><li>Повертайте інвентар на місце.</li><li>Не кидайте важкі предмети.</li><li>Дотримуйтесь чистоти.</li><li>Заборонено тренуватися у вуличному взутті.</li><li>Поважайте інших.</li></ul><p>Повний список правил доступний на рецепції.</p>`
    },
    {
        id: 'info3', title: 'Безпека та Інструктаж', iconName: 'Devices',
        content: `<p>На кожному тренажері є QR-код до відео-інструкції. Якщо виникають питання, зверніться до чергового тренера.</p><p>Не соромтеся запитувати – ваша безпека та ефективність тренувань для нас пріоритет.</p>`
    },
];

// --- AVAILABLE TIME SLOTS (для бронювання тренажерів) ---
export const mockAvailableTimeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];