# Windows 服务器部署

此文档说明如何部署本仓库；不代表已经登录、安装或修改了服务器。此前确认的腾讯云产品是**轻量应用服务器 Lighthouse**，实例运行 Windows。门户应使用独立目录与端口，不覆盖现有 EMP Bot 或指标项目。

建议结构是：访客 → 公网 80/443 → IIS 或 Caddy → `127.0.0.1:3100` 上的门户 Node 服务。服务器需要两层规则都允许网站流量：腾讯云实例防火墙，以及 Windows 防火墙。

## 1. 获取源码与运行环境

准备支持 Node.js 22 的 Windows 系统、Node.js 22、npm 和 Git。若已有服务依赖其他 Node 版本，给门户使用独立运行时，不要直接更换整个服务器的 Node 环境。

以下目录仅为示例，可选择其他有足够空间的独立目录：

```powershell
New-Item -ItemType Directory -Path 'C:\EMP' -Force
Set-Location -LiteralPath 'C:\EMP'
git clone https://github.com/Liuc0757/empalpha-mainwebsite.git portal
Set-Location -LiteralPath 'C:\EMP\portal'
node --version
npm.cmd --version
npm.cmd ci
```

若仓库需要登录，用自己的 GitHub 账号授权 Git；不要将令牌写入网页配置或提交到仓库。PowerShell 中使用 `npm.cmd` 可避免 `npm.ps1` 执行策略造成的误会。

## 2. 构建和启动

没有域名也可以先运行：

```powershell
npm.cmd run build
npm.cmd run start:local
```

在服务器自身浏览器打开 `http://127.0.0.1:3100/zh`。应看到没有编号工具的中文页面，图表与消息卡片正常加载。当前命令窗口关闭后，进程可能停止；它还不是已安装的 Windows 常驻服务。

服务器只有 2GB 内存时，Windows、其他业务和构建进程会争用内存。优先在有余量的 Windows 构建机完成 `npm ci`、检查和构建，再传输**同一份源码对应的** `.next`、`public`、配置文件与 lockfile，并在目标服务器安装依赖。构建机与服务器应使用兼容的 Windows 架构和 Node 版本；不要把其他操作系统的 `node_modules` 直接搬过去。若在服务器构建，应先检查可用内存、磁盘和虚拟内存；增加虚拟内存也不保证任何资源条件下都能成功构建。

不需要上传 `EMP_Portal_Handoff`、`qa/`、研究目录或原 PDF。不要混用旧 `.next` 与新源码。

## 3. 接收公网访问

门户继续使用 `npm run start:local`，公网只开放网站代理使用的端口。以 Caddy 为例，无域名的临时 HTTP 配置可以是：

```caddyfile
:80 {
    reverse_proxy 127.0.0.1:3100
}
```

这是明文 HTTP 的连通性检查配置。将它保存为 Caddyfile，并按 Caddy 的正常方式启动代理。若使用 IIS，则由 IIS 的站点绑定接收 80/443，并通过已经安装、启用的反向代理功能转发到同一地址；仅新建 IIS 静态目录不能运行此 Next.js 应用。

在腾讯云**轻量应用服务器 → 对应实例 → 防火墙**添加允许 TCP 80、443 的入站规则，并在 Windows 防火墙允许对应网站代理端口。不要为了开放网页而放通所有端口，也不要改变现有远程桌面或其他服务的规则。先确认 80/443 未被其他站点占用；若已占用，应整合现有站点绑定。

从另一台电脑访问服务器公网 IP，核对 `/`、`/zh`、快速入门和图片。`127.0.0.1` 只表示当前机器，不能作为其他人访问服务器的地址。代理在公网接收请求时，无须公开 3100。

## 4. 配置域名与 HTTPS

购买并完成注册商要求的域名流程后，到该域名实际使用的 DNS 服务商添加记录：

| 用途 | 记录类型 | 记录值 |
|---|---|---|
| 根域名，主机记录 `@` | A | 服务器当前公网 IPv4，只填 IP |
| 可选的 `www` | CNAME | 真实根域名，只填域名 |

不要覆盖已有邮件或其他业务的记录。先使用 IPv4；仅在已经验证 IPv6 连通时添加 AAAA。

确定域名后，将 Caddyfile 的 `:80` 换成真实域名；Caddy 在满足 DNS、80/443 可访问和证书签发条件时管理 HTTPS。若选择 IIS，则配置该域名的站点绑定和有效证书，并安排证书续期。这里不预填任何未购买的域名。

复制项目内 `.env.example` 为 `.env.production`，填写 `NEXT_PUBLIC_SITE_URL` 为正式 HTTPS 根地址，重新执行：

```powershell
npm.cmd run build
```

随后重启门户进程。这个值在构建时写入页面，单独重启旧构建不会更新 canonical 或 sitemap。保持域名根地址一致，不附加 `/zh`、查询参数或片段。

## 5. 常驻运行与更新

通过合适的 Windows 服务管理方式让 Node 门户和网站代理随系统启动，并设置重启策略及日志目录。门户服务要使用明确的 Node 路径、工程工作目录与 `start:local` 入口；不要依赖远程桌面的临时命令窗口。确认重启服务器后两个服务均恢复，且不影响现有 Bot。

更新时先确认工作区没有需要保留的本地修改，再获取新代码，运行 `npm ci` 和 `npm run build`。构建通过后才切换并重启服务。保留上一份可运行构建便于恢复。

最终从外网验证：首页及中文页可访问、图片可加载、Discord 邀请地址正确、HTTPS 证书有效、重启后服务恢复。网站部署不会自动授予 Discord 会员、开通指标权限或启用付款；这些仍依赖真实业务配置。
