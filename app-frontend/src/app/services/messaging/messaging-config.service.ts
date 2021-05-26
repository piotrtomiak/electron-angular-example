import {InjectionToken} from "@angular/core";
import {MessagingConfig} from "./messaging.service";

export const MessagingConfigService = new InjectionToken<MessagingConfig>("Messaging Config");
