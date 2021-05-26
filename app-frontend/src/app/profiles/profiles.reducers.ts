import {Profile} from "app-common";
import {Action, createReducer, on} from "@ngrx/store";
import {profileCreated, profileDeleted, profilesListed, profileUpdated} from "./profiles.actions";
import _ from "lodash";

export const PROFILES_FEATURE_KEY = "profiles";

const profilesInitialState: Profile[] = [];

const _profilesReducer = createReducer<Profile[]>(
    profilesInitialState,
    on(profileCreated, (state, action) => {
          const newState = _.cloneDeep(state);
          newState.push(action.profile);
          return newState;
        }
    ),
    on(profileUpdated, (state, {profile}) => {
          const newState = _.cloneDeep(state);
          const idx = state.findIndex(p => p.id === profile.id);
          newState[idx] = profile;
          return newState;
        }
    ),
    on(profileDeleted, (state, action) => state.filter(p => p.id !== action.id)),
    on(profilesListed, (state, action) => action.profiles),
);

export function profilesReducer(state: Profile[] | undefined, action: Action) {
  return _profilesReducer(state, action);
}
