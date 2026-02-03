import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { API } from '../../../data/api';
import useStore from '../../../store';
import QuestionImageUploadField from '../../Forms/Fields/QuestionImageUploadField';
import SingleSelectAnswersField from '../../Forms/Fields/SingleSelectAnswersField';
import NodeProperties from './NodeProperties';

const newId = (prefix: string) =>
  globalThis.crypto?.randomUUID?.() ??
  `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

type EyesTaskQuestionForm = {
  qid?: string;
  answers?: string[];
  correctIndex?: number;
};

const EyesTaskTestNodeProperties = () => {
  const { control } = useFormContext();
  const toast = useToast();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'data.questions',
  });

  const questions = useWatch({
    control,
    name: 'data.questions',
  }) as EyesTaskQuestionForm[] | undefined;

  const selectedElement = useStore((store: any) => {
    const v = store.getSelectedElement;
    return typeof v === 'function' ? v() : v;
  });

  const nodeId = selectedElement?._id as string | undefined;

  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="Crea una lista di quesiti con un’immagine per ciascuno. Ogni quesito ha più risposte: seleziona quella corretta."
      />

      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="sm">Quesiti</Heading>
        <Button
          size="sm"
          leftIcon={<AddIcon />}
          onClick={() =>
            append({
              qid: newId('q'),
              answers: ['', ''],
              correctIndex: 0,
            })
          }
        >
          Aggiungi quesito
        </Button>
      </Flex>

      {fields.length === 0 && (
        <Box borderWidth="1px" borderRadius="md" p={3} opacity={0.85}>
          <Text fontSize="sm">
            Nessun quesito ancora. Clicca <b>Aggiungi quesito</b> per iniziare.
          </Text>
        </Box>
      )}

      <Stack spacing={4}>
        {fields.map((field, index) => {
          const base = `data.questions.${index}`;
          const qid = questions?.[index]?.qid;

          return (
            <Box key={field.id} borderWidth="1px" borderRadius="md" p={3}>
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="xs">Quesito #{index + 1}</Heading>

                <IconButton
                  aria-label="Rimuovi quesito"
                  size="xs"
                  colorScheme="red"
                  icon={<CloseIcon />}
                  type="button"
                  onClick={async () => {
                    const qidToDelete = questions?.[index]?.qid;

                    // se non ho le chiavi, rimuovo solo dal form
                    if (!nodeId || !qidToDelete) {
                      remove(index);
                      return;
                    }

                    try {
                      await API.deleteQuestionImage({
                        nodeId,
                        qid: qidToDelete,
                      });

                      // delete ok → rimuovo il quesito
                      remove(index);
                    } catch (e) {
                      // in caso di errore NON rimuovo il quesito
                      // (così non perdi il riferimento all'immagine)
                      console.error('Delete question image failed', e);
                    }
                  }}
                />
              </Flex>

              {nodeId && qid ? (
                <QuestionImageUploadField nodeId={nodeId} qid={qid} />
              ) : (
                <Text fontSize="xs" opacity={0.6} mt={2}>
                  Seleziona il nodo e assicurati che l’ID quesito sia valido per
                  caricare un’immagine.
                </Text>
              )}

              <SingleSelectAnswersField
                label="Risposte (seleziona quella corretta)"
                answersName={`${base}.answers`}
                correctIndexName={`${base}.correctIndex`}
                minAnswers={2}
                defaultAnswers={['', '']}
                allowNoCorrect={false}
              />
            </Box>
          );
        })}
      </Stack>
    </>
  );
};

export default EyesTaskTestNodeProperties;
