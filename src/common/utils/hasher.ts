import bcrypt from 'bcrypt';

export type HashPair = {
  hash: string;
  salt: string;
};

export default class Hasher {
  public static async hash(password: string): Promise<HashPair> {
    const salt = await bcrypt.genSalt(2);
    const hash = await bcrypt.hash(Hasher.applySalt(password, salt), 2);
    return { hash, salt };
  }
  public static async check(
    password: string,
    hashPair: HashPair,
  ): Promise<boolean> {
    return await bcrypt.compare(
      Hasher.applySalt(password, hashPair.salt),
      hashPair.hash,
    );
  }
  private static applySalt(password: string, salt: string): string {
    return `${password}${salt}`;
  }
}
