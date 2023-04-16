import { QuizStatsViewModel } from './quiz.stats.view.model';

describe('QuizStats average score calculation', () => {
  it('Should return 0 if 0 passed', () => {
    const test: any = { sumScore: 0, gamesCount: 0 };
    const result = new QuizStatsViewModel(test);
    expect(result.avgScores).toBe(0);
  });

  it('Should return int if divides without remainder', () => {
    const test: any = { sumScore: 6, gamesCount: 3 };
    const result = new QuizStatsViewModel(test);
    expect(result.avgScores).toBe(2);
    expect(result.avgScores.toString()).toBe('2');
  });

  it('Should have 2 decimal places if float', () => {
    const test: any = { sumScore: 5, gamesCount: 3 };
    const result = new QuizStatsViewModel(test);
    expect(result.avgScores).toBe(1.67);
    expect(result.avgScores.toString()).toBe('1.67');
  });
});
