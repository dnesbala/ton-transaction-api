import { Message } from "../../../models/ton-transaction.model";

export enum EventType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW_INITIATED = "WITHDRAW_INITIATED",
  WITHDRAW = "WITHDRAW",
  WINNER_ASSIGNED = "WINNER_ASSIGNED",
  WINNER_NUMBER_DECIDED = "WINNER_NUMBER_DECIDED",
}

export interface EventMessage {
  eventType: EventType;
  message: Message;
}
