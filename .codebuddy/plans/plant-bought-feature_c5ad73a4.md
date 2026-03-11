---
name: plant-bought-feature
overview: "点击详情卡片的\"已购\"按钮后，将该植物标记为已购状态，区域内对应植物名称字色变为 #00BC3E。"
todos:
  - id: add-bought-feature
    content: 实现"已购"按钮功能：CSS 新增 .plant-bought 样式(#00BC3E)，JS 添加按钮事件和渲染时已购状态检测
    status: completed
---

## 用户需求

点击详情卡片中的"已购"按钮后，该植物在区域列表中的名称字色变为绿色（#00BC3E），标识该植物已被购买。

## 产品概述

为"植物光照查询器"的"已购"按钮增加交互功能，点击后在内存中标记植物的已购状态，并在区域植物列表中以绿色字体（#00BC3E）显示已购植物的名称，方便用户视觉区分哪些植物已经购买。

## 核心功能

- 点击详情卡片底部"已购"按钮，标记当前植物为已购状态
- 区域列表中已购植物的名称字色变为 #00BC3E
- 已购状态仅在当前会话内存中保持，刷新页面后重置（与删除功能行为一致）

## 技术栈

- HTML / CSS / JavaScript（纯前端，与现有项目一致）

## 实现方案

### 策略

在植物对象上增加 `bought` 属性标记已购状态，点击"已购"按钮时设置该属性为 `true`，关闭卡片并重新渲染列表。渲染时检测 `bought` 属性，为已购植物的 `.plant-name` 元素追加 `.plant-bought` 类，通过 CSS 控制字色。

### 关键技术决策

- **内存标记**：直接在 `plants` 数组的对象上添加 `bought: true` 属性，与删除功能的数据操作方式一致，无需额外数据结构
- **CSS 类切换**：通过追加 `.plant-bought` 类改变字色，保持渲染逻辑清晰，便于后续扩展其他已购样式
- **重复点击处理**：已购按钮可重复点击但效果幂等（`bought` 始终为 `true`），无需额外判断

## 实现细节

### 修改点

**1. style.css** — 新增已购植物名称样式

- 在 `.plant-name` 样式后添加 `.plant-name.plant-bought` 规则，设置 `color: #00BC3E`

**2. index.html** — render 函数中检测已购状态

- 第 451 行附近，创建 `nameSpan` 后，检查 `plant.bought`，如果为 `true` 则追加 `plant-bought` 类

**3. index.html** — 给"已购"按钮绑定事件

- 第 512 行后，为 `cardBought` 添加 click 事件监听器，设置 `currentPlant.bought = true`，关闭卡片并调用 `render()` 刷新列表

## 目录结构

```
project-root/
├── index.html  # [MODIFY] render函数中添加已购状态检测；添加"已购"按钮点击事件
└── style.css   # [MODIFY] 新增 .plant-name.plant-bought 样式规则
```