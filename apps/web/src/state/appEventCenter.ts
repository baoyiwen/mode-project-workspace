import { createActor, createMachine, assign } from 'xstate';
import type { AppMode } from '../types/modes';

export type AppPage = 'model' | 'query' | 'result';
export type AppCommand = 'undo' | 'redo' | 'save' | 'export';

interface AppContext {
  currentPage: AppPage;
  currentMode: AppMode;
  commandNonce: number;
  lastCommand: AppCommand | null;
}

type AppEvent =
  | { type: 'NAVIGATE'; page: AppPage }
  | { type: 'SET_MODE'; mode: AppMode }
  | { type: 'COMMAND'; command: AppCommand };

const appMachine = createMachine({
  id: 'app-event-center',
  initial: 'active',
  context: {
    currentPage: 'model',
    currentMode: 'select',
    commandNonce: 0,
    lastCommand: null,
  } as AppContext,
  states: {
    active: {
      on: {
        NAVIGATE: {
          actions: assign(({ context, event }) => ({
            ...context,
            currentPage: event.page,
            currentMode: 'select',
          })),
        },
        SET_MODE: {
          actions: assign(({ context, event }) => ({
            ...context,
            currentMode: event.mode,
          })),
        },
        COMMAND: {
          actions: assign(({ context, event }) => ({
            ...context,
            lastCommand: event.command,
            commandNonce: context.commandNonce + 1,
          })),
        },
      },
    },
  },
});

export const appEventActor = createActor(appMachine);
appEventActor.start();

