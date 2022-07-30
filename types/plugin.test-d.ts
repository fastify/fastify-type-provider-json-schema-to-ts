import { FastifyPluginAsyncJStT, FastifyPluginCallbackJStT } from "../index";
import { expectType } from "tsd";
import Fastify, { FastifyPluginAsync, FastifyPluginCallback } from "fastify";

import { Http2Server } from "http2";

// Ensure the defaults of FastifyPluginAsyncJStT are the same as FastifyPluginAsync
export const pluginAsyncDefaults: FastifyPluginAsync = async (
  fastify,
  options
) => {
  const pluginAsyncJStTDefaults: FastifyPluginAsyncJStT = async (
    fastifyWithJstT,
    optionsTypebox
  ) => {
    expectType<typeof fastifyWithJstT["server"]>(fastify.server);
    expectType<typeof optionsTypebox>(options);
  };
  fastify.register(pluginAsyncJStTDefaults);
};

// Ensure the defaults of FastifyPluginCallbackJStT are the same as FastifyPluginCallback
export const pluginCallbackDefaults: FastifyPluginCallback = async (
  fastify,
  options,
  done
) => {
  const pluginCallbackJStTDefaults: FastifyPluginCallbackJStT = async (
    fastifyWithJstT,
    optionsTypebox,
    doneTypebox
  ) => {
    expectType<typeof fastifyWithJstT["server"]>(fastify.server);
    expectType<typeof optionsTypebox>(options);
  };

  fastify.register(pluginCallbackJStTDefaults);
};

const asyncPlugin: FastifyPluginAsyncJStT<
  { optionA: string },
  Http2Server
> = async (fastify, options) => {
  expectType<Http2Server>(fastify.server);

  expectType<string>(options.optionA);

  fastify.get(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            x: { type: "string" },
            y: { type: "number" },
            z: { type: "boolean" },
          },
          required: ["x", "y", "z"],
        } as const,
      },
    },
    (req) => {
      expectType<boolean>(req.body.z);
      expectType<number>(req.body.y);
      expectType<string>(req.body.x);
    }
  );
};

const callbackPlugin: FastifyPluginCallbackJStT<
  { optionA: string },
  Http2Server
> = (fastify, options, done) => {
  expectType<Http2Server>(fastify.server);

  expectType<string>(options.optionA);

  fastify.get(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            x: { type: "string" },
            y: { type: "number" },
            z: { type: "boolean" },
          },
          required: ["x", "y", "z"],
        } as const,
      },
    },
    (req) => {
      expectType<boolean>(req.body.z);
      expectType<number>(req.body.y);
      expectType<string>(req.body.x);
    }
  );
  done();
};

const fastify = Fastify();

fastify.register(asyncPlugin);
fastify.register(callbackPlugin);
