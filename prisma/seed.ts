import { PrismaClient, type ItemType, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/** Local development accounts (never use these passwords in production). */
const DEV_ACCOUNTS = [
  { email: "demo@unt.kz", password: "Demo12345", displayName: "Демо оқушы", role: "student" as const, grade: 11 },
  { email: "admin@unt.kz", password: "Admin12345", displayName: "Әкімші", role: "admin" as const, grade: null },
];

const topics = [
  { code: "NUM", nameKk: "Санау жүйелері және ақпарат өлшемі", nameRu: "Системы счисления и измерение информации" },
  { code: "ALG", nameKk: "Алгоритмдер және Python", nameRu: "Алгоритмы и Python" },
  { code: "LOG", nameKk: "Логика негіздері", nameRu: "Основы логики" },
  { code: "DB", nameKk: "Деректер қоры және SQL", nameRu: "Базы данных и SQL" },
  { code: "NET", nameKk: "Компьютерлік желілер", nameRu: "Компьютерные сети" },
  { code: "HW", nameKk: "Компьютер құрылғысы", nameRu: "Устройство компьютера" },
];

const studentsTable = {
  headers: ["id", "name", "grade", "score"],
  rows: [
    ["1", "Айгерім", "11", "92"],
    ["2", "Нұрлан", "10", "78"],
    ["3", "Дана", "11", "85"],
    ["4", "Ерлан", "11", "64"],
  ],
};

const context = {
  title: "Students кестесі",
  text: "Мектеп деректер қорындағы Students кестесі берілген. 7–8 тапсырмаларды осы кесте бойынша орындаңыз.",
  table: studentsTable,
};

type SeedItem = {
  type: ItemType;
  topic: string;
  body: Prisma.InputJsonValue;
  options: { id: string; text: string }[];
  answerKey: Prisma.InputJsonValue;
  explanation: string;
};

// Version 1 (free): the order follows the UNT block (single → context → matching → multiple)
const version1: SeedItem[] = [
  {
    type: "single",
    topic: "NUM",
    body: { text: "Ондық санау жүйесіндегі 13 санының екілік жүйедегі жазылуы:" },
    options: [
      { id: "A", text: "1101" },
      { id: "B", text: "1011" },
      { id: "C", text: "1110" },
      { id: "D", text: "1001" },
    ],
    answerKey: { correct: "A" },
    explanation: "13 = 8 + 4 + 1 = 2³ + 2² + 2⁰, сондықтан екілік жазылуы 1101.",
  },
  {
    type: "single",
    topic: "NUM",
    body: { text: "1 Кбайт неше байтқа тең?" },
    options: [
      { id: "A", text: "1000" },
      { id: "B", text: "1024" },
      { id: "C", text: "512" },
      { id: "D", text: "8" },
    ],
    answerKey: { correct: "B" },
    explanation: "Информатикада 1 Кбайт = 2¹⁰ байт = 1024 байт.",
  },
  {
    type: "single",
    topic: "ALG",
    body: {
      text: "Программа нәтижесінде экранға не шығады?",
      code: "s = 0\nfor i in range(1, 5):\n    s += i\nprint(s)",
    },
    options: [
      { id: "A", text: "10" },
      { id: "B", text: "15" },
      { id: "C", text: "4" },
      { id: "D", text: "5" },
    ],
    answerKey: { correct: "A" },
    explanation: "range(1, 5) 1, 2, 3, 4 сандарын береді (5 кірмейді). 1 + 2 + 3 + 4 = 10.",
  },
  {
    type: "single",
    topic: "LOG",
    body: {
      text: "Python тілінде A = True, B = False болғанда өрнектің мәні неге тең?",
      code: "(A and not B) or B",
    },
    options: [
      { id: "A", text: "True" },
      { id: "B", text: "False" },
      { id: "C", text: "None" },
      { id: "D", text: "Қате шығады" },
    ],
    answerKey: { correct: "A" },
    explanation: "not B = True, A and True = True, True or False = True.",
  },
  {
    type: "single",
    topic: "NET",
    body: { text: "IPv4 адресі неше биттен тұрады?" },
    options: [
      { id: "A", text: "16" },
      { id: "B", text: "32" },
      { id: "C", text: "64" },
      { id: "D", text: "128" },
    ],
    answerKey: { correct: "B" },
    explanation: "IPv4 адресі 4 байттан, яғни 32 биттен тұрады (мысалы, 192.168.0.1). 128 бит — IPv6.",
  },
  {
    type: "single",
    topic: "HW",
    body: { text: "Төмендегілердің қайсысы енгізу құрылғысы?" },
    options: [
      { id: "A", text: "Монитор" },
      { id: "B", text: "Принтер" },
      { id: "C", text: "Пернетақта" },
      { id: "D", text: "Колонка" },
    ],
    answerKey: { correct: "C" },
    explanation: "Пернетақта компьютерге мәлімет енгізеді. Монитор, принтер және колонка — шығару құрылғылары.",
  },
  {
    type: "context",
    topic: "DB",
    body: { context, text: "Сұраныстың нәтижесі неге тең?", code: "SELECT COUNT(*) FROM Students WHERE grade = 11;" },
    options: [
      { id: "A", text: "1" },
      { id: "B", text: "2" },
      { id: "C", text: "3" },
      { id: "D", text: "4" },
    ],
    answerKey: { correct: "C" },
    explanation: "grade = 11 шартына Айгерім, Дана және Ерлан сәйкес келеді — 3 жол.",
  },
  {
    type: "context",
    topic: "DB",
    body: {
      context,
      text: "Сұраныс нәтижесінің бірінші жолында қай есім тұрады?",
      code: "SELECT name FROM Students WHERE score > 80 ORDER BY score DESC;",
    },
    options: [
      { id: "A", text: "Дана" },
      { id: "B", text: "Айгерім" },
      { id: "C", text: "Нұрлан" },
      { id: "D", text: "Ерлан" },
    ],
    answerKey: { correct: "B" },
    explanation: "score > 80: Айгерім (92) және Дана (85). DESC — кему ретімен, сондықтан бірінші Айгерім.",
  },
  {
    type: "matching",
    topic: "ALG",
    body: {
      text: "Python функциясы мен оның қызметін сәйкестендіріңіз.",
      left: [
        { id: "1", text: "len()" },
        { id: "2", text: "int()" },
        { id: "3", text: "input()" },
      ],
    },
    options: [
      { id: "A", text: "Мәнді бүтін санға түрлендіреді" },
      { id: "B", text: "Тізбектің ұзындығын қайтарады" },
      { id: "C", text: "Пернетақтадан енгізілген жолды оқиды" },
      { id: "D", text: "Экранға мәлімет шығарады" },
    ],
    answerKey: { correct: { "1": "B", "2": "A", "3": "C" } },
    explanation: "len() — ұзындық, int() — бүтін санға түрлендіру, input() — енгізу. Экранға шығаратын print() тізімде жоқ.",
  },
  {
    type: "matching",
    topic: "NUM",
    body: {
      text: "Ақпарат өлшем бірліктерін сәйкестендіріңіз.",
      left: [
        { id: "1", text: "1 байт" },
        { id: "2", text: "1 Кбайт" },
        { id: "3", text: "1 Мбайт" },
      ],
    },
    options: [
      { id: "A", text: "1024 Кбайт" },
      { id: "B", text: "8 бит" },
      { id: "C", text: "1024 байт" },
      { id: "D", text: "1000 байт" },
    ],
    answerKey: { correct: { "1": "B", "2": "C", "3": "A" } },
    explanation: "1 байт = 8 бит, 1 Кбайт = 1024 байт, 1 Мбайт = 1024 Кбайт.",
  },
  {
    type: "multiple",
    topic: "ALG",
    body: { text: "Python тіліндегі өзгермейтін (immutable) деректер типтерін таңдаңыз." },
    options: [
      { id: "A", text: "list" },
      { id: "B", text: "tuple" },
      { id: "C", text: "str" },
      { id: "D", text: "dict" },
      { id: "E", text: "int" },
      { id: "F", text: "set" },
    ],
    answerKey: { correct: ["B", "C", "E"] },
    explanation: "tuple, str және int — өзгермейтін типтер. list, dict және set — өзгермелі (mutable).",
  },
  {
    type: "multiple",
    topic: "NET",
    body: { text: "Төмендегілердің қайсысы желілік хаттамалар (протоколдар)?" },
    options: [
      { id: "A", text: "HTTP" },
      { id: "B", text: "TCP" },
      { id: "C", text: "HTML" },
      { id: "D", text: "FTP" },
      { id: "E", text: "CSS" },
      { id: "F", text: "Python" },
    ],
    answerKey: { correct: ["A", "B", "D"] },
    explanation: "HTTP, TCP және FTP — хаттамалар. HTML және CSS — белгілеу/стиль тілдері, Python — бағдарламалау тілі.",
  },
];

// Version 2 (premium): opens with a subscription
const version2: SeedItem[] = [
  {
    type: "single",
    topic: "NUM",
    body: { text: "Екілік жүйедегі 10110 санының ондық жүйедегі мәні:" },
    options: [
      { id: "A", text: "20" },
      { id: "B", text: "22" },
      { id: "C", text: "24" },
      { id: "D", text: "26" },
    ],
    answerKey: { correct: "B" },
    explanation: "10110₂ = 16 + 4 + 2 = 22.",
  },
  {
    type: "single",
    topic: "ALG",
    body: {
      text: "Программа нәтижесінде экранға не шығады?",
      code: "a = [3, 8, 1, 6]\nprint(max(a) - min(a))",
    },
    options: [
      { id: "A", text: "5" },
      { id: "B", text: "7" },
      { id: "C", text: "9" },
      { id: "D", text: "2" },
    ],
    answerKey: { correct: "B" },
    explanation: "max(a) = 8, min(a) = 1, 8 − 1 = 7.",
  },
  {
    type: "single",
    topic: "ALG",
    body: {
      text: "Программа нәтижесінде экранға не шығады?",
      code: 'word = "informatika"\nprint(word[2:5])',
    },
    options: [
      { id: "A", text: "nfo" },
      { id: "B", text: "for" },
      { id: "C", text: "form" },
      { id: "D", text: "fo" },
    ],
    answerKey: { correct: "B" },
    explanation: "Қиық [2:5] 2, 3, 4 индекстерін алады: f, o, r → \"for\". 5-индекс кірмейді.",
  },
  {
    type: "single",
    topic: "LOG",
    body: { text: "X = 5 болғанда қай өрнек True мәнін береді?" },
    options: [
      { id: "A", text: "X > 5 and X < 10" },
      { id: "B", text: "not (X == 5)" },
      { id: "C", text: "X >= 5 or X > 100" },
      { id: "D", text: "X < 3 and X != 5" },
    ],
    answerKey: { correct: "C" },
    explanation: "X >= 5 ақиқат, ал or операторына бір ақиқат шарт жеткілікті.",
  },
  {
    type: "matching",
    topic: "NET",
    body: {
      text: "Хаттама мен оның қызметін сәйкестендіріңіз.",
      left: [
        { id: "1", text: "HTTP" },
        { id: "2", text: "FTP" },
        { id: "3", text: "SMTP" },
      ],
    },
    options: [
      { id: "A", text: "Электрондық хат жіберу" },
      { id: "B", text: "Веб-беттерді жеткізу" },
      { id: "C", text: "Файлдарды тасымалдау" },
      { id: "D", text: "Адрестерді автоматты беру" },
    ],
    answerKey: { correct: { "1": "B", "2": "C", "3": "A" } },
    explanation: "HTTP — веб-беттер, FTP — файлдар, SMTP — хат жіберу. Адрестерді DHCP береді.",
  },
  {
    type: "multiple",
    topic: "DB",
    body: { text: "SQL тіліндегі деректерді өзгертетін командаларды таңдаңыз." },
    options: [
      { id: "A", text: "INSERT" },
      { id: "B", text: "SELECT" },
      { id: "C", text: "UPDATE" },
      { id: "D", text: "DELETE" },
      { id: "E", text: "WHERE" },
      { id: "F", text: "ORDER BY" },
    ],
    answerKey: { correct: ["A", "C", "D"] },
    explanation: "INSERT, UPDATE, DELETE кестедегі деректерді өзгертеді. SELECT тек оқиды, WHERE мен ORDER BY — сұраныс бөліктері.",
  },
];

const maxPointsByType: Record<ItemType, number> = { single: 1, context: 1, multiple: 2, matching: 2 };

async function upsertVersion(
  number: number,
  title: string,
  access: "free" | "premium",
  timeLimitMin: number,
  items: SeedItem[],
  topicByCode: Map<string, string>,
) {
  const version = await prisma.testVersion.upsert({
    where: { number },
    update: { title, access, timeLimitMin, status: "published" },
    create: { number, title, access, timeLimitMin, status: "published", difficulty: number },
  });
  for (const [index, it] of items.entries()) {
    const data = {
      type: it.type,
      body: it.body,
      options: it.options,
      answerKey: it.answerKey,
      explanation: it.explanation,
      maxPoints: maxPointsByType[it.type],
    };
    const item = await prisma.item.upsert({
      where: { versionId_position: { versionId: version.id, position: index + 1 } },
      update: data,
      create: { ...data, versionId: version.id, position: index + 1 },
    });
    await prisma.itemTopic.deleteMany({ where: { itemId: item.id } });
    await prisma.itemTopic.create({ data: { itemId: item.id, topicId: topicByCode.get(it.topic)! } });
  }
}

async function main() {
  for (const t of topics) {
    await prisma.topic.upsert({ where: { code: t.code }, update: t, create: t });
  }
  const topicByCode = new Map((await prisma.topic.findMany()).map((t) => [t.code, t.id]));

  for (const a of DEV_ACCOUNTS) {
    const passwordHash = await bcrypt.hash(a.password, 10);
    await prisma.user.upsert({
      where: { email: a.email },
      update: { passwordHash, role: a.role },
      create: { email: a.email, displayName: a.displayName, role: a.role, grade: a.grade, passwordHash },
    });
  }

  await upsertVersion(1, "Нұсқа 1 (демо)", "free", 20, version1, topicByCode);
  await upsertVersion(2, "Нұсқа 2", "premium", 15, version2, topicByCode);

  console.log(
    `Seed done: ${topics.length} topics, 2 versions (${version1.length} + ${version2.length} items), dev accounts demo@unt.kz and admin@unt.kz.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
