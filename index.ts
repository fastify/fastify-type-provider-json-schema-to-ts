import {
  FastifyTypeProvider,
  FastifyPluginOptions,
  RawServerBase,
  RawServerDefault,
  FastifyPluginCallback,
  FastifyPluginAsync,
} from "fastify";

import { JSONSchema7, FromSchema } from "json-schema-to-ts";

export interface JsonSchemaToTsProvider extends FastifyTypeProvider {
  output: this["input"] extends JSONSchema7 ? FromSchema<this["input"]> : never;
}

/**
 * FastifyPluginCallback with Typebox automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginCallbackTypebox } fromg "@fastify/type-provider-typebox"
 *
 * const plugin: FastifyPluginCallbackTypebox = (fastify, options, done) => {
 *   done()
 * }
 * ```
 */
export type FastifyPluginCallbackJStT<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault
> = FastifyPluginCallback<Options, Server, JsonSchemaToTsProvider>;

/**
 * FastifyPluginAsync with Typebox automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginAsyncTypebox } fromg "@fastify/type-provider-typebox"
 *
 * const plugin: FastifyPluginAsyncTypebox = async (fastify, options) => {
 * }
 * ```
 */
export type FastifyPluginAsyncJStT<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault
> = FastifyPluginAsync<Options, Server, JsonSchemaToTsProvider>;
