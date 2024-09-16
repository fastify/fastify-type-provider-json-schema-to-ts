import Fastify, { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'
import { expectType } from 'tsd'
import {
  FastifyPluginAsyncJsonSchemaToTs,
  FastifyPluginCallbackJsonSchemaToTs
} from '../index'

import { Http2Server } from 'node:http2'

import type { JSONSchema } from 'json-schema-to-ts'

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
    async (
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

const asyncPlugin: FastifyPluginAsyncJsonSchemaToTs<{
  Options: { optionA: string },
  Server: Http2Server
}> = async (fastify, options) => {
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
        }
      }
    },
    (req) => {
      expectType<boolean>(req.body.z)
      expectType<number>(req.body.y)
      expectType<string>(req.body.x)
    }
  )
}

const userSchema = {
  $id: 'UserSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name', 'age']
} as const satisfies JSONSchema

const serializedUserSchema = {
  $id: 'SerializedUserSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    registeredAt: { type: 'string', format: 'date-time' }
  },
  required: ['name', 'age', 'registeredAt']
} as const satisfies JSONSchema

const asyncPluginWithSchemaOptions: FastifyPluginAsyncJsonSchemaToTs<{
  Options: { optionA: string },
  ValidatorSchemaOptions: {
    references: [typeof userSchema]
  },
  SerializerSchemaOptions: {
    references: [typeof serializedUserSchema],
    deserialize: [{ pattern: { type: 'string'; format: 'date-time' }; output: Date }]
  }
}> = async (fastify, options) => {
  expectType<string>(options.optionA)

  // Register schemas
  fastify.addSchema(userSchema)
  fastify.addSchema(serializedUserSchema)

  fastify.get(
    '/option',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            foo: {
              type: 'boolean',
              default: true
            }
          }
        },
        body: {
          type: 'object',
          $ref: 'UserSchema#'
        },
        response: {
          200: { $ref: 'SerializedUserSchema#' }
        }
      }
    },
    async (req, reply) => {
      expectType<boolean>(req.query.foo)
      expectType<string>(req.body.name)
      expectType<number>(req.body.age)

      reply.send({
        name: req.body.name,
        age: req.body.age,
        registeredAt: new Date()
      })
    }
  )
}

const callbackPlugin: FastifyPluginCallbackJsonSchemaToTs<{
  Options: { optionA: string },
  Server: Http2Server
}> = (fastify, options, done) => {
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
        }
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

const callbackPluginWithSchemaOptions: FastifyPluginCallbackJsonSchemaToTs<{
  Options: { optionA: string },
  ValidatorSchemaOptions: {
    references: [typeof userSchema]
  },
  SerializerSchemaOptions: {
    references: [typeof serializedUserSchema],
    deserialize: [{ pattern: { type: 'string'; format: 'date-time' }; output: Date }]
  }
}> = (fastify, options, done) => {
  expectType<string>(options.optionA)

  // Register schemas
  fastify.addSchema(userSchema)
  fastify.addSchema(serializedUserSchema)

  fastify.get(
    '/callback-option',
    {
      schema: {
        body: { $ref: 'UserSchema#' },
        response: {
          200: { $ref: 'SerializedUserSchema#' }
        }
      }
    },
    (req, reply) => {
      expectType<string>(req.body.name)
      expectType<number>(req.body.age)

      reply.send({
        name: req.body.name,
        age: req.body.age,
        registeredAt: new Date()
      })
    }
  )

  done()
}

const fastify = Fastify()

fastify.register(asyncPlugin, { optionA: 'a' })
fastify.register(asyncPluginWithSchemaOptions, { optionA: 'a' })
fastify.register(callbackPlugin, { optionA: 'a' })
fastify.register(callbackPluginWithSchemaOptions, { optionA: 'a' })
