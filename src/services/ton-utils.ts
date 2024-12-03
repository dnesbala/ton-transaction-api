import TonWeb from "tonweb";

const tonWeb = new TonWeb();

export function decodeBase64ToCell(message: string) {
  const boc = Buffer.from(message, "base64").toString("hex");
  return tonWeb.boc.Cell.fromBoc(boc)[0]!;
}
