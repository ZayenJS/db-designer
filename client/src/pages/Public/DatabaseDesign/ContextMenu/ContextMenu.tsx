import { FC, forwardRef } from 'react';

import classes from './ContextMenu.module.scss';

export interface ContextMenuProps {
  posX: number;
  posY: number;
  visible: boolean;
  onAdd: () => void;
}

const ContextMenu: FC<ContextMenuProps> = forwardRef<HTMLUListElement, ContextMenuProps>(
  ({ posX, posY, visible = false, onAdd }, ref) => {
    return (
      <ul
        style={{ left: `${posX}px`, top: `${posY}px` }}
        className={`${classes.Menu} ${visible ? classes.Visible : ''}`}
        ref={ref}>
        <li onClick={onAdd}>Ajouter une table</li>
        <li>Ajouter une note</li>
        <li>Enregistrer</li>
        <li>A propos</li>
      </ul>
    );
  },
);

export default ContextMenu;
