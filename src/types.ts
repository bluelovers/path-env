import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';

export const enum EnumPathDelimiter
{
  poxix = ':',
  win32 = ';',
}

export type IPathDelimiter = ITSTypeAndStringLiteral<EnumPathDelimiter>
export type IPathElement = string
export type IPathArray = ReadonlyArray<IPathElement>
export type IPathString = IPathElement

export interface IEnv
{
  readonly [name: string]: string | undefined
}

export interface IPathFactory
{
  get: {
    array(): IPathArray,
    string(): IPathString,
    delim(): IPathDelimiter
  },
  set: {
    array(x: IPathArray): IPathFactory,
    string(x: IPathString): IPathFactory,
    delim(x: IPathDelimiter): IPathFactory
  },

  append(x: IPathArray): IPathFactory,

  prepend(x: IPathArray): IPathFactory,

  surround(x: IPathArray): IPathFactory,

  deduplicate(): IPathFactory
}

export interface IEnvFactory
{
  get: {
    path: {
      name(): string,
      factory(): IPathFactory
    },
    env(): IEnv,
    rest(): IEnv
  },
  set: {
    factory(x: IPathFactory): IEnvFactory,
    name(x: string): IEnvFactory,
    delim(x: IPathDelimiter): IEnvFactory
  },
  path: {
    get: {
      factory(): IPathFactory,
      string(): IPathString,
      array(): IPathArray,
      delim(): IPathDelimiter,
      name(): string
    },
    set: {
      factory(x: IPathFactory): IEnvFactory,
      string(x: IPathString): IEnvFactory,
      array(x: IPathArray): IEnvFactory,
      delim(x: IPathDelimiter): IEnvFactory,
      name(x: string): IEnvFactory
    },
    append(addend: IPathArray): IEnvFactory,
    prepend(addend: IPathArray): IEnvFactory,
    surround(addend: IPathArray): IEnvFactory,
    deduplicate(): IEnvFactory
  }
}
