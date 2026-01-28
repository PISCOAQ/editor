import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Input,
  Stack,
} from '@chakra-ui/react';
import {
  useController,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';

type AnswerRowProps = {
  answersName: string;
  correctIndexes: number[];
  idx: number;
  canRemove: boolean;
  onToggleCorrect: (idx: number) => void;
  onRemove: (idx: number) => void;
};

const AnswerRow = ({
  answersName,
  correctIndexes,
  onToggleCorrect,
  onRemove,
  idx,
  canRemove,
}: AnswerRowProps) => {
  const { control } = useFormContext();

  // Collego l'input alla singola risposta: answersName.idx
  const { field } = useController({
    control,
    name: `${answersName}.${idx}` as any,
    defaultValue: '',
  });

  return (
    <Flex align="center" gap={2}>
      {/* Checkbox: indica se questa risposta è corretta */}
      <Checkbox
        isChecked={correctIndexes.includes(idx)}
        onChange={() => onToggleCorrect(idx)}
      />

      {/* Input della risposta */}
      <Input
        {...field}
        value={field.value ?? ''}
        placeholder={`Answer ${idx + 1}`}
        onChange={(e) => field.onChange(e.target.value)}
      />

      {/* Rimozione risposta */}
      <IconButton
        aria-label="Remove answer"
        size="sm"
        icon={<CloseIcon />}
        onClick={() => onRemove(idx)}
        isDisabled={!canRemove}
      />
    </Flex>
  );
};

type Props = {
  label: string;
  answersName: string; // es: data.items.0.sections.0.answers
  correctIndexesName: string; // es: data.items.0.sections.0.correctIndexes
  minAnswers?: number; // minimo numero di risposte (0 = nessun vincolo)
};

const MultiSelectAnswersField = ({
  label,
  answersName,
  correctIndexesName,
  minAnswers = 0,
}: Props) => {
  const { control, setValue } = useFormContext();

  // Gestione array risposte
  const answersArray = useFieldArray({
    control,
    name: answersName as any,
  });

  // Tengo osservato l'array degli indici corretti
  const correctIndexes =
    (useWatch({
      control,
      name: correctIndexesName as any,
    }) as number[]) ?? [];

  // Aggiunge/toglie l'indice dall'array correctIndexes
  const toggleCorrect = (idx: number) => {
    const exists = correctIndexes.includes(idx);

    const next = exists
      ? correctIndexes.filter((x) => x !== idx)
      : [...correctIndexes, idx];

    next.sort((a, b) => a - b);

    setValue(correctIndexesName as any, next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // Rimuove una risposta e riallinea gli indici corretti
  const removeAnswer = (idx: number) => {
    // 1) Rimuovo davvero dal FieldArray (source of truth)
    answersArray.remove(idx);

    // 2) Aggiorno correctIndexes:
    // - tolgo idx
    // - scalo di -1 quelli maggiori di idx
    const nextCorrect = correctIndexes
      .filter((x) => x !== idx)
      .map((x) => (x > idx ? x - 1 : x))
      .sort((a, b) => a - b);

    setValue(correctIndexesName as any, nextCorrect, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const canRemove = answersArray.fields.length > minAnswers;

  return (
    <Box mt={3}>
      <Heading size="xs" mb={1}>
        {label}
      </Heading>

      <Stack spacing={2}>
        {answersArray.fields.map((f, idx) => (
          <AnswerRow
            key={f.id}
            answersName={answersName}
            correctIndexes={correctIndexes}
            onToggleCorrect={toggleCorrect}
            onRemove={removeAnswer}
            idx={idx}
            canRemove={canRemove}
          />
        ))}
      </Stack>

      <Button
        size="xs"
        mt={2}
        leftIcon={<AddIcon />}
        onClick={() => answersArray.append('')}
      >
        Add answer
      </Button>
    </Box>
  );
};

export default MultiSelectAnswersField;
