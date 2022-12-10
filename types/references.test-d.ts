import { JsonSchemaToTsProvider } from '../index'
import { expectAssignable, expectType } from 'tsd'
import Fastify, { FastifyInstance, FastifyLoggerInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

const addressSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    line1: { type: 'string' },
    line2: { type: 'string' },
    city: { type: 'string' }
  },
  required: ['line1', 'city']
} as const
type Address = FromSchema<typeof addressSchema>;

const userSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    givenName: { type: 'string' },
    familyName: { type: 'string' }
  },
  required: ['givenName', 'familyName']
} as const
type User = FromSchema<typeof userSchema>

const sharedSchema = {
  $id: 'shared-schema',
  definitions: {
    address: addressSchema,
    user: userSchema
  }
} as const

type JsonSchemaToTsProviderWithSharedSchema = JsonSchemaToTsProvider<{
  references: [typeof sharedSchema];
}>;
const fastify = Fastify().withTypeProvider<JsonSchemaToTsProviderWithSharedSchema>()

expectAssignable<FastifyInstance<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyLoggerInstance, JsonSchemaToTsProviderWithSharedSchema>>(fastify)

fastify.get('/profile', {
  schema: {
    body: {
      type: 'object',
      properties: {
        user: {
          $ref: 'shared-schema#/definitions/user'
        },
        address: {
          $ref: 'shared-schema#/definitions/address'
        }
      },
      required: ['user', 'address']
    } as const
  }
}, (req) => {
  expectType<User>(req.body.user)
  expectType<Address>(req.body.address)
})
