// src/validation/nodes/fauxPasNode.ts
import type { ValidationError } from '../generic';

const isNonEmptyString = (v: unknown) =>
  typeof v === 'string' && v.trim() !== '';

export const validateFauxPasNode = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  const quiz = data?.quiz;
  if (!Array.isArray(quiz) || quiz.length === 0) {
    errors.push({
      label: 'quiz',
      path: 'data.quiz',
      message: 'Inserisci almeno un quiz item.',
    });
    return errors;
  }

  quiz.forEach((item: any, qi: number) => {
    if (!isNonEmptyString(item?.qid)) {
      errors.push({
        label: 'qid',
        path: `data.quiz.${qi}.qid`,
        message: 'qid mancante.',
      });
    }

    if (!isNonEmptyString(item?.narration)) {
      errors.push({
        label: 'narration',
        path: `data.quiz.${qi}.narration`,
        message: 'narration mancante.',
      });
    }

    const questions = item?.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      errors.push({
        label: 'questions',
        path: `data.quiz.${qi}.questions`,
        message: 'Inserisci almeno una domanda.',
      });
      return;
    }

    questions.forEach((q: any, qj: number) => {
      if (!isNonEmptyString(q?.question)) {
        errors.push({
          label: 'question',
          path: `data.quiz.${qi}.questions.${qj}.question`,
          message: 'Testo domanda mancante.',
        });
      }

      const answers = q?.answers;
      if (
        !Array.isArray(answers) ||
        answers.length === 0 ||
        !answers.every(isNonEmptyString)
      ) {
        errors.push({
          label: 'answers',
          path: `data.quiz.${qi}.questions.${qj}.answers`,
          message: 'Inserisci almeno una risposta (non vuota).',
        });
      }

      const ci = q?.correctIndex;

      // può essere null (tutte sbagliate)
      if (ci === null) return;

      // undefined o altro tipo -> errore
      if (!Number.isInteger(ci)) {
        errors.push({
          label: 'correctIndex',
          path: `data.quiz.${qi}.questions.${qj}.correctIndex`,
          message: 'correctIndex deve essere un numero o null.',
        });
        return;
      }

      // se abbiamo answers, l'indice deve essere valido
      if (Array.isArray(answers) && answers.length > 0) {
        if (ci < 0 || ci >= answers.length) {
          errors.push({
            label: 'correctIndex',
            path: `data.quiz.${qi}.questions.${qj}.correctIndex`,
            message: 'correctIndex fuori range rispetto alle answers.',
          });
        }
      }
    });
  });

  return errors;
};
