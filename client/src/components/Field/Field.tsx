import { ChangeEvent, FC, FocusEvent } from 'react';
import { StringUtil } from '../../utils/StringUtil';
// import { useChangeValue } from '../../hooks/useChangeValue';

import classes from './Field.module.scss';

export interface FieldProps {
  id?: string;
  className?: string;
  label?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  maxLength?: number;
  placeholder?: string;
  reducerName?: 'contact';
  name: string;
  value?: string | number | boolean;
  autofocus?: boolean;
  errorMessage?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'url' | 'textarea' | 'checkbox';
  min?: string;
  max?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Field: FC<FieldProps> = ({
  id,
  label,
  className = '',
  type = 'text',
  onKeyUp,
  name,
  value,
  reducerName,
  onChange,
  onBlur,
  placeholder,
  maxLength,
  errorMessage = '',
  min,
  max,
}) => {
  // const { changeValue, value: fieldValue } = useChangeValue(name, reducerName);
  // value = fieldValue ?? value;

  const onChangeHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    if (onChange) return onChange(event);

    // if (reducerName) return changeValue(reducerName, event.target.value);
  };

  const onBlurHandler = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onBlur) onBlur(event);
  };

  let input;
  switch (type) {
    case 'textarea':
      input = (
        <>
          <textarea
            name={name}
            maxLength={maxLength}
            id={id}
            placeholder={placeholder}
            value={value as string}
            onBlur={onBlurHandler}
            className={errorMessage ? classes.Error : ''}
            onChange={onChangeHandler}></textarea>
          <label htmlFor={id}>{label}</label>
        </>
      );
      break;
    case 'number':
      input = (
        <>
          <input
            name={name}
            type={type}
            id={id}
            placeholder={placeholder}
            onKeyUp={onKeyUp}
            value={value as string}
            onChange={onChangeHandler}
            min={min}
            max={max}
            onBlur={onBlurHandler}
            className={errorMessage ? classes.Error : ''}
          />
          <label htmlFor={id}>{label}</label>
        </>
      );
      break;
    case 'checkbox':
      input = (
        <>
          <input
            name={name}
            type={type}
            id={id}
            placeholder={placeholder}
            onKeyUp={onKeyUp}
            value={value as string}
            onChange={onChangeHandler}
          />
          <label htmlFor={id}>{label}</label>
        </>
      );
      break;
    default:
      input = (
        <>
          <input
            autoComplete="off"
            name={name}
            type={type}
            id={id}
            placeholder={placeholder}
            onKeyUp={onKeyUp}
            value={value as string}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            className={errorMessage ? classes.Error : ''}
          />
          <label htmlFor={id}>{label}</label>
        </>
      );
  }

  return (
    <div
      className={`${classes.Container} ${classes[StringUtil.upperCaseFirstLetter(type)]} ${
        className ?? ''
      } ${errorMessage ? classes.Error : ''}`}>
      <div>{input}</div>
      {errorMessage && <span className={classes.Error}>{errorMessage}</span>}
    </div>
  );
};

export default Field;
