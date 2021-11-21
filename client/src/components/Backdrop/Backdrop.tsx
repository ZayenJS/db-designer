import { FC, MouseEvent } from 'react';

import styles from './Backdrop.module.scss';
interface BackdropProps {
  isVisible: boolean;
  className?: string;
  onClick?: (event: MouseEvent) => void;
}

const Backdrop: FC<BackdropProps> = ({ isVisible, className, onClick, children }) => (
  <div
    onClick={(event) => onClick && onClick(event)}
    className={[styles.Container, className, isVisible ? styles.Visible : ''].join(' ')}>
    {children}
  </div>
);

export default Backdrop;
