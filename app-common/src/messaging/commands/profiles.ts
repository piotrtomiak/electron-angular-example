import {v4 as uuidv4} from "uuid";

import {Command, CommandCreator, CommandType} from "./commands";
import {Profile} from "../../model";

export interface CreateProfileCommandPayload {
  profile: Omit<Profile, "id">;
}

export interface UpdateProfileCommandPayload {
  profile: Profile;
}

export interface DeleteProfileCommandPayload {
  profileId: number;
}

export interface CreateProfileCommand extends Command<CommandType.CreateProfile, CreateProfileCommandPayload> {
}

export interface UpdateProfileCommand extends Command<CommandType.UpdateProfile, UpdateProfileCommandPayload> {
}

export interface DeleteProfileCommand extends Command<CommandType.DeleteProfile, DeleteProfileCommandPayload> {
}

export const createProfile: CommandCreator<CreateProfileCommand> = (profile: Profile) => ({
  id: uuidv4(),
  name: CommandType.CreateProfile,
  payload: {profile}
});


export const updateProfile: CommandCreator<UpdateProfileCommand> = (profile: Profile) => ({
  id: uuidv4(),
  name: CommandType.UpdateProfile,
  payload: {profile}
});

export const deleteProfile: CommandCreator<DeleteProfileCommand> = (id: number) => ({
  id: uuidv4(),
  name: CommandType.DeleteProfile,
  payload: {profileId: id}
});
