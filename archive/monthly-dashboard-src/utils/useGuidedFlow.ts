import { useState } from 'react';
import type {
  BusinessModel, GuidedAnswers, GuidedContext, GuidedFlow, GuidedFlowOptions, GuidedNumberKey, GuidedQuestion, GuidedQuestionId,
} from '../types';
import { buildRecordFromAnswers, getDefaultGuidedMonth, getQuestionError, GUIDED_QUESTIONS } from './guidedQuestions';

const findQuestion = (questionId: GuidedQuestionId) =>
  GUIDED_QUESTIONS.find((question) => question.id === questionId) as GuidedQuestion;

const isAnswerQuestion = (question: GuidedQuestion) => question.kind !== 'confirm' && question.kind !== 'review';

/** Steps through the guided questions, skipping any that the answers so far make irrelevant. */
export function useGuidedFlow({ records, knownBusinessModel, initialMonth, onComplete }: GuidedFlowOptions): GuidedFlow {
  const [answers, setAnswers] = useState<GuidedAnswers>({
    businessModel: knownBusinessModel,
    month: initialMonth ?? getDefaultGuidedMonth(records),
    mrr: '', revenue: '', customers: '', newCustomers: '', churnedCustomers: '', cogs: '', salesMarketing: '', otherCosts: '',
  });
  const isBusinessModelKnown = knownBusinessModel !== null;
  const buildContext = (latestAnswers: GuidedAnswers): GuidedContext => ({ answers: latestAnswers, records, isBusinessModelKnown });
  const context = buildContext(answers);

  const [questionId, setQuestionId] = useState<GuidedQuestionId>(isBusinessModelKnown ? 'month' : 'businessModel');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditingFromReview, setIsEditingFromReview] = useState(false);

  const question = findQuestion(questionId);
  const questionIndex = GUIDED_QUESTIONS.indexOf(question);
  const relevantBefore = GUIDED_QUESTIONS.slice(0, questionIndex).filter((candidate) => candidate.isRelevant(context));
  const countedQuestions = GUIDED_QUESTIONS.filter((candidate) => isAnswerQuestion(candidate) && candidate.isRelevant(context));

  const showQuestion = (nextId: GuidedQuestionId) => {
    setErrorMessage('');
    setQuestionId(nextId);
  };

  const advance = (latestAnswers: GuidedAnswers) => {
    const latestContext = buildContext(latestAnswers);
    const error = getQuestionError(question, latestContext);
    if (error) {
      setErrorMessage(error);
      return;
    }
    const isAlreadyAnswered = (candidate: GuidedQuestion) =>
      isEditingFromReview && isAnswerQuestion(candidate) && !getQuestionError(candidate, latestContext);
    const nextQuestion = GUIDED_QUESTIONS.slice(questionIndex + 1)
      .find((candidate) => candidate.isRelevant(latestContext) && !isAlreadyAnswered(candidate));
    if (nextQuestion) showQuestion(nextQuestion.id);
  };

  const updateNumber = (key: GuidedNumberKey, value: string) => setAnswers({ ...answers, [key]: value });
  const updateMonth = (month: string) => setAnswers({ ...answers, month });

  const chooseBusinessModel = (businessModel: BusinessModel) => {
    const latestAnswers = { ...answers, businessModel };
    setAnswers(latestAnswers);
    advance(latestAnswers);
  };

  const applyQuickFill = (key: GuidedNumberKey, value: string) => {
    const latestAnswers = { ...answers, [key]: value };
    setAnswers(latestAnswers);
    advance(latestAnswers);
  };

  const goBack = () => {
    const previousQuestion = relevantBefore[relevantBefore.length - 1];
    if (previousQuestion) showQuestion(previousQuestion.id);
  };

  const correctAnswer = () => {
    if (question.correctionTarget) showQuestion(question.correctionTarget);
  };

  const editFromReview = (targetId: GuidedQuestionId) => {
    setIsEditingFromReview(true);
    showQuestion(targetId);
  };

  const saveAnswers = () => {
    if (answers.businessModel) onComplete(buildRecordFromAnswers(answers), answers.businessModel);
  };

  const answeredCount = relevantBefore.filter(isAnswerQuestion).length;

  return {
    question,
    context,
    errorMessage,
    progress: { current: Math.min(answeredCount + 1, countedQuestions.length), total: countedQuestions.length },
    canGoBack: relevantBefore.length > 0,
    updateNumber,
    updateMonth,
    chooseBusinessModel,
    applyQuickFill,
    goForward: () => advance(answers),
    goBack,
    correctAnswer,
    editFromReview,
    saveAnswers,
  };
}
