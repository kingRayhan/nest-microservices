import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './module-definition';
import { MessageBrokerService } from './message-broker.service';

@Module({
  providers: [MessageBrokerService],
  exports: [MessageBrokerService],
})
export class MessageBrokerModule extends ConfigurableModuleClass {}
