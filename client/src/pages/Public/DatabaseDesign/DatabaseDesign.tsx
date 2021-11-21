import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Xarrow, { Xwrapper } from 'react-xarrows';
import Table from '../../../components/Table/Table';

import classes from './DatabaseDesign.module.scss';
import ContextMenu from './ContextMenu/ContextMenu';
import {
  GridPosition,
  Table as DBTable,
  Table as TableModel,
  TableProperty,
} from '../../../models';
import { StringUtil } from '../../../utils/StringUtil';
import { ObjectUtil } from '../../../utils/ObjectUtil';
import Portal from '../../../components/Portal/Portal';
import AddColumnModal from './AddColumnModal/AddColumnModal';

export interface DatabaseDesignProps {}

interface DatabaseDesignState {
  mainContextMenuVisible: boolean;
  addColumnModalVisible: boolean;
  editingTable: DBTable | null;
  menuX: number;
  menuY: number;
  zoom: number;
  tables: DBTable[];
}

const DatabaseDesign: FC<DatabaseDesignProps> = () => {
  const [state, setState] = useState<DatabaseDesignState>({
    mainContextMenuVisible: false,
    addColumnModalVisible: false,
    editingTable: null,
    menuX: 0,
    menuY: 0,
    zoom: 1,
    tables: [],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const generateSQL = () => {
    const fullSQL = [];

    for (const table of state.tables) {
      const { tableName, props, relations } = table;

      let SQL = `CREATE TABLE "${tableName}" (\n`;

      const tableProps = [];

      for (const prop of props) {
        const { name, type, allowNull, unique, default: defaultValue } = prop;
        tableProps.push(
          `\t"${name}" ${type}${unique ? ' UNIQUE' : ''}${allowNull ? '' : ' NOT NULL'}${
            defaultValue ? ' DEFAULT NOW()' : ''
          }`,
        );
      }

      SQL += tableProps.join(',\n');
      SQL += '\n);\n';

      fullSQL.push(SQL);
    }

    console.log(fullSQL.join('\n'));
  };

  const showMenu = (event: MouseEvent) => {
    event.preventDefault();
    if (event.target === containerRef.current) {
      setState((prevState) => ({
        ...prevState,
        mainContextMenuVisible: true,
        menuX: event.clientX,
        menuY: event.clientY,
      }));
    }
  };

  const appClickHandler = (event: MouseEvent<HTMLDivElement>) => {
    if (!menuRef.current?.contains(event.target as HTMLElement)) {
      setState((prevState) => ({ ...prevState, mainContextMenuVisible: false }));
    }
  };

  const addTable = () => {
    const tables = [
      ...state.tables,
      new DBTable(
        `_${StringUtil.makeid(55)}`,
        [
          {
            id: `_${StringUtil.makeid(55)}`,
            name: 'id',
            type: 'BIGSERIAL',
          },
          {
            id: `_${StringUtil.makeid(55)}`,
            name: 'created_at',
            type: 'DATETIME',
            allowNull: true,
            default: 'NOW()',
          },
          {
            id: `_${StringUtil.makeid(55)}`,
            name: 'updated_at',
            type: 'DATETIME',
            allowNull: true,
          },
        ],
        {
          defaultPosition: new GridPosition(state.menuX, state.menuY),
          tableName: `nouvelle_table_${state.tables.length + 1}`,
        },
      ),
    ];

    setState((prevState) => ({ ...prevState, mainContextMenuVisible: false, tables }));
  };

  const setProperties = (newState: (TableProperty & { id: string })[], name: string) => {
    const tables = ObjectUtil.deepCopy([...state.tables]) as TableModel[];

    tables.forEach((table) => {
      if (table.tableName === name) {
        table.props = newState;
      }
    });

    setState((prevState) => ({ ...prevState, tables }));
  };

  const changeTableName = (oldName: string, newName: string) => {
    const tables = state.tables.map((table) => ({
      ...table,
      tableName: table.tableName === oldName ? newName : table.tableName,
    }));

    setState((prevState) => ({ ...prevState, tables }));
  };

  const onSetHandleBackgroundColor = (id: string, color: string) => {
    const c = color.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    let handleColor = '#333';
    console.log({ luma });

    if (luma < 120) {
      handleColor = '#fff';
    }

    const tables = state.tables.map((table) => ({
      ...table,
      handleBackgroundColor: table.key === id ? color : table.handleBackgroundColor,
      handleColor: table.key === id ? handleColor : table.handleColor,
    }));

    setState((prevState) => ({ ...prevState, tables }));
  };

  const openAddColumnModal = (id: string) => {
    const editingTable = state.tables.find((table) => table.key === id);

    if (editingTable)
      setState((prevState) => ({ ...prevState, editingTable, addColumnModalVisible: true }));
  };

  const closeAddColumnModal = () => {
    setState((prevState) => ({ ...prevState, editingTable: null, addColumnModalVisible: false }));
  };

  const addColumnHandler = (addedColumn: TableProperty) => {
    const editingTable = { ...state.editingTable };
    editingTable.props?.push(addedColumn);
    const tables = (ObjectUtil.deepCopy(state.tables) as TableModel[]).map((table) =>
      table.key === editingTable.key ? editingTable : table,
    ) as TableModel[];

    setState((prevState) => ({
      ...prevState,
      editingTable: null,
      addColumnModalVisible: false,
      tables,
    }));
  };

  return (
    <>
      <div
        style={{ transform: `scale(${state.zoom})` }}
        ref={containerRef}
        onContextMenu={showMenu}
        onClick={appClickHandler}
        className={classes.Container}>
        <ContextMenu
          posX={state.menuX}
          posY={state.menuY}
          visible={state.mainContextMenuVisible}
          onAdd={addTable}
        />
        <Xwrapper>
          {state.tables.map((element) => (
            <Table
              key={element.key}
              id={element.key}
              tableName={element.tableName}
              handleBackgroundColor={element.handleBackgroundColor}
              handleColor={element.handleColor}
              defaultPosition={element.defaultPosition}
              changeTableName={changeTableName}
              properties={element.props}
              setProperties={setProperties}
              setHandleBackgroundColor={onSetHandleBackgroundColor}
              onAddColumn={openAddColumnModal}
              rounded
            />
          ))}

          {/* <Table rounded id={users} defaultPosition={{ x: 500, y: 270 }} />
        <Table id={workouts} defaultPosition={{ x: 200, y: 57 }} />
        <Table id={workoutlogs} defaultPosition={{ x: 700, y: 57 }} />
        <Xarrow start={users} end={workouts} />
        <Xarrow start={workoutlogs} end={workouts} /> */}
        </Xwrapper>
        <button onClick={generateSQL}>générer</button>
      </div>

      <Portal animate animationDuration={150} mount={state.addColumnModalVisible}>
        <AddColumnModal
          tableId={state.editingTable?.key ?? ''}
          tableName={state.editingTable?.tableName ?? ''}
          availableTables={state.tables.map((table) => ({
            id: table.key,
            name: table.tableName,
            fields: table.props.map((prop) => ({ id: prop.id, name: prop.name })),
          }))}
          onValidate={addColumnHandler}
          onCancel={closeAddColumnModal}
        />
      </Portal>
    </>
  );
};

export default DatabaseDesign;
