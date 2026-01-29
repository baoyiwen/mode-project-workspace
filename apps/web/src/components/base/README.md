# 基础组件目录

## 说明

此目录包含所有组件的基础抽象类，提供公共方法和功能。

## 继承链

```
Component (基础组件)
  ↓
SizeComponent (尺寸组件 - 添加resize功能)
  ↓
SVGComponent (SVG组件 - 添加SVG操作)
  ↓
GraphComponent (Graph组件 - 具体实现)
```

## 组件说明

### Component

**职责**：提供所有组件的基础功能

**主要功能**：
- 容器管理
- 生命周期管理（mount/unmount）
- 配置管理
- 渲染抽象

**使用示例**：
```typescript
class MyComponent extends Component<MyConfig> {
  protected render(): void {
    // 实现渲染逻辑
  }
}
```

### SizeComponent

**职责**：提供resize功能的基础组件

**主要功能**：
- 自动resize监听
- 尺寸管理
- 响应式布局

**使用示例**：
```typescript
class MySizeComponent extends SizeComponent<MySizeConfig> {
  protected render(): void {
    const { width, height } = this.getSize();
    // 使用尺寸进行渲染
  }
}
```

### SVGComponent

**职责**：提供SVG相关的基础操作

**主要功能**：
- SVG元素创建和管理
- 缩放和平移功能
- Zoom变换管理

**使用示例**：
```typescript
class MySVGComponent extends SVGComponent<MySVGConfig> {
  protected renderSVG(): void {
    // 实现SVG渲染逻辑
    const g = this.getG();
    // 使用g进行SVG操作
  }
}
```

## 设计原则

1. **单一职责**：每个抽象类只负责一个功能领域
2. **继承复用**：通过继承复用公共方法
3. **抽象方法**：子类必须实现抽象方法
4. **生命周期**：提供完整的生命周期管理
5. **类型安全**：充分利用TypeScript类型系统

## 扩展指南

### 创建新的组件类

1. 选择合适的基类继承
2. 实现抽象方法
3. 重写需要的方法
4. 添加特定功能

### 示例：创建新的SVG组件

```typescript
class MyChartComponent extends SVGComponent<MyChartConfig> {
  protected renderSVG(): void {
    const g = this.getG();
    if (!g) return;
    
    // 实现图表渲染逻辑
  }
  
  protected onResize(width: number, height: number): void {
    super.onResize(width, height);
    // 处理尺寸变化
  }
}
```
