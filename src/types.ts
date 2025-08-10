import { RuleProperties, TopLevelCondition } from 'json-rules-engine';
import { StyleObject } from './components/styles';
import { LabelObject } from './labels';

export interface Fact {
  value: string;
  label: string;
}

export interface Operator {
  value: string;
  label: string;
}

export interface Event {
  value: string;
  label: string;
}

export interface Condition {
  fact: string;
  operator: string;
  value: { fact: string } | any;
  path?: string;
  priority?: number;
  params?: Record<string, any>;
}

export interface TestFacts {
  [key: string]: string;
}

export interface Path extends Array<number> {}

export interface RuleEditorProps {
  value: string;
  onChange?(rules: string): void;
  styles?: Partial<StyleObject>;
  labels?: LabelObject;
  facts: Fact[];
  operators: Operator[];
  events: Event[];
}

export interface RuleTesterProps {
  rules: RuleProperties[];
  styles?: Partial<StyleObject>;
  labels?: LabelObject;
  facts: Fact[];
}

export interface RulesSelectProps {
  placeholder?: string;
  value: string;
  onChange(value: { label: string; value: string }): void;
  className?: string;
  style?: React.CSSProperties;
  options: { label: string; value: string; isDisabled?: boolean }[];
}

export interface RuleGroupProps {
  ruleIndex: number;
  condition: TopLevelCondition;
  path: Path;
  renderConditions: (
    ruleIndex: number,
    conditions: TopLevelCondition,
    path: Path,
  ) => JSX.Element[];
  onAddCondition: (ruleIndex: number, path: Path) => void;
  onAddGroup: (ruleIndex: number, path: Path) => void;
  onDeleteGroup: (ruleIndex: number, path: Path) => void;
  styles: StyleObject;
  labels?: LabelObject;
}

export interface RuleConditionProps {
  ruleIndex: number;
  conditionOrGroup: Condition;
  path: Path;
  onUpdateCondition: (
    ruleIndex: number,
    path: Path,
    updatedCondition: Condition,
  ) => void;
  onDeleteCondition: (ruleIndex: number, path: Path) => void;
  facts: Fact[];
  operators: Operator[];
  styles: StyleObject;
  labels?: LabelObject;
}
