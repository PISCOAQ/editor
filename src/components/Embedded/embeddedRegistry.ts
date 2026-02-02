import type React from 'react';
import ruotaIcona from '../../public/icona_ruota.png';
import emotionIcon from '../../public/mult_choice_icon.png';
import EmotionAttributionAEmbedded from './EmotionAttributionANodeEmbedded/EmotionAttributionANodeEmbedded';
import EmotionAttributionBEmbedded from './EmotionAttributionBNodeEmbedded/EmotionAttributionBNodeEmbedded';

export type EmbeddedProps = {
  basePath: string;
  isDisabled?: boolean;
};

export type EmbeddedDefinition = {
  type: string;
  label: string;
  icon?: string;
  component: React.ComponentType<EmbeddedProps>;
  createDefaultData: () => any;
};

export const embeddedRegistry: EmbeddedDefinition[] = [
  {
    type: 'EmotionAttributionANode',
    label: 'Attribuzione delle Emozioni (A)',
    icon: emotionIcon.src,
    component: EmotionAttributionAEmbedded,
    createDefaultData: () => ({
      scenario: '',
      domanda: '',
      risposteCorrette: [''],
      spiegazioneS: '',
      spiegazioneR: '',
    }),
  },
  {
    type: 'EmotionAttributionBNode',
    label: 'Attribuzione delle Emozioni (B)',
    icon: ruotaIcona.src,
    component: EmotionAttributionBEmbedded,
    createDefaultData: () => ({
      items: [
        {
          emotion: '',
          scenario: '',
          scenarioExplanation: '',
        },
      ],
    }),
  },
];

export const embeddedByType = Object.fromEntries(
  embeddedRegistry.map((d) => [d.type, d])
) as Record<string, EmbeddedDefinition>;
