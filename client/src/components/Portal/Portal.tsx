import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './Portal.module.scss';

interface PortalProps {
  mount?: boolean;
  className?: string;
  animate?: boolean;
  animationDuration?: number;
}
interface PortalState {
  id: string;
  isMounted: boolean;
  baseClass: string;
}

const Portal: FC<PortalProps> = ({
  mount,
  animate,
  animationDuration = 0,
  className,
  children,
}) => {
  const [state, setState] = useState<PortalState>({
    id: uuidv4(),
    isMounted: false,
    baseClass: '',
  });

  useEffect(() => {
    if (mount && !state.isMounted) {
      setState((prevState) => ({
        ...prevState,
        isMounted: true,
        baseClass: animate ? styles.Mounting : '',
      }));
    }
  }, [mount, state.isMounted, animate, className]);

  useEffect(() => {
    if (!mount && animate && state.isMounted) {
      setState((prevState) => ({ ...prevState, baseClass: styles.Unmounting }));
    }
  }, [mount, state.isMounted, animate]);

  useEffect(() => {
    if (!animate && !mount && state.isMounted) {
      setState((prevState) => ({ ...prevState, isMounted: false }));
    }
  }, [animate, mount, state.isMounted]);

  const animationEndHandler = () => {
    if (!mount) {
      setState((prevState) => ({ ...prevState, isMounted: false, baseClass: '' }));
      return;
    }

    setState((prevState) => ({ ...prevState, baseClass: styles.Mounted }));
  };

  return state.isMounted
    ? createPortal(
        <div
          id={state.id}
          style={{ animationDuration: `${animationDuration}ms` }}
          onAnimationEnd={animationEndHandler}
          className={`${state.baseClass} ${className ?? ''}`}>
          {children}
        </div>,
        document.body,
        state.id,
      )
    : null;
};

export default Portal;
