export default abstract class TestRepository {
  public abstract dropAll(): Promise<void>;
}
