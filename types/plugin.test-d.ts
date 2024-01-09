import type {
  JsonSchemaToTsProvider
} from '../index'
import { expectType } from 'tsd'
import Fastify, { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'

const asyncPlugin: FastifyPluginAsync = async (fastify, options) => {
  const app = fastify.withTypeProvider<JsonSchemaToTsProvider>()
  app.get(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            x: { type: 'string' },
            y: { type: 'number' },
            z: { type: 'boolean' }
          },
          required: ['x', 'y', 'z']
        } as const
      }
    },
    (req) => {
      expectType<boolean>(req.body.z)
      expectType<number>(req.body.y)
      expectType<string>(req.body.x)
    }
  )
}

const callbackPlugin: FastifyPluginCallback = (fastify, _options, done) => {
  const app = fastify.withTypeProvider<JsonSchemaToTsProvider>()
  app.get(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            x: { type: 'string' },
            y: { type: 'number' },
            z: { type: 'boolean' }
          },
          required: ['x', 'y', 'z']
        } as const
      }
    },
    (req) => {
      expectType<boolean>(req.body.z)
      expectType<number>(req.body.y)
      expectType<string>(req.body.x)
    }
  )
  done()
}

const fastify = Fastify()

fastify.register(asyncPlugin)
fastify.register(callbackPlugin)
