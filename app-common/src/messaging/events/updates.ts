import {EventType, ServerEvent} from "./index";

export interface UpdateDownloadProgress {
  total: number;
  delta: number;
  transferred: number;
  percent: number;
  bytesPerSecond: number;
}

export interface UpdateDownloadStartedEvent extends ServerEvent<EventType.UpdateDownloadStarted, {}> {
}

export interface UpdateDownloadProgressEvent extends ServerEvent<EventType.UpdateDownloadProgress,
    UpdateDownloadProgress> {
}

export interface UpdateDownloadFinishedEvent extends ServerEvent<EventType.UpdateDownloadFinished, {}> {
}
