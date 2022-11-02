import { v4 as uuidv4 } from 'uuid';

export default class IdGenerator {
  public static generate(): string {
    return uuidv4();
  }
}
