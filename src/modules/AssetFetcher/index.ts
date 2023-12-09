import mime from "mime";
// eslint-disable-next-line import/no-unresolved
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import serveCachedResponse from "../cache";

import type { Arg, Manifest, Options } from "./types";

class AssetFetcher<E extends Arg> {
  private manifest: Manifest;

  private namespace: KVNamespace;

  constructor(env: E) {
    // eslint-disable-next-line no-underscore-dangle
    const manifest = manifestJSON || env.__STATIC_CONTENT_MANIFEST;
    // eslint-disable-next-line no-underscore-dangle
    const namespace = env.__STATIC_CONTENT;
    this.manifest =
      typeof manifest === "string"
        ? (JSON.parse(manifest) as Manifest)
        : manifest || {};
    this.namespace = namespace || {};
  }

  private getAssetInfo(input: URL | string, defaultType = "text/plain") {
    const path =
      (input instanceof URL ? input.pathname : input).replace(/^\/+/, "") ||
      "/";
    let filePath: string | null = null;
    if (Object.prototype.hasOwnProperty.call(this.manifest, path)) {
      filePath = path;
    } else if (path.endsWith("/")) {
      const otherPaths = Object.keys(this.manifest)
        .filter((key) =>
          new RegExp(
            `^${path === "/" ? "" : path}(/)?index.[a-zA-Z0-9]+$`
          ).test(key)
        )
        .sort((a, b) => {
          if (a.endsWith(".html")) return -1;
          if (b.endsWith(".html")) return 1;
          return a.localeCompare(b);
        });

      if (
        otherPaths.length > 0 &&
        Object.prototype.hasOwnProperty.call(this.manifest, otherPaths[0])
      ) {
        filePath = otherPaths[0];
      }
    }
    if (filePath) {
      const fileName = filePath.replace(/^.*[\\/]/, "");
      const extensionMatches = fileName.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
      const extension =
        extensionMatches && extensionMatches[1] ? extensionMatches[1] : null;

      let fileType = (extension && mime.getType(extension)) || defaultType;
      if (
        fileType.startsWith("text") ||
        fileType === "application/javascript"
      ) {
        fileType += "; charset=utf-8";
      }
      return {
        input: path,
        path: filePath,
        key: this.manifest[filePath],
        name: fileName,
        extension,
        type: fileType
      };
    }
    return null;
  }

  has(input: URL | string) {
    return this.getAssetInfo(input) !== null;
  }

  async getBuffer(input: URL | string) {
    const assetInfo = this.getAssetInfo(input);
    if (assetInfo) {
      const arrayBuffer = await this.namespace.get(
        assetInfo.key,
        "arrayBuffer"
      );
      if (arrayBuffer) {
        return {
          info: assetInfo,
          buffer: arrayBuffer
        };
      }
    }

    return null;
  }

  async getFile(input: URL | string) {
    const result = await this.getBuffer(input);
    if (result) {
      const { buffer, info } = result;
      return {
        info,
        file: new File([buffer], info.name, {
          type: info.type
        })
      };
    }

    return null;
  }

  async fetch(input: URL | string) {
    const result = await this.getBuffer(input);
    if (result) {
      const { buffer, info } = result;
      return new Response(buffer, {
        headers: {
          "Content-Type": info.type
        }
      });
    }
    return null;
  }

  async serve(request: Request, ctx: ExecutionContext, options: Options = {}) {
    const requestURL = new URL(request.url);
    const path = options.toAsset
      ? options.toAsset(requestURL, request)
      : requestURL.pathname;
    return serveCachedResponse(request, ctx, () => this.fetch(path), options);
  }
}

export default AssetFetcher;
export type * from "./types";
