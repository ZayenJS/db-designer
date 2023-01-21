import { ChangeEvent, FC, FormEvent, MouseEvent, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { ReactSortable } from 'react-sortablejs';
import { useXarrow } from 'react-xarrows';
import { TableProperty } from '../../models';
import { Color } from '../../utils/Color';

import classes from './Table.module.scss';
import TableField from './TableField/TableField';

export interface TableProps {
  id: string;
  tableName?: string;
  handleBackgroundColor?: string;
  handleColor?: string;
  defaultPosition?: { x: number; y: number };
  rounded?: boolean;
  properties: (TableProperty & { id: string })[];
  setProperties: (newState: (TableProperty & { id: string })[], name: string) => void;
  setFieldOffset: (tableId: string, fieldId: string, offset: number) => void;
  changeTableName: (oldName: string, newName: string) => void;
  setHandleBackgroundColor: (id: string, color: string) => void;
  onAddColumn: (id: string) => void;
}

const Table: FC<TableProps> = ({
  id,
  tableName = 'Nouvelle table',
  defaultPosition = { x: 0, y: 0 },
  handleBackgroundColor = '#aaaaaa',
  handleColor = '#333333',
  rounded = false,
  properties,
  setProperties,
  setFieldOffset,
  changeTableName,
  setHandleBackgroundColor,
  onAddColumn,
}) => {
  const [state, setState] = useState({
    editing: false,
    newTableName: tableName,
    size: 0,
  });
  const updateXarrow = useXarrow();

  const inputRef = useRef<HTMLInputElement>(null);

  const formSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    // TODO: add notification to give feedback to the user
    if (state.editing && !state.newTableName) return;

    if (state.editing) changeTableName(tableName, state.newTableName);

    // doesn't work without setTimeout
    setTimeout(() => {
      inputRef.current?.select();
    }, 5);

    const textLength = inputRef.current?.value.length;
    const size = textLength && textLength > 1 ? textLength : 1;

    setState((prevState) => ({
      ...prevState,
      editing: !state.editing,
      size,
    }));
  };

  const onSetProperties = (newState: (TableProperty & { id: string })[]) => {
    setProperties(newState, tableName);
  };

  const inputChangeHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const { value, name } = target;

    const textLength = inputRef.current?.value.length;

    const size = textLength && textLength > 1 ? textLength : 1;

    setState((prevState) => ({ ...prevState, [name]: value, size }));
  };

  const addColumnButtonMouseEnterHandler = (event: MouseEvent) => {
    (event.target as HTMLButtonElement).style.backgroundColor = `#${Color.lighten(
      handleBackgroundColor,
      10,
    )}`;
  };

  const addColumnButtonMouseLeaveHandler = (event: MouseEvent) => {
    (event.target as HTMLButtonElement).style.backgroundColor = handleBackgroundColor;
  };

  const handleRef = useRef<HTMLHeadingElement>(null);

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
          ref={handleRef}
          style={{ backgroundColor: handleBackgroundColor, color: handleColor }}
          className={`${classes.Handle} ${state.editing ? classes.Editing : ''}`}>
          <form onSubmit={formSubmitHandler}>
            <input
              ref={inputRef}
              size={state.size}
              autoFocus
              name="newTableName"
              style={{ color: handleColor }}
              className={`${classes.TableName} ${state.editing ? classes.Editing : ''}`}
              disabled={!state.editing}
              onChange={inputChangeHandler}
              value={state.newTableName}
            />
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
              <button className={state.editing ? classes.Validate : classes.Edit}></button>
            </div>
          </form>
        </header>
        <main className={classes.Main}>
          <ReactSortable
            tag="ul"
            handle={'.column__handle'}
            list={properties}
            setList={onSetProperties}>
            {properties.map((prop) => (
              <TableField
                key={prop.id}
                tableId={id}
                fieldId={prop.id}
                handleRef={handleRef}
                className={classes.Property}
                setOffset={setFieldOffset}
                {...prop}
              />
            ))}
          </ReactSortable>
        </main>
        <footer className={classes.Footer}>
          <button
            onClick={onAddColumn.bind(null, id)}
            onMouseEnter={addColumnButtonMouseEnterHandler}
            onMouseLeave={addColumnButtonMouseLeaveHandler}
            style={{ backgroundColor: handleBackgroundColor, color: handleColor }}>
            Ajouter une colonne
          </button>
        </footer>
      </article>
    </Draggable>
  );
};

export default Table;
