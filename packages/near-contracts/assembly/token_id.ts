import { u256 } from "near-sdk-as";

@nearBindgen
export class TokenId {
  tokenId: i64;
  TokenURI: string;
  public  toString(): string {
    return this.tokenId.toString();
  }
}
