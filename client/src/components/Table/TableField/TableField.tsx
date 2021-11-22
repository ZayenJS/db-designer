import { FC, RefObject, useEffect, useRef } from 'react';
import { TableProperty } from '../../../models';
import { Space } from '../../../utils/Space';

import classes from './TableField.module.scss';

export interface TableFieldProps extends TableProperty {
  tableId: string;
  fieldId: string;
  className: string;
  handleRef: RefObject<HTMLHeadingElement>;
  setOffset: (tableId: string, fieldId: string, offset: number) => void;
}

const TableField: FC<TableFieldProps> = ({
  tableId,
  fieldId,
  className,
  handleRef,
  children,
  setOffset,
  name,
  primaryKey,
}) => {
  const fieldRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (handleRef.current && fieldRef.current) {
      const distance = Space.getDistanceBetweenElements(handleRef.current, fieldRef.current);

      setOffset(tableId, fieldId, distance);
    }
  }, [handleRef, fieldId, tableId, setOffset]);

  if (name === 'id') primaryKey = true;

  return (
    <li id={fieldId} ref={fieldRef} className={`${classes.Container} ${className}`}>
      <div className={classes.Name}>
        {primaryKey && <span className={classes.Primary_Key}></span>}
        <strong>{name}</strong>
      </div>
      <div className={classes.Actions}>
        <button type="button" className={classes.Edit}></button>
        <button type="button" className={`${classes.Move} column__handle`}></button>
      </div>
    </li>
  );
};

export default TableField;
