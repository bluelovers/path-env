import { delimiter as _pathDelimiter } from 'path'

import { IEnvFactory, IEnv, IPathArray, IPathDelimiter, IPathFactory, IPathString } from './types'

export function _delimiter()
{
	return _pathDelimiter as IPathDelimiter;
}

export function _split(str: IPathString, delim = _pathDelimiter as IPathDelimiter): IPathArray
{
	return str.split(delim);
}

export function _join(array: IPathArray, delim = _pathDelimiter as IPathDelimiter): IPathString
{
	return array.join(delim);
}

export function _pathString(str: IPathString, delim?: IPathDelimiter)
{
	return _pathArray(_split(str, delim), delim)
}

export function _pathArray(array: IPathArray, delim = _pathDelimiter as IPathDelimiter): IPathFactory
{
	const append = (addend: IPathArray) =>
		_pathArray(array.concat(...addend), delim)

	const prepend = (addend: IPathArray) =>
		_pathArray(addend.concat(...array), delim)

	const surround = (addend: IPathArray) =>
		_pathArray(addend.concat(...array).concat(...addend), delim)

	const deduplicate = () =>
		_pathArray(Array.from(new Set(array)), delim)

	return {
		get: {
			array: () => array,
			string: () => _join(array, delim),
			delim: () => delim,
		},
		set: {
			array: (x: IPathArray) => _pathArray(x, delim),
			string: (x: IPathString) => _pathString(x, delim),
			delim: (x: IPathDelimiter) => _pathArray(array, x),
		},
		append,
		prepend,
		surround,
		deduplicate,
	}
}

export function _pathEnv(env: IEnv, name = 'PATH', delim = _pathDelimiter as IPathDelimiter): IEnvFactory
{
	const { [name]: str = '', ...restEnv } = env
	const factory = _pathString(str, delim)

	function main(
		factory: IPathFactory,
		name: string,
		delim: IPathDelimiter,
	): IEnvFactory
	{
		const replaceFactory = (x: IPathFactory) => main(x, name, x.get.delim())

		return {
			get: {
				path: {
					name: () => name,
					factory: () => factory,
				},
				env: () => ({
					[name]: factory.get.string(),
					...restEnv,
				}),
				rest: () => restEnv,
			},
			set: {
				factory: replaceFactory,
				name: (x: string) => main(factory, x, delim),
				delim: (x: IPathDelimiter) => main(factory, name, x),
			},
			path: {
				get: {
					...factory.get,
					factory: () => factory,
					name: () => name,
				},
				set: {
					factory: replaceFactory,
					string: (x: IPathString) => main(factory.set.string(x), name, delim),
					array: (x: IPathArray) => main(factory.set.array(x), name, delim),
					delim: (x: IPathDelimiter) => main(factory.set.delim(x), name, x),
					name: (x: string) => main(factory, x, delim),
				},
				append: (addend: IPathArray) =>
					replaceFactory(factory.append(addend)),
				prepend: (addend: IPathArray) =>
					replaceFactory(factory.prepend(addend)),
				surround: (addend: IPathArray) =>
					replaceFactory(factory.surround(addend)),
				deduplicate: () =>
					replaceFactory(factory.deduplicate()),
			},
		}
	}

	return main(factory, name, delim)
}
