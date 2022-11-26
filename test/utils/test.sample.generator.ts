import { INestApplication } from '@nestjs/common';

export default abstract class TestSampleGenerator<Tinput, Toutput> {
  public samples: Array<Tinput> = [];
  public outputs: Array<Toutput> = [];

  constructor(protected readonly app: INestApplication) { }

  // generateOne should push its result to samples
  public abstract generateOne(): Tinput;
  // createOne should put sample to db
  public abstract createOne(sample: Tinput): Promise<Toutput>;

  public clearSamples = () => {
    this.samples = [];
  };
  public generateSamples(length: number): Array<Tinput> {
    for (let i = 0; i < length; i++) {
      this.generateOne();
    }
    return this.getLastSamples(length);
  }
  public async createSamples(): Promise<void> {
    const promises = this.samples.map((s) => this.createOne(s));
    const results = await Promise.all(promises);
    this.outputs.push(...results);
  }

  protected rand = () => {
    return Math.floor(Math.random() * 999_999);
  };
  protected getLastSamples = (length: number) => {
    return this.samples.slice(this.samples.length - length);
  };
}
