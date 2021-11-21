import { FC, FormEvent, KeyboardEvent, useState } from 'react';
import Draggable from 'react-draggable';
import { ReactSortable } from 'react-sortablejs';
import { useXarrow } from 'react-xarrows';
import { TableProperty } from '../../models';

import classes from './Table.module.scss';

export interface TableProps {
  id: string;
  tableName?: string;
  handleBackgroundColor?: string;
  handleColor?: string;
  defaultPosition?: { x: number; y: number };
  rounded?: boolean;
  properties: (TableProperty & { id: string })[];
  setProperties: (newState: (TableProperty & { id: string })[], name: string) => void;
  changeTableName: (oldName: string, newName: string) => void;
  setHandleBackgroundColor: (id: string, color: string) => void;
  onAddColumn: (id: string) => void;
}

const Table: FC<TableProps> = ({
  id,
  tableName = 'Nouvelle table',
  defaultPosition = { x: 0, y: 0 },
  handleBackgroundColor = '#aaa',
  handleColor = '#333',
  rounded = false,
  properties,
  setProperties,
  changeTableName,
  setHandleBackgroundColor,
  onAddColumn,
}) => {
  const [state, setState] = useState({
    editing: false,
    newTableName: tableName,
  });
  const updateXarrow = useXarrow();

  const formSubmitHandler = (event: FormEvent) => {
    event.preventDefault();

    // TODO: check if empty field
    if (state.editing) changeTableName(tableName, state.newTableName);

    setState((prevState) => ({ ...prevState, editing: !state.editing }));
  };

  const onSetProperties = (newState: (TableProperty & { id: string })[]) => {
    setProperties(newState, tableName);
  };

  const tableNameFieldKeyDownHandler = (event: KeyboardEvent) => {
    const tableNameElement = event.target as HTMLSpanElement;
    let editing = true;

    if (event.key.toLowerCase() === 'enter') {
       // TODO: check if empty field
       changeTableName(tableName, tableNameElement.textContent);
       editing = false;
    }

    setState((prevState) => ({
      ...prevState,
      editing,
      newTableName: tableNameElement.textContent,
    }));
  };

  return (
    <Draggable
      onDrag={updateXarrow}
      onStop={updateXarrow}
      disabled={state.editing}
      handle={`#${id}`}
      defaultPosition={defaultPosition}>
      <article className={`${classes.Container}`} style={{ borderRadius: rounded ? '10px' : 0 }}>
        <header
          id={id}
          style={{ backgroundColor: handleBackgroundColor, color: handleColor }}
          className={`${classes.Handle} ${state.editing ? classes.Editing : ''}`}>
          <form onSubmit={formSubmitHandler}>
            <span
              onKeyDown={tableNameFieldKeyDownHandler}
              className={`${classes.TableName} ${state.editing ? classes.Editing : ''}`}
              contentEditable={state.editing}>
              {state.newTableName}
            </span>
            <div className={classes.Actions}>
              {state.editing && (
                <label className={classes.Color}>
                  <input
                    type="color"
                    value={handleBackgroundColor}
                    onChange={(e) => setHandleBackgroundColor(id, e.target.value)}
                  />
                </label>
              )}
              {/* // TODO: fix bug: not updating tablename */}
              <button className={state.editing ? classes.Validate : classes.Edit}></button>
            </div>
          </form>
        </header>
        <main>
          <ReactSortable tag="ul" handle={''} list={properties} setList={onSetProperties}>
            {properties.map((prop) => (
              <li key={prop.id}>{prop.name}</li>
            ))}
          </ReactSortable>
        </main>
        <footer className={classes.Footer}>
          <button
            onClick={onAddColumn.bind(null, id)}
            style={{ backgroundColor: handleBackgroundColor, color: handleColor }}>
            Ajouter une colonne
          </button>
        </footer>
      </article>
    </Draggable>
  );
};

export default Table;
