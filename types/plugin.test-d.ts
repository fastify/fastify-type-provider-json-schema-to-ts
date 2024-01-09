import type {
  FastifyPluginAsyncJsonSchemaToTs,
  FastifyPluginCallbackJsonSchemaToTs,
  JsonSchemaToTsProvider
} from '../index'
import { expectType } from 'tsd'
import Fastify, { FastifyPluginAsync, FastifyPluginCallback, RawServerDefault } from 'fastify'

import { Http2Server } from 'http2'

// Ensure the defaults of FastifyPluginAsyncJsonSchemaToTs are the same as FastifyPluginAsync
export const pluginAsyncDefaults: FastifyPluginAsync = async (
  fastify,
  options
) => {
  const pluginAsyncJSONSchemaToTsDefaults: FastifyPluginAsyncJsonSchemaToTs =
    async (fastifyWithJSONSchemaToTs, optionsJSONSchemaToTs) => {
      expectType<typeof fastifyWithJSONSchemaToTs['server']>(fastify.server)
      expectType<typeof optionsJSONSchemaToTs>(options)
    }
  fastify.register(pluginAsyncJSONSchemaToTsDefaults)
}

// Ensure the defaults of FastifyPluginCallbackJsonSchemaToTs are the same as FastifyPluginCallback
export const pluginCallbackDefaults: FastifyPluginCallback = (
  fastify,
  options,
  done
) => {
  const pluginCallbackJSONSchemaToTsDefaults: FastifyPluginCallbackJsonSchemaToTs =
    (
      fastifyWithJSONSchemaToTs,
      optionsJSONSchemaToTs,
      doneJSONSchemaToTs
    ) => {
      expectType<typeof fastifyWithJSONSchemaToTs['server']>(fastify.server)
      expectType<typeof optionsJSONSchemaToTs>(options)
      doneJSONSchemaToTs()
    }

  fastify.register(pluginCallbackJSONSchemaToTsDefaults)
  done()
}
const asyncPlugin: FastifyPluginAsyncJsonSchemaToTs<
  { optionA: string },
  Http2Server
> = async (fastify, options) => {
  expectType<string>(options.optionA)

  expectType<Http2Server>(fastify.server)

  fastify.get(
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

const callbackPlugin: FastifyPluginCallbackJsonSchemaToTs<
  { optionA: string },
  Http2Server
> = (fastify, options, done) => {
  expectType<Http2Server>(fastify.server)

  expectType<string>(options.optionA)

  fastify.get(
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
