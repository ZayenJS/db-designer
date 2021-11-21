import { FC } from 'react';
import { StringUtil } from '../../utils/StringUtil';

import styles from './CloseCross.module.scss';
interface CloseCrossProps {
  click?: () => void;
  modal?: boolean;
  tooltip?: boolean;
  tooltipPosition?: 'left' | 'right';
  tooltipText?: string;
  className?: string;
}

const CloseCross: FC<CloseCrossProps> = ({
  click,
  modal = false,
  tooltip = false,
  tooltipText,
  tooltipPosition = 'right',
  className,
}) => {
  const props: { [key: string]: any } = {
    className: [
      styles.Item,
      styles[StringUtil.upperCaseFirstLetter(tooltipPosition)],
      modal ? styles.Modal : '',
      className,
    ].join(' '),
  };

  if (modal || tooltip) props['data-tooltip'] = tooltipText ?? 'Cliquer ici pour fermer';
  if (click) props.onClick = click;

  return <span {...props}></span>;
};

export default CloseCross;
