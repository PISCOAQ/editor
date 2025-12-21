import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import Image from 'next/image';
import { DragEvent } from 'react';
import { polyglotNodeComponentMapping } from '../../types/polyglotElements';

interface NodeItem {
  key: string;
  text: string;
  icon: string;
  index: string;
}

// We organized the menu by bloom taxonomy levels:
// I leave as template the configuration if needed.
// the concept is that each node has an assigned group so you can easily filter them here.

/*
const configLearning = [
  {
    label: 'REMEMBER',
    bgColor: '#FFF0C8',
    group: 'remember_learning',
  },
  {
    label: 'UNDERSTAND',
    bgColor: '#FFEBB6',
    group: 'understand_learning',
  },
  {
    label: 'APPLY',
    bgColor: '#FFE092',
    group: 'apply_learning',
  },
  {
    label: 'CREATE',
    bgColor: '#FFCC49',
    group: 'create_learning',
  },
];

const configAssessment = [
  {
    label: 'REMEMBER',
    bgColor: '#D3CDDB',
    group: 'remember_assessment',
  },
  {
    label: 'UNDERSTAND',
    bgColor: '#BEB4C9',
    group: 'understand_assessment',
  },
  {
    label: 'APPLY',
    bgColor: '#9282A5',
    group: 'apply_assessment',
  },
  {
    label: 'CREATE',
    bgColor: '#7C6892',
    group: 'create_assessment',
  },
];
*/

//In our case we had multiple nodes that weren't already implemented in execution phase,
//so we decided to show them but not allowing the usage, you can remove this list and the corresponding logic if not needed.

const listImplementedNodes = [
  'multipleChoiceQuestionNode',
  'closeEndedQuestionNode',
  'OpenQuestionNode',
  'TrueFalseNode',
  'ReadMaterialNode',
  'WatchVideoNode',
  'CollaborativeModelingNode',
  'UMLModelingNode',
  'CircuitNode',
];

//lateral menu configuration with bloom taxonomy concept as example of configured menu.

export type LateralMenuProps = {
  isOpen: boolean;
};
const ITEM_COLORS = ['#FFCC49', '#FFF0C8'];

const LateralMenu = ({ isOpen }: LateralMenuProps) => {
  if (!isOpen) return <></>;

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodes: NodeItem[] = Object.keys(
    polyglotNodeComponentMapping.nameMapping
  ).map((index, id) => ({
    key: id.toString(),
    text: polyglotNodeComponentMapping.nameMapping[index],
    icon: polyglotNodeComponentMapping.iconMapping[index] ?? '',
    index,
  }));

  return (
    <Box w="300px" backgroundColor="rgba(217, 217, 217, 0.6)">
      <div className="label">NEW ACTIVITY</div>

      <Box height="100%" overflowY="auto" paddingBottom="15%">
        {nodes.map((node, idx) => {
          const isEnabled = listImplementedNodes.includes(node.index);

          const bgColor = ITEM_COLORS[idx % ITEM_COLORS.length];

          return (
            <Box
              key={node.key}
              id={node.key}
              display="flex"
              alignItems="center"
              gap="8px"
              padding="8px"
              marginBottom="4px"
              backgroundColor={bgColor}
              cursor={isEnabled ? 'grab' : 'not-allowed'}
              opacity={isEnabled ? 1 : 0.5}
              fontSize={{ base: '10px', md: '12px', xl: '14px' }}
              draggable={isEnabled}
              title={
                isEnabled
                  ? 'Drag the new Node type'
                  : 'Node type not implemented yet'
              }
              onDragStart={(event) =>
                isEnabled ? onDragStart(event, node.index) : null
              }
              _hover={{
                backgroundColor: isEnabled ? '#e6b83f' : bgColor,
              }}
            >
              <Image alt="Node icon" src={node.icon} width={20} height={20} />
              {node.text}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LateralMenu;
