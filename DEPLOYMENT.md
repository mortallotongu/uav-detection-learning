# 部署到 GitHub Pages

本项目是纯静态 PWA，不需要 Node.js、npm、数据库或后端。下面只是一份未来部署指南；当前版本没有自动发布。

## 部署前确认

- 不要把任何 API key、密码、Token、账号信息或私人研究代码放进本项目。
- 项目中的网页路径必须保持相对路径。
- `index.html`、`manifest.json` 和 `service-worker.js` 应位于发布目录根部。
- GitHub Pages 使用 HTTPS，满足 Service Worker 与 PWA 安装的安全上下文要求。

## 方式一：GitHub 网页设置（推荐初学者）

1. 在 GitHub 新建一个公开或支持 Pages 的仓库。
2. 把 `D:\UAV_Detection_Learning` 中的项目文件提交并推送到仓库根目录。
3. 打开仓库 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**。
5. 选择你的默认分支（通常为 `main`）和 `/ (root)`，然后保存。
6. 等待 GitHub 给出 `https://<用户名>.github.io/<仓库名>/` 地址。

代码中使用相对路径，因此放在 `/<仓库名>/` 子路径下也能工作。

## 手机上安装

1. 首次用在线状态打开 GitHub Pages 地址，等待页面完整加载。
2. Android Chrome：浏览器菜单 → **安装应用** 或 **添加到主屏幕**。
3. iPhone Safari：分享按钮 → **添加到主屏幕**。
4. 安装入口是否出现取决于浏览器、系统版本与站点安装条件。

## 验证离线

1. 在线依次打开首页和任一课程页。
2. 在浏览器开发工具的 Application 中确认 Manifest 与 Service Worker 正常。
3. 切换为 Offline，再刷新首页和课程页。
4. 确认课程、CSS、JavaScript、测验和进度页面仍能打开。

首次安装前或缓存更新失败时，不应假设所有内容都已离线可用。

## 更新缓存

`service-worker.js` 顶部有缓存版本名，例如 `uav-phase-a-v1`。发布修改后，如核心文件没有及时更新，可把版本增加到 `v2` 再发布。新的 Service Worker 激活后会清理旧版本缓存。

## 本地 PWA 测试

直接双击 `index.html` 只能测试静态阅读，不能注册 Service Worker。若未来需要在电脑本地完整测试 PWA，应使用 localhost 静态服务器；这只是测试方式，不会成为项目运行依赖。
