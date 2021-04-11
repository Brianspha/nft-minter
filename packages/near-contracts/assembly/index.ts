import { NEP721 } from "./nep_721";
import { INEP721 } from "./i_nep_721";
import { PersistentMap, storage, u256 } from "near-sdk-core";
import { AccountId } from "./account_id";
import { TokenId } from "./token_id";
import { Context, PersistentVector } from "near-sdk-as";
import {
  _balances,
  _operator_approvals,
  _owners,
  _token_approvals,
  _totalSupply,
} from "./models";
import { TokenDetail } from "./token_detail";

/**
 *
 * @param to
 * @returns bool- indicating if the token was minted to the user
 */
export function mint(to: string): bool {
  var token_id= _totalSupply.length + 1;
  assert(to !== null, "NEP721:  mint to the zero address");
  assert(!token_exists(token_id), "NEP721: token already minted");
  _before_token_transfer("", to, token_id);
  if (_balances.contains(to)) {
    _balances.getSome(to).push(token_id);
  } else {
    var balance = new PersistentVector<number>(
      Context.blockTimestamp.toString() + Math.random().toString(4)
    );
    balance.push(token_id);
    _balances.set(to, balance);
  }
  _owners.set(token_id, to);
  _totalSupply.push(total_supply.length + 1);
  return true;
}
/**
 * @dev this function is a bit tricky due to my decision to use a PersistantMap instead of the Vector
 * @param index
 * @returns
 */
function token_uri(index: number): number {


  return 0;
}
/**
 *
 * @returns total supply of tokens
 */
export function total_supply(): u256 {
  return new u256(_totalSupply.length);
}

/**
 *
 * @param spender
 * @param owner
 * @param token_id
 * @returns bool - indicating if the user is approved or owner
 */
export function is_approved_or_owner(
  spender: string,
  owner: string,
  token_id: number
): bool {
  assert(
    token_exists(token_id),
    "NEP721: approved query for nonexistent token"
  );
  var isOwner = owner_of(token_id);
  var approvals = get_approved(token_id);

  return (
    isOwner !== spender ||
    (approvals !== null ? approvals.contains(spender) : false) ||
    is_approved_for_all(spender, owner)
  );
}

/**
 *
 * @param token_id
 * @returns approves transffering of token
 */
export function get_approved(
  token_id: number
): PersistentMap<string, bool> {
  assert(
    token_exists(token_id),
    "NEP721: approved query for nonexistent token"
  );
  var approved = _token_approvals.get(token_id);
  return approved !== null ? approved : new PersistentMap<string, bool>("a");
}

/**
 *
 * @param operator
 * @param caller
 * @param approved
 * @returns nothing
 */
export function set_approval_for_all(
  operator: string,
  caller: string,
  approved: bool
): void {
  assert(operator !== caller, "NEP721: approve to caller");
  assert(operator != null, "NEP721: operator cannot be null");
  assert(caller != null, "NEP721: caller cannot be null");
  var approvals = _operator_approvals.get(caller);
  if (approvals != null) {
    approvals.set(operator, approved);
    _operator_approvals.set(caller, approvals);
  } else {
    var temp = new PersistentMap<string, bool>(
      Context.blockTimestamp.toString() + Math.random().toString(4)
    );
    temp.set(operator, approved);
    _operator_approvals.set(caller, temp);
  }
}

/**
 *
 * @param operator
 * @param caller
 * @returns bool - indicating if the user is approved to transfer any tokens
 */
export function is_approved_for_all(
  operator: string,
  caller: string
): bool {
  var approved = _operator_approvals.get(caller);
  if (approved !== null) {
    return approved.getSome(operator);
  } else {
    return false;
  }
}

/**
 *
 * @param token_id
 * @returns checks if the given token exists
 */
export function token_exists(token_id: number): bool {
  return _owners.contains(token_id);
}

/**
 *
 * @param owner_id
 * @param account_id
 * @param token_id
 * @returns bool- indicating if the grant function was executed fully
 */
export function grant_access(
  owner_id: string,
  account_id: string,
  token_id: number
): bool {
  var owner = owner_of(token_id);
  assert(
    owner != owner_id,
    "NEP721: granting access to current owner"
  );
  assert(
    owner_id != account_id && is_approved_for_all(owner_id, owner_id),
    "NEP721: not owner or approved for all"
  );
  return _approve(account_id, token_id);
}
/**
 *
 * @param account_to
 * @param token_id
 * @returns  bool - indicating if the user access was revoked for the given token
 */
