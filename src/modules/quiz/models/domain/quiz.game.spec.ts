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

  it('second player should be added', () => {
    quiz.addParticipant(player2);

    expect(quiz.startedAt).toBeInstanceOf(Date);
    expect(quiz.endedAt).toBeFalsy();

    const firstParticipant = QuizParticipant.create(player1, quiz);
    const secondParticipant = QuizParticipant.create(player2, quiz);

    expect(quiz.participants).toEqual([
      { ...firstParticipant, id: expect.stringMatching(regex.uuid) },
      { ...secondParticipant, id: expect.stringMatching(regex.uuid) },
    ]);
  });

  it('answers from non-participating user should make error', () => {
    const illegalActivity = () => {
      quiz.acceptAnswer(IdGenerator.generate(), 'Here you go, backend');
    };

    expect(illegalActivity).toThrow(Error);
  });

  it('player2 should be able to send answers', () => {
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

  it('player1 should be able to send answers', () => {
    expect(quiz.participants[0].answers).toBeFalsy();

    quiz.acceptAnswer(player1.id, questions[0].answers[1]);
    quiz.acceptAnswer(player1.id, questions[1].answers[0]);

    const answers = quiz.participants[0].answers;
    expect(quiz.participants[0].score).toBe(2);
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

  it('game should be finished', () => {
    for (let i = 2; i < questionAmount; i++) {
      quiz.acceptAnswer(player1.id, questions[i].answers[0]);
    }
    for (let i = 1; i < questionAmount; i++) {
      quiz.acceptAnswer(player2.id, questions[i].answers[0]);
    }

    expect(quiz.endedAt).toBeInstanceOf(Date);
    for (const p of quiz.participants) {
      expect(p.allAnswersMade()).toBe(true);
      expect(p.answers.length).toBe(questionAmount);
    }

    const p1 = quiz.participants.find((p) => p.userId === player1.id);
    expect(p1.isWinner).toBe(true);
    expect(p1.score).toBe(questionAmount + 1); // Time bonus

    const p2 = quiz.participants.find((p) => p.userId === player2.id);
    expect(p2.isWinner).toBe(false);
    expect(p2.score).toBe(questionAmount - 1);
  });
});
