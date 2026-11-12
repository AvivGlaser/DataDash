import type { IconName, QuestionnaireFlow } from '../types';

export const FLOW_TEXT: Record<QuestionnaireFlow, { title: string; intro: string; badge: string; icon: IconName; submit: string }> = {
  instant: {
    title: 'Your Instant Dashboard',
    intro: 'Six quick questions you can answer from memory. Good estimates are fine.',
    badge: 'Instant · 6 questions',
    icon: 'bolt',
    submit: 'Build my dashboard',
  },
  extended: {
    title: 'Your Extended Dashboard',
    intro: 'The six core questions, then a few about your customers and sales. Takes about three minutes.',
    badge: 'Extended · 12 questions',
    icon: 'barChart',
    submit: 'Build my dashboard',
  },
  upgrade: {
    title: 'Unlock deeper insights',
    intro: 'Your first six answers are kept. Add these to see customer and per-sale insights.',
    badge: 'Extended · 6 more questions',
    icon: 'barChart',
    submit: 'Update my dashboard',
  },
};
