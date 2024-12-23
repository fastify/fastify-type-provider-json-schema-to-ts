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

export interface JsonSchemaToTsProviderOptions {
  ValidatorSchemaOptions?: FromSchemaOptions;
  SerializerSchemaOptions?: FromSchemaOptions;
}

export interface JsonSchemaToTsProvider<
  Options extends JsonSchemaToTsProviderOptions = {}
> extends FastifyTypeProvider {
  validator: this['schema'] extends JSONSchema
    ? FromSchema<
        this['schema'],
        Options['ValidatorSchemaOptions'] extends FromSchemaOptions
          ? Options['ValidatorSchemaOptions']
          : FromSchemaDefaultOptions
      >
    : unknown;
  serializer: this['schema'] extends JSONSchema
    ? FromSchema<
        this['schema'],
        Options['SerializerSchemaOptions'] extends FromSchemaOptions
          ? Options['SerializerSchemaOptions']
          : FromSchemaDefaultOptions
      >
    : unknown;
}

export interface FastifyPluginJsonSchemaToTsOptions extends JsonSchemaToTsProviderOptions {
  Options?: FastifyPluginOptions;
  Server?: RawServerBase;
  Logger?: FastifyBaseLogger;
};

/**
 * FastifyPluginCallback with JSON Schema to Typescript automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginCallbackJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts"
 *
 * const plugin: FastifyPluginCallbackJsonSchemaToTs<{
 *   ValidatorSchemaOptions: {
 *     references: [ SchemaWrite ],
 *   },
 *   SerializerSchemaOptions: {
 *     references: [ SchemaRead ],
 *     deserialize: [{ pattern: { type: 'string'; format: 'date-time'; }; output: Date; }]
 *   }
 * }> = (fastify, options, done) => {
 *   done()
 * }
 * ```
 */
export type FastifyPluginCallbackJsonSchemaToTs<
  Options extends FastifyPluginJsonSchemaToTsOptions = {}
> = FastifyPluginCallback<
  Options['Options'] extends FastifyPluginOptions
    ? Options['Options']
    : Record<never, never>,
  Options['Server'] extends RawServerBase
    ? Options['Server']
    : RawServerDefault,
  JsonSchemaToTsProvider<{
    ValidatorSchemaOptions: Options['ValidatorSchemaOptions'] extends FromSchemaOptions
      ? Options['ValidatorSchemaOptions']
      : FromSchemaDefaultOptions,
    SerializerSchemaOptions: Options['SerializerSchemaOptions'] extends FromSchemaOptions
      ? Options['SerializerSchemaOptions']
      : FromSchemaDefaultOptions
  }>,
  Options['Logger'] extends FastifyBaseLogger
    ? Options['Logger']
    : FastifyBaseLogger
>

/**
 * FastifyPluginAsync with JSON Schema to Typescript automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts"
 *
 * const plugin: FastifyPluginAsyncJsonSchemaToTs<{
 *   ValidatorSchemaOptions: {
 *     references: [ SchemaWrite ],
 *   },
 *   SerializerSchemaOptions: {
 *     references: [ SchemaRead ],
 *     deserialize: [{ pattern: { type: 'string'; format: 'date-time'; }; output: Date; }]
 *   }
 * }> = async (fastify, options) => {
 * }
 * ```
 */
export type FastifyPluginAsyncJsonSchemaToTs<
  Options extends FastifyPluginJsonSchemaToTsOptions = {}
> = FastifyPluginAsync<
  Options['Options'] extends FastifyPluginOptions
    ? Options['Options']
    : Record<never, never>,
  Options['Server'] extends RawServerBase
    ? Options['Server']
    : RawServerDefault,
  JsonSchemaToTsProvider<{
    ValidatorSchemaOptions: Options['ValidatorSchemaOptions'] extends FromSchemaOptions
      ? Options['ValidatorSchemaOptions']
      : FromSchemaDefaultOptions,
    SerializerSchemaOptions: Options['SerializerSchemaOptions'] extends FromSchemaOptions
      ? Options['SerializerSchemaOptions']
      : FromSchemaDefaultOptions
  }>,
  Options['Logger'] extends FastifyBaseLogger
    ? Options['Logger']
    : FastifyBaseLogger
>
