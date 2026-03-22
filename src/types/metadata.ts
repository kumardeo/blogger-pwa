export interface GithubMetadata {
  repository: string;
  branch: string;
}

export interface Metadata {
  github: GithubMetadata;
}
