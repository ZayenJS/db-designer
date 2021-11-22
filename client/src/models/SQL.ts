import { Relation, TableProperty } from '.';
import { StringUtil } from '../utils/StringUtil';

export enum DBMS {
  MYSQL = 'MySQL',
  POSTGRES = 'Postgres',
  SQLITE = 'Sqlite',
}
export type DBElement = 'table' | 'database' | 'index';

export interface MySQLQuotes {
  column: '`';
  field: '`';
}
export interface PostgresQuotes {
  column: '"';
  field: "'";
}

export type Quotes = MySQLQuotes | PostgresQuotes;

// TODO: fill the types for each DBMS
export type PostgresDataTypes = '';
export type MySQLDataTypes = '';
export type SqliteDataTypes = '';

export type SQLDataTypes =
  | 'BIGINT'
  | 'BIGSERIAL'
  | 'BIT'
  | 'BIT VARYING'
  | 'BOOL'
  | 'BOOLEAN'
  | 'CHAR'
  | 'CHARACTER'
  | 'CHARACTER VARYING'
  | 'CIRCLE'
  | 'DATE'
  | 'DATETIME'
  | 'DATERANGE'
  | 'DECIMAL'
  | 'DOUBLE'
  | 'FLOAT4'
  | 'FLOAT8'
  | 'HSTORE'
  | 'INT'
  | 'INTEGER'
  | 'INTERVAL'
  | 'JSON'
  | 'JSONB'
  | 'NUMERIC'
  | 'NUMRANGE'
  | 'REAL'
  | 'SERIAL'
  | 'SMALLINT'
  | 'SMALLSERIAL'
  | 'TEXT'
  | 'TIMESTAMP'
  | 'UUID'
  | 'VARCHAR';

export class SQLQuery {
  private fullSQL: string[] = [];
  private query: string = '';
  private queryLines: string[] = [];
  private quotes: Quotes = { column: '"', field: "'" };

  constructor(private dbms: DBMS) {
    if (dbms === DBMS.POSTGRES) this.quotes = { column: '"', field: "'" };
    else if (dbms === DBMS.MYSQL) this.quotes = { column: '`', field: '`' };
  }

  private wrapWithQuotes(txt: string, type: 'column' | 'field') {
    return `${this.quotes[type]}${txt}${this.quotes[type]}`;
  }

  public createTable(name: string) {
    let query = `CREATE TABLE ${this.wrapWithQuotes(name, 'column')}`;

    this.query = `${query} (\n`;
  }

  public createColumns(props: TableProperty[], relations: Relation[]) {
    for (const prop of props) {
      const { name, type, size, signed, allowNull, unique, default: defaultValue } = prop;

      let defVal = defaultValue;
      if (defVal && StringUtil.isString(defVal) && !/(?:\(*.?\))/g.test(defVal as string)) {
        defVal = this.wrapWithQuotes(defVal as string, 'field');
      }

      const columnType = this.getColumnType(prop);

      let isRelationField = false;

      if (relations.length) {
        ({ isRelationField } = this.addRelations(prop, relations));
      }

      if (!isRelationField) {
        this.queryLines.push(
          `\t${this.wrapWithQuotes(name, 'column')} ${columnType}${unique ? ' UNIQUE' : ''}${
            allowNull ? '' : ' NOT NULL'
          }${defaultValue ? ` DEFAULT ${defVal}` : ''}`,
        );
      }
    }

    this.finalizeQuery();
    this.addStatement();
  }

  private getColumnType(prop: TableProperty) {
    const { name, type, size, signed, allowNull, unique, default: defaultValue } = prop;

    if (['INT', 'INTEGER'].includes(type)) {
      return `${signed ? '' : 'UNSIGNED '}${type}(${size ?? 11})`;
    }

    if (['VARCHAR', 'CHAR', 'CHARACTER'].includes(type)) {
      return `${type}(${size})`;
    }

    return type;
  }

  private addRelations(prop: TableProperty, relations: Relation[]) {
    const { name, type, size, signed, allowNull, unique, default: defaultValue } = prop;
    const columnType = this.getColumnType(prop);

    let isRelationField = false;

    for (const relation of relations) {
      const { referencedTable, referencedColumn } = relation;

      if (prop.tableRef === referencedTable.id) {
        this.queryLines.push(
          `\t${this.wrapWithQuotes(name, 'column')} ${columnType}${unique ? ' UNIQUE' : ''}${
            allowNull ? '' : ' NOT NULL'
          } REFERENCES ${this.wrapWithQuotes(
            referencedTable.name,
            'column',
          )} (${this.wrapWithQuotes(
            referencedColumn.name,
            'field',
          )}) ON DELETE CASCADE ON UPDATE CASCADE`,
        );

        isRelationField = true;
        break;
      }
    }

    return { isRelationField };
  }

  private finalizeQuery() {
    this.query += this.queryLines.join(',\n');
    this.query += '\n);\n';
  }

  private addStatement() {
    this.fullSQL.push(this.query);
    this.query = '';
    this.queryLines = [];
  }

  public getCompleteQuery() {
    return this.fullSQL.join('\n');
  }
}
