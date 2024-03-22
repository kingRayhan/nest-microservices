import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface RegisterOptions {
  host: string;
  globalExchangeName: string;
  queue: string;
  auth?: {
    username?: string;
    password?: string;
  };
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<RegisterOptions>().build();
