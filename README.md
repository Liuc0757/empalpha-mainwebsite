# EMP Signals

EMP Signals 的中英文宣传门户，使用 Next.js 和 React。这个仓库提供可独立构建、部署的页面源码：包含当前选定的图表与网页消息卡片，不依赖原交接包或本地 QA 文件。

仓库版本不包含替换编号、审阅面板、内部预览横幅和本地素材接口。页面仍明确标注历史信号及规则演示；真实订阅、会员权限和私信交付由 Discord 中的服务处理。

## 启动

使用 Node.js 22.20 或更新的兼容版本及 npm，在工程根目录执行：

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd start
```

默认服务监听 `0.0.0.0:3000`，在本机打开 `http://127.0.0.1:3000`。托管平台可以通过进程环境变量 `PORT` 指定端口；`0.0.0.0` 是监听地址，不是访客访问地址。

Windows 服务器采用反向代理时，使用：

```powershell
npm.cmd run start:local
```

这个入口只监听 `127.0.0.1:3100`，由 IIS 或 Caddy 接收公网请求并转发。完整步骤见 [Windows 部署说明](docs/DEPLOY_WINDOWS.md)。

开发时使用 `npm.cmd run dev`。开发页面也没有原本的编号审阅工具。

## 当前配置

- “加入 Discord”统一使用 `https://discord.gg/RxEH3E73J`。
- 默认英文首页 `/`，中文首页 `/zh`；两种语言各有 `/start` 和 `/risk` 页面。
- 中文图表为 AAPL，英文图表为 GOOG。NVDA 普通信号与 AAPL APEX 是独立历史案例。
- 普通信号、APEX 和其底部横幅由 HTML/CSS 渲染，历史数据集中在 `src/data/signal-examples.json`。
- 业务链接集中在 `src/config/site.ts`。未提供的链接保持空值，使用站内操作说明或隐藏入口，不生成虚构地址。
- 当前为联系获取访问的模式，不显示未经确认的价格，不提供网站内付款或订阅管理。

配置详情与剩余事项见 [待配置清单](docs/CONFIGURATION_REQUIRED.md)。

## 域名

域名是构建时的可选配置。未填写时仍可构建运行，但不会输出虚构的 canonical、语言替代地址或 sitemap 条目，并保留 `noindex`。

准备好正式 HTTPS 域名后，将 `.env.example` 复制为 `.env.production`，在 `NEXT_PUBLIC_SITE_URL=` 后填写真实根地址，然后重新构建并重启。也可以通过构建进程环境变量设置同名值。前置配置检查与 Next 构建使用相同环境配置。

不要填 GitHub 仓库地址、尚未拥有的域名或包含路径的地址。此变量仅描述网站地址；它不会替你购买域名、设置 DNS 或申请 HTTPS 证书。

## 检查与维护

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

浏览器测试需先启动一个已构建服务，再设置测试地址后运行 `npm.cmd run test:e2e`。测试报告与截图写入被 Git 忽略的 `qa/`，不作为网站公共资源。

本次实际执行结果见 [发布源码验证记录](docs/VERIFICATION.md)。

选定素材登记在 `public/assets/approved/manifest.json`。只发布页面实际使用的这些文件；原 PDF、完整指南、交接包、研究资料和本地账号信息不属于此仓库的部署内容。

推送代码到 GitHub 不等于网站已经上线。本项目使用 Node 服务部署，没有配置 GitHub Pages 自动发布；公网可访问性、域名解析、HTTPS 和服务器常驻运行仍需在目标主机完成验证。
