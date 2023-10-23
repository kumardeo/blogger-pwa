declare module "__STATIC_CONTENT_MANIFEST" {
  type Manifest = string | { [key: string]: string };
  const manifestJSON: Manifest;

  export default manifestJSON;
}
