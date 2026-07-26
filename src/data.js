const BASE_URL = import.meta.env.BASE_URL || "/";
const withBase = (path) => {
  const cleanBase = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const rewriteAbsolutePaths = (value) => {
  if (typeof value === "string") {
    return /^\/(media|docs|projects)\//.test(value) ? withBase(value) : value;
  }
  if (Array.isArray(value)) return value.map(rewriteAbsolutePaths);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, rewriteAbsolutePaths(entry)])
    );
  }
  return value;
};

export const profile = {
  name: "MINGZE GUO",
  chineseName: "郭明泽",
  role: "游戏系统策划 / UI 策划 / 游戏分析",
  status: "2026 应届本科毕业生 · 寻找游戏系统策划 / 游戏策划机会",
  location: "中国 · 可到岗",
  email: "16655690@qq.com",
  phone: "13180891811",
  intro:
    "加州大学圣克鲁兹分校游戏设计本科。作品集中包含可运行的 Combat Shuang 原型、两轮 Playtest 反馈迭代，以及《Vampire Survivors》系统分析文档。关注核心循环、成长反馈、数值取舍、玩家理解成本与可验证的策划表达。",
  education: "UC Santa Cruz · Computer Science: Game Design",
  graduation: "2019.08 — 2026.04",
};

export const gameExperience = [
  {
    category: "MMORPG",
    games: [
      {
        title: "Final Fantasy XIV",
        meta: "8000h+",
        achievement: "带队攻略多个版本副本，并完成 3 个绝本",
      },
    ],
  },
  {
    category: "FPS",
    games: [
      {
        title: "Valorant",
        meta: "2000h+",
        achievement: "最高段位：钻石 1",
      },
      {
        title: "Apex Legends",
        meta: "1000h+",
        achievement: "最高段位：钻石 3",
      },
    ],
  },
  {
    category: "MOBA",
    games: [
      {
        title: "League of Legends",
        meta: "S5 入坑",
        achievement: "最高段位：钻石 4",
      },
    ],
  },
  {
    category: "二次元 / 长线养成",
    games: [
      {
        title: "崩坏：星穹铁道",
        meta: "3.4 版本退坑",
        achievement: "退坑前全图鉴",
      },
      {
        title: "明日方舟：终末地",
        meta: "持续游玩中",
        achievement: "当前全图鉴",
      },
    ],
  },
];

