# 植物光照查询器 - 项目长期记忆

> 最后更新：2026-03-11

## 项目概况
- **名称**：植物光照查询器（Plant Care App）
- **仓库**：https://github.com/leroy003/plant-care-app.git（分支：main）
- **技术栈**：纯 HTML + CSS + JS（无框架），Tailwind CSS CDN 辅助
- **本地开发服务器**：端口 `8093`
- **部署**：GitHub Pages

## 文件结构
| 文件 | 用途 |
|---|---|
| `index.html` | 主页面，包含所有 HTML 结构和 JS 逻辑 |
| `style.css` | 所有样式，版本号通过 `?v=XX` 控制缓存 |
| `plant-database.js` | 统一植物库（500种），`plantDatabase` 数组 |
| `recommend-data.js` | 已废弃，不再加载 |
| `supabase-sync.js` | Supabase 云端同步模块（`syncManager` 单例） |
| `leaf-icon.webp` | 叶子图标（卡片翻转按钮） |

## 核心功能
1. **5个光照区域**：按光照条件分类显示植物
2. **植物详情卡**：点击植物名查看详情，支持翻转查看照片
3. **推荐植物**：从500种库中随机推荐，可选择区域添加
4. **科/属详情页**：点击科属名查看下级分类
5. **Supabase 同步**：跨设备数据同步
6. **每日身份验证**：每日首次打开弹窗输入用户名验证（答案：Leroy）

## 数据持久化
- `plant_zone_list`：区域内植物 `[{name, zone}]`
- `plant_bought_names`：已购植物名单
- `sync_daily_auth`：今日验证日期

## 同步逻辑
- 同步按钮 → `pushToCloud()`（上传覆盖）
- 每日验证后 / 刷新页面 → `pullFromCloud()`（拉取最新）
- 用户名固定：`Leroy`

## 当前 CSS 版本号
- `style.css?v=47`

## 开发注意事项
- ⚠️ CSS 文件中容易出现同名选择器规则，`replace_in_file` 可能命中错误位置，每次修改后用 `read_file` 确认
- ⚠️ 修改 CSS 后务必更新版本号（`style.css?v=XX`）避免浏览器缓存
- 输入框使用自定义闪烁光标（`<span class="daily-auth-caret">`），通过 Canvas 测量文字宽度定位
