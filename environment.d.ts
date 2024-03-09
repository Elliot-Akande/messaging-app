declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      MONGO_URL: string;
      SESSION_SECRET: string;
    }
  }
}

export {};
