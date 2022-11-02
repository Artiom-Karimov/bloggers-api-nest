const dateRegex =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

export default class DateGenerator {
  public static generate(): string {
    return new Date().toISOString();
  }
  public static validate(date: string): boolean {
    return dateRegex.test(date);
  }
}
