import {APP_BASE_HREF, PlatformLocation, registerLocaleData} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import en from "@angular/common/locales/en";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {routerReducer, RouterState, StoreRouterConnectingModule} from "@ngrx/router-store";
import {StoreModule} from "@ngrx/store";

import {environment} from "../environments/environment";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {RootState} from "./app.store";
import {extModules} from "./build-specifics";
import {MainModule} from "./main/main.module";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {MessagingModule} from "./services/messaging/messaging.module";
import {EffectsModule} from "@ngrx/effects";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    StoreModule.forRoot<RootState>({
      router: routerReducer,
    }, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      }
    }),
    extModules,
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
    }),
    EffectsModule.forRoot([]),
    MessagingModule.forRoot(environment.messaging),
    MainModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    }
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
