import SocialSituationsNodeProperties from '../../../components/Properties/Nodes/SocialSituationsNodeProperties';
import { ReactFlowSocialSituationsNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/icona_persone.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type SocialSituationSection = {
  before: string;
  bold: string;
  after: string;
  answers: string[];
  correctIndexes: number[]; // multi-select
};

export type SocialSituationItem = {
  sid: string;
  sections: SocialSituationSection[];
};

export type SocialSituationsNodeData = NodeData & {
  items: SocialSituationItem[];
};

export type SocialSituationsNode = PolyglotNode & {
  type: 'socialSituationsNode';
  data: SocialSituationsNodeData;
};

polyglotNodeComponentMapping.registerMapping<SocialSituationsNode>({
  elementType: 'socialSituationsNode',
  name: 'Situazioni sociali',
  icon: icon.src,
  group: 'remember_assessment',
  platform: 'WebApp',
  propertiesComponent: SocialSituationsNodeProperties,
  elementComponent: ReactFlowSocialSituationsNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    items: [],
  },
});
