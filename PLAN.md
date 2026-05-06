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

- 状态：已完成
- 完成时间：2026-05-06 08:59:00 +08:00
- 备注：已实现 `mockMarketDataService`、可复现 PRNG、session 连续走势、mock error 开关、empty/extreme/flat/uptrend/downtrend fixtures、Quote/Candle/搜索能力及对应测试；`npm run test`、`npm run typecheck`、`npm run lint`、`npm run build` 已通过。

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

- 状态：已完成
- 完成时间：2026-05-06 09:01:21 +08:00
- 备注：已实现 `watchlistStore`、`strategyStore`、`mockControlStore`、localStorage 持久化封装及 store 测试；`npm run test`、`npm run typecheck`、`npm run lint`、`npm run build` 已通过。

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

- 状态：已完成
- 完成时间：2026-05-06 09:02:59 +08:00
- 备注：已安装并接入 TanStack Query，新增 App Provider、通用 market data client、`useQuote`、`useCandles`、`useStockSearch`、`useMarketSnapshot`、`useSignal`；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过。

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

- 状态：已完成
- 完成时间：2026-05-06 09:05:03 +08:00
- 备注：已替换默认 Vite 页面，完成顶部栏、自选股、行情摘要、图表占位、信号占位、策略占位、模拟交易占位和风险说明的响应式基础布局；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，dev 服务返回 HTTP 200。

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

- 状态：已完成
- 完成时间：2026-05-06 09:07:27 +08:00
- 备注：已安装 Recharts，新增价格/均线/成交量图表和信号卡片，并接入 Dashboard；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，dev 服务返回 HTTP 200。build 存在图表库体积 warning，暂不影响 MVP。

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

- 状态：已完成
- 完成时间：2026-05-06 09:10:05 +08:00
- 备注：已实现策略设置控件、恢复默认、模拟买入价/数量、当前价、浮动盈亏、手续费估算和止盈/止损状态显示；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，dev 服务返回 HTTP 200。build 存在图表库体积 warning，暂不影响 MVP。

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

- 状态：已完成
- 完成时间：2026-05-06 09:12:50 +08:00
- 备注：已补充 loading、error、empty、mock error 恢复、自选股为空恢复、candles 为空、指标数据不足和策略参数非法提示；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，dev 服务返回 HTTP 200。build 存在图表库体积 warning，暂不影响 MVP。

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

- 状态：已完成
- 完成时间：2026-05-06 09:13:45 +08:00
- 备注：最终验证已完成；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 全部通过。build 存在图表库体积 warning，暂不影响 MVP。

## 13. 清理模板残留和补充运行说明

需要完成：

- 删除未使用的 Vite/React 模板资源。
- 将 README 改为本项目说明。
- 补充本地启动、验证命令和推荐端口说明。
- 增加固定端口启动脚本，降低打开错项目服务的概率。

验收标准：

- README 不再是 Vite 默认模板内容。
- 未使用的模板资源已移除。
- 能通过 README 明确知道应打开哪个地址。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 09:47:16 +08:00
- 备注：已删除未使用模板资源，重写 README，新增 `npm run dev:local` 固定端口脚本并说明应访问 `http://127.0.0.1:5174/`；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，确认 5174 由当前项目服务占用。

## 14. 实现自选股添加和删除 UI

需要完成：

- 在页面中增加股票代码输入。
- 支持添加合法 A 股代码到自选股。
- 支持删除自选股。
- 添加非法代码时显示错误提示。
- 保留自选股为空时恢复默认的操作。

验收标准：

- 支持添加 `600519.SH`、`000001.SZ`、`300750.SZ`、`430047.BJ` 格式股票。
- 重复添加不会出现重复项。
- 删除当前选中股票后自动切换到下一个股票或空状态。
- 非法代码不会添加，并显示清晰错误。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 09:51:15 +08:00
- 备注：已新增自选股输入、添加、删除、非法代码提示、重复添加提示，并保留空自选股恢复默认操作；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，`http://127.0.0.1:5174/` 返回 HTTP 200。

## 15. 补充自选股 UI 交互测试

需要完成：

- 为自选股组件补充 UI 级 smoke tests。
- 覆盖合法代码添加。
- 覆盖非法代码错误提示。
- 覆盖重复添加错误提示。
- 覆盖删除自选股回调。

验收标准：

- 测试不依赖真实网络。
- 测试能验证用户可见交互。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 09:53:48 +08:00
- 备注：已新增 `WatchlistPanel` UI smoke tests，覆盖合法添加、非法代码、重复添加和删除回调；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过。

## 16. 将自选股改为市场菜单和搜索添加

需要完成：

- 自选股展示不显示 `.SH`、`.SZ`、`.HK` 等交易所后缀。
- 使用 A股、港股、美股菜单区分市场。
- 使用搜索结果添加股票，不再要求用户手动输入交易所后缀。
- 搜索支持代码和名称，并按当前市场过滤。
- 内部仍保留唯一 symbol，避免跨市场代码冲突。

验收标准：

- A股股票在 UI 中显示 `600519`，不显示 `600519.SH`。
- 切换市场菜单后，自选股列表和搜索结果按市场变化。
- 搜索 `茅台`、`腾讯`、`AAPL` 能返回对应市场结果。
- 添加/删除自选股仍可用。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 14:14:23 +08:00
- 备注：已将自选股改为 A股/港股/美股市场菜单，UI 展示不再显示交易所后缀，搜索结果按市场过滤并支持代码/名称添加；内部保留唯一 symbol 防止跨市场冲突；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，`http://127.0.0.1:5174/` 返回 HTTP 200。

## 17. 设计真实行情数据适配层

需要完成：

