import { PersistentMap, PersistentVector, u256 } from "near-sdk-as";
import { AccountId } from "./account_id";
import { TokenId } from "./token_id";





export const _owners = new PersistentMap<number, string>("a");
export const _balances = new PersistentMap<string, PersistentVector<number>>("b");
export const _token_approvals = new PersistentMap<
i64,
PersistentMap<string, bool>
>("c");
export const _operator_approvals = new PersistentMap<
string,
PersistentMap<string, bool>
>("d");
export const _totalSupply = new PersistentVector<number>("e");