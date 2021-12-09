import { FastifyTypeProvider } from 'fastify'

import { JSONSchema, FromSchema } from 'json-schema-to-ts'

export interface JsonSchemaToTsProvider extends FastifyTypeProvider {
  output: this['input'] extends JSONSchema ? FromSchema<this['input']> : never
}