- 梳理现有 `MarketDataService` 是否满足真实行情接入。
- 明确搜索、Quote、Candles 三类接口的输入输出。
- 设计 A股、港股、美股数据字段归一化规则。
- 设计数据源状态：Mock、Real API、Hybrid、未配置。
- 设计真实 API 失败、限流、延迟行情、休市、无权限时的状态表达。

验收标准：

- `PLAN.md` 或独立设计文档中明确接口边界。
- 明确真实数据源不直接污染 UI 组件。
- 明确不同市场的 symbol、displayCode、exchange 处理规则。
- 明确错误状态和降级策略。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 15:19:36 +08:00
- 备注：已新增 `DATA_SOURCE_DESIGN.md`，明确真实行情适配层接口边界、A股/港股/美股 symbol 与展示字段归一化规则、数据源模式、错误状态和降级策略；本步骤只改文档，未改运行时代码。

## 18. 增加数据源切换面板

需要完成：

- 增加数据源选择 UI：Mock、Real API、Hybrid。
- Real API 未配置时显示明确提示，不发起无效请求。
- 页面显示当前数据源状态。
- 数据源选择状态持久化到 localStorage。

验收标准：

- 用户能看到当前使用的数据源。
- 切换 Mock 后继续使用现有 mock 行情。
- 切换 Real API 且未配置时显示未配置状态。
- 不因为未配置真实 API 导致白屏。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 15:22:36 +08:00
- 备注：已新增数据源模式类型、`dataSourceStore`、数据源切换面板和未配置状态提示；Mock 继续可用，Real API 未配置时不发起行情请求，Hybrid 可使用 Mock 回退；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过。

## 19. 增强股票搜索数据流

需要完成：

- 将搜索流程设计为本地缓存优先。
- 支持真实搜索 API 的适配入口。
- API 失败时回退到 Mock/本地结果。
- 搜索结果显示市场、代码、名称、交易所。
- 自选股列表继续只显示纯代码和名称。

验收标准：

- 搜索逻辑不直接写死在 UI 组件中。
- 搜索失败时有错误提示或回退提示。
- A股、港股、美股搜索结果按当前市场隔离。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 15:24:30 +08:00
- 备注：已抽出本地股票目录和 `searchStocksWithFallback` 搜索服务，搜索先走本地缓存，并为 Real/Hybrid 预留真实搜索入口；真实搜索未配置或失败时回退本地结果并向 UI 传递提示；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过。

## 20. 补充数据源级错误状态

需要完成：

- 覆盖未配置 API key。
- 覆盖网络错误。
- 覆盖限流。
- 覆盖无权限。
- 覆盖延迟行情。
- 覆盖市场休市。
- 在行情摘要、图表、信号区域中统一展示数据源错误。

验收标准：

- 每类错误都有用户可理解的提示。
- 错误状态可以恢复或切换回 Mock。
- 错误不影响页面其他本地交互。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 15:26:56 +08:00
- 备注：已新增统一数据源错误类型和文案映射，覆盖未配置、网络错误、限流、无权限、延迟行情、市场休市、供应商错误；Mock 控制面板可模拟这些状态，行情摘要、图表、信号区域会统一展示并可清除错误；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过。

## 21. 接入首个真实数据源试点

需要完成：

- 选择一个真实数据源作为试点。
- 优先选择无需暴露敏感密钥到前端的方案。
- 如果需要 API key，必须通过环境变量读取。
- 实现该数据源的搜索、Quote、Candles 至少一种能力。
- 保留 Mock 作为默认数据源和失败回退。

验收标准：

- 未配置 API key 时应用仍可正常使用 Mock。
- 配置真实数据源后至少一个市场能返回真实数据。
- 真实数据源失败时有明确提示并可回退。
- 不提交任何密钥或敏感配置。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 15:31:55 +08:00
- 备注：已接入 Stooq 作为首个真实数据源试点，默认关闭并通过 `VITE_STOOQ_REAL_ENABLED=true` 开启；Vite dev proxy 代理 `/api/stooq`，当前实现美股 Quote 真实行情，Candles 和搜索保留 Mock/本地回退；未配置时应用继续正常使用 Mock，不提交任何密钥；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，并用临时 dev 服务验证 AAPL.US 真实 Quote 响应成功。

## 22. 接入 Tushare A股真实搜索和股票信息

需要完成：

- 使用本机 `.env.local` 保存 `TUSHARE_TOKEN`，不提交 token。
- 新增 Vite dev server `/api/tushare` 代理，由服务端注入 token。
- 新增 `StockProfile` 类型，用于股票基础信息展示。
- 使用 Tushare `stock_basic` 实现 A股真实股票搜索。
- 使用真实搜索结果补充股票名称、交易所、行业、地区、上市日期、上市状态。
- 未配置 token 或接口失败时回退本地缓存/Mock，并显示提示。
- 更新 README 和 `.env.example` 说明配置方式。

验收标准：

- 前端 bundle 中不包含 Tushare token。
- `.env.local` 不被 Git 跟踪。
- A股搜索 `茅台`、`平安`、`宁德时代` 能返回真实结果。
- 股票详情区域能显示真实基础信息。
- 未配置或接口失败时页面不白屏，并能继续使用本地缓存。
- `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 通过。

状态记录：

- 状态：已完成
- 完成时间：2026-05-06 18:10:53 +08:00
- 备注：已新增 Tushare dev server 代理、`StockProfile` 类型、A股真实搜索、股票基础信息展示、本地缓存和 Mock 回退；token 保存在被忽略的 `.env.local`，未提交；`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 已通过，并用临时 dev 服务真实调用 Tushare `stock_basic`，确认返回 5512 条 A股基础信息且包含贵州茅台、平安银行、宁德时代。
