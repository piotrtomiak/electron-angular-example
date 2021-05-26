import {EventType, ServerEvent} from "./index";
import {Profile} from "../../model";

export interface ProfileCreatedEventData {
  profile: Profile;
}

export interface ProfileUpdatedEventData {
  profile: Profile;
}

export interface ProfileDeletedEventData {
  profileId: number;
}

export interface ProfileCreatedEvent extends ServerEvent<EventType.ProfileCreated, ProfileCreatedEventData> {
}

export interface ProfileUpdatedEvent extends ServerEvent<EventType.ProfileUpdated, ProfileUpdatedEventData> {
}

export interface ProfileDeletedEvent extends ServerEvent<EventType.ProfileDeleted, ProfileDeletedEventData> {
}
