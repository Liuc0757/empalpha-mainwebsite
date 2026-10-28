/** Copy source: EMP_Portal_Handoff/02_COPY_EN_ZH.md and 06_SOURCE_LEDGER.md.
 * Quick start and risk sections summarize the supplied facts; they do not reproduce the restricted PDF.
 * Publication approval is handled separately by src/config/site.ts.
 */
import type { Locale } from '../config/site';

export interface PortalCopy {
  heroDescription: string;
  signalTitle: string;
  signalBody: string;
  signalNote: string;
  apexTitle: string;
  apexBody: string;
  apexRules: string;
  apexLimit: string;
  apexIncluded: string;
  deliveryTitle: string;
  deliveryBody: string;
  deliveryTools: string;
  accessTitle: string;
  accessBody: string;
  accessNote: string;
  historicalNote: string;
  ruleDemoNote: string;
  footerRisk: string;
  independence: string;
  faq: Array<{ question: string; answer: string }>;
  steps: Array<{ title: string; body: string }>;
  quickStart: Array<{ id: string; title: string; body: string[] }>;
  risks: Array<{ title: string; body: string[] }>;
}

/** English is the default. Both languages share the same content contract. */
export const copy = {
  "en": {
    "heroDescription": "EMP marks Buy/Sell signals on TradingView after a candle closes and the indicator’s conditions are met. Subscribe to supported symbols in Discord, receive signal DMs, and see multi-timeframe context with APEX Confluence.",
    "signalTitle": "See the signal. Keep the context.",
    "signalBody": "On TradingView, EMP marks independent Buy/Sell reference points on the chart. In Discord, a signal card brings the symbol, direction, timeframe, signal price, and trigger time into one readable message.",
    "signalNote": "A signal appears after the relevant candle closes. It is a point to review—not an instruction to open or close a position.",
    "apexTitle": "Five timeframes. One evidence trail.",
    "apexBody": "APEX Confluence brings together signals recorded for the same symbol and the same direction across 1H, 2H, 3H, 4H, and 1D in a rolling seven-day window.",
    "apexRules": "Any four distinct timeframes produce a 4/5 alert. All five produce a 5/5 alert. Repeated signals on one timeframe count once; BUY and SELL are tracked separately.",
    "apexLimit": "The card shows which timeframes matched and when their signals were recorded. Coverage describes the evidence in that window—not a confidence score, win rate, or guarantee. The signals do not have to occur at the same moment.",
    "apexIncluded": "Existing subscribers do not need a separate APEX subscription.",
    "deliveryTitle": "Follow your symbols. Not every message.",
    "deliveryBody": "Use Subscribe in the Discord console to follow supported symbols. MySubscriptions shows your current list and whether DM and access are active. Manage or remove subscriptions in Discord as your watchlist changes.",
    "deliveryTools": "The console also provides Latest Signal, Unsubscribe, and Help. Latest Signal is a lookup of recorded signal information, not a live quote.",
    "accessTitle": "Start with access. Then choose your watchlist.",
    "accessBody": "Join Discord and follow the current access instructions. For TradingView indicator access, share your TradingView username with the administrator and add the indicator after authorization. To receive DMs, subscribe to supported symbols in the Discord console, check your DM and access status, and enable Discord notifications on your device.",
    "accessNote": "Ask about current membership and indicator access in Discord. Joining the server alone does not confirm paid access or indicator authorization.",
    "historicalNote": "Historical AAPL example · 24 Oct 2026. Reconstructed from an EMP Discord message. This is not a live feed or a current quote. Times are shown as they appear in the supplied screenshot; the timezone has not been confirmed.",
    "ruleDemoNote": "Illustrative states, not a record of actual notifications. The website does not generate or send trading signals.",
    "footerRisk": "EMP Signals provides technical-analysis tools and algorithm-generated reference signals based on historical price data. It does not predict future prices, execute trades, or provide investment advice. Signals do not guarantee accuracy, profits, or any future price movement. Trading involves risk. You are responsible for your decisions and their outcomes.",
    "independence": "EMP is an independent service. References to TradingView and Discord describe the tools used for charts and delivery, not an endorsement by either platform.",
    "faq": [
      {
        "question": "When does a signal appear?",
        "answer": "A signal appears after the relevant candle has closed and EMP’s conditions are met. It is not a prediction made before the candle closes. The time needed for delivery through external services can vary."
      },
      {
        "question": "Does BUY mean I should buy immediately?",
        "answer": "No. Buy and Sell are independent technical-analysis reference points, not action orders. They do not form a complete entry-and-exit plan, and your decisions remain your own."
      },
      {
        "question": "What does 5/5 mean?",
        "answer": "Five distinct timeframes recorded signals for the same symbol and direction within the rolling seven-day window. It does not mean a 100% success probability or that all five signals happened at the same moment."
      },
      {
        "question": "Which timeframes count toward APEX?",
        "answer": "1H, 2H, 3H, 4H, and 1D. Any four distinct matches can produce 4/5 coverage. A repeated signal on the same timeframe does not add another timeframe."
      },
      {
        "question": "Can BUY and SELL combine into one APEX alert?",
        "answer": "No. APEX counts each symbol and each direction separately. Opposite-direction signals are not combined to reach a coverage threshold."
      },
      {
        "question": "Is APEX a separate subscription?",
        "answer": "The current announcement makes APEX available to existing subscribers without a separate APEX subscription. Follow the current membership and access instructions for your account."
      },
      {
        "question": "Will I receive old APEX alerts after subscribing?",
        "answer": "No. Historical APEX alerts are not backfilled after subscribing or restarting the service. APEX notifications are sent when the conditions are met and the current round has not already been notified. Normal real-time signal DMs continue separately."
      },
      {
        "question": "Why have I not received an alert?",
        "answer": "Signals only appear when the rules are met, so quiet periods can be normal. Also check that the symbol is supported, your subscription exists, DM and access are active, and Discord notifications are enabled. Contact support if these settings are correct and you still suspect a delivery issue."
      },
      {
        "question": "Can timeframes disagree?",
        "answer": "Different timeframes can show different directions. The guide gives the example of a shorter-term rebound inside a longer-term decline. They describe different time scales; they are not instructions that must be combined into one trade."
      },
      {
        "question": "Does EMP work in every market condition?",
        "answer": "No. The original guide describes ranging markets as a better fit and warns that prolonged one-way trends can produce false signals against the trend. This is a usage limitation, not a performance guarantee in other conditions."
      },
      {
        "question": "Can I subscribe to any ticker or choose individual timeframes?",
        "answer": "Subscriptions are limited to the supported watchlist. Contact support about missing symbols. The current materials describe symbol subscriptions; they do not establish a user-selectable timeframe filter. Check the current console for available controls."
      },
      {
        "question": "Can I manage subscriptions on this website?",
        "answer": "No. This website explains EMP and links to its access and support channels. Signal subscriptions are managed in Discord. TradingView indicator access follows the administrator’s authorization process."
      }
    ],
    "steps": [
      {
        "title": "Join and arrange access",
        "body": "Join Discord and follow the administrator’s current membership and access instructions."
      },
      {
        "title": "Add the chart indicator",
        "body": "If you need TradingView indicator access, submit your TradingView username and wait for authorization. Then add it from Indicators → Invite-only scripts."
      },
      {
        "title": "Subscribe in Discord",
        "body": "Use Subscribe in the read-only console to follow symbols on the supported watchlist."
      },
      {
        "title": "Check delivery settings",
        "body": "Check your list in MySubscriptions, confirm DM and Access, and enable Discord notifications on your device."
      }
    ],
    "quickStart": [
      {
        "id": "access",
        "title": "1. Join Discord and arrange access",
        "body": [
          "Join the EMP Discord server and follow the administrator’s current membership and access instructions. Joining the server alone does not confirm paid access or indicator authorization.",
          "Ask about the current membership terms and which services are included. Chart access and message delivery are separate steps; the current materials do not establish that they are always bundled."
        ]
      },
      {
        "id": "tradingview",
        "title": "2. Add the TradingView indicator, if needed",
        "body": [
          "For chart access, provide your TradingView username to the administrator. After authorization, open Indicators → Invite-only scripts and add the indicator. The exact interface may change.",
          "EMP marks Buy/Sell reference points after the relevant candle closes and its conditions are met. Buy and Sell are independent markers, not a complete entry-and-exit plan.",
          "The supplied DM setup flow uses the Discord console. It does not establish a requirement to create your own TradingView Alert or purchase a particular TradingView plan; confirm your actual chart access requirements with the administrator."
        ]
      },
      {
        "id": "subscribe",
        "title": "3. Subscribe to supported symbols in Discord",
        "body": [
          "Open the read-only subscription console and use Subscribe to enter a supported symbol. Subscriptions are managed inside Discord; this website does not submit subscriptions or send signal DMs.",
          "Availability follows the current supported watchlist. Ask support about a missing symbol. The materials establish symbol subscriptions, not a user-selectable timeframe filter."
        ]
      },
      {
        "id": "existing-members",
        "title": "Existing members: check your console",
        "body": [
          "MySubscriptions shows your current symbol list, DM and Access status. Confirm that the symbol is listed and the required settings and permissions are active. Also enable Discord notifications on your device.",
          "Latest Signal queries the latest recorded signal information; it is not a live quote or an execution lookup. Subscribe adds a supported symbol, Unsubscribe removes one, and Help provides console guidance. Button names may differ slightly in the current interface.",
          "A quiet period may simply mean no signal has met the rules. If your subscription, DM, Access and device notifications appear correct but delivery still seems wrong, contact support."
        ]
      },
      {
        "id": "apex",
        "title": "Read APEX as timeframe coverage",
        "body": [
          "APEX Confluence counts signals for the same symbol and the same direction across 1H, 2H, 3H, 4H and 1D in a rolling seven-day window (168 hours). Any four distinct matches can produce 4/5; all five can produce 5/5.",
          "Repeated signals on a single timeframe count once. BUY and SELL are tracked separately. Five timeframes do not mean a 100% success probability, and the signals do not have to occur at the same moment.",
          "Existing subscribers do not need a separate APEX subscription. Historical APEX alerts are not backfilled after subscribing or restarting the service. APEX is sent when conditions are met and the current round has not already been notified. Normal real-time signal DMs continue separately."
        ]
      },
      {
        "id": "read-a-signal",
        "title": "Keep the signal fields in context",
        "body": [
          "A Discord signal card shows the symbol, direction, timeframe, Signal Price and Triggered time. Signal Price is a displayed signal reference, not an entry recommendation, execution price or current quote.",
          "The NVDA ordinary signal and AAPL APEX cards are separate historical examples reconstructed from supplied EMP messages. Their supplied date and time strings are preserved; the source timezone is unconfirmed. Source-message links may require member access.",
          "The GOOG indicator chart, NVDA ordinary signal and AAPL APEX message are independent historical examples. They do not document the same event."
        ]
      },
      {
        "id": "limitations",
        "title": "Understand the limits before use",
        "body": [
          "The original guide describes ranging markets as a better fit and warns that prolonged one-way trends can produce false signals against the trend. Different timeframes can also show different directions.",
          "EMP provides technical-analysis references, not investment advice. It does not predict future prices, execute trades, or guarantee accuracy or returns. Review the risk information before relying on a signal."
        ]
      }
    ],
    "risks": [
      {
        "title": "Technical references, not trade instructions",
        "body": [
          "EMP Signals provides technical-analysis tools and algorithm-generated reference signals based on historical price data. It does not predict future prices, execute trades, or provide investment advice. Signals do not guarantee accuracy, profits, or any future price movement. Trading involves risk. You are responsible for your decisions and their outcomes.",
          "Buy and Sell markers are independent reference points. They do not form a complete entry-and-exit plan. Signal Price does not represent a recommended entry or a confirmed execution."
        ]
      },
      {
        "title": "Market conditions and conflicting timeframes",
        "body": [
          "The original guide describes ranging markets as a better fit and warns that prolonged one-way trends can produce false signals against the trend. This does not guarantee performance in ranging markets or any other conditions.",
          "Different timeframes may show different directions, such as a shorter-term rebound within a longer-term decline. They describe different time scales; they need not be combined into one trade."
        ]
      },
      {
        "title": "APEX measures coverage, not probability",
        "body": [
          "APEX aggregates the same symbol and direction across 1H, 2H, 3H, 4H and 1D within a rolling seven-day (168-hour) window. Any four distinct timeframes can form 4/5; all five can form 5/5. Repeated signals on one timeframe count once, and opposite directions are not combined.",
          "A 5/5 card is not a 100% success probability, a confidence score or a return guarantee. The five signals need not have occurred at the same time.",
          "Historical APEX alerts are not backfilled after subscribing or restarting the service. Normal real-time signal DMs continue separately."
        ]
      },
      {
        "title": "Delivery and access depend on your setup",
        "body": [
          "Signals appear only after a candle has closed and EMP’s conditions are met. Quiet periods can be normal. Delivery through external services can vary; no fixed delivery delay is promised.",
          "Only supported symbols can be subscribed to. Receiving Discord DMs requires the relevant subscription, access and DM settings, as well as device notification settings. Chart access follows the administrator’s TradingView authorization process."
        ]
      },
      {
        "title": "Historical and illustrative examples",
        "body": [
          "Historical cards and charts explain the product interface. They are not live quotes, an audited performance record or evidence of future results. The NVDA signal, AAPL APEX message and GOOG chart are separate historical examples.",
          "Historical display times are preserved as supplied; the source timezone is unconfirmed. DEMO states illustrate public APEX coverage rules, not actual notifications. This website does not generate or send signals, manage subscriptions or execute trades."
        ]
      },
      {
        "title": "Independent service",
        "body": [
          "EMP is an independent service. References to TradingView and Discord describe the tools used for charts and delivery, not an endorsement by either platform."
        ]
      }
    ]
  },
  "zh": {
    "heroDescription": "EMP 在 K 线收盘且规则满足后，于 TradingView 图表标记 Buy/Sell 信号。在 Discord 订阅支持的标的，接收信号私信，并通过 APEX Confluence 查看多周期信号的汇总与证据。",
    "signalTitle": "看见信号，也看见上下文。",
    "signalBody": "在 TradingView 中，EMP 将独立的 Buy/Sell 参考点标记在图表上。在 Discord 中，信号卡片集中呈现标的、方向、周期、信号价格和触发时间。",
    "signalNote": "信号在对应 K 线收盘后出现。它是供你查看的参考点，不是开仓或平仓指令。",
    "apexTitle": "五个周期，一条可核对的信号记录。",
    "apexBody": "APEX Confluence 在滚动七天窗口内，汇总同一标的、同一方向在 1H、2H、3H、4H 和 1D 五个周期上的信号。",
    "apexRules": "任意四个不同周期匹配时，发送 4/5 提醒；五个周期全部匹配时，发送 5/5 提醒。同一周期重复出现只计一次，BUY 与 SELL 分开统计。",
    "apexLimit": "卡片展示匹配的周期及对应信号时间。覆盖度描述的是该窗口内的信号证据，不是置信度、胜率或收益保证。信号不必在同一时刻出现。",
    "apexIncluded": "现有订阅用户无需单独购买 APEX。",
    "deliveryTitle": "订阅你关注的标的，而不是所有消息。",
    "deliveryBody": "在 Discord 控制台使用 Subscribe，订阅支持的标的。通过 MySubscriptions 查看当前列表，检查 DM 与 Access 状态；关注列表变化时，也在 Discord 中管理或取消订阅。",
    "deliveryTools": "控制台还提供 Latest Signal、Unsubscribe 和 Help。Latest Signal 用于查询已记录的最新信号，不是实时行情报价。",
    "accessTitle": "先开通访问，再建立你的关注列表。",
    "accessBody": "加入 Discord，并按当前说明获取对应访问权限。需要使用 TradingView 指标时，向管理员提供 TradingView 用户名，授权后再添加指标。接收私信提醒时，在 Discord 控制台订阅支持的标的，检查 DM 与 Access 状态，并开启设备上的 Discord 通知。",
    "accessNote": "当前会员与指标访问方式请在 Discord 中了解。加入服务器本身不代表已获得付费服务或指标授权。",
    "historicalNote": "AAPL 历史示例 · 2026年10月24日。根据 EMP Discord 消息重排展示，不是实时推送或当前报价。时间保留原截图显示值，时区尚未确认。",
    "ruleDemoNote": "以下为示意状态，不是真实通知记录。网页不会生成或发送交易信号。",
    "footerRisk": "EMP Signals 提供基于历史价格数据的技术分析工具与算法参考信号，不预测未来价格、不执行交易，也不提供投资建议。信号不保证准确率、收益或未来价格方向。交易存在风险，决策及其结果由使用者自行承担。",
    "independence": "EMP 为独立服务。文中提及 TradingView 与 Discord，是为了说明图表和消息交付方式，不代表获得这两个平台的官方背书。",
    "faq": [
      {
        "question": "信号什么时候出现？",
        "answer": "对应 K 线收盘且 EMP 规则满足后，才会出现信号。它不是在收盘前预测结果。外部服务的消息送达时间可能变化。"
      },
      {
        "question": "出现 BUY 就应该立即买入吗？",
        "answer": "不是。Buy 与 Sell 是独立的技术分析参考点，不是操作指令，也不构成一套完整的进出场计划。是否采取行动由你自行判断。"
      },
      {
        "question": "5/5 代表什么？",
        "answer": "在滚动七天窗口内，五个不同周期都记录了同一标的、同一方向的信号。它不代表100%成功概率，也不表示五个信号在同一时刻出现。"
      },
      {
        "question": "哪些周期参与 APEX？",
        "answer": "1H、2H、3H、4H 和1D。任意四个不同周期匹配，都可以形成4/5覆盖。同一周期重复出现信号，不会增加周期数量。"
      },
      {
        "question": "BUY 和 SELL 能合并计算共振吗？",
        "answer": "不能。APEX 对每个标的、每个方向分别统计，不会把相反方向的信号合并凑成覆盖门槛。"
      },
      {
        "question": "APEX 需要另外订阅吗？",
        "answer": "根据当前公告，现有订阅用户无需单独购买 APEX。具体账号权限仍以当前会员和接入说明为准。"
      },
      {
        "question": "新订阅后会补发以前的 APEX 吗？",
        "answer": "不会。订阅或服务重启后，不补发历史 APEX 提醒。只有条件满足且当前轮次尚未通知时，才发送 APEX。普通实时信号私信独立继续运行。"
      },
      {
        "question": "为什么一直没有收到提醒？",
        "answer": "只有规则满足时才会产生信号，一段时间没有提醒可能是正常情况。同时请检查标的是否受支持、是否已订阅、DM 与 Access 是否正常，以及设备通知是否开启。上述设置正常但仍怀疑推送异常时，请联系支持。"
      },
      {
        "question": "不同周期方向相反，是不是指标出错？",
        "answer": "不同周期可以给出不同方向。指南中的例子是：长期下跌过程中，短周期出现反弹。它们描述的是不同时间尺度，不是必须合成一笔交易的指令。"
      },
      {
        "question": "EMP 适合所有行情吗？",
        "answer": "不是。原指南将震荡行情描述为更适合的使用场景，并提醒：持续单边趋势中可能出现反向误报。这是使用边界，不代表其他行情下的效果保证。"
      },
      {
        "question": "可以订阅任意股票或独立选择周期吗？",
        "answer": "订阅范围以当前支持列表为准，缺少的标的可向支持人员提出需求。现有资料说明的是按标的订阅，没有确认可独立选择提醒周期；实际可用操作以当前控制台为准。"
      },
      {
        "question": "可以直接在网站上管理订阅吗？",
        "answer": "不可以。网站用于介绍 EMP，并提供接入和支持入口。信号订阅在 Discord 中管理；TradingView 指标访问按管理员授权流程办理。"
      }
    ],
    "steps": [
      {
        "title": "加入并获取访问",
        "body": "加入 Discord，按管理员当前的会员与接入说明获取相应权限。"
      },
      {
        "title": "添加图表指标",
        "body": "需要 TradingView 指标访问时，提交 TradingView 用户名并等待授权，再从 Indicators → Invite-only scripts 添加。"
      },
      {
        "title": "在 Discord 订阅",
        "body": "在只读控制台使用 Subscribe，订阅支持列表内的标的。"
      },
      {
        "title": "检查提醒设置",
        "body": "在 MySubscriptions 查看列表，确认 DM 与 Access，并开启设备上的 Discord 通知。"
      }
    ],
    "quickStart": [
      {
        "id": "access",
        "title": "1. 加入 Discord 并获取访问",
        "body": [
          "加入 EMP Discord 服务器，按管理员当前的会员与接入说明获取对应权限。加入服务器本身，不代表已获得付费服务或指标授权。",
          "请确认当前会员条款与包含权益。图表访问和消息接收是两个操作步骤，现有资料没有确认两项授权始终捆绑。"
        ]
      },
      {
        "id": "tradingview",
        "title": "2. 按需添加 TradingView 指标",
        "body": [
          "需要图表访问时，向管理员提供 TradingView 用户名。获得授权后，从 Indicators → Invite-only scripts 中添加指标；具体界面可能更新。",
          "EMP 在对应 K 线收盘且规则满足后标记 Buy/Sell 参考点。Buy 与 Sell 是独立标记，不构成一套完整的进出场计划。",
          "资料中的私信接入流程使用 Discord 控制台，没有将自行创建 TradingView Alert 或购买某个 TradingView 套餐列为必需步骤；实际图表访问要求请向管理员确认。"
        ]
      },
      {
        "id": "subscribe",
        "title": "3. 在 Discord 订阅支持的标的",
        "body": [
          "打开只读订阅控制台，使用 Subscribe 输入受支持的标的代码。实际订阅在 Discord 内管理，本网站不会提交订阅或发送信号私信。",
          "标的范围以当前支持列表为准，缺少的标的可向支持人员提出需求。现有资料确认的是按标的订阅，没有确认可独立选择提醒周期。"
        ]
      },
      {
        "id": "existing-members",
        "title": "已有用户：检查订阅控制台",
        "body": [
          "MySubscriptions 显示当前标的列表，以及 DM 和 Access 状态。确认标的已在列表中，所需设置与权限可用，并开启设备上的 Discord 通知。",
          "Latest Signal 查询已记录的最新信号，不是实时行情或成交查询。Subscribe 用于添加受支持的标的，Unsubscribe 用于取消订阅，Help 提供控制台帮助；当前界面的按钮名称可能略有不同。",
          "一段时间没有提醒，可能只是没有满足规则的信号。如果订阅、DM、Access 和设备通知均正常，但仍怀疑推送异常，请联系支持。"
        ]
      },
      {
        "id": "apex",
        "title": "将 APEX 理解为周期覆盖",
        "body": [
          "APEX Confluence 在滚动七天（168 小时）窗口内，统计同一标的、同一方向在 1H、2H、3H、4H 和 1D 五个周期上的信号。任意四个不同周期匹配可形成 4/5，五个全部匹配可形成 5/5。",
          "同一周期重复出现只计一次，BUY 与 SELL 分开统计。五个周期覆盖不代表 100% 成功概率，也不要求信号在同一时刻出现。",
          "现有订阅用户无需单独购买 APEX。订阅或服务重启后不补发历史 APEX；只有条件满足且当前轮次尚未通知时，才发送 APEX。普通实时信号私信独立继续运行。"
        ]
      },
      {
        "id": "read-a-signal",
        "title": "结合字段理解信号",
        "body": [
          "Discord 信号卡片包含标的、方向、周期、Signal Price（信号价格）和 Triggered（触发时间）。Signal Price 是信号参考字段，不是推荐入场价、成交价或当前报价。",
          "本页的 NVDA 普通信号与 AAPL APEX 卡片，是根据用户提供的 EMP 消息重排的独立历史示例。日期与时间保留原资料显示值，来源时区尚未确认；源消息可能需要成员权限才能查看。",
          "中文版 AAPL 图表、NVDA 普通信号与 AAPL APEX 消息是独立的历史示例，不代表同一笔事件。英文版保留原 GOOG 图表。"
        ]
      },
      {
        "id": "limitations",
        "title": "使用前理解局限",
        "body": [
          "原指南将震荡行情描述为更适合的使用场景，并提醒持续单边趋势中可能出现反向误报。不同周期也可能给出不同方向。",
          "EMP 提供技术分析参考，不构成投资建议，不预测未来价格、不执行交易，也不保证准确率或收益。使用信号前请阅读风险说明。"
        ]
      }
    ],
    "risks": [
      {
        "title": "技术参考，不是交易指令",
        "body": [
          "EMP Signals 提供基于历史价格数据的技术分析工具与算法参考信号，不预测未来价格、不执行交易，也不提供投资建议。信号不保证准确率、收益或未来价格方向。交易存在风险，决策及其结果由使用者自行承担。",
          "Buy 与 Sell 是独立的参考点，不构成完整的进出场计划。Signal Price 不是推荐入场价，也不代表已确认的成交。"
        ]
      },
      {
        "title": "行情局限与多周期分歧",
        "body": [
          "原指南将震荡行情描述为更适合的使用场景，并提醒持续单边趋势中可能出现反向误报。这不代表震荡行情或其他任何行情下的效果保证。",
          "不同周期可能给出不同方向，例如长期下跌中的短期反弹。它们描述不同时间尺度，不必合并成同一笔交易。"
        ]
      },
      {
        "title": "APEX 表示覆盖，不表示概率",
        "body": [
          "APEX 在滚动七天（168 小时）窗口内，汇总同一标的、同一方向在 1H、2H、3H、4H 和 1D 上的信号。任意四个不同周期可形成 4/5，五个全部匹配可形成 5/5。同一周期重复只计一次，相反方向不混算。",
          "5/5 卡片不代表 100% 成功概率、置信度或收益保证；五个信号也不必在同一时刻出现。",
          "订阅或服务重启后不补发历史 APEX，普通实时信号私信独立继续运行。"
        ]
      },
      {
        "title": "消息交付与访问依赖设置",
        "body": [
          "只有 K 线收盘且 EMP 规则满足后才会出现信号，安静时期可能是正常情况。外部服务的消息送达时间可能变化，不承诺固定延迟。",
          "订阅仅限受支持的标的。接收 Discord 私信需要相应订阅、权限与 DM 设置，并应检查设备通知；图表访问按管理员的 TradingView 授权流程办理。"
        ]
      },
      {
        "title": "历史示例与规则演示",
        "body": [
          "历史卡片与图表用于说明产品界面，不是实时行情、经审计的业绩记录或未来结果的依据。NVDA 普通信号、AAPL APEX 消息与中文版 AAPL 图表属于独立历史示例。",
          "历史时间按原资料显示，来源时区尚未确认。DEMO 状态仅说明公开的 APEX 周期覆盖规则，不是真实通知。本网站不生成或发送信号，不管理订阅，也不执行交易。"
        ]
      },
      {
        "title": "独立服务",
        "body": [
          "EMP 为独立服务。文中提及 TradingView 与 Discord，是为了说明图表和消息交付方式，不代表获得这两个平台的官方背书。"
        ]
      }
    ]
  }
} satisfies Record<Locale, PortalCopy>;
