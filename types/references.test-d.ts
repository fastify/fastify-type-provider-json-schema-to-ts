import { JsonSchemaToTsProvider } from '../index'
import { expectAssignable, expectType } from 'tsd'
import Fastify, { FastifyInstance, FastifyBaseLogger, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import type { JSONSchema } from 'json-schema-to-ts'

// Define schemas
const addressSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    line1: { type: 'string' },
    line2: { type: 'string' },
    city: { type: 'string' }
  },
  required: ['line1', 'city']
} as const satisfies JSONSchema
type Address = FromSchema<typeof addressSchema>

const userSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    givenName: { type: 'string' },
    familyName: { type: 'string' }
  },
  required: ['givenName', 'familyName']
} as const satisfies JSONSchema
type User = FromSchema<typeof userSchema>

const sharedSchema = {
  $id: 'shared-schema',
  definitions: {
    address: addressSchema,
    user: userSchema
  }
} as const

const userProfileSchema = {
  $id: 'userProfile',
  type: 'object',
  additionalProperties: false,
  properties: {
    user: { $ref: 'shared-schema#/definitions/user' },
    address: { $ref: 'shared-schema#/definitions/address' },
    joinedAt: { type: 'string', format: 'date-time' }
  },
  required: ['user', 'address', 'joinedAt']
} as const satisfies JSONSchema
type UserProfile = FromSchema<typeof userProfileSchema, {
  references: [typeof sharedSchema],
  deserialize: [{ pattern: { type: 'string'; format: 'date-time' }; output: Date }]
}>

type JsonSchemaToTsProviderWithSharedSchema = JsonSchemaToTsProvider<{
  ValidatorSchemaOptions: {
    references: [typeof sharedSchema];
  },
  SerializerSchemaOptions: {
    references: [typeof userProfileSchema, typeof sharedSchema];
    deserialize: [{ pattern: { type: 'string'; format: 'date-time' }; output: Date }];
  }
}>

const fastify = Fastify().withTypeProvider<JsonSchemaToTsProviderWithSharedSchema>()

expectAssignable<FastifyInstance<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyBaseLogger, JsonSchemaToTsProviderWithSharedSchema>>(fastify)

// Register schemas
fastify.addSchema(sharedSchema)
fastify.addSchema(userProfileSchema)

// Test validation schema
fastify.get('/profile', {
  schema: {
    body: {
      type: 'object',
      properties: {
        user: { $ref: 'shared-schema#/definitions/user' },
        address: { $ref: 'shared-schema#/definitions/address' }
      },
      required: ['user', 'address']
    }
  }
}, (req) => {
  expectType<User>(req.body.user)
  expectType<Address>(req.body.address)
})

// Test serialization and validation schemas
fastify.get('/profile-serialized', {
  schema: {
    body: {
      type: 'object',
      properties: {
        user: { $ref: 'shared-schema#/definitions/user' },
        address: { $ref: 'shared-schema#/definitions/address' }
      },
      required: ['user', 'address']
    },
    response: {
      200: { $ref: 'userProfile#' }
    }
  }
}, (req, reply) => {
  // Ensure type correctness for request body
  expectType<User>(req.body.user)
  expectType<Address>(req.body.address)

  // Create response
  const profile: UserProfile = {
    user: {
      givenName: 'John',
      familyName: 'Doe'
    },
    address: {
      line1: '123 Main St',
      line2: 'Apt 4B',
      city: 'Springfield'
    },
    joinedAt: new Date() // Returning a Date object
  }

  // Ensure type correctness for response
  expectType<UserProfile>(profile)
  expectType<Date>(profile.joinedAt) // Ensure joinedAt is typed as Date
  reply.send(profile)
})
