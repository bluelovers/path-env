import { env } from 'process'
export * from './path-env'
export * from './types'
import { IEnv, IPathDelimiter } from './types';
import { _pathEnv, _pathString } from './path-env';

export function pathString(str = env['PATH'] || '', delim?: IPathDelimiter) {
	return _pathString(str, delim);
}

export function pathEnv(envObject: IEnv = env,
	name?: string,
	delim?: IPathDelimiter,
)
{
	return _pathEnv(envObject, name, delim);
}

export default pathEnv
