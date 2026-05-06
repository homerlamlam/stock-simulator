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
- 修改策略参数，信号重新计算。
- 输入模拟买入价和数量，显示浮动盈亏、手续费和止盈/止损状态。
