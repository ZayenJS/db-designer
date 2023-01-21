import { FC, Fragment, MouseEvent, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Xarrow, { Xwrapper } from 'react-xarrows';
import html2canvas from 'html2canvas';

import Table from '../../../components/Table/Table';
import Field from '../../../components/Field/Field';
import ContextMenu from './ContextMenu/ContextMenu';
import Portal from '../../../components/Portal/Portal';
import AddColumnModal from './AddColumnModal/AddColumnModal';

import {
  DBMS,
  GridPosition,
  SQLQuery,
  Table as DBTable,
  Table as TableModel,
  TableProperty,
} from '../../../models';

import { StringUtil } from '../../../utils/StringUtil';
import { ObjectUtil } from '../../../utils/ObjectUtil';
import { Color } from '../../../utils/Color';
import { FileUtil } from '../../../utils/FileUtil';

import classes from './DatabaseDesign.module.scss';

export interface DatabaseDesignProps {}

interface DatabaseDesignState {
  schemaName: string;
  mainContextMenuVisible: boolean;
  addColumnModalVisible: boolean;
  editingTable: DBTable | null;
  panning: boolean;
  panX: number;
  panY: number;
  zoom: number;
  menuX: number;
  menuY: number;
  tables: DBTable[];
  minimap: string;
}

const DatabaseDesign: FC<DatabaseDesignProps> = () => {
  const [state, setState] = useState<DatabaseDesignState>({
    schemaName: 'untitled',
    mainContextMenuVisible: false,
    addColumnModalVisible: false,
    editingTable: null,
    panning: false,
    panX: 0,
    panY: 0,
    zoom: 1,
    menuX: 0,
    menuY: 0,
    tables: [],
    minimap: '',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const generateSQL = async () => {
    const query = new SQLQuery(DBMS.POSTGRES);

    for (const table of state.tables) {
      const { tableName, props, relations } = table;
      query.createTable(tableName);
      query.createColumns(props, relations);
    }

    const completeQuery = query.getCompleteQuery();

    // FileUtil.makeDownloadableFile(completeQuery, `${state.schemaName}.sql`);
    if (containerRef.current) {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#333',
      });

      const minimap = canvas.toDataURL('image/png', 0.5);
      document.body.append(canvas);

      setState((prevState) => ({ ...prevState, minimap }));
    }
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
    const luma = Color.getLuminance(color);

    let handleColor = 'rgb(30, 30, 30)';

    if (luma < 120) {
      handleColor = 'rgb(255, 255, 255)';
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

    if (!editingTable.relations?.length) editingTable.relations = [];

    if (addedColumn.tableRef) {
      const tableRef = state.tables.find((t) => t.key === addedColumn.tableRef);

      if (tableRef) {
        const columnRef = tableRef.props.find((p) => p.id === addedColumn.fieldRef);

        if (columnRef) {
          editingTable.relations.push({
            referencedTable: { id: tableRef.key, name: tableRef.tableName },
            referencedColumn: {
              id: columnRef.id,
              name: columnRef.name,
              offset: columnRef.offset ?? 0,
            },
            baseColumn: {
              id: addedColumn.id,
              name: addedColumn.name,
              offset: addedColumn.offset ?? 0,
            },
            baseTable: { id: editingTable.key!, name: editingTable.tableName! },
          });
        }
      }
    }

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

  const setFieldOffset = (tableId: string, fieldId: string, offset: number) => {
    const tables = [...state.tables];
    let updateState = false;

    for (const table of tables) {
      if (table.key === tableId) {
        for (const prop of table.props) {
          if (prop.id === fieldId && prop.offset !== offset) {
            prop.offset = offset;
            updateState = true;
          }
        }
      }
    }

    if (updateState) setState((prevState) => ({ ...prevState, tables }));
  };

  return (
    <>
      {/* //TODO implement minimap */}
      <div className={classes.Minimap}>
        {state.minimap ? <img src={state.minimap} alt="" /> : <div></div>}
      </div>
      <div
        id="db-design"
        ref={containerRef}
        onContextMenu={showMenu}
        onClick={appClickHandler}
        // onMouseDown={(e) =>
        //   setState((prevState) => ({ ...prevState, panX: e.pageX, panY: e.pageY, panning: true }))
        // }
        // onMouseMove={(e) => {
        //   if (state.panning) {
        //     window.scrollBy({
        //       behavior: 'auto',
        //       left: state.panX - e.pageX,
        //       top: state.panY - e.pageY,
        //     });
        //     setState((prevState) => ({ ...prevState, panX: e.pageX, panY: e.pageY }));
        //   }
        // }}
        // onMouseUp={(e) => setState((prevState) => ({ ...prevState, panning: false }))}
        className={classes.Container}>
        <ContextMenu
          posX={state.menuX}
          posY={state.menuY}
          visible={state.mainContextMenuVisible}
          onAdd={addTable}
        />
        <Xwrapper>
          {state.tables.map((element) => (
            <Fragment key={element.key}>
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
                setFieldOffset={setFieldOffset}
                setHandleBackgroundColor={onSetHandleBackgroundColor}
                onAddColumn={openAddColumnModal}
                rounded
              />
              {element.relations.map((relation) => (
                <Xarrow
                  key={uuidv4()}
                  showHead
                  curveness={0.65}
                  color="#fff" // TODO: have a setting for this
                  startAnchor={{
                    offset: {
                      y: state.tables
                        .find((t) => t.key === relation.baseTable.id)
                        ?.props.find((p) => p.id === relation.baseColumn.id)?.offset,
                      x: 0,
                    },
                    position: 'auto',
                  }}
                  endAnchor={{
                    offset: {
                      y: state.tables
                        .find((t) => t.key === relation.referencedTable.id)
                        ?.props.find((p) => p.id === relation.referencedColumn.id)?.offset,
                      x: 0,
                    },
                    position: 'auto',
                  }}
                  headSize={6}
                  zIndex={5_000_000}
                  start={element.key}
                  end={relation.referencedTable.id}
                />
              ))}
            </Fragment>
          ))}
        </Xwrapper>
        <div style={{ position: 'fixed', top: 0, left: 0 }}>
          <Field
            name="schemaName"
            value={state.schemaName}
            className={classes.Field}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
            }
          />
          <button onClick={generateSQL}>générer</button>
        </div>
      </div>

      <Portal animate animationDuration={150} mount={state.addColumnModalVisible}>
        <AddColumnModal
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
