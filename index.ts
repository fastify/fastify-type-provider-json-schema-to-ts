import {
  FastifyTypeProvider
} from 'fastify'

import { JSONSchema, FromSchema, FromSchemaOptions, FromSchemaDefaultOptions } from 'json-schema-to-ts'

export interface JsonSchemaToTsProvider<Options extends FromSchemaOptions = FromSchemaDefaultOptions> extends FastifyTypeProvider {
  output: this['input'] extends JSONSchema ? FromSchema<this['input'], Options> : unknown;
}
