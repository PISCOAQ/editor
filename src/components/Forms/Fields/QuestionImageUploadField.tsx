import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API } from '../../../data/api';

type Props = {
  nodeId: string;
  qid: string;
};

const QuestionImageUploadField = ({ nodeId, qid }: Props) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [hasRemote, setHasRemote] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const toast = useToast();

  // cleanup preview URL (evita leak)
  useEffect(() => {
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // quando entri/rientri nel nodo: verifica se l'immagine esiste già per (nodeId, qid)
  useEffect(() => {
    let cancelled = false;

    const checkRemote = async () => {
      if (!nodeId || !qid) return;
      setChecking(true);
      try {
        await API.downloadQuestionImage({ nodeId, qid });
        if (!cancelled) setHasRemote(true);
      } catch {
        if (!cancelled) setHasRemote(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    // reset preview quando cambiano chiavi
    setPreviewUrl((prev) => {
      if (prev) window.URL.revokeObjectURL(prev);
      return undefined;
    });

    checkRemote();
    return () => {
      cancelled = true;
    };
  }, [nodeId, qid]);

  const onUpload = async () => {
    if (!file) {
      toast({ title: "Seleziona un'immagine", status: 'warning' });
      return;
    }

    const ok =
      ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
        file.type
      ) || /\.(png|jpg|jpeg|webp)$/i.test(file.name);

    if (!ok) {
      toast({
        title: 'Formato non supportato (PNG/JPG/WEBP)',
        status: 'warning',
      });
      return;
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', file.name);

    try {
      await API.uploadQuestionImage({ nodeId, qid, file: fd });
      setHasRemote(true);
      toast({ title: 'Immagine caricata', status: 'success' });
    } catch (e: any) {
      const status = e?.response?.status ?? e?.status;
      const msg = e?.response?.data?.message ?? e?.message ?? 'Upload fallito';
      console.log('UPLOAD ERROR', { status, msg, e });
      toast({
        title: `Upload fallito${status ? ` (${status})` : ''}`,
        description: msg,
        status: 'error',
      });
    }
  };

  const onPreview = async () => {
    try {
      const resp = await API.downloadQuestionImage({ nodeId, qid });

      const blob = new Blob([resp.data], {
        type: resp.headers?.['content-type'] || 'image/png',
      });

      const url = window.URL.createObjectURL(blob);

      setPreviewUrl((prev) => {
        if (prev) window.URL.revokeObjectURL(prev);
        return url;
      });
    } catch (e: any) {
      const status = e?.response?.status ?? e?.status;
      console.log('PREVIEW ERROR', { status, e });
      toast({
        title: 'Immagine non trovata o errore download',
        status: 'info',
      });
      setHasRemote(false);
    }
  };

  return (
    <Box mt={3}>
      <Flex align="center" justify="space-between" mb={2}>
        <Text fontSize="sm">Immagine (PNG/JPG/WEBP)</Text>
        <Badge colorScheme={hasRemote ? 'green' : 'gray'}>
          {checking
            ? 'Controllo...'
            : hasRemote
            ? 'Immagine presente'
            : 'Nessuna immagine'}
        </Badge>
      </Flex>

      <Input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => setFile(e.target.files?.[0])}
      />

      <Flex gap={2} mt={2}>
        <Button size="sm" colorScheme="teal" onClick={onUpload}>
          Carica
        </Button>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={onPreview}
          isDisabled={!hasRemote}
        >
          Anteprima
        </Button>
      </Flex>

      {previewUrl && (
        <Box mt={3} borderWidth="1px" borderRadius="md" p={2}>
          <Image
            src={previewUrl}
            alt="Question preview"
            maxH="220px"
            objectFit="contain"
          />
        </Box>
      )}
    </Box>
  );
};

export default QuestionImageUploadField;
