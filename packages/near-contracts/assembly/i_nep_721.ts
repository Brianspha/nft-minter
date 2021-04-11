import { PersistentMap, u256 } from "near-sdk-core";
import { AccountId } from "./account_id";
import { TokenId } from "./token_id";
export interface INEP721 {
  total_supply() :u256
     is_approved_or_owner (caller:AccountId, owner: AccountId, token_id:TokenId): bool;
  get_approved(token_id: TokenId) : PersistentMap<AccountId,bool>;
  set_approval_for_all(operator: AccountId, caller: AccountId, approved: bool): void;
  is_approved_for_all(operator: AccountId, caller: AccountId): bool;
  grant_access(
    owner_id: AccountId,
    account_id: AccountId,
    token_id: TokenId
  ): bool;
  revoke_access(owner_id: AccountId, account_id: AccountId,token_id: TokenId): bool;
  transfer_from(
    owner_id: AccountId,
    new_owner_id: AccountId,
    token_id: TokenId
  ): bool;

  check_access(account_id: AccountId): bool;
  owner_of(token_id: TokenId): string;
  token_exists(token_id: TokenId): bool;
  name(): String;
  symbol(): String;
}
