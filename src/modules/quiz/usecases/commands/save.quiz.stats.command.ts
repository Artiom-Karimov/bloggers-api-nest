import { Quiz } from '../../models/domain/quiz';

export class SaveQuizStatsCommand {
  constructor(public quiz: Quiz) { }
}
