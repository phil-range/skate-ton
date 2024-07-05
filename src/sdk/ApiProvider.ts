interface IApiAdapter {
  get(endpoint: string, params?: any): Promise<any>;
  post(endpoint: string, body?: any): Promise<any>;
}

const failedMsg = "fetch";

const TIME_OUT = 15000;

export default class ApiAdapter implements IApiAdapter {
  private baseUrl: string | undefined;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else if (typeof window !== "undefined") {
      this.baseUrl = window.location.protocol + "//" + window.location.host;
    }
  }

  async get(endpoint: string, params?: any): Promise<any> {
    const url = new URL(endpoint, this.baseUrl);

    try {
      if (params) {
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );
      }

      // eslint-disable-next-line no-console
      console.info(`GET ${url.toString()}`);

      const response = await fetch(url.toString(), {
        // timeout after 10s
        signal: AbortSignal.timeout(TIME_OUT),
      });

      const res = await response.json();

      if (!res?.success) {
        throw new Error(res?.message);
      }
      return res;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(`GET ${url.toString()} Error: `, error?.message);

      // Silently ignore failed fetch message
      const message = error?.message?.includes(failedMsg)
        ? undefined
        : error?.message;

      return { error: message };
    }
  }

  async post(endpoint: string, body?: any): Promise<any> {
    const url = new URL(endpoint, this.baseUrl);

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        Authorization: process.env.AUTHOR_NFT_BE_KEY || "",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIME_OUT),
    };
    try {
      // eslint-disable-next-line no-console
      console.info(`POST ${url.toString()} with options`, options);
      const response = await fetch(url.toString(), options);

      const res = await response.json();

      if (!res?.success) {
        throw new Error(res?.message);
      }

      return res;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(`POST ${url.toString()} Error: `, error?.message, options);

      return { error: error?.message };
    }
  }
}

// eslint-disable-next-line turbo/no-undeclared-env-vars
export const relayerApiProvider = new ApiAdapter(
  import.meta.env.NEXT_PUBLIC_RELAYER_ENDPOINT || ""
);
