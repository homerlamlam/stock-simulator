# MVP 执行计划

状态说明：

- `未开始`
- `进行中`
- `已完成`
- `阻塞`

## 1. 创建项目和基础配置

需要完成：

- 创建 Vite React TypeScript 项目。
- 配置 TypeScript、Tailwind CSS、ESLint、Prettier、Vitest。
- 配置路径别名 `@/`。
- 配置基础 npm scripts：`dev`、`build`、`typecheck`、`lint`、`test`。

验收标准：

- `npm install` 成功。
- `npm run dev` 能启动。
- `npm run typecheck` 能运行。
- `npm run test` 能运行。
- `src` 目录存在，基础入口可加载。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 08:42:35 +08:00
- 备注：已创建 Vite React TypeScript 项目，配置 Tailwind CSS、ESLint、Prettier、Vitest、`@/` 路径别名和基础 npm scripts；`npm install`、`npm run dev`、`npm run typecheck`、`npm run test`、`npm run lint`、`npm run build` 已通过。

## 2. 创建类型定义和默认配置

需要完成：

- 创建核心类型：`Market`、`Exchange`、`StockSymbol`、`Quote`、`Candle`、`IndicatorResult`、`TradeSignal`、`SignalType`、`RiskLevel`、`StrategySettings`、`PaperPosition`、`MarketDataService`。
- 创建默认自选股配置：`600519.SH`、`000001.SZ`、`300750.SZ`。
- 创建默认策略配置：MA、RSI、止盈、止损、最小置信度、手续费估算。

验收标准：

- 类型文件不依赖 React。
- 默认配置集中管理。
- 后续 UI、store、service 都从统一类型和配置引用。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 08:53:14 +08:00
- 备注：已新增核心业务类型、默认 A 股自选股和默认策略配置；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过。

## 3. 实现纯函数工具

需要完成：

- 实现股票代码校验和标准化。
- 实现 MA 计算。
- 实现 RSI 计算。
- 实现 Volatility 计算。
- 实现信号生成。

验收标准：

- 纯函数不引入 React、Zustand、TanStack Query。
- 所有函数输入相同则输出相同。
- 极端数据不返回 `NaN` 或 `Infinity`。
- 股票代码校验支持 `600519.SH`、`000001.SZ`、`300750.SZ`、`BJ`。
- 每个交易信号都有原因列表、置信度、风险等级和更新时间。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 08:55:21 +08:00
- 备注：已实现股票代码校验、MA、RSI、Volatility 和交易信号生成纯函数；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过。

## 4. 为纯函数补单元测试

需要完成：

- 测试股票代码校验。
- 测试 MA 正常、数据不足、非法周期。
- 测试 RSI 上涨、下跌、横盘、数据不足。
- 测试 Volatility 正常、极端波动、横盘。
- 测试信号生成的五种状态。
- 测试策略参数边界。

验收标准：

- `npm run test` 通过。
- 测试不依赖浏览器和网络。
- 测试数据简单、可读、可维护。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 08:56:58 +08:00
- 备注：已为股票代码校验、MA、RSI、Volatility、信号生成和策略边界补充 Vitest 单元测试；`npm run test`、`npm run typecheck`、`npm run lint`、`npm run build` 已通过。

## 5. 实现 mockMarketDataService

需要完成：

- 实现 `MarketDataService` 接口。
- 使用可复现的 seed-based PRNG。
- 为同一 `symbol` 维护 session 内连续走势。
- 支持 mock error 开关。
- 支持 `empty candles`、`extreme candles`、`flat candles`、`uptrend candles`、`downtrend candles` fixture。
- 支持 Quote、Candle 和股票搜索。

验收标准：

- 相同 seed 和 symbol 生成一致初始走势。
- 同一 symbol 连续请求时价格走势连贯。
- 行情生成主逻辑不直接使用不可控的 `Math.random()`。
- mock error 开启后返回可预测错误。
- fixture 可被测试和 UI 使用。

