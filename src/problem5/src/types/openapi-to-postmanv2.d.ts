declare module 'openapi-to-postmanv2' {
  interface ConvertOptions {
    type: 'json' | 'string' | 'file';
    data: any;
  }

  interface ConvertCallback {
    (err: any, result: { result: boolean; reason?: string; output?: Array<{ type: string; data: any }> }): void;
  }

  export function convert(
    options: ConvertOptions,
    customOptions: Record<string, any>,
    callback: ConvertCallback
  ): void;
}
