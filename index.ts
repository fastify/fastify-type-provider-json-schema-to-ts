import { FastifyTypeProvider } from 'fastify'

import { JSONSchema7, FromSchema  } from 'json-schema-to-ts'

export interface JsonSchemaToTsProvider extends FastifyTypeProvider {
  output: this['input'] extends JSONSchema7 ? FromSchema<this['input']> : never
}