状态记录：

- 状态：未开始
- 完成时间：
- 备注：

## 6. 实现 Zustand stores

需要完成：

- 实现 `watchlistStore`。
- 实现 `strategyStore`。
- 实现 `mockControlStore`。
- 持久化自选股和策略配置到 localStorage。

验收标准：

- stores 不直接做行情请求。
- 刷新页面后自选股和策略配置保留。
- 删除当前股票后自动选择下一个。
- 空自选股状态可表达。
- action 命名清晰。

状态记录：

- 状态：未开始
- 完成时间：
- 备注：

## 7. 接入 TanStack Query

需要完成：

- 实现 `useQuote(symbol)`。
- 实现 `useCandles(symbol, range)`。
- 实现 `useStockSearch(keyword)`。
- 实现 `useMarketSnapshot(symbol)`。
- 实现 `useSignal(symbol)`。

验收标准：

- hooks 不直接依赖具体 mock 实现。
- loading、error、empty 状态清晰。
- 切换 symbol 后数据正确更新。
- mock error 开启时 UI 可拿到错误状态。
- 关闭 mock error 后可恢复。

状态记录：

- 状态：未开始
- 完成时间：
- 备注：

## 8. 实现基础 UI 布局

需要完成：

- 实现顶部栏。
- 实现自选股区域。
- 实现行情摘要区域。
- 实现图表区域占位。
- 实现信号区域占位。
- 实现策略区域占位。
- 实现模拟交易区域占位。
- 实现风险说明。

验收标准：

- 375px、768px、1440px 下布局正常。
- 页面可以在 mock 数据下完整渲染。
- 没有重叠、溢出、不可读文本。
- UI 风格年轻、干净、温暖、专业。

状态记录：

- 状态：未开始
- 完成时间：
- 备注：

## 9. 实现图表和信号卡片

需要完成：

- 使用 Recharts 实现价格折线。
- 显示 MA5、MA20。
- 显示成交量柱状图。
- 显示当前价格。
- 实现信号卡片。

验收标准：

- 图表随 symbol 切换更新。
- empty candles 显示空状态。
- extreme candles 不导致图表崩溃。
- flat candles 显示稳定横盘效果。
- 每个信号都有解释。

状态记录：

- 状态：未开始
- 完成时间：
- 备注：

## 10. 实现策略设置和模拟交易

需要完成：

- 实现 MA、RSI、止盈、止损、最小置信度设置。
- 实现恢复默认。
- 实现模拟买入价、买入数量、当前价、浮动盈亏、手续费估算。
- 显示是否触发止盈或止损。

验收标准：

- 短周期不能大于等于长周期。
- 非法输入有提示。
- 参数调整后信号即时变化。
- 当前价刷新后模拟盈亏同步更新。
- 恢复默认后状态和 UI 一致。

状态记录：

- 状态：未开始
- 完成时间：
- 备注：

## 11. 补 loading、error、empty 状态

需要完成：

- 覆盖行情加载中。
- 覆盖图表加载中。
- 覆盖 mock error。
- 覆盖股票不存在。
- 覆盖自选股为空。
- 覆盖 candles 为空。
- 覆盖数据不足无法计算指标。
- 覆盖策略参数非法。

验收标准：

- 所有主要区域都有对应状态。
- 错误状态可以恢复。
- 空状态有可执行操作。
- 不出现白屏或未捕获异常。

状态记录：

- 状态：未开始
- 完成时间：
- 备注：

## 12. 运行最终验证

需要完成：

- 运行 `npm run typecheck`。
- 运行 `npm run lint`。
- 运行 `npm run test`。
- 运行 `npm run build`。

验收标准：

- 四个命令全部通过。
- 无 TypeScript 错误。
- 无 lint 错误。
- 单元测试通过。
- 生产构建成功。

状态记录：

- 状态：未开始
- 完成时间：
- 备注：
