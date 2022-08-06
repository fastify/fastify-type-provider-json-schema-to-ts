import {
  FastifyTypeProvider,
  FastifyPluginOptions,
  RawServerBase,
  RawServerDefault,
  FastifyPluginCallback,
  FastifyPluginAsync
} from 'fastify'

import { JSONSchema7, FromSchema } from 'json-schema-to-ts'

export interface JsonSchemaToTsProvider extends FastifyTypeProvider {
  output: this['input'] extends JSONSchema7 ? FromSchema<this['input']> : never;
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
  Server extends RawServerBase = RawServerDefault
> = FastifyPluginCallback<Options, Server, JsonSchemaToTsProvider>;

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
  Server extends RawServerBase = RawServerDefault
> = FastifyPluginAsync<Options, Server, JsonSchemaToTsProvider>;
