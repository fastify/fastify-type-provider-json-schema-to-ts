import Fastify, { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'
import { expect } from 'tstyche'
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
      expect(fastifyWithJSONSchemaToTs.server).type.toBe<typeof fastify.server>()
      expect(optionsJSONSchemaToTs).type.toBe<typeof options>()
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
      expect(fastifyWithJSONSchemaToTs.server).type.toBe<typeof fastify.server>()
      expect(optionsJSONSchemaToTs).type.toBe<typeof options>()
      doneJSONSchemaToTs()
    }

  fastify.register(pluginCallbackJSONSchemaToTsDefaults)
  done()
}

const asyncPlugin: FastifyPluginAsyncJsonSchemaToTs<{
  Options: { optionA: string },
  Server: Http2Server
}> = async (fastify, options) => {
  expect(fastify.server).type.toBe<Http2Server>()
  expect(options.optionA).type.toBe<string>()

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
      expect(req.body.z).type.toBe<boolean>()
      expect(req.body.y).type.toBe<number>()
      expect(req.body.x).type.toBe<string>()
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
  expect(options.optionA).type.toBe<string>()

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
      expect(req.query.foo).type.toBe<boolean>()
      expect(req.body.name).type.toBe<string>()
      expect(req.body.age).type.toBe<number>()

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
  expect(fastify.server).type.toBe<Http2Server>()
  expect(options.optionA).type.toBe<string>()

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
      expect(req.body.z).type.toBe<boolean>()
      expect(req.body.y).type.toBe<number>()
      expect(req.body.x).type.toBe<string>()
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
  expect(options.optionA).type.toBe<string>()

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
      expect(req.body.name).type.toBe<string>()
      expect(req.body.age).type.toBe<number>()

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
