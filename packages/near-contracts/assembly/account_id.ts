import { u128 } from "near-sdk-core";
@nearBindgen
export class AccountId {
  accountId: string;

  public toString(): string {
    return this.accountId.toString();
  }
}
