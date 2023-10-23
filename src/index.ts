import app from "./app";

const worker = {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const response = await app
      .handle(request, { env, ctx })
      .then((res) =>
        res instanceof Response
          ? res
          : Response.json(
              {
                success: false,
                error: {
                  code: "internal_error",
                  name: "InternalError",
                  message: "Worker did not return Response object.",
                  stack: "InternalError: Worker did not return Response object."
                }
              },
              {
                status: 500
              }
            )
      )
      .catch((err) =>
        Response.json(
          {
            success: false,
            error: {
              code: "internal_error",
              ...(err instanceof Error
                ? {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                  }
                : {
                    name: "InternalError",
                    message: "An internal error occurred.",
                    stack: "InternalError: An internal error occurred."
                  })
            }
          },
          {
            status: 500
          }
        )
      );
    return response;
  }
};

export default worker;
