import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {EffectsModule} from "@ngrx/effects";

import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {ProfilesEffects} from "./profiles.effects";
import {StoreModule} from "@ngrx/store";
import {PROFILES_FEATURE_KEY, profilesReducer} from "./profiles.reducers";

@NgModule({
  declarations: [ProfileEditComponent],
  exports: [],
  imports: [
    EffectsModule.forFeature([ProfilesEffects]),
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    StoreModule.forFeature(PROFILES_FEATURE_KEY, profilesReducer),
  ]
})
export class ProfilesModule {
}
