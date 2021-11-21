import { ChangeEvent, FC, useState } from 'react';
import { ReactSortable as Sortable } from 'react-sortablejs';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';

import classes from './DraggableBox.module.scss';

export interface DraggableBoxProps {
  id: string;
  tableName?: string;
  handleBackgroundColor?: string;
  handleColor?: string;
  defaultPosition?: { x: number; y: number };
  rounded?: boolean;
}

const DraggableBox: FC<DraggableBoxProps> = ({
  id,
  tableName = 'Nouvelle table',
  defaultPosition = { x: 0, y: 0 },
  handleBackgroundColor = '#aaa',
  handleColor = '#333',
  rounded = false,
}) => {
  const [list, setList] = useState([]);
  const [state, setState] = useState({
    editing: false,
    newTableName: tableName,
  });
  const updateXarrow = useXarrow();

  const inputChangeHanlder = (event: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({ ...prevState, newTableName: event.target.value }));
  };

  const setEditing = () => {
    setState((prevState) => ({ ...prevState, editing: !state.editing }));
  };

  return (
    <Draggable
      onDrag={updateXarrow}
      onStop={updateXarrow}
      disabled={state.editing}
      handle={`#${id}`}
      defaultPosition={defaultPosition}>
      <article className={classes.Container} style={{ borderRadius: rounded ? '10px' : 0 }}>
        {/* // TODO replace by a form */}
        <header
          id={id}
          style={{ backgroundColor: handleBackgroundColor, color: handleColor }}
          className={classes.Handle}>
          {state.editing ? (
            <input type="text" value={state.newTableName} onChange={inputChangeHanlder} />
          ) : (
            <span>{state.newTableName}</span>
          )}
          <button onClick={setEditing}>{state.editing ? 'rennomer' : 'modifier'}</button>
        </header>
        <main>
          <ul>
            <Sortable list={list} setList={setList}>
              {}
            </Sortable>
          </ul>
        </main>
      </article>
    </Draggable>
  );
};

export default DraggableBox;
