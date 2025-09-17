export interface CustomizationState {
  logo: string | null;
  accentColor: string;
  favicon: string | null;
  font: 'inter' | 'roboto-mono' | 'source-serif';
  footer: string;
  postmanCollectionId: string | null;
  postmanWorkspaceId: string | null;
  postmanUserId: string | null;
}
