import { regex } from '../../../../common/utils/validation.regex';
import { User } from '../../../users/typeorm/models/user';
import { Question } from './question';
import { Quiz } from './quiz';
import { QuizParticipant } from './quiz.participant';

describe('Quiz creation tests', () => {
  let quiz: Quiz;
  const questionAmount = 5;
  let questions: Question[];
  let player1: User;

  beforeAll(async () => {
    questions = [];
    for (let i = 0; i < questionAmount; i++) {
      questions.push(
        Question.create({
          body: `q${i}-stion`,
          correctAnswers: [`but what's the q${i}-stion?`],
        }),
      );
    }

    player1 = await User.create({
      login: 'Glasha',
      email: 'nasha.glafira@youndex.ru',
      password: 'TheP4$sWoo0rd',
    });
  });

  it('Create without user should fail', () => {
    const wrongCreate = () => {
      Quiz.create(null, questions);
    };
    expect(wrongCreate).toThrow(Error);
  });

  it('Create without questions should fail', () => {
    const wrongCreate = () => {
      Quiz.create(player1, null);
    };
    expect(wrongCreate).toThrow(Error);
  });

  it('Create with not enough questions should fail', () => {
    const wrongCreate = () => {
      Quiz.create(player1, questions.slice(0, 2));
    };
    expect(wrongCreate).toThrow(Error);
  });

  it('Create with too many questions should fail', () => {
    const wrongCreate = () => {
      Quiz.create(player1, [...questions, ...questions]);
    };
    expect(wrongCreate).toThrow(Error);
  });

  it('Create quiz, check fields', () => {
    quiz = Quiz.create(player1, questions);

    expect(quiz.id).toMatch(regex.uuid);
    expect(quiz.createdAt).toBeInstanceOf(Date);
    expect(quiz.startedAt).toBeFalsy();
    expect(quiz.endedAt).toBeFalsy();

    expect(quiz.questions.length).toBe(questionAmount);
    questions.forEach((q, i) => {
      const match = quiz.questions.find((qq) => qq.question.id === q.id);
      expect(match).toBeTruthy();
      expect(match.questionOrder).toBe(i + 1);
      expect(match.id).toMatch(regex.uuid);
      expect(match.quiz.id).toBe(quiz.id);
    });

    const firstParticipant = QuizParticipant.create(player1, quiz);
    expect(quiz.participants).toEqual([
      {
        ...firstParticipant,
        id: expect.stringMatching(regex.uuid),
        addedAt: expect.any(Date),
      },
    ]);
  });
});
