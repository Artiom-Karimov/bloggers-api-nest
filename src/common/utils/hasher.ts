import * as bcrypt from 'bcrypt';

export default class Hasher {
  public static async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 2);
    return hash;
  }
  public static async check(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
