// tslint:disable:no-duplicate-imports

import * as path from 'path'
import { env } from 'process'
import * as subject from '../src/index'
import { IEnv, IPathDelimiter } from '../src/index'
import { testEnvFactory, testPathFactory } from './lib/index';

it('subject.base.delimiter() returns path.delimiter', () => {
  expect(subject._delimiter()).toBe(path.delimiter)
})

describe('subject.pathString being called', () => {
  const { PATH, ALT_NAMED_PATH } = env
  const newPath = ['hello', 'world', 'foo', 'bar']
  const newAltNamedPath = ['alternate', 'named', 'path']

  beforeEach(() => {
    Object.assign(env, {
      PATH: subject._join(newPath),
      ALT_NAMED_PATH: subject._join(newAltNamedPath)
    })
  })

  afterEach(() => {
    Object.assign(env, { PATH, ALT_NAMED_PATH })
  })

  describe('without specifying parameters', () => {
    testPathFactory(subject.pathString, newPath, path.delimiter as IPathDelimiter)
  })

  describe('with specified `string`, without specifying `delim`', () => {
    testPathFactory(
      () => subject.pathString(['specified', 'string', 'param'].join(path.delimiter)),
      ['specified', 'string', 'param'],
      path.delimiter as IPathDelimiter
    )
  })

  describe('with specified `string` and `delim`', () => {
    testPathFactory(
      () => subject.pathString('specified:string:and:delimiter', ':'),
      ['specified', 'string', 'and', 'delimiter'],
      ':'
    )

    testPathFactory(
      () => subject.pathString('specified;string;and;delimiter', ';'),
      ['specified', 'string', 'and', 'delimiter'],
      ';'
    )
  })
})

describe('subject.pathEnv being called', () => {
  const oldEnv: IEnv = { ...env }

  const newEnv: IEnv = {
    REST_FOO: 'foo',
    REST_BAR: 'bar',
    PATH: ['this', 'is', 'true', 'path'].join(path.delimiter),
    ALT_NAMED_PATH: ['this', 'is', 'alternative', 'named', 'path'].join(path.delimiter)
  }

  describe('without specified parameters', () => {
    function clearObject<X> (object: {[_: string]: X}) {
      for (const key in object) {
        delete object[key]
      }
    }

    beforeEach(() => {
      clearObject(env)
      Object.assign(env, newEnv)
    })

    afterEach(() => {
      clearObject(env)
      Object.assign(env, oldEnv)
    })

    testEnvFactory(
      () => subject.pathEnv(),
      newEnv,
      'PATH',
      path.delimiter as IPathDelimiter
    )
  })

  describe('with specified `env`, without specifying `name` and `delim`', () => {
    testEnvFactory(
      () => subject.pathEnv({ ...newEnv }),
      { ...newEnv },
      'PATH',
      path.delimiter as IPathDelimiter
    )
  })

  describe('with specified `env` and `name`, without specifying `delim`', () => {
    testEnvFactory(
      () => subject.pathEnv({ ...newEnv }, 'PATH'),
      { ...newEnv },
      'PATH',
      path.delimiter as IPathDelimiter
    )

    testEnvFactory(
      () => subject.pathEnv({ ...newEnv }, 'ALT_NAMED_PATH'),
      { ...newEnv },
      'ALT_NAMED_PATH',
      path.delimiter as IPathDelimiter
    )
  })

  describe('with specified `env`, `name` and `delim`', () => {
    const name = 'SPECIAL_PATH'

    const env = {
      colon: {
        ...newEnv,
        [name]: ['abc', 'def', 'ghi'].join(':')
      },
      semicolon: {
        ...newEnv,
        [name]: ['abc', 'def', 'ghi'].join(';')
      }
    }

    testEnvFactory(
      () => subject.pathEnv({ ...env.colon }, name, ':'),
      { ...env.colon },
      name,
      ':'
    )

    testEnvFactory(
      () => subject.pathEnv({ ...env.semicolon }, name, ';'),
      { ...env.semicolon },
      name,
      ';'
    )
  })
})
