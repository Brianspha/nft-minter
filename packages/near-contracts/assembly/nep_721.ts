import { Context, PersistentMap, PersistentVector, u256 } from "near-sdk-core";
import { AccountId } from "./account_id";
import { INEP721 } from "./i_nep_721";
import { TokenId } from "./token_id";

/**
 * @dev Very Silly port of the ERC721 to near
 * @notice lots of innefficiencies but its still a WIP
 */
@nearBindgen
export class NEP721 implements INEP721 {
  static _owner: string;
  static _name: string;
  static _symbol: string;
  static _owners: PersistentMap<TokenId, AccountId>;
  static _balances: PersistentMap<AccountId, TokenId>;
  static _token_approvals: PersistentMap<
    TokenId,
    PersistentMap<AccountId, bool>
  >;
  static _operator_approvals: PersistentMap<
    AccountId,
    PersistentMap<AccountId, bool>
  >;
  static _totalSupply: u256;
  constructor(token_name: string, token_symbol: string) {
    NEP721._owner = Context.sender;
    NEP721._totalSupply = new u256();
    NEP721._name = token_name;
    NEP721._symbol = token_symbol;
    NEP721._owners = new PersistentMap<TokenId, AccountId>("a");
    NEP721._balances = new PersistentMap<AccountId, TokenId>("b");
    NEP721._token_approvals = new PersistentMap<
      TokenId,
      PersistentMap<AccountId, bool>
    >("c");
    NEP721._operator_approvals = new PersistentMap<
      AccountId,
      PersistentMap<AccountId, bool>
    >("d");
  }
  total_supply(): u256 {
    return NEP721._totalSupply;
  }

  mint(to: AccountId): bool {
    NEP721._totalSupply = new u256(NEP721._totalSupply.postInc().toI64());
    var token_id: TokenId = new TokenId();
    token_id.tokenId = NEP721._totalSupply;
    assert(to !== null, "NEP721:  mint to the zero address");
    assert(!this.token_exists(token_id), "NEP721: token already minted");
    this._before_token_transfer(new AccountId(), to, token_id);
    NEP721._balances.set(to, token_id);
    NEP721._owners.set(token_id, to);
    return true;
  }

  is_approved_or_owner(
    spender: AccountId,
    owner: AccountId,
    token_id: TokenId
  ): bool {
    assert(
      this.token_exists(token_id),
      "NEP721: approved query for nonexistent token"
    );
    var isOwner = this.owner_of(token_id);
    var approvals = this.get_approved(token_id);

    return (
      isOwner !== spender.accountId ||
      (approvals !== null ? approvals.contains(spender) : false) ||
      this.is_approved_for_all(spender, owner)
    );
  }
  get_approved(token_id: TokenId): PersistentMap<AccountId, bool> {
    assert(
      this.token_exists(token_id),
      "NEP721: approved query for nonexistent token"
    );
    var approved = NEP721._token_approvals.get(token_id);
    return approved !== null
      ? approved
      : new PersistentMap<AccountId, bool>("a");
  }
  set_approval_for_all(
    operator: AccountId,
    caller: AccountId,
    approved: bool
  ): void {
    assert(operator !== caller, "NEP721: approve to caller");
    var approvals = NEP721._operator_approvals.get(caller);
    if (approvals !== null) {
      return approvals.set(operator, approved);
    }
  }
  is_approved_for_all(operator: AccountId, caller: AccountId): bool {
    var approved = NEP721._operator_approvals.get(caller);
    if (approved !== null) {
      return approved.getSome(operator);
    } else {
      return false;
    }
  }
  name(): String {
    return NEP721._name;
  }
  symbol(): String {
    return NEP721._symbol;
  }
  token_exists(token_id: TokenId): bool {
    return NEP721._owners.contains(token_id);
  }
  grant_access(
    owner_id: AccountId,
    account_id: AccountId,
    token_id: TokenId
  ): bool {
    var owner = this.owner_of(token_id);
    assert(
      owner != owner_id.accountId,
      "NEP721: granting access to current owner"
    );
    assert(
      owner_id != account_id && this.is_approved_for_all(owner_id, owner_id),
      "NEP721: not owner or approved for all"
    );
    return this._approve(account_id, token_id);
  }

  private _revoke(account_to: AccountId, token_id: TokenId): bool {
    var success = false;
    var list = NEP721._token_approvals.getSome(token_id);
    if (list !== null) {
      list.set(account_to, false);
      success = true;
    }
    return success;
  }
  private _approve(account_to: AccountId, token_id: TokenId): bool {
    var success = false;
    var list = NEP721._token_approvals.get(token_id);
    if (list !== null) {
      list.set(account_to, true);
      success = true;
    } else {
      success = true;
      var temp = new PersistentMap<AccountId, bool>("temp");
      temp.set(account_to, true);
      NEP721._token_approvals.set(token_id, temp);
    }
    return success;
  }
  revoke_access(
    owner_id: AccountId,
    account_id: AccountId,
    token_id: TokenId
  ): bool {
    var owner = this.owner_of(token_id);
    assert(
      owner !== owner_id.accountId,
      "NEP721: revoking access to current owner"
    );
    assert(
      owner_id != account_id && this.is_approved_for_all(owner_id, owner_id),
      "NEP721: not owner or approved for all"
    );
    return this._revoke(account_id, token_id);
  }
  transfer_from(
    owner_id: AccountId,
    new_owner_id: AccountId,
    token_id: TokenId
  ): bool {
    assert(
      this.is_approved_or_owner(new_owner_id, owner_id, token_id),
      "NEP721:  transfer caller is not owner nor approved"
    );
    return this._transfer(owner_id, new_owner_id, token_id);
  }

  private _transfer(from: AccountId, to: AccountId, token_id: TokenId): bool {
    assert(
      this.owner_of(token_id) === from.accountId,
      "NEP721: transfer of token that is not own"
    );
    assert(to !== null, "NEP721: transfer to invalid address");
    this._before_token_transfer(from, to, token_id);
    this._approve(to, token_id);
    NEP721._balances.delete(from);
    NEP721._balances.set(to, token_id);
    NEP721._owners.set(token_id, to);
    return true;
  }
  private _before_token_transfer(
    owner_id: AccountId,
    new_owner_id: AccountId,
    token_id: TokenId
  ): void {}

  transfer(
    owner_id: AccountId,
    new_owner_id: AccountId,
    token_id: TokenId
  ): bool {
    return false;
  }
  check_access(account_id: AccountId): bool {
    return false;
  }
  owner_of(token_id: TokenId): string {
    var account = NEP721._owners.getSome(token_id);
    return account.accountId.toString();
  }
}
