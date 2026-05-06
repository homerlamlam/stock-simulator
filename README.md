# Stock Signal Simulator

A 股优先的股票买卖信号辅助系统 MVP。系统使用 Mock 行情数据，根据价格波动、MA、RSI、Volatility 和用户策略参数生成可解释的交易辅助信号。

## 项目定位

- 辅助分析工具，不构成投资建议。
- 不承诺收益。
- 不做自动交易。
- 不接真实券商。
- 不做登录。
- 不做数据库。
- MVP 阶段使用 Mock/延迟行情。

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- TanStack Query
- Zustand
- Vitest
- localStorage

## 本地启动

推荐使用固定端口启动，避免打开其他项目的 Vite 服务：

```bash
npm install
npm run dev:local
```

然后打开：

```text
http://127.0.0.1:5174/
```

如果端口被占用，先停止占用 `5174` 的旧进程，再重新运行 `npm run dev:local`。不要只看 `localhost:5173`，该端口可能属于其他项目。

## 真实数据源试点

项目已预留 Stooq 真实行情试点，默认关闭，Mock 仍是默认数据源。

开启方式：

```bash
copy .env.example .env.local
```

然后把 `.env.local` 中的值改为：

```text
VITE_STOOQ_REAL_ENABLED=true
```

重新运行 `npm run dev:local` 后，在页面左侧“数据源”选择 `Real API` 或 `Hybrid`。当前试点只对美股 Quote 做真实行情请求，例如切换到“美股”并选择 `AAPL`；K 线仍使用 Mock 回退数据。

A 股真实搜索和股票基础信息使用 Tushare。本地开发时在 `.env.local` 中配置：

```text
VITE_TUSHARE_REAL_ENABLED=true
TUSHARE_TOKEN=你的 Tushare token
```

`TUSHARE_TOKEN` 只由 Vite dev server 的 `/api/tushare` 代理读取，不使用 `VITE_` 前缀，不会被打包进浏览器代码。不要提交 `.env.local`。

## 验证命令

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

预期结果：

- TypeScript 无错误。
- ESLint 无错误。
- Vitest 测试通过。
- 生产构建成功。

当前 Recharts 会带来 bundle size warning，但不影响 MVP 构建和运行。

## 页面验证

打开 `http://127.0.0.1:5174/` 后应看到：

- 顶部栏和风险说明。
- 默认自选股：`600519.SH`、`000001.SZ`、`300750.SZ`。
- 行情摘要。
- 价格、MA、成交量图表。
- 信号推荐卡片。
- 策略参数设置。
- 模拟交易面板。
- Mock 数据 fixture 和模拟错误开关。

建议手动检查：

- 切换自选股，行情、图表、信号同步变化。
- 切换 Mock fixture，图表和状态提示变化。
- 勾选模拟错误，页面显示错误提示，关闭后恢复。
- 切换“数据源”到 `Real API`，未开启 `.env.local` 时应看到未配置提示；开启后可用美股 `AAPL` 验证真实 Quote 试点。
- 在 A股菜单搜索 `茅台`、`平安`、`宁德时代`，应返回 Tushare A股真实股票基础信息，并在当前标的区域显示行业、地区、板块、上市日期。
- 修改策略参数，信号重新计算。
- 输入模拟买入价和数量，显示浮动盈亏、手续费和止盈/止损状态。
