import {createAction, props} from "@ngrx/store";
import {Profile} from "app-common";

export const listProfiles = createAction("Profiles.List");

export const profilesListed = createAction("Profiles.Listed", props<{ profiles: Profile[] }>());

export const updateProfile = createAction("Profile.Update", props<{ profile: Profile }>());

export const createProfile = createAction("Profile.Create", props<{ profile: Omit<Profile, "id"> }>());

export const profileCreated = createAction("Profile.Created", props<{ profile: Profile }>());

export const profileUpdated = createAction("Profile.Updated", props<{ profile: Profile }>());

export const deleteProfile = createAction("Profile.Delete", props<{ id: number }>());

export const profileDeleted = createAction("Profile.Deleted", props<{ id: number }>());
