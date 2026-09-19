import {
  Award, ClipboardCheck, Clock, FilePlus2, Layers, Send, ShieldCheck, SlidersHorizontal, Sparkles, Target, Workflow,
  type LucideIcon,
} from 'lucide-react';

/** Icon registry so content data stays serialisable. */
export const ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  sparkles: Sparkles,
  workflow: Workflow,
  target: Target,
  'file-plus': FilePlus2,
  send: Send,
  clipboard: ClipboardCheck,
  award: Award,
  sliders: SlidersHorizontal,
  layers: Layers,
  shield: ShieldCheck,
};
