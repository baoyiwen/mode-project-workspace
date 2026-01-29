# Layout组件

## 说明

Layout组件用于页面布局，支持center、left、right、top、bottom五个区域。

## 功能特性

- ✅ 中心区域（center）- 主要内容区域
- 🔜 左侧区域（left）- 预留，可通过showLeft控制显示
- 🔜 右侧区域（right）- 预留，可通过showRight控制显示
- 🔜 顶部区域（top）- 预留，可通过showTop控制显示
- 🔜 底部区域（bottom）- 预留，可通过showBottom控制显示
- ✅ 响应式设计
- ✅ 灵活的布局控制

## 使用方法

### 基础用法（只使用center）

```typescript
import { Layout } from '@/components/layout';

<Layout
  center={<div>主要内容</div>}
/>
```

### 完整布局（预留其他区域）

```typescript
import { Layout } from '@/components/layout';

<Layout
  top={<Header />}
  left={<Sidebar />}
  center={<MainContent />}
  right={<Panel />}
  bottom={<Footer />}
  showTop={true}
  showLeft={true}
  showRight={true}
  showBottom={true}
/>
```

## Props说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| center | ReactNode | - | 中心区域内容 |
| left | ReactNode | - | 左侧区域内容（预留） |
| right | ReactNode | - | 右侧区域内容（预留） |
| top | ReactNode | - | 顶部区域内容（预留） |
| bottom | ReactNode | - | 底部区域内容（预留） |
| className | string | '' | 自定义类名 |
| showLeft | boolean | false | 是否显示左侧面板 |
| showRight | boolean | false | 是否显示右侧面板 |
| showTop | boolean | false | 是否显示顶部面板 |
| showBottom | boolean | false | 是否显示底部面板 |

## 布局结构

```
┌─────────────────────────────────┐
│         Top (预留)              │
├──────┬──────────────┬───────────┤
│      │              │           │
│ Left │   Center     │  Right    │
│(预留)│   (主要)     │ (预留)    │
│      │              │           │
├──────┴──────────────┴───────────┤
│         Bottom (预留)           │
└─────────────────────────────────┘
```

## 样式说明

- `.layout-container` - 布局容器
- `.layout-top` - 顶部区域
- `.layout-body` - 主体区域
- `.layout-left` - 左侧区域
- `.layout-center` - 中心区域
- `.layout-right` - 右侧区域
- `.layout-bottom` - 底部区域

## 响应式设计

在移动端（max-width: 768px）：
- 左右侧面板会变为绝对定位
- 可以通过添加`.show`类来控制显示/隐藏
- 支持平滑的过渡动画
