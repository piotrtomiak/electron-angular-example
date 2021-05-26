import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";

import {
  CommandStatusError,
  CommandStatusKind,
  CommandType,
  EventMessage,
  EventType,
  getLogEntryMessage,
  isCommandMessageResponse,
  isEventMessage,
  isQueryMessageResponse,
  ListProfilesQuery,
  ProfileCreatedEvent,
  ProfileDeletedEvent,
  ProfileUpdatedEvent,
  QueryMessageResponse,
  QueryType,
} from "app-common";


import {RootState} from "../../app.store";
import {profileCreated, profileDeleted, profilesListed, profileUpdated} from "../../profiles/profiles.actions";

@Injectable()
export class MessageMapper {
  constructor(private store: Store<RootState>) {
  }

  map(msg: any) {
    if (isCommandMessageResponse(msg)) {
      if (msg.name) {
        switch (msg.name) {
          case CommandType.UpdateProfile:
            break;
          default:
        }
      }

      if (msg.status.kind === CommandStatusKind.Error) {
        window.alert(`Application failed to '${msg.name}' with message: `
            + (msg.status as CommandStatusError).errors.map(getLogEntryMessage).join("\n"));
      }
    } else if (isQueryMessageResponse(msg)) {
      let typedMsg;

      switch (msg.name) {
        case QueryType.ListProfiles:
          typedMsg = msg as QueryMessageResponse<ListProfilesQuery>;
          this.store.dispatch(profilesListed({profiles: typedMsg.payload?.profiles ?? []}));
          break;
        default:
          console.warn("[MessageMapper] Unknown Query message response from the server: ", JSON.stringify(msg));
      }
    } else if (isEventMessage(msg)) {
      let typedMsg;

      switch (msg.name) {
        case EventType.ProfileCreated:
          typedMsg = msg as EventMessage<ProfileCreatedEvent>;

          this.store.dispatch(profileCreated({profile: typedMsg.payload?.profile || {}}));
          break;
        case EventType.ProfileUpdated:
          typedMsg = msg as EventMessage<ProfileUpdatedEvent>;

          this.store.dispatch(profileUpdated({profile: typedMsg.payload?.profile || {}}));
          break;
        case EventType.ProfileDeleted:
          typedMsg = msg as EventMessage<ProfileDeletedEvent>;

          this.store.dispatch(profileDeleted({id: typedMsg.payload?.profileId}));
          break;
        default:
          console.warn("[MessageMapper] Unknown Event message from the server: ", JSON.stringify(msg));
      }
    } else {
      console.warn("[MessageMapper] Unknown message: " + JSON.stringify(msg));
    }
  }

  error(err: Error) {
    console.error(`[MessageMapper] Error was propagated from the WebSocket. Most likely a disconnect or failure to connect. See:`);
    console.error(err);
  }
}
