import {inspect} from 'util';

import {list} from './pactl';

list().then((data) => {
	console.log(inspect(data, false, Infinity, true));
});
