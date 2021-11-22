import { Identifier, SQLDataTypes } from '.';
import { GridPosition } from './GridPosition';

export interface TableProperty {
  id: string;
  name: string;
  type: SQLDataTypes;
  signed?: boolean;
  size?: number;
  color?: string;
  default?: string | number;
  primaryKey?: boolean;
  allowNull?: boolean;
  unique?: boolean;
  autoIncrement?: boolean;
  foreignKey?: boolean;
  tableRef?: string;
  fieldRef?: string;
  offset?: number;
}

export interface Relation {
  referencedTable: Identifier;
  referencedColumn: Identifier & { offset: number };
  baseTable: Identifier;
  baseColumn: Identifier & { offset: number };
}

export class Table {
  public tableName = 'Nouvelle table';
  public defaultPosition = new GridPosition(0, 0);
  public relations: Relation[] = [];
  public handleColor: string;
  public handleBackgroundColor: string;

  constructor(
    public key: string,
    public props: TableProperty[],
    options?: {
      tableName?: string;
      defaultPosition?: GridPosition;
      relations?: Relation[];
      handleColor?: string;
      handleBackgroundColor?: string;
    },
  ) {
    this.tableName = options?.tableName ?? this.tableName;
    this.defaultPosition = options?.defaultPosition ?? this.defaultPosition;
    this.relations = options?.relations ?? [];
    this.handleColor = options?.handleColor ?? '#fff';
    this.handleBackgroundColor = options?.handleBackgroundColor ?? '#444444';
  }
}
