# Hooks 分层规范手册

本手册是 `src/hooks` 的唯一结构规范来源。

## 1. 分域定义

- 业务域（强制严格四层）：`auth` / `authz` / `chat` / `class` / `assignment` / `sidebar`
- 编排与工具域（不强制四层）：`app` / `landing` / `shared`

## 2. 业务域目录规范

每个业务域只允许以下结构：

- `ui/`：页面可直接消费的状态编排（含原 flow/states 逻辑）
- `queries/`：React Query 的 query/mutation hooks
- `interface/`：域聚合接口与实例装配
- `implementation/`：底层实现（supabase/transport/normalizer/error/storage）
- `types.ts`：域类型单一来源
- `constants.ts`：域常量
- `public.ts`：唯一对外导出边界

禁止保留或新增：

- `flow/` / `flows/`
- `states/`
- `services/`
- `model/`
- `utils/`

## 3. 命名规范

- Hook 命名：
  - UI 编排统一 `useXState`
  - 数据 hooks 统一 `useXQuery` / `useXMutation`
  - 禁止对外导出 `useXFlow`
- Interface 命名：`xxxInterface.ts`
- Implementation 命名：`*Instance.ts`（含实例工厂与底层实现）
- 类型文件：域内统一收敛到 `types.ts`

## 4. 依赖边界规则

- `src/hooks/index.ts` 是跨域统一入口：`export * from "./<domain>/public"`
- `src/hooks/<domain>/public.ts` 只导出对外 API
- `src/app` 只能从 `@hooks` 消费，不得直接深层引用 `@hooks/<domain>/...`
- `src/hooks/app` 若跨域依赖，只能从 `../<domain>/public` 导入
- 禁止跨域直接导入 `interface/queries/implementation` 内部路径

## 5. public.ts 导出规则

- 仅导出必要 API：`use*State` / `use*Query` / `use*Mutation`、必要类型与常量
- 禁止兼容别名导出（例如 `useX = useXQuery`）
- 禁止对外暴露内部迁移过渡 API

## 6. 迁移禁令

- 禁止继续新增旧分层目录
- 禁止引入 `*DomainInterface.ts`、`*Port.ts` 历史命名
- 禁止通过兼容别名维持旧 API
- 禁止跨域深层 import

## 7. 验收清单

静态检查：

- `npm run lint:hooks`
- `npm run lint:architecture`
- `npx tsc -p tsconfig.app.json --pretty false`

结构检查：

- 业务域仅保留 `ui/queries/interface/implementation` + `types.ts/constants.ts/public.ts`
- 不再存在 `flow/flows/states/services/model/utils`
- `src/hooks/app` 跨域只走各域 `public.ts`

关键流程手测：

- Auth：登录/注册/登出、Profile 编辑取消保存、头像上传回滚
- Chat：会话加载切换增删改、消息发送停止、标题生成、附件上传
- Class：班级上下文、线程消息、发帖与线程管理、分享
- Assignment：发布、提交、评分草稿/保存/发布
- Authz：权限读取、管理员查询与更新
- Sidebar：会话菜单、重命名删除、宽度持久化
