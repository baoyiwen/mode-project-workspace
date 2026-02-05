export enum PrimitiveType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
}

export type AttributeType =
  | { kind: 'primitive'; type: PrimitiveType }
  | { kind: 'reference'; modelId: string };
