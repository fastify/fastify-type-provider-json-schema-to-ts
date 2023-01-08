import { JsonSchemaToTsProvider } from '../index'
import { expectAssignable, expectType } from 'tsd'
import Fastify, { FastifyInstance, FastifyLoggerInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify'

const fastify = Fastify().withTypeProvider<JsonSchemaToTsProvider>()
expectAssignable<FastifyInstance<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyLoggerInstance, JsonSchemaToTsProvider>>(fastify)
expectAssignable<FastifyInstance>(fastify)

fastify.get('/', {
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
}, (req) => {
  expectType<boolean>(req.body.z)
  expectType<number>(req.body.y)
  expectType<string>(req.body.x)
})
