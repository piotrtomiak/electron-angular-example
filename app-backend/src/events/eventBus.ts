import {EventEmitter} from "events";
import {EventType, extractEventPayload, extractEventType, ServerEvent} from "app-common";

export class EventBus {

  private eventBus: EventEmitter = new EventEmitter();

  broadcast<T extends ServerEvent<EventType, any>>(eventType: extractEventType<T>,
                                                   eventData: extractEventPayload<T>): void {
    this.eventBus.emit(eventType, eventData);
  }

  subscribe<T extends ServerEvent<EventType, any>>(eventType: extractEventType<T>,
                                                   listener: (eventData: extractEventPayload<T>) => void): void {
    this.eventBus.on(eventType, listener);
  }

  unsubscribe<T extends ServerEvent<EventType, any>>(eventType: extractEventType<T>,
                                                     listener: (eventData: extractEventPayload<T>) => void): void {
    this.eventBus.off(eventType, listener);
  }

}
