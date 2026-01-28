import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import NumberField from './NumberField';

type MinCorrectToPassFieldProps = {
  // Path RHF del numero soglia (es: "data.minCorrectToPass")
  name: string;

  // Label campo
  label?: string;

  // Se vuoi validare in base alla lunghezza di un array:
  // es: "data.questions"
  totalFromArrayName?: string;

  // Se invece vuoi passare un max fisso (fallback)
  maxValue?: number;

  // Se true, quando il totale diminuisce e la soglia è troppo alta,
  // la riportiamo automaticamente al massimo consentito.
  clampToMax?: boolean;
};

/*Campo riusabile per "minCorrectToPass" con validazione.*/
const MinCorrectToPassField = ({
  name,
  label = 'Minimo corrette per superare',
  totalFromArrayName,
  maxValue,
  clampToMax = true,
}: MinCorrectToPassFieldProps) => {
  const { control, setValue, getValues } = useFormContext();

  // Se mi dai un array path, ne osservo il valore per ricavare la lunghezza
  const arrValue = useWatch({
    control,
    name: totalFromArrayName ?? '',
  });

  const computedMax =
    typeof maxValue === 'number'
      ? maxValue
      : Array.isArray(arrValue)
      ? arrValue.length
      : undefined;

  // Clamp automatico: se diminuiscono le domande e la soglia resta > max, la abbasso
  useEffect(() => {
    if (!clampToMax) return;
    if (typeof computedMax !== 'number') return;

    const current = getValues(name);

    if (typeof current === 'number' && current > computedMax) {
      setValue(name, computedMax, { shouldDirty: true, shouldValidate: true });
    }
  }, [clampToMax, computedMax, getValues, name, setValue]);

  return (
    <NumberField
      label={label}
      name={name}
      defaultValue={0}
      min={0}
      // Se computedMax esiste, lo usiamo come max UI
      max={typeof computedMax === 'number' ? computedMax : 999}
      // (Se NumberField supporta "rules", vedi nota sotto)
      // rules={{
      //   validate: (v: any) => {
      //     if (v == null || v === '') return true;
      //     const n = Number(v);
      //     if (Number.isNaN(n)) return 'Inserisci un numero valido';
      //     if (n < 0) return 'Deve essere ≥ 0';
      //     if (typeof computedMax === 'number' && n > computedMax)
      //       return `Deve essere ≤ ${computedMax}`;
      //     return true;
      //   },
      // }}
    />
  );
};

export default MinCorrectToPassField;