const rawProjects = [
  {
    id: "01",
    type: "GAME DESIGN · SYSTEM / COMBAT",
    title: "暗渊之塔",
    subtitle: "职业成长、技能分支与局内奖励构筑",
    description:
      "个人可试玩玩法原型。我负责玩法方向、职业设计、技能设计、构筑系统、路线与奖励节奏设计，并独立完成原型搭建，用于验证“职业成长 + 技能分支 + 局内奖励构筑”的核心循环与构筑体验。",
    tags: ["玩法策划", "系统策划", "战斗策划", "Roguelite 原型"],
    tone: "lime",
    symbol: "塔",
    preview: "/media/dark-tower-hero.png",
    previewVideo: "/media/dark-tower-home-showcase.mp4",
    previewMeta: "GAMEPLAY FLOW / DARK TOWER",
    dimensions: ["CLASS BUILD", "SKILL BRANCH", "ROUTE", "REWARD"],
    caseLink: "/projects/dark-tower",
    caseLinkLabel: "查看策划案例",
    caseMetrics: [
      { value: "2", label: "可选职业" },
      { value: "3", label: "构筑层级" },
      { value: "8", label: "核心流程节点" },
      { value: "WebGL", label: "可试玩版本" },
    ],
    insights: [
      "战士与奥术法师分别验证近战压迫、连击节奏、蓄力咏唱、范围控制与持续伤害等差异化战斗体验。",
      "技能分支、圣物、附魔三层系统共同承担 Build 差异，避免局内成长只停留在数值叠加。",
      "路线选择参考爬塔式 Roguelite 风险收益结构，让玩家根据生命、金币、已有圣物和构筑方向动态调整推进策略。",
    ],
  },
  {
    id: "02",
    type: "GAME DESIGN · SYSTEM / ROGUELIKE",
    title: "Combat Shuang",
    subtitle: "核心循环、词条系统与战斗节奏迭代",
    description:
      "基于 Unity 项目代码重新梳理：该原型围绕移动走位、自动锁敌射击、击杀经验、升级三选一和波次推进构成完整战斗循环。重点设计 12 类升级词条、15% 特殊词条出现机制、6 级后风险收益惩罚，以及随波次增长的敌群压力曲线，用可运行原型验证肉鸽成长反馈。",
    tags: ["系统策划", "词条设计", "战斗循环", "数值验证"],
    tone: "lime",
    symbol: "◫",
    preview: "/media/roguelike-auto-attack.gif",
    previewMeta: "AUTO ATTACK / MOVEMENT LOOP",
    dimensions: ["MOVE", "AUTO FIRE", "XP LOOP", "LEVEL UP"],
    caseLink: "/projects/roguelike",
    caseLinkLabel: "查看完整案例",
    caseMetrics: [
      { value: "12", label: "升级词条类型" },
      { value: "15%", label: "特殊词条初始概率" },
      { value: "Lv.6", label: "风险收益启动" },
      { value: "+10", label: "每波敌人数成长" },
    ],
    insights: [
      "升级池由 9 项基础属性与 3 项特殊弹道组成：生命、速度、暴击、伤害、防御、闪避、恢复，以及多弹道、弹射、火焰总伤害。",
      "6 级后进入风险收益阶段：高收益属性会附带受伤增加、输出降低或移速下降等惩罚，避免成长只变成线性堆数值。",
      "波次从 30 个敌人起步，每波 +10 敌人，生命按 30% 增长，生成间隔逐波缩短到 0.5 秒下限，形成逐步压迫。",
    ],
    systemNotes: [
      "自动瞄准最近敌人，存在目标时才显示武器并进入射击节奏。",
      "子弹支持多弹道散射与 8 格范围内弹射，避免攻击反馈单一。",
      "敌人包含追击、远程射击、蓄力冲刺三类行为，用移动压力区分战斗节奏。",
    ],
  },
  {
    id: "03",
    type: "GAME ANALYSIS · SYSTEM / RETENTION",
    title: "Vampire Survivors 分析",
    subtitle: "核心玩法、成长反馈与局外留存拆解",
    description:
      "围绕《Vampire Survivors》的轻量化自动战斗、30 分钟局内节奏、随机升级选择、武器构筑与局外解锁展开拆解；用目标用户、核心循环、成长反馈和留存结构解释作品如何把低门槛操作转化为高频成长爽感。",
    tags: ["游戏分析", "核心循环", "成长反馈", "留存拆解"],
    tone: "red",
    symbol: "◆",
    cover: "/media/vampire-analysis-cover.png",
    spreads: ["/media/vampire-analysis-page-02.png", "/media/vampire-analysis-page-03.png"],
    dimensions: ["CORE LOOP", "GROWTH", "BUILD", "RETENTION"],
    caseLink: "/projects/vampire-survivors",
    caseLinkLabel: "查看分析案例",
    insights: [
      "低操作门槛，把玩家注意力从复杂输入转移到走位、拾取与升级选择。",
      "高频成长节点，让每 30—60 秒都有可感知的能力提升和构筑反馈。",
      "局外解锁目标，把单局爽感延展为角色、地图与永久强化的长期留存。",
    ],
    link: "/docs/vampire-survivors-analysis.pdf",
    linkLabel: "阅读完整 PDF",
  },
  {
    id: "04",
    type: "UI DESIGN · LOCALIZATION",
    title: "Combat Shuang UI",
    subtitle: "完整界面流程与中英日多语言适配",
    description:
      "参与主菜单、设置、玩法说明、制作人员与结算页的 UI 流程设计；重构 How To Play 内容，并独立完成中英日三端本地化适配与交互反馈优化。",
    tags: ["UI 策划", "信息架构", "本地化", "Unity"],
    tone: "silver",
    symbol: "≋",
    preview: "/media/ui-main-menu-cover.png",
    previewVideo: "/media/ui-language-switch.mp4",
    previewMeta: "MAIN MENU / SETTINGS / LOCALIZATION",
    dimensions: ["HOW TO PLAY", "SETTING", "LANGUAGE", "FEEDBACK"],
    caseLink: "/projects/unity-ui",
    caseLinkLabel: "查看 UI 案例",
  },
];

