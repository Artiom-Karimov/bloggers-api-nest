import IdGenerator from '../../../../common/utils/id.generator';
import { regex } from '../../../../common/utils/validation.regex';
import { User } from '../../../users/typeorm/models/user';
import { Question } from './question';
import { Quiz } from './quiz';
import { QuizAnswer } from './quiz.answer';
import { QuizParticipant } from './quiz.participant';

describe('Quiz game tests', () => {
  let quiz: Quiz;
  const questionAmount = 5;
  let questions: Question[];
  let player1: User;
  let player2: User;

  beforeAll(async () => {
    questions = [];
    for (let i = 0; i < questionAmount; i++) {
      questions.push(
        Question.create({
          body: `Which number is ${i}?`,
          correctAnswers: [`Idk, maybe ${i}`, `the number is ${i}`],
        }),
      );
    }

    player1 = await User.create({
      login: 'Glasha',
      email: 'nasha.glafira@youndex.ru',
      password: 'TheP4$sWoo0rd',
    });
    player2 = await User.create({
      login: 'Hariton',
      email: 'karton.hariton@fail.ru',
      password: 'ilovecookies',
    });

    quiz = Quiz.create(player1, questions);
  });

  it('Answers should not be accepted without second player', () => {
    const illegalActivity = () => {
      quiz.acceptAnswer(player1.id, 'Here you go, backend');
    };

    expect(illegalActivity).toThrow(Error);
  });

  it('Create quiz, add second player', () => {
    quiz.addParticipant(player2);

    expect(quiz.startedAt).toBeInstanceOf(Date);
    expect(quiz.endedAt).toBeFalsy();

    const firstParticipant = QuizParticipant.create(player1, quiz);
    const secondParticipant = QuizParticipant.create(player2, quiz);

    expect(quiz.participants).toEqual([firstParticipant, secondParticipant]);
  });

  it('ansers from non-participating user should make error', () => {
    const illegalActivity = () => {
      quiz.acceptAnswer(IdGenerator.generate(), 'Here you go, backend');
    };

    expect(illegalActivity).toThrow(Error);
  });

  it('player2 should be able to send ansers', () => {
    const wrongAnswer = 'I am so wrong, fogive me';
    quiz.acceptAnswer(player2.id, wrongAnswer);
    const answers = quiz.participants[1].answers;

    expect(answers.length).toBe(1);
    expect(answers[0]).toBeInstanceOf(QuizAnswer);

    const a = answers[0];
    expect(a.answer).toBe(wrongAnswer);
    expect(a.createdAt).toBeInstanceOf(Date);
    expect(a.participant).toBe(quiz.participants[1]);
    expect(a.isCorrect).toBe(false);

    expect(a.getInfo()).toEqual({
      questionId: questions[0].id,
      answerStatus: 'Incorrect',
      addedAt: a.createdAt.toISOString(),
    });
  });

  it('player1 should be able to send ansers', () => {
    expect(quiz.participants[0].answers).toBeFalsy();

    quiz.acceptAnswer(player1.id, questions[0].answers[1]);
    quiz.acceptAnswer(player1.id, questions[1].answers[0]);

    const answers = quiz.participants[0].answers;

    expect(answers.length).toBe(2);

    answers.forEach((a, i) => {
      expect(a).toBeInstanceOf(QuizAnswer);
      expect(a.participant).toBe(quiz.participants[0]);
      expect(a.isCorrect).toBe(true);

      expect(a.getInfo()).toEqual({
        questionId: questions[i].id,
        answerStatus: 'Correct',
        addedAt: a.createdAt.toISOString(),
      });
    });
  });
});
