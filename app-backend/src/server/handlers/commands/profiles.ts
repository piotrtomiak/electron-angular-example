import {
  CreateProfileCommand,
  DeleteProfileCommand,
  UpdateProfileCommand,
} from "app-common";

import {createCommandHandler} from "../index";

export const createProfileCommandHandler = createCommandHandler<CreateProfileCommand>(
    async (context, payload) => {
      await context.services.storage.createProfile(payload.profile);
    });

export const updateProfileCommandHandler = createCommandHandler<UpdateProfileCommand>(
    async (context, payload) => {
      await context.services.storage.updateProfile(payload.profile);
    });

export const deleteProfileCommandHandler = createCommandHandler<DeleteProfileCommand>(
    async (context, payload) => {
      await context.services.storage.deleteProfile(payload.profileId);
    });