const rawCaseStudies = {
  darkTower: {
    id: "01",
    title: "暗渊之塔",
    subtitle: "职业成长 + 技能分支 + 局内奖励构筑",
    role: "玩法 / 系统 / 战斗策划 · 独立完成可试玩原型搭建",
    responsibility:
      "我负责玩法方向、职业与技能设计、构筑系统、路线与奖励节奏设计，并独立完成 Unity 原型搭建，用于验证核心玩法循环。",
    period: "个人玩法原型",
    engine: "Unity / WebGL Prototype",
    playtestUrl: "https://yyemin.itch.io/test",
    summary:
      "《暗渊之塔》是一款俯视角动作 Roguelite 可试玩玩法原型。玩家通过局外职业成长与局内圣物、附魔、技能分支组合，逐步构建属于自己的战斗流派，并在路线选择中权衡风险、收益与资源规划。",
    media: {
      heroImage: "/media/dark-tower-hero.png",
      mainVideo: "/media/dark-tower-main-demo-web.mp4",
      lobby: "/media/dark-tower-lobby.png",
      playerUpgrade: "/media/dark-tower-player-upgrade.png",
      classAttributes: "/media/dark-tower-class-attributes.png",
      classSkills: "/media/dark-tower-class-skills.png",
      skillConfig: "/media/dark-tower-skill-config.png",
      routeMap: "/media/dark-tower-route-map.png",
      warriorVideo: "/media/dark-tower-warrior-skills.mp4",
      mageVideo: "/media/dark-tower-mage-skills.mp4",
      shop: "/media/dark-tower-shop.png",
      battleReward: "/media/dark-tower-battle-reward.png",
    },
    outgameShowcase: [
      {
        title: "大厅界面",
        src: "/media/dark-tower-lobby.png",
        text: "展示玩家进入一局前的准备空间。",
      },
      {
        title: "玩家强化",
        src: "/media/dark-tower-player-upgrade.png",
        text: "提供账号层面的长期成长目标，影响开局资源和构筑起点。",
      },
      {
        title: "职业强化属性",
        src: "/media/dark-tower-class-attributes.png",
        text: "通过属性分支强化职业倾向，让战士和法师在成长方向上逐渐分化。",
      },
      {
        title: "职业强化技能",
        src: "/media/dark-tower-class-skills.png",
        text: "技能解锁与分支选择放在局外，降低局内随机性，让玩家能主动规划流派。",
      },
      {
        title: "技能配置",
        src: "/media/dark-tower-skill-config.png",
        text: "玩家选择 3 个主动技能带入本局，使构筑从开局前就开始。",
      },
    ],
    heroTags: ["玩法策划", "系统策划", "战斗策划", "可试玩原型"],
    metrics: [
      { value: "2", label: "战士 / 法师" },
      { value: "3", label: "技能分支 / 圣物 / 附魔" },
      { value: "8", label: "核心流程节点" },
      { value: "WebGL", label: "可试玩版本" },
    ],
    goals: [
      {
        title: "技能设计",
        text: "通过战士与法师两套职业机制，验证近战连击、蓄力咏唱、范围控制、持续伤害等不同战斗体验。",
      },
      {
        title: "职业成长",
        text: "将职业成长放在局外，让玩家通过职业经验解锁属性、技能与技能分支，形成长期成长目标。",
      },
      {
        title: "构筑系统",
        text: "通过技能分支、圣物、附魔三层系统，让玩家在开局配置与局内奖励之间形成不同流派。",
      },
    ],
    loop: [
      "选择存档",
      "局外成长 / 职业强化",
      "选择职业与技能配置",
      "路线选择",
      "战斗 / 精英 / 商人 / 休整",
      "获得奖励：圣物 / 金币 / 附魔",
      "强化构筑",
      "挑战 Boss",
    ],
    loopPurposes: [
      {
        title: "局外准备",
        text: "玩家通过职业强化和技能配置，决定本局基础玩法方向。",
      },
      {
        title: "路线规划",
        text: "玩家根据血量、金币和构筑状态，选择精英、商人、休整或普通战斗。",
      },
      {
        title: "局内奖励",
        text: "圣物、金币和附魔提供即时构筑反馈，让每一层结束后都有新的选择。",
      },
      {
        title: "构筑回流",
        text: "获得奖励后重新回到路线选择，让玩家持续调整本局策略。",
      },
    ],
    classes: [
      {
        title: "战士",
        label: "WARRIOR",
        text: "战士强调近战压迫、连击节奏、灵活切入与生存能力。技能围绕连斩、突进、护盾、流血和处决展开，鼓励玩家在敌群中寻找进攻窗口，并通过技能分支形成流血输出或稳定站场等方向。",
        keywords: ["近战", "连击", "灵活", "生存", "流血", "护盾"],
      },
      {
        title: "法师",
        label: "MAGE",
        text: "法师以奥术、咏唱和范围控制为核心，强调蓄力强化、大范围打击、持续伤害与控制能力。核心节奏是通过蓄力普攻、咏唱强化和技能连锁，在安全距离外制造持续压制与范围爆发。",
        keywords: ["咏唱", "大范围", "DOT", "控制", "连锁", "奥术"],
      },
    ],
    buildSystems: [
      {
        title: "技能分支",
        text: "每个职业技能拥有不同分支，玩家在局外决定技能发展方向。例如同一个战士技能可以走流血输出，也可以走生存站场。",
      },
      {
        title: "圣物",
        text: "圣物作为本局全局被动，决定构筑方向。例如流血传播、护盾增伤、感电传导等。",
      },
      {
        title: "附魔",
        text: "附魔绑定到单个已携带技能上，用于改变技能释放方式或强化技能表现，例如扩大范围、回响、双重施法、传播等。",
      },
      {
        title: "商人",
        text: "商人节点提供资源消耗入口，让金币不只是战斗奖励，而是路线规划、补强构筑与风险控制的一部分。",
      },
    ],
    archetypes: [
      {
        title: "流血战士",
        text: "流血战士通过选择流血相关技能分支，让疾风连斩、旋刃风暴和猩红处决持续施加流血；再配合血疫徽记、传播类附魔，让敌人死亡后扩散状态，形成持续清怪和收割循环。",
      },
      {
        title: "奥术法师流派",
        text: "奥术法师围绕咏唱强化、奥术标记和范围技能展开。玩家通过咏唱提高下一个技能强度，再用大范围技能施加标记或触发爆发，使法师形成“准备、释放、连锁扩散”的战斗节奏。",
      },
    ],
    routeSystem:
      "路线系统参考爬塔式 Roguelite 的风险收益结构。玩家在看到地图后，需要提前判断哪条路线收益更高：是否挑战精英获取更高奖励，是否在状态较差时转向休整，是否根据金币数量规划商店路线。我希望路线选择不是单纯点击下一关，而是让玩家在开局看到地图时就开始规划：当前状态是否适合挑战精英，金币是否足够支持商店路线，血量较低时是否需要转向休整。",
    decisions: [
      {
        title: "删除局内等级，降低系统臃肿度",
        problem: "初版设计中，玩家在局内通过等级获得属性强化。",
        action: "随着圣物和附魔系统加入，局内等级会让成长来源过多，数值也更难控制。",
        result: "因此我将等级成长转移到局外职业系统，让局内重点回到圣物、附魔和路线选择上。",
      },
      {
        title: "技能从局内随机获取改为局外配置",
        problem: "初版中，职业技能会在局内随机获得，玩家可能拿到与当前流派不匹配的技能。",
        action: "我将技能放到局外配置，让玩家在开局前选择携带技能。",
        result: "这样构筑有明确起点，局内随机性则主要由圣物和附魔承担，既保留变化，也降低流派无法成型的挫败感。",
      },
      {
        title: "技能升级从数值成长改为分支选择",
        problem: "初版技能升级更接近 1-3 级数值强化，但这种设计对玩法变化贡献有限。",
        action: "我将技能升级改为分支选择，让同一个技能可以向不同流派发展。",
        result: "玩家不是单纯“让技能更强”，而是在选择“这个技能要服务于什么构筑”。",
      },
    ],
    implemented: [
      "主菜单、存档与大厅流程",
      "战士、法师两个职业",
      "技能配置系统",
      "职业强化树与技能分支",
      "玩家局外成长",
      "随机路线地图",
      "普通战斗、精英战斗、商人、休整、Boss 房间框架",
      "多类型敌人与不同攻击方式",
      "圣物、附魔、商人商品系统",
      "战斗奖励与金币奖励",
      "训练场测试模式",
      "WebGL 可试玩版本",
    ],
    nextPlan: [
      "Boss 与精英敌人机制仍以框架验证为主，可继续扩展行为差异。",
      "技能特效、命中反馈与音效表现可进一步强化战斗读秒感。",
      "圣物、附魔和商人商品池可继续扩充，以验证更多构筑组合。",
      "敌人组合与关卡节奏已具备基础链路，可继续做波次压强调优。",
      "角色立绘、头像、技能图标和 UI 资源目前服务于原型验证，可在视觉阶段统一替换。",
    ],
    references: [
      {
        title: "《杀戮尖塔》路线结构",
        text: "参考其路线选择结构，将战斗、商人、休整、精英等节点转化为玩家的风险收益判断。",
      },
      {
        title: "海克斯强化类机制",
        text: "参考“改变技能使用方式”的设计思路，将附魔设计为绑定单个技能的强化，而不是简单的全局数值提升。",
      },
    ],
    clips: [
      { title: "路线选择", text: "展示玩家如何根据精英、商店、休整和 Boss 路径做规划。" },
      { title: "战斗技能", text: "展示战士与法师的攻击距离、节奏和技能差异。" },
      { title: "职业强化", text: "展示职业经验、强化树和技能分支选择。" },
      { title: "奖励构筑", text: "展示圣物、附魔、商人商品如何改变本局 Build。" },
    ],
  },
  roguelike: {
    id: "02",
    title: "Combat Shuang",
    subtitle: "从自动攻击原型到可验证的成长反馈",
    role: "系统策划 / 数值设计 / 原型测试",
    period: "2026.01 — 2026.04",
    engine: "Unity / C#",
    media: "/media/roguelike-auto-attack.gif",
    fullGameplayVideo: "/media/roguelike-full-gameplay-demo-web.mp4",
    fullGameplayPoster: "/media/roguelike-full-gameplay-poster.png",
    summary:
      "Combat Shuang 是一个围绕“低操作负担 + 高频成长选择”搭建的肉鸽原型。玩家通过移动和翻滚处理走位压力，武器自动锁定最近敌人并攻击；击杀敌人获得经验，升级后进入三选一词条选择，随后面对更高密度、更高强度的波次。",
    responsibilities: [
      "梳理核心战斗循环：移动、自动攻击、击杀、经验、升级、波次推进。",
      "设计 12 类升级词条与特殊弹道词条刷新机制。",
      "设计 Lv.6 后的风险收益惩罚，避免成长曲线过度线性。",
      "根据 2 轮原型测试调整敌群强度、升级反馈和战斗节奏。",
    ],
    metrics: [
      { value: "12", label: "升级词条类型" },
      { value: "9 + 3", label: "基础属性 + 特殊弹道" },
      { value: "15%", label: "特殊词条初始概率" },
      { value: "30", label: "首波敌人数量" },
      { value: "+10", label: "每波敌人数成长" },
      { value: "0.5s", label: "生成间隔下限" },
    ],
    loop: [
      {
        step: "01",
        title: "移动与规避",
        text: "玩家通过 WASD 移动，并可通过双击方向键触发翻滚。翻滚期间短暂无敌，用来处理敌群包围与冲刺敌人的高压瞬间。",
      },
      {
        step: "02",
        title: "自动锁敌攻击",
        text: "武器会自动搜索最近敌人；存在目标时显示武器并按冷却发射子弹，减少瞄准负担，让注意力集中在走位和成长选择。",
      },
      {
        step: "03",
        title: "击杀与经验",
        text: "敌人死亡后给予经验与分数。经验满足阈值后升级，阈值按 1.2 倍递增，同时回复 30% 最大生命，形成稳定的阶段奖励。",
      },
      {
        step: "04",
        title: "升级三选一",
        text: "每次升级暂停战斗并生成词条选项，玩家在即时收益与长期风险之间做选择，强化每局 Build 的差异。",
      },
    ],
    loopDiagram: [
      {
        code: "MOVE",
        title: "移动 / 翻滚",
        text: "WASD 走位，双击方向键翻滚，短暂无敌处理包围压力。",
      },
      {
        code: "TARGET",
        title: "自动锁敌",
        text: "检测最近敌人，有目标时显示武器并进入攻击节奏。",
      },
      {
        code: "FIRE",
        title: "自动攻击",
        text: "按冷却发射子弹，多弹道、暴击、弹射影响输出反馈。",
      },
      {
        code: "KILL",
        title: "击杀 / XP",
        text: "敌人死亡给经验与分数，XP 满足阈值触发升级。",
      },
      {
        code: "CHOICE",
        title: "升级三选一",
        text: "暂停战斗生成词条，选择属性或特殊弹道形成 Build。",
      },
      {
        code: "PRESSURE",
        title: "波次加压",
        text: "敌人数、血量、伤害与生成频率递增，迫使玩家重新走位。",
      },
    ],
    loopModifiers: [
      "XP 阈值 ×1.2",
      "升级回复 30% 最大生命",
      "15% 特殊词条入池",
      "Lv.6 后风险收益",
      "每波敌人 +10",
      "生成间隔最低 0.5s",
    ],
    upgradeSystem: [
      {
        title: "基础属性池",
        items: ["生命 +3", "速度 +0.5", "暴击率 +15%", "暴击伤害 +30%", "伤害 +5", "护甲 +1", "减伤 +5%", "闪避 +10%", "生命恢复 +1"],
      },
      {
        title: "特殊弹道池",
        items: ["投射物数量 +1", "弹射次数 +1", "最终伤害 +25%"],
      },
      {
        title: "概率与节奏",
        items: ["普通词条 15% 概率出现双倍数值", "特殊词条初始 15% 概率加入池", "未出现特殊词条时概率递增，出现后重置"],
      },
    ],
    riskReward: [
      "Lv.6 后选择伤害：玩家受到伤害 +10%",
      "Lv.6 后选择速度：玩家造成伤害 -10%",
      "Lv.6 后选择生命：玩家移动速度 -0.3",
    ],
    upgradeEvidence: {
      image: "/media/roguelike-cursed-upgrade.png",
      video: "/media/roguelike-cursed-upgrade-demo-web.mp4",
      label: "LV.10 CURSED UPGRADE",
      title: "诅咒升级实机证据",
      text: "Lv.6 后，部分高收益词条会附带负面代价。图中伤害 +5 的同时，玩家受到伤害 +10%，用短期输出收益换取更高生存压力。",
    },
    uiShowcase: {
      title: "UI 信息架构：让玩家理解规则、调整设置并切换语言",
      summary:
        "在同一个 Unity 原型中，我参与了主菜单、How To Play、Setting 与本地化 UI 的整理。重点不是单张页面美化，而是把新手理解、可用设置、交互反馈和中英日适配串成完整的玩家入口体验。",
      flow: ["Main Menu", "How To Play", "Settings", "Language", "Gameplay"],
      points: [
        {
          title: "玩法说明拆层",
          text: "How To Play 将移动 / Dash、自动攻击、经验升级拆成独立信息块，降低第一次进入游戏时的理解成本。",
        },
        {
          title: "设置反馈闭环",
          text: "Setting 页面提供音量百分比、音量条填充、Mute / Unmute 状态和按钮反馈，让设置行为有明确结果。",
        },
        {
          title: "多语言适配",
          text: "UI 文案通过 Unity Localization 管理 EN / 中文 / 日文版本，兼顾按钮、说明文本和玩法术语的一致性。",
        },
      ],
      clips: [
        {
          title: "How To Play 页面展示",
          label: "ONBOARDING",
          src: "/media/ui-how-to-play.mp4",
          text: "展示移动、Dash、自动攻击和升级成长说明，把核心系统拆成玩家能快速扫读的教学模块。",
        },
        {
          title: "Setting 声音调节",
          label: "SETTINGS",
          src: "/media/ui-settings-audio.mp4",
          text: "展示 +/- 调节、百分比变化、音量条反馈和 Mute / Unmute 状态切换。",
        },
        {
          title: "语言切换演示",
          label: "LOCALIZATION",
          src: "/media/ui-language-switch.mp4",
          text: "展示 UI 文案在不同语言下切换，用实际界面说明本地化落地，而不是只列语言能力。",
        },
      ],
    },
    upgradeTable: [
      { name: "生命值", type: "基础属性", value: "+3 最大生命", condition: "普通升级池", purpose: "提高容错；Lv.6 后选择会降低移速 -0.3" },
      { name: "速度", type: "基础属性", value: "+0.5 移速 / +10% 闪避", condition: "普通升级池", purpose: "提高走位能力；Lv.6 后选择会降低造成伤害 -10%" },
      { name: "伤害", type: "基础属性", value: "+5 攻击力", condition: "普通升级池", purpose: "提升清怪效率；Lv.6 后选择会使受到伤害 +10%" },
      { name: "暴击率", type: "基础属性", value: "+15%", condition: "普通升级池", purpose: "提高爆发频率，配合暴击伤害形成输出路线" },
      { name: "暴击伤害", type: "基础属性", value: "+30%", condition: "普通升级池", purpose: "放大暴击收益，强化高风险输出 Build" },
      { name: "护甲", type: "防御属性", value: "+1", condition: "普通升级池", purpose: "抵消固定伤害，提升面对密集敌群时的生存稳定性" },
      { name: "减伤", type: "防御属性", value: "+5%", condition: "普通升级池", purpose: "百分比降低最终受伤，代码上限为 80%" },
      { name: "闪避", type: "防御属性", value: "+10%", condition: "普通升级池", purpose: "提供概率规避，代码上限为 70%" },
      { name: "生命恢复", type: "续航属性", value: "+1 / 5 秒", condition: "普通升级池", purpose: "拉长单局存活时间，支持消耗型打法" },
      { name: "投射物", type: "特殊弹道", value: "+1 子弹数量", condition: "15% 初始概率入池", purpose: "扩大攻击覆盖面，强化自动攻击反馈" },
      { name: "弹射", type: "特殊弹道", value: "+1 弹射次数", condition: "15% 初始概率入池", purpose: "提升群体清怪效率，让弹道升级带来可见差异" },
      { name: "总伤害", type: "特殊强化", value: "+25% 最终伤害", condition: "15% 初始概率入池", purpose: "作为稀有高收益输出强化，提升 Build 峰值" },
    ],
    systemRules: [
      "每次升级生成三选一选项，并暂停战斗让玩家决策。",
      "普通词条有 15% 概率出现双倍数值。",
      "特殊词条初始 15% 概率加入候选池；若未进入最终选项，概率逐次 +15%，最高到 100%；出现后重置为 15%。",
      "Lv.6 起启动诅咒/惩罚机制，让高收益选择附带负面代价。",
    ],
    playtestDocs: [
      {
        title: "1st Playtest",
        date: "2026.02.26",
        summary: "第一轮集中发现教程传达、Dash 价值、敌人强度、升级频率和重复性问题，为系统扩展与节奏调整提供依据。",
        status: "匿名测试摘要",
      },
      {
        title: "2nd Playtest",
        date: "2026.03.12",
        summary: "第二轮继续验证升级说明、地图边界、波次节奏、Boss 强度和本地化可读性，同时收集到操作清晰、技能组合有趣的正向反馈。",
        status: "匿名测试摘要",
      },
    ],
    iterationRecords: [
      {
        title: "让 Dash 和移动真正参与生存决策",
        before: "第一轮多名测试者不知道可以双击翻滚，或认为移动与 Dash 对生存帮助不大；也有反馈指出后期几乎不需要移动来躲避敌人。",
        action: "保留低操作自动攻击，把移动压力转向敌群、远程子弹、冲刺敌人与地图陷阱；Dash 设计为短暂无敌，用来处理包围和高压瞬间。",
        result: "第二轮仍发现早期 Dash 使用率不高，但玩家已经能在新地图中明确识别火球、旋转刀等需要躲避的威胁，说明移动压力开始变得可感知。",
        evidence: "1st Playtest 2/26 · 2nd Playtest 3/12 · PlayerController.cs",
      },
      {
        title: "扩展升级池，减少重复选项和线性成长",
        before: "第一轮反馈中出现“升级选项重复”“部分选项明显弱于其他选项”“内容重复后乐趣下降”等问题。",
        action: "在 9 项基础属性外加入投射物、弹射、总伤害 3 类特殊弹道，并设置特殊词条概率累积，让 Build 不只停留在面板数值。",
        result: "第二轮出现了正向反馈：操作简单清晰，技能组合更多且有趣；同时暴露出升级说明仍不够清楚，因此将词条描述和图标一致性列为迭代重点。",
        evidence: "1st Playtest 2/26 · 2nd Playtest 3/12 · Menu_LevelUp.cs",
      },
      {
        title: "用诅咒升级限制中后期滚雪球",
        before: "第一轮和第二轮都出现“游戏过于简单”“升级后玩家过强”“Boss 很容易被击败”的反馈，说明成长收益缺少反向约束。",
        action: "Lv.6 后启动风险收益机制：选择伤害会增加受到伤害，选择速度会降低造成伤害，选择生命会降低移动速度。",
        result: "升级从单纯正收益变成取舍题，让玩家在输出、生存和机动之间判断当前局势；这部分已通过诅咒升级实机视频展示。",
        evidence: "1st Playtest 2/26 · 2nd Playtest 3/12 · Menu_LevelUp.cs",
      },
      {
        title: "重调波次压力，避免前期过空和后期失控",
        before: "第一轮反馈认为敌人血量太低、敌人还没靠近就死亡；第二轮反馈则指出前两波过易，但第三波敌人出现过密、移动区域偏小。",
        action: "通过敌人数、生命倍率、伤害、经验和生成间隔建立波次成长曲线，并将节奏调整集中到可量化参数上。",
        result: "页面中保留了当前版本的波次规则作为阶段结果：首波 30 敌人、每波 +10、生命每波 +30%、生成间隔最低 0.5 秒。",
        evidence: "1st Playtest 2/26 · 2nd Playtest 3/12 · EnemySpawner.cs",
      },
    ],
    enemies: [
      {
        name: "追击敌人",
        text: "持续向玩家靠近，并带有简单避让，承担基础包围压力。",
      },
      {
        name: "远程敌人",
        text: "进入射程后蓄力瞄准再发射，迫使玩家持续移动，打断安全站桩。",
      },
      {
        name: "冲刺敌人",
        text: "检测到玩家后蓄力并高速冲刺，制造明显的预警、规避和惩罚节奏。",
      },
    ],
    wave:
      "波次从 30 个敌人起步，每波增加 10 个敌人；敌人生命按每波 30% 增长，伤害与经验同步提升，生成间隔每波缩短 0.1 秒并限制在 0.5 秒下限。",
  },
  ui: {
    id: "03",
    title: "Combat Shuang UI",
    subtitle: "从新手说明到设置反馈的完整界面流程",
    role: "UI 策划 / 信息架构 / 本地化适配",
    period: "2026.01 — 2026.04",
    engine: "Unity UI / Localization",
    cover: "/media/ui-main-menu-cover.png",
    summary:
      "这是 Combat Shuang 项目中的 UI 案例，但单独作为界面作品展示。重点不是单张页面美化，而是把新手理解、设置控制、按钮反馈和中英日语言适配串成完整的玩家入口体验。",
    metrics: [
      { value: "3", label: "核心 UI 场景" },
      { value: "EN/CN/JP", label: "本地化语言" },
      { value: "5%", label: "音量调节步进" },
      { value: "3", label: "展示视频" },
    ],
    brief: {
      problem:
        "原型的核心玩法包含移动、Dash、自动攻击、经验升级和多语言文本。如果只把玩家直接丢进战斗，第一次进入时会同时面对操作、规则和设置入口，理解成本偏高。",
      approach:
        "我把 UI 拆成主菜单入口、How To Play 教学、Setting 设置反馈和语言切换四个层级：先让玩家知道去哪，再让玩家理解怎么玩，最后确保设置与本地化可被验证。",
      outcome:
        "最终页面不只展示界面美术，而是展示一套可运行的玩家入口流程：从菜单选择到教学阅读，从音量调整到语言切换，都能用实机视频证明已经在 Unity 中落地。",
    },
    designDecisions: [
      {
        title: "入口先清楚",
        text: "主菜单保留 Start / Setting / How To Play 等基础路径，让玩家进入战斗前有明确选择，而不是依赖口头说明。",
      },
      {
        title: "教学先拆层",
        text: "把移动、Dash、自动攻击、升级成长拆成可扫读的信息块，适合第一次接触原型的测试玩家快速理解。",
      },
      {
        title: "设置要有反馈",
        text: "音量变化用百分比、进度条和 Mute 状态同步反馈，避免玩家点击后不知道设置是否生效。",
      },
      {
        title: "语言要能验证",
        text: "中英日文本通过实际切换视频展示，说明本地化不是简历标签，而是进入了界面流程。",
      },
    ],
    flow: ["Main Menu", "How To Play", "Settings", "Language", "Gameplay"],
    points: [
      {
        title: "玩法说明拆层",
        text: "How To Play 将移动 / Dash、自动攻击、经验升级拆成独立信息块，降低第一次进入游戏时的理解成本。",
      },
      {
        title: "设置反馈闭环",
        text: "Setting 页面提供音量百分比、音量条填充、Mute / Unmute 状态和按钮反馈，让设置行为有明确结果。",
      },
      {
        title: "多语言适配",
        text: "UI 文案通过 Unity Localization 管理 EN / 中文 / 日文版本，兼顾按钮、说明文本和玩法术语的一致性。",
      },
    ],
    clips: [
      {
        title: "How To Play 页面展示",
        label: "ONBOARDING",
        src: "/media/ui-how-to-play.mp4",
        text: "展示移动、Dash、自动攻击和升级成长说明，把核心系统拆成玩家能快速扫读的教学模块。",
      },
      {
        title: "Setting 声音调节",
        label: "SETTINGS",
        src: "/media/ui-settings-audio.mp4",
        text: "展示 +/- 调节、百分比变化、音量条反馈和 Mute / Unmute 状态切换。",
      },
      {
        title: "语言切换演示",
        label: "LOCALIZATION",
        src: "/media/ui-language-switch.mp4",
        text: "展示 UI 文案在不同语言下切换，用实际界面说明本地化落地，而不是只列语言能力。",
      },
    ],
    implementation: [
      {
        title: "SettingAudioController.cs",
        text: "把音量百分比、Mute 状态、音量条填充和按钮输入连接成可反馈的设置闭环。",
      },
      {
        title: "UIHoverScaleGlow.cs",
        text: "为按钮提供缩放和发光反馈，让菜单、设置和教学页面的交互更清楚。",
      },
      {
        title: "Unity Localization Tables",
        text: "用 UI 表管理菜单、玩法说明、设置和结算等界面文案的中英日版本。",
      },
    ],
  },
  vampire: {
    id: "04",
    title: "Vampire Survivors 核心玩法分析",
    subtitle: "低门槛自动战斗如何形成高频成长爽感",
    role: "游戏系统分析 / 成长反馈拆解 / 策划文档",
    period: "2026",
    engine: "游戏分析文档",
    media: "/media/vampire-analysis-cover.png",
    pdf: "/docs/vampire-survivors-analysis.pdf",
    spreads: ["/media/vampire-analysis-page-02.png", "/media/vampire-analysis-page-03.png"],
    summary:
      "这是一份围绕《Vampire Survivors》的系统拆解文档，重点分析它如何用极低操作门槛、自动战斗、经验资源、随机升级、武器构筑和局外成长，把短局爽感转化为持续留存。",
    responsibilities: [
      "拆解目标用户、产品定位和轻量化 Roguelite 体验。",
      "梳理 0—30 分钟局内节奏：入门、成长、压迫、终局。",
      "分析经验宝石、金币、武器/被动、超武和 PowerUps 的资源关系。",
      "从策划角度提出前期引导、构筑多样性和中后期目标感优化建议。",
    ],
    metrics: [
      { value: "32", label: "分析文档页数" },
      { value: "4", label: "局内节奏阶段" },
      { value: "2", label: "资源成长层" },
      { value: "6 + 6", label: "武器 / 被动槽位" },
      { value: "30min", label: "单局时间上限" },
      { value: "3", label: "优化方向" },
    ],
    analysisFramework: [
      {
        title: "核心循环",
        text: "移动走位、击杀敌群、拾取经验、升级三选一、构筑成型，再回到更高密度的敌群压力。",
      },
      {
        title: "成长反馈",
        text: "经验宝石提供局内即时成长，金币和 PowerUps 把失败转化为下一局的长期成长。",
      },
      {
        title: "构筑系统",
        text: "武器与被动的槽位限制让每次选择都有机会成本，超武合成为玩家提供强目标感。",
      },
      {
        title: "留存结构",
        text: "角色、地图、收藏图鉴和局外强化把单局爽感延展为持续探索目标。",
      },
    ],
    phaseTable: [
      { phase: "探索适应", time: "0—3 分钟", pressure: "敌人密度低，操作压力小", goal: "熟悉移动、拾取和自动战斗" },
      { phase: "成长过渡", time: "3—10 分钟", pressure: "敌群数量增加，开始形成围压", goal: "选择武器与被动，建立构筑方向" },
      { phase: "构筑成型", time: "10—20 分钟", pressure: "敌人密度和精英单位提升", goal: "追求超武合成，提高击杀效率" },
      { phase: "终局压迫", time: "20—30 分钟", pressure: "高密度敌群持续压迫", goal: "验证 Build 强度并冲刺终局" },
    ],
    keyInsights: [
      {
        title: "降低操作门槛不是降低决策深度",
        text: "自动攻击减少输入负担，但把玩家注意力转移到移动路线、拾取时机、升级选择和构筑规划上。",
      },
      {
        title: "压力与成长交替制造爽感",
        text: "敌群压力不断推高，成长系统不断提供突破压力的手段，形成“接近危险—获得成长—反向压制”的节奏。",
      },
      {
        title: "双资源结构同时服务短期和长期目标",
        text: "经验宝石负责局内即时反馈，金币与 PowerUps 负责局外积累，让失败也能被转化为下一局动机。",
      },
    ],
    recommendations: [
      {
        issue: "前期构筑理解门槛偏高",
        suggestion: "加入轻量合成提示，不直接给答案，但降低玩家因不了解武器/被动关系带来的挫败感。",
      },
      {
        issue: "成熟玩家容易形成固定最优路线",
        suggestion: "加入构筑挑战、角色限定目标或图鉴激励，引导玩家尝试非主流 Build。",
      },
      {
        issue: "中后期构筑完成后目标感下降",
        suggestion: "加入终局 Bonus 强化或临时目标，让 20—30 分钟阶段仍有新的追求。",
      },
    ],
    transfer: [
      {
        title: "自动攻击",
        text: "分析低操作门槛后，我在 Combat Shuang 原型中保留自动锁敌与自动攻击，把玩家注意力放回走位、升级选择和敌群压力。",
      },
      {
        title: "高频成长",
        text: "经验宝石与升级节奏的拆解，反向影响了原型里的 XP、升级三选一和词条反馈设计。",
      },
      {
        title: "压力回流",
        text: "Vampire 的敌群压力曲线启发了原型中的波次数值：敌人数、血量和生成间隔随波次变化。",
      },
      {
        title: "风险收益",
        text: "为了避免中后期只堆正收益，我在原型中加入 Lv.6 后诅咒升级，让成长选择变成取舍题。",
      },
    ],
  },
};

