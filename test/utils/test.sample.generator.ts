import { INestApplication } from '@nestjs/common';

export default abstract class TestSampleGenerator<Tinput, Toutput> {
  public samples: Array<Tinput> = [];
  public outputs: Array<Toutput> = [];

  constructor(protected readonly app: INestApplication) { }

  public clearSamples = () => {
    this.samples = [];
  };
  public abstract generateSamples(length: number): Array<Tinput>;
  public async createSamples(): Promise<void> {
    const promises = this.samples.map((s) => this.createOne(s));
    const results = await Promise.all(promises);
    this.outputs.push(...results);
  }
  public abstract createOne(sample: Tinput): Promise<Toutput>;

  protected rand = () => {
    return Math.floor(Math.random() * 999_999);
  };
  protected getLastSamples = (length: number) => {
    return this.samples.slice(this.samples.length - length);
  };
}
