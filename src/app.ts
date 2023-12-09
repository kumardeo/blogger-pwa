import { Router } from "itty-router";
import type { IRequest } from "itty-router";
import AssetFetcher from "./modules/AssetFetcher";

type Args = [{ env: Env; ctx: ExecutionContext }];

const app = Router<IRequest, Args>();

/**
 * You can create your own routes 😀
 * For example:
 *
 * app.get<IRequest, Args>("/app/my-route", () => new Response("Hello World!"));
 *
 * HTTP [GET] /app/my-route => Hello World!
 */

app.all<IRequest, Args>("*", async (request, { env, ctx }) => {
  switch (request.method) {
    case "GET":
    case "HEAD": {
      const assets = new AssetFetcher(env);
      const response = await assets.serve(request, ctx, {
        // Bypass cache in development environment
        bypassCache: env.ENVIRONMENT === "development"
      });
      if (response) {
        // Set Service-Worker-Allowed header if asset is serviceworker.js
        if (/\/(service-?worker.js|sw.js)/.test(request.url)) {
          response.headers.set("Service-Worker-Allowed", "/");
        }
        return response;
      }
      const notFoundJson = {
        success: false,
        error: {
          code: "not_found",
          message: "File not found"
        }
      };
      return Response.json(notFoundJson, {
        status: 404
      });
    }
    default: {
      const methodNotAllowedJson = {
        success: false,
        error: {
          code: "method_not_allowed",
          message: "Method not allowed"
        }
      };
      return Response.json(methodNotAllowedJson, {
        status: 405
      });
    }
  }
});

export default app;
