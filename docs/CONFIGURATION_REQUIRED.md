# 当前配置与待补充事项

这是可构建、可部署的门户源码。域名、支持入口或可选业务链接留空，不会被替换成虚构信息，也不等于这些服务已经接通。配置主要集中在 `src/config/site.ts`，历史案例位于 `src/data/signal-examples.json`。

## 已配置

| 项目 | 当前内容 |
|---|---|
| Discord 邀请 | `https://discord.gg/RxEH3E73J`，全部加入入口共用 |
| 语言 | 英文 `/` 与中文 `/zh`，各有快速入门和风险说明 |
| 获取访问方式 | `accessMode: contact`，通过 Discord 了解当前会员和接入说明 |
| 中文图表 | 用户选定的 AAPL 中文历史图 |
| 英文图表 | 当前页面选定的 GOOG 历史图 |
| 普通信号 | NVDA / BUY / 1H / 214.86 / 2026-10-26 22:30 |
| APEX 示例 | AAPL / SELL，五个不同周期，保留对应七日窗口与五条时间证据 |
| 呈现方式 | 消息卡片及 APEX 横幅为 HTML/CSS，图片随 `public` 一起部署 |

这些图表、消息卡片是独立的历史案例，不是当前行情或同一笔事件。保留历史标识不影响使用生产构建。

## 后续补充

| 项目 / 配置位置 | 当前处理 | 何时需要补充 |
|---|---|---|
| 正式域名 `NEXT_PUBLIC_SITE_URL` | 空值可运行；无 canonical、语言替代地址与 sitemap 条目，保持 noindex | 域名及 HTTPS 配好后填写正式根地址，重新构建 |
| `links.support` | 没有公开支持入口，隐藏相应入口 | 有真实支持频道、工单页或邮箱后配置 |
| `links.subscriptionConsole` | 使用对应语言的站内成员操作说明 | 提供真实 Discord 控制台频道，并确认成员权限 |
| `historicalSources.ordinarySignal` | 不跳转至虚构源消息 | 提供与 NVDA 示例一致的 Discord 消息链接 |
| `historicalSources.apex` | 不跳转至虚构源消息 | 提供与 AAPL APEX 示例一致的 Discord 消息链接 |
| `sourceTimezone` | 明确显示时区未确认，保留原显示时间 | 产品方确认真实 IANA 时区后填写，不能按服务器所在地猜测 |
| `links.tradingViewIndicator`、`links.watchlist` | 使用站内相应操作说明，不虚构支持范围 | 提供对外说明或真实成员频道后配置 |
| `links.tradingViewProfile`、社交链接和状态页 | 未提供则不显示 | 有真实官方入口时添加 |
| 会员方案、价格、周期、退款与取消规则 | 不展示未知价格，不启用付款 | 决定启用 checkout 时，先核实权益、价格、币种、周期与全部政策 |
| `links.checkout`、`links.billingPortal` | 不创建付款或账单假入口 | 获得实际付款页面，并通过完整配置校验后启用 |
| `links.terms`、`links.privacy` | 未提供则不创建假页面；法律和隐私适用方式仍待确认 | 确定真实主体、流程和适用政策后提供；checkout 必须满足相应检查 |
| `links.publicGuide` | 完整原指南不提供下载 | 只在明确允许公开完整指南时提供对应地址及许可 |
| 支持标的数量、市场范围、周期自选能力 | 不宣传未经验证的数量或新增能力 | 新证据成立且文案、实现同时更新后再启用 |

邀请地址来自用户提供，写入代码不等于已经验证所有访客的入群状态、邀请有效期或付费权限。成员链接需要在有权限的成员环境与新访客环境分别核验。

## 素材和发布范围

本仓库只包含当前页面选定的具体素材，并在 `public/assets/approved/manifest.json` 登记尺寸、哈希和来源。此范围不包括完整交接包、原 PDF、内部 QA 截图、研究资料或账号文件。未来新增素材应逐个登记，不能将整个资料目录放入 `public`。

无正式域名时的 noindex 是搜索引擎提示，不是访问控制。敏感内容不应进入这个宣传门户。第三方分析、支付 SDK、网页内订阅管理和 Bot 接口均未接入，不能将未来配置字段描述为已上线功能。
