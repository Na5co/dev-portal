declare module 'postman-code-generators' {
  export function convert(
    language: string,
    variant: string,
    request: any,
    options?: any,
    callback?: (error: any, snippet: string) => void
  ): void;
  
  export function getLanguageList(): { key: string; label: string; syntax_mode: string; variants: any[] }[];
  
  export function getOptions(language: string, variant: string, callback: (error: any, options: any) => void): void;
}
