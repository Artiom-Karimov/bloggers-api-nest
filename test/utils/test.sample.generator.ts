import { INestApplication } from '@nestjs/common';

export default abstract class TestSampleGenerator<Tinput, Toutput> {
  public samples: Array<Tinput> = [];
  public outputs: Array<Toutput & { id: string }> = [];

  constructor(protected readonly app: INestApplication) { }

  // generateOne should push its result to samples
  public abstract generateOne(): Tinput;
  // createOne should put sample to db
  public abstract createOne(sample: Tinput): Promise<Toutput>;
  // removeOne should remove it from samples, outputs and db
  public abstract removeOne(id: string): Promise<void>;
  // alreadyCreated should check if outputs have sample data
  protected abstract alreadyCreated(sample: Tinput): boolean;

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
    for (const sample of this.samples) {
      if (this.alreadyCreated(sample)) return;
      const output = await this.createOne(sample);
      this.outputs.push(output as Toutput & { id: string });
    }
  }

  protected rand = () => {
    let result = Math.floor(Math.random() * 999);
    result *= new Date().getTime() % 100;
    return result;
  };
  protected getLastSamples = (length: number) => {
    return this.samples.slice(this.samples.length - length);
  };
  protected removeFromArrays(id: string, fieldName: string) {
    let value: any;

    for (let i = 0; i < this.outputs.length; i++) {
      const o = this.outputs[i];
      if (o.id !== id) continue;
      value = o[fieldName];
      this.outputs.splice(i, 1);
      break;
    }
    if (!value) return;

    for (let i = 0; i < this.samples.length; i++) {
      const s = this.samples[i];
      if (s[fieldName] !== value) continue;
      this.samples.splice(i, 1);
      break;
    }
  }
}
