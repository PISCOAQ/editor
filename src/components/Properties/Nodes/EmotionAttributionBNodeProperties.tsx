import { Box } from '@chakra-ui/react';
import NodeProperties from './NodeProperties';
import EmotionAttributionBEmbedded from '../../Embedded/EmotionAttributionBNodeEmbedded/EmotionAttributionBNodeEmbedded';
/**
 * Properties panel per il nodo "EmotionAttributionBNode".
 *
 * Backend fields:
 * - data.items[].emotion
 * - data.items[].scenario
 * - data.items[].scenarioExplanation
 */
const EmotionAttributionBNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="Esercitazione di attribuzione delle emozioni (Tipo B): inserisci una lista di elementi, ciascuno con emozione, scenario e spiegazione dello scenario."
      />

      <Box px={2} pt={2}>
        <EmotionAttributionBEmbedded basePath="data" />
      </Box>
    </>
  );
};

export default EmotionAttributionBNodeProperties;

