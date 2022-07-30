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
 * FastifyPluginCallback with JSON Schema to Typescript automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginCallbackJStT } from "@fastify/type-provider-json-schema-to-ts"
 *
 * const plugin: FastifyPluginCallbackJStT = (fastify, options, done) => {
 *   done()
 * }
 * ```
 */
export type FastifyPluginCallbackJStT<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault
> = FastifyPluginCallback<Options, Server, JsonSchemaToTsProvider>;

/**
 * FastifyPluginAsync with JSON Schema to Typescript automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginAsyncJStT } fromg "@fastify/type-provider-json-schema-to-ts"
 *
 * const plugin: FastifyPluginAsyncJStT = async (fastify, options) => {
 * }
 * ```
 */
export type FastifyPluginAsyncJStT<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault
> = FastifyPluginAsync<Options, Server, JsonSchemaToTsProvider>;
