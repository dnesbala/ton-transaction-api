export interface TonTransaction {
  account: string;
  hash: string;
  lt: string;
  now: number;
  mc_block_seqno: number;
  trace_id: string;
  prev_trans_hash: string;
  prev_trans_lt: string;
  orig_status: string;
  end_status: string;
  total_fees: string;
  description: Description;
  block_ref: BlockRef;
  in_msg: Msg;
  out_msgs: Msg[];
  account_state_before: AccountState;
  account_state_after: AccountState;
}

export interface AccountState {
  hash: string;
  balance: null | string;
  account_status: string | null;
  frozen_hash: null;
  data_hash: string | null;
  code_hash: string | null;
}

export interface BlockRef {
  workchain: number;
  shard: string;
  seqno: number;
}

export interface Description {
  type: DescriptionType;
  aborted: boolean;
  destroyed: boolean;
  credit_first: boolean;
  storage_ph: StoragePh;
  compute_ph: ComputePh;
  action?: Action;
  bounce?: Bounce;
}

export interface Action {
  success: boolean;
  valid: boolean;
  no_funds: boolean;
  status_change: string;
  total_fwd_fees?: string;
  total_action_fees?: string;
  result_code: number;
  tot_actions: number;
  spec_actions: number;
  skipped_actions: number;
  msgs_created: number;
  action_list_hash: string;
  tot_msg_size: MsgSize;
}

export interface MsgSize {
  cells: string;
  bits: string;
}

export interface Bounce {
  type: string;
  msg_size: MsgSize;
  msg_fees: string;
  fwd_fees: string;
}

export interface ComputePh {
  skipped: boolean;
  success: boolean;
  msg_state_used: boolean;
  account_activated: boolean;
  gas_fees: string;
  gas_used: string;
  gas_limit: string;
  mode: number;
  exit_code: number;
  vm_steps: number;
  vm_init_state_hash: string;
  vm_final_state_hash: string;
}

export interface StoragePh {
  storage_fees_collected: string;
  status_change: string;
}

export enum DescriptionType {
  Ord = "ord",
}

export interface Msg {
  hash: string;
  source: string;
  destination: null | string;
  value: null | string;
  fwd_fee: null | string;
  ihr_fee: null | string;
  created_lt: string;
  created_at: string;
  opcode: string | null;
  ihr_disabled: boolean | null;
  bounce: boolean | null;
  bounced: boolean | null;
  import_fee: null;
  message_content: MessageContent;
  init_state: MessageContent | null;
}

export interface MessageContent {
  hash: string;
  body: string;
  decoded: Decoded | null;
}

export interface Decoded {
  type: string;
  comment: string;
}
