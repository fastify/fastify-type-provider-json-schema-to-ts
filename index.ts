import {
  FastifyBaseLogger,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyTypeProvider,
  RawServerBase,
  RawServerDefault
} from 'fastify'

import { FromSchema, FromSchemaDefaultOptions, FromSchemaOptions, JSONSchema } from 'json-schema-to-ts'

export interface JsonSchemaToTsProvider<Options extends FromSchemaOptions = FromSchemaDefaultOptions> extends FastifyTypeProvider {
  validator: this['schema'] extends JSONSchema ? FromSchema<this['schema'], Options> : unknown;
  serializer: this['schema'] extends JSONSchema ? FromSchema<this['schema'], Options> : unknown;
}

/**
 * FastifyPluginCallback with JSON Schema to Typescript automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginCallbackJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts"
 *
 * const plugin: FastifyPluginCallbackJsonSchemaToTs = (fastify, options, done) => {
 *   done()
 * }
 * ```
 */
export type FastifyPluginCallbackJsonSchemaToTs<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
  Logger extends FastifyBaseLogger = FastifyBaseLogger
> = FastifyPluginCallback<Options, Server, JsonSchemaToTsProvider, Logger>

/**
 * FastifyPluginAsync with JSON Schema to Typescript automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginAsyncJsonSchemaToTs } fromg "@fastify/type-provider-json-schema-to-ts"
 *
 * const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify, options) => {
 * }
 * ```
 */
export type FastifyPluginAsyncJsonSchemaToTs<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
  Logger extends FastifyBaseLogger = FastifyBaseLogger
> = FastifyPluginAsync<Options, Server, JsonSchemaToTsProvider, Logger>
