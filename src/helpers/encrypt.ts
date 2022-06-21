import * as crypto from "crypto";
import * as JSEncrypt from "node-jsencrypt";

export class Encrypt {
  private algorithm = "aes-256-ctr";
  // NOTE :: Set password from .env for encrypt and decrypt
  private password = process.env.ENCRYPT_AES_256_CTR_PASSWORD;

  public encrypt(text: string) {
    const cipher = crypto.createCipher(this.algorithm, this.password);
    let crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  }

  /**
   * decrypt
   */
  public decrypt(text: string) {
    const decipher = crypto.createDecipher(this.algorithm, this.password);
    let dec = decipher.update(text, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  }

  /**
   * convertToSha
   */
  public convertToSha(pwd: string, salt: string) {
    const hash = crypto.createHmac("sha512", salt); /** Hashing algorithm sha512 */
    hash.update(pwd);
    const value = hash.digest("hex");
    return { salt, passwordHash: value };
  }

  public encryptwithJS(key: string) {
    const text = typeof key === "string" ? key : `${key}`;
    const jsEncrypt: JSEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(process.env.jsEncPubKey);
    const hash = jsEncrypt.encrypt(text);
    return hash;
  }
}
