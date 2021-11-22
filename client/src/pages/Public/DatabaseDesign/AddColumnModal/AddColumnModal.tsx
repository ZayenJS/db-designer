import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Backdrop from '../../../../components/Backdrop/Backdrop';
import CloseCross from '../../../../components/CloseCross/CloseCross';
import Field from '../../../../components/Field/Field';
import { SQLDataTypes, TableProperty } from '../../../../models';
import { StringUtil } from '../../../../utils/StringUtil';

import classes from './AddColumnModal.module.scss';

type Identifier = {
  id: string;
  name: string;
};

type AddColumnTable = Identifier & { fields: Identifier[] };

export interface AddColumnModalProps {
  tableId: string;
  tableName: string;
  availableTables: AddColumnTable[];
  onValidate: (addedColumn: TableProperty) => void;
  onCancel: () => void;
}

const AddColumnModal: FC<AddColumnModalProps> = ({
  tableId,
  tableName,
  availableTables,
  onCancel,
  onValidate,
}) => {
  const [state, setState] = useState<TableProperty>({
    id: `_${StringUtil.makeid(50)}`,
    name: '',
    type: 'VARCHAR',
    size: 255,
    allowNull: false,
  });

  const dataTypes: SQLDataTypes[] = [
    'BIGINT',
    'BIGSERIAL',
    'BIT',
    'BIT VARYING',
    'BOOL',
    'BOOLEAN',
    'CHAR',
    'CHARACTER',
    'CHARACTER VARYING',
    'CIRCLE',
    'DATE',
    'DATETIME',
    'DATERANGE',
    'DECIMAL',
    'DOUBLE',
    'FLOAT4',
    'FLOAT8',
    'HSTORE',
    'INT',
    'INTEGER',
    'INTERVAL',
    'JSON',
    'JSONB',
    'NUMERIC',
    'NUMRANGE',
    'REAL',
    'SERIAL',
    'SMALLINT',
    'SMALLSERIAL',
    'TEXT',
    'TIMESTAMP',
    'UUID',
    'VARCHAR',
  ];

  const formSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    onValidate(state);
  };

  const inputChangeHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target as HTMLSelectElement | HTMLInputElement;
    const name = target.name;
    const value = target.value;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const checkBoxCheckHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target as HTMLSelectElement | HTMLInputElement;
    const name = target.name;
    const value = target.value === 'true' ? false : true;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <Backdrop isVisible={true} />
      <div className={classes.Container}>
        <CloseCross modal tooltipPosition="left" click={onCancel} />
        <strong>Ajout d'une colonne à la table "{tableName}"</strong>
        <form onSubmit={formSubmitHandler}>
          <Field
            id={uuidv4()}
            name="name"
            label="Nom de la colonne"
            placeholder=" "
            onChange={inputChangeHandler}
            value={state.name}
          />
          <select onChange={inputChangeHandler} name="type">
            <option>Sélectionner un type de donnée</option>
            {dataTypes.map((dataType) => (
              <option value={dataType} key={dataType}>
                {dataType}
              </option>
            ))}
          </select>
          <Field
            id={uuidv4()}
            name="size"
            label="Taille"
            type="number"
            placeholder=" "
            onChange={inputChangeHandler}
            value={state.size}
            min="1"
          />
          <Field
            id={uuidv4()}
            name="default"
            label="Valeur par défaut"
            placeholder=" "
            onChange={inputChangeHandler}
            value={state.default}
            min="1"
          />
          <div className={classes.Checkbox_Container}>
            <Field
              id={uuidv4()}
              name="primaryKey"
              label="Clé primaire"
              type="checkbox"
              placeholder=" "
              className={classes.CheckBox}
              onChange={checkBoxCheckHandler}
              value={state.primaryKey}
            />
            <Field
              id={uuidv4()}
              name="autoIncrement"
              label="Incrémentation automatique"
              type="checkbox"
              placeholder=" "
              className={classes.CheckBox}
              onChange={checkBoxCheckHandler}
              value={state.autoIncrement}
            />
            <Field
              id={uuidv4()}
              name="allowNull"
              label="Autoriser valeur null"
              type="checkbox"
              placeholder=" "
              className={classes.CheckBox}
              onChange={checkBoxCheckHandler}
              value={state.allowNull}
            />
            <Field
              id={uuidv4()}
              name="unique"
              label="Marquer comme unique"
              type="checkbox"
              placeholder=" "
              className={classes.CheckBox}
              onChange={checkBoxCheckHandler}
              value={state.unique}
            />
            {[
              'DECIMAL',
              'DOUBLE',
              'FLOAT4',
              'FLOAT8',
              'INT',
              'INTEGER',
              'NUMERIC',
              'REAL',
            ].includes(state.type) ? (
              <Field
                id={uuidv4()}
                name="signed"
                label="Valeur signée"
                type="checkbox"
                placeholder=" "
                className={classes.CheckBox}
                onChange={checkBoxCheckHandler}
                value={state.signed}
              />
            ) : null}
            <Field
              id={uuidv4()}
              name="foreignKey"
              label="Clé étrangère"
              type="checkbox"
              placeholder=" "
              className={classes.CheckBox}
              onChange={checkBoxCheckHandler}
              value={state.foreignKey}
            />
            {state.foreignKey ? (
              <>
                <select name="tableRef" onChange={inputChangeHandler}>
                  <option>Table de référence</option>
                  {availableTables.map((table) => (
                    <option value={table.id}>{table.name}</option>
                  ))}
                </select>
                <select name="fieldRef" onChange={inputChangeHandler}>
                  <option>Champ de référence</option>
                  {state.tableRef
                    ? availableTables
                        .find((t) => t.id === state.tableRef)!
                        .fields.map((field) => <option value={field.id}>{field.name}</option>)
                    : null}
                </select>
              </>
            ) : null}
          </div>

          <button>Ajouter</button>
        </form>
      </div>
    </>
  );
};

export default AddColumnModal;
