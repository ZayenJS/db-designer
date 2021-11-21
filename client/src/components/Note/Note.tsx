import { FC } from 'react';

import classes from './Note.module.scss';

export interface NoteProps {}

const Note: FC<NoteProps> = () => {
	return (
		<div className={classes.Container}>Note Component</div>
	);
}

export default Note;