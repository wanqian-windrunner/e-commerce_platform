# 电商平台

基于 React、TypeScript、Express 和 PostgreSQL 的前后端分离电商项目，包含商城前台和管理后台。

## 已实现功能

- **商城前台**：用户注册与登录、商品及分类浏览、购物车、填写收货信息并创建订单、查看个人订单。
- **管理后台**：商品和分类管理、订单查询与状态管理、用户管理及管理员权限控制。
- **后端能力**：JWT Access Token 与 Cookie Refresh Token 登录续期、Zod 请求校验、认证接口限流、下单事务与库存校验；提供 `/health` 和 Prometheus 格式的 `/metrics` 接口。

> 当前没有接入真实支付网关；商品评价仅有数据库表结构，尚未提供完整评价功能。`/metrics` 只暴露指标，项目未包含 Prometheus 抓取服务或可视化大盘。

## 本地部署

需要 Node.js、pnpm 和 PostgreSQL。前后端分别安装依赖，并使用两个终端启动。

1. 创建 PostgreSQL 数据库，在 `backend/.env.development.local` 中配置（请替换为自己的值）：

   ```dotenv
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce
   JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
   CLIENT_ORIGIN=http://localhost:5173
   ```

2. 安装后端依赖、执行已有数据库迁移并启动 API：

   ```bash
   cd backend
   pnpm install --frozen-lockfile
   pnpm db:migrate
   pnpm dev
   ```

   如需使用管理后台，另开终端在 `backend` 目录设置 `ADMIN_NAME`、`ADMIN_EMAIL`、`ADMIN_PASSWORD` 后运行 `pnpm seed:admin`。例如：

   ```bash
   ADMIN_NAME=Admin ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='replace-with-a-strong-password' pnpm seed:admin
   ```

   可选：运行 `pnpm seed:categories` 和 `pnpm seed:products` 初始化演示数据。API 默认地址为 `http://localhost:5000`。

3. 配置并启动前端：在 `frontend/.env.development` 中设置 `VITE_API_BASE_URL`（没有该文件时可参考 `.env.example` 新建），值为后端根地址，如 `http://localhost:5000`，不要在末尾加 `/api`。然后执行：

   ```bash
   cd frontend
   pnpm install --frozen-lockfile
   pnpm dev
   ```

   浏览器打开 `http://localhost:5173`。

## 生产部署说明

- 在部署环境提供后端的 `DATABASE_URL`、至少 32 字符的 `JWT_SECRET`、`NODE_ENV=production` 和 `CLIENT_ORIGIN`（前端实际访问域名）；按需设置 `PORT`。后端使用 `pnpm db:migrate` 执行迁移，`pnpm build` 编译，`pnpm start` 启动。生产数据库连接会校验 TLS 证书，请提供可验证的数据库证书配置。
- 前端构建前设置 `VITE_API_BASE_URL` 为对外可访问的后端根地址，执行 `pnpm build`，将 `frontend/dist` 部署到静态站点服务；由于使用浏览器路由，静态站点需要把非静态资源路径回退到 `index.html`。
- 登录续期使用 `Secure`、`SameSite=None` 的 HttpOnly Cookie。部署时前后端应使用 HTTPS，并确认跨域请求和 Cookie 配置与实际域名匹配。不要将数据库密码、JWT 密钥或管理员密码提交到仓库。
