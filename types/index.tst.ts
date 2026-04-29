import { JsonSchemaToTsProvider } from '../index'
import { expect } from 'tstyche'
import Fastify, {
  FastifyInstance,
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault
} from 'fastify'

const fastify = Fastify().withTypeProvider<JsonSchemaToTsProvider>()
expect(fastify).type.toBeAssignableTo<
  FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    JsonSchemaToTsProvider
  >
>()

expect(fastify).type.toBeAssignableTo<FastifyInstance>()

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
    }
  }
}, (req) => {
  expect(req.body.z).type.toBe<boolean>()
  expect(req.body.y).type.toBe<number>()
  expect(req.body.x).type.toBe<string>()
})