export const projects = rewriteAbsolutePaths(rawProjects);
export const caseStudies = rewriteAbsolutePaths(rawCaseStudies);

export const strengths = [
  {
    no: "A",
    title: "系统与成长设计",
    en: "SYSTEM DESIGN",
    text: "能够围绕核心循环、经验成长、升级词条、风险收益与波次压力设计系统规则，并用可运行原型验证玩家是否真的感受到成长。",
    tools: "Core Loop · Progression · Balance · Prototype",
  },
  {
    no: "B",
    title: "游戏分析与文档",
    en: "GAME ANALYSIS",
    text: "能拆解成熟游戏的目标用户、局内节奏、资源循环、构筑系统与留存结构，并把分析结论迁移到自己的原型设计中。",
    tools: "System Breakdown · Retention · Docs",
  },
  {
    no: "C",
    title: "Playtest 与反馈迭代",
    en: "PLAYTEST",
    text: "能整理测试观察、玩家困惑与反馈建议，将其转化为升级说明、波次压力、移动价值和战斗反馈等可执行改动。",
    tools: "Observation · Feedback · Iteration",
  },
  {
    no: "D",
    title: "UI / 本地化 / 信息传达",
    en: "UI & LOCALIZATION",
    text: "具备中英文沟通与海外学习背景，完成过中英日游戏界面适配，关注界面文案、玩家理解成本与信息传达的一致性。",
    tools: "Unity UI · CN / EN / JP · Communication",
  },
];

export const experience = [
  {
    year: "2026",
    range: "01 — 04",
    role: "游戏策划 / UI 策划",
    org: "UC Santa Cruz · 小组课程项目",
    detail: "完成 Combat Shuang 的肉鸽核心循环、12 类随机词条、6 级风险收益解锁机制、2 轮原型测试，以及游戏 UI 流程与多语言适配。",
  },
  {
    year: "2019",
    range: "08 — 2026.04",
    role: "Computer Science: Game Design",
    org: "University of California, Santa Cruz",
    detail: "学习游戏系统、交互叙事、原型制作、数据结构、算法、软件工程与 UI / UX。",
  },
];