function _revoke(account_to: string, token_id: number): bool {
  var success = false;
  var list = _token_approvals.getSome(token_id);
  if (list !== null) {
    list.set(account_to, false);
    success = true;
  }
  return success;
}

/**
 *
 * @param account_to
 * @param token_id
 * @returns bool- indicates if the user was approved to transfer the given token
 */
function _approve(account_to: string, token_id: number): bool {
  var success = false;
  if (_token_approvals.contains(token_id)) {
    _token_approvals.getSome(token_id).set(account_to, true);
    success = true;
  } else {
    success = true;
    var temp = new PersistentMap<string, bool>(
      Context.blockTimestamp.toString() + Math.random().toString(4)
    );
    temp.set(account_to, true);
    _token_approvals.set(token_id, temp);
  }
  return success;
}

/**
 *
 * @param owner_id
 * @param account_id
 * @param token_id
 * @returns bool- indicating if the user access to this token were revoked
 */
export function revoke_access(
  owner_id: string,
  account_id: string,
  token_id: number
): bool {
  var owner = owner_of(token_id);
  assert(
    owner !== owner_id,
    "NEP721: revoking access to current owner"
  );
  assert(
    owner_id != account_id && is_approved_for_all(owner_id, owner_id),
    "NEP721: not owner or approved for all"
  );
  return _revoke(account_id, token_id);
}
/**
 *
 * @param owner_id
 * @param new_owner_id
 * @param token_id
 * @returns bool indicating if the transfer of the token was done succesfully
 */
export function transfer_from(
  owner_id: string,
  new_owner_id: string,
  token_id: number
): bool {
  assert(
    is_approved_or_owner(new_owner_id, owner_id, token_id),
    "NEP721:  transfer caller is not owner nor approved"
  );
  assert(
    owner_id != new_owner_id,
    "NEP721 cant transfer to self"
  );
  return _transfer(owner_id, new_owner_id, token_id);
}

/**
 *
 * @param from
 * @param to
 * @param token_id
 * @returns bool- indicating if the token was transferered
 */
function _transfer(from: string, to: string, token_id: number): bool {
  assert(
    owner_of(token_id) == from,
    "NEP721: transfer of token that is not own"
  );
  assert(to !== null, "NEP721: transfer to invalid address");
  _before_token_transfer(from, to, token_id);
  _approve("", token_id);//@dev clear approval of previous owner

  //@dev this part of the code attempts to delete the token being transffered from the current owners list of owned tokens
  var userTokens = _balances.getSome(from);
  var tempUserBalance = new PersistentVector<number>(
    Context.blockTimestamp.toString() + Math.random().toString(4)
  );
  while (!userTokens.isEmpty) {
    var temp = userTokens.pop(); //@dev pop token from the user owned tokens vector
    if (temp !== token_id) {
      //@dev check if the current token does not match the current token being transffered
      tempUserBalance.push(temp);
    }
  }
  _balances.set(from, tempUserBalance); //@dev overrides current user vector
  //@dev end delete token
  if (_balances.contains(to)) {
    //@dev check if the balances map contains the receipient
    _balances.getSome(to).push(token_id);
  } else {
    var balance = new PersistentVector<number>(
      Context.blockTimestamp.toString() + Math.random().toString(4)
    ); //@dev create new receipient vector for tokens
    balance.push(token_id);
    _balances.set(to, balance);
  }
  _owners.set(token_id, to); //@dev set receipient as owner of token
  return true; //@dev success
}

function _before_token_transfer(
  owner_id: string,
  new_owner_id: string,
  token_id: number
): void {}

function check_access(account_id: string): bool {
  return false;
}

/**
 *
 * @param token_id
 * @returns bool-  indicating if a user is the owner of a token
 */
export function owner_of(token_id: number): string {
  var account = _owners.getSome(token_id);
  return account;
}

/**
 *
 * @param owner
 * @returns balance - indicating the total number of tokens owned by a user
 */
export function balance_of(owner: string): u256 {
  assert(owner !== null, "NEP721: balance query for invalid address");
  return new u256(_balances.getSome(owner).length);
}
