import { u128 } from "near-sdk-core";
@nearBindgen
export class TokenDetail {
  name: string;
  symbol: string;
  public toString(): string {
    return this.name.toString() + ":" +this.symbol.toString();
  }
}
