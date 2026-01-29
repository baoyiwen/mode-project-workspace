/**
 * 中文语言包
 */

import type { LocaleMessages } from '../I18nManager';

export const zhCN: LocaleMessages = {
  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    close: '关闭',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '提示',
    yes: '是',
    no: '否',
    ok: '确定',
    search: '搜索',
    reset: '重置',
    export: '导出',
    import: '导入',
  },

  // 应用模式
  modes: {
    select: {
      label: '选择',
      description: '选择实体或关系',
    },
    create: {
      label: '创建',
      description: '点击画布创建新实体',
    },
    copy: {
      label: '复制',
      description: '点击实体进行复制',
    },
    delete: {
      label: '删除',
      description: '点击实体或关系删除',
    },
    multiSelect: {
      label: '多选',
      description: '框选多个实体',
    },
    connect: {
      label: '连接',
      description: '创建实体间的关系',
    },
    pan: {
      label: '平移',
      description: '拖拽画布平移视图',
    },
    zoom: {
      label: '缩放',
      description: '滚轮或按钮缩放视图',
    },
  },

  // 页面导航
  pages: {
    modelDesigner: '模型设计器',
    queryDesigner: '查询设计器',
    resultViewer: '结果查看器',
  },

  // 操作按钮
  actions: {
    undo: '撤销',
    redo: '重做',
    save: '保存',
    export: '导出',
    zoomIn: '放大',
    zoomOut: '缩小',
    fitView: '适应视图',
  },

  // Model Designer
  modelDesigner: {
    title: '模型设计器',
    emptyTitle: '开始设计您的模型',
    emptyDescription: '使用左侧工具栏切换到创建模式，然后点击画布创建新实体',
    // 工作栏
    workbench: {
      hierarchy: '层级',
      properties: '属性',
      settings: '设置',
    },
    // 实体属性
    entity: {
      metadata: '实体属性',
      name: '名称',
      description: '描述',
      color: '颜色',
      fields: '实体字段',
      noFields: '暂无字段',
      addFirstField: '+ 添加第一个字段',
      fieldName: '字段名',
      fieldType: '类型',
      fieldRequired: '必填',
      selectEntity: '选择一个实体查看其属性',
    },
    // 字段类型
    fieldTypes: {
      string: '字符串',
      number: '数字',
      boolean: '布尔值',
      date: '日期',
      text: '文本',
      integer: '整数',
      float: '浮点数',
      uuid: 'UUID',
    },
    // 层级面板
    hierarchy: {
      title: '层级结构',
      empty: '暂无实体，开始创建吧',
    },
  },

  // Query Designer
  queryDesigner: {
    title: '查询设计器',
  },

  // Result Viewer
  resultViewer: {
    title: '结果查看器',
  },

  // 设置
  settings: {
    title: '设置',
    language: '语言',
    theme: '主题',
    comingSoon: '即将推出',
  },
};
