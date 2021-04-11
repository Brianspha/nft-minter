import {
  mint,
  total_supply,
  token_exists,
  transfer_from,
  owner_of,
  balance_of,
  set_approval_for_all,
} from "..";
import { storage, Context, u256 } from "near-sdk-as";
import { AccountId } from "../account_id";
import { TokenId } from "../token_id";

describe("Should create an NFT ", () => {
  it("should mint new token", () => {
    var account = Context.senderPublicKey;
    var minted = mint(account);
    log("minted: ");
    log(minted);
    assert(minted, "Token not minted");
  });
  it("should mint new token and check if it exists", () => {
    var account = Context.senderPublicKey;
    var minted = mint(account);
    log("minted: ");
    log(minted);
    var token = 1;
    var exists = token_exists(token);
    log("exists: ");
    log(exists);
    assert(minted && exists, "Token does not exist");
  });

  it("should transfer newly minted token to another user", () => {
    var account = Context.senderPublicKey;
    var minted = mint(account);
    log("minted: ");
    log(minted);
    var token = 1;
    var account1 = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkLKK";
    var transffered = transfer_from(account, account1, token);
    log("transffered: ");
    log(transffered);
    log("key: ");
    log(Context.senderPublicKey);
    assert(minted && transffered, "Token not transferred");
  });

  it("should check balance of account1 after transfer", () => {
    var account = Context.senderPublicKey;

    var minted = mint(account);
    log("minted: ");
    log(minted);
    var token = 1;
    var account1 = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkLKK";
    var transffered = transfer_from(account, account1, token);
    log("transffered: ");
    log(transffered);
    log("key: ");
    log(Context.senderPublicKey);
    var balanceAccount1 = balance_of(account1);
    log("balanceAccount1: ");
    log(balanceAccount1.toI64());
    assert(
      minted && transffered && balanceAccount1.toI64() === 1,
      "Token not transferred"
    );
  });
  it("should transfer token not owned and fail", () => {
    var account = Context.senderPublicKey;
    log("pubKey: ");
    log(account);
    var minted = mint(account);
    log("minted: ");
    log(minted);
    var token = 1;
    var account1 = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkLKK";
    var transffered = transfer_from(account1, account, token);
    log("transffered: ");
    log(transffered);
    assert(minted && transffered, "Token not transferred");
  }); /* ;*/
  it("should approve user to transfer token not minted yet and fail", () => {
    var account = Context.senderPublicKey;
    log("pubKey: ");
    log(account);
    var minted = mint(account);
    log("minted: ");
    log(minted);
    var token = 2;
    var account1 = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkLKK";
    set_approval_for_all(account, account1, true);
    var account2 = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkWWK";
    var transferred = transfer_from(account1, account2, token);
    log("transferred: ");
    log(transferred);
    assert(minted && transferred, "Token not transferred");
  });
  it("should approve user to transfer token minted yet and fail", () => {
    var account = Context.senderPublicKey;
    log("pubKey: ");
    log(account);
    var minted = mint(account);
    log("minted: ");
    log(minted);
    var token = 1;
    var account1 = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkLKK";
    set_approval_for_all(account, account1, true);
    var account2 = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkWWK";
    var transferred = transfer_from(account1, account2, token);
    log("transferred: ");
    log(transferred);
    assert(minted && transferred, "Token not transferred");
  });
});
