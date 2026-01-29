/**
 * English Language Pack
 */

import type { LocaleMessages } from '../I18nManager';

export const enUS: LocaleMessages = {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    search: 'Search',
    reset: 'Reset',
    export: 'Export',
    import: 'Import',
  },

  // Application Modes
  modes: {
    select: {
      label: 'Select',
      description: 'Select entities or relationships',
    },
    create: {
      label: 'Create',
      description: 'Click on canvas to create new entity',
    },
    copy: {
      label: 'Copy',
      description: 'Click on entity to duplicate',
    },
    delete: {
      label: 'Delete',
      description: 'Click on entity or relationship to delete',
    },
    multiSelect: {
      label: 'Multi-Select',
      description: 'Draw a box to select multiple entities',
    },
    connect: {
      label: 'Connect',
      description: 'Create relationships between entities',
    },
    pan: {
      label: 'Pan',
      description: 'Drag canvas to pan view',
    },
    zoom: {
      label: 'Zoom',
      description: 'Use scroll wheel or buttons to zoom',
    },
  },

  // Page Navigation
  pages: {
    modelDesigner: 'Model Designer',
    queryDesigner: 'Query Designer',
    resultViewer: 'Result Viewer',
  },

  // Action Buttons
  actions: {
    undo: 'Undo',
    redo: 'Redo',
    save: 'Save',
    export: 'Export',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitView: 'Fit View',
  },

  // Model Designer
  modelDesigner: {
    title: 'Model Designer',
    emptyTitle: 'Start Designing Your Model',
    emptyDescription: 'Switch to Create mode using the toolbar, then click on the canvas to create a new entity',
    // Workbench
    workbench: {
      hierarchy: 'Hierarchy',
      properties: 'Properties',
      settings: 'Settings',
    },
    // Entity Properties
    entity: {
      metadata: 'Entity Metadata',
      name: 'Name',
      description: 'Description',
      color: 'Color',
      fields: 'Entity Fields',
      noFields: 'No fields defined',
      addFirstField: '+ Add first field',
      fieldName: 'Field Name',
      fieldType: 'Type',
      fieldRequired: 'Required',
      selectEntity: 'Select an entity to view its properties',
    },
    // Field Types
    fieldTypes: {
      string: 'String',
      number: 'Number',
      boolean: 'Boolean',
      date: 'Date',
      text: 'Text',
      integer: 'Integer',
      float: 'Float',
      uuid: 'UUID',
    },
    // Hierarchy Panel
    hierarchy: {
      title: 'Hierarchy',
      empty: 'No entities yet, start creating',
    },
  },

  // Query Designer
  queryDesigner: {
    title: 'Query Designer',
  },

  // Result Viewer
  resultViewer: {
    title: 'Result Viewer',
  },

  // Settings
  settings: {
    title: 'Settings',
    language: 'Language',
    theme: 'Theme',
    comingSoon: 'Coming Soon',
  },
};
