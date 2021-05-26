import {ModuleWithProviders, NgModule} from "@angular/core";

import {MessagingConfigService} from "./messaging-config.service";
import {MessagingConfig, MessagingService} from "./messaging.service";
import {MessageMapper} from "./message-mapper";

@NgModule()
export class MessagingModule {
  static forRoot(config: MessagingConfig): ModuleWithProviders<MessagingModule> {
    return {
      ngModule: MessagingModule,
      providers: [
        MessagingService, {provide: MessagingConfigService, useValue: config},
        MessageMapper, {provide: MessageMapper, useClass: MessageMapper}
      ],
    };
  }
}
