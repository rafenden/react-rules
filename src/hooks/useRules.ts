import { useState } from 'react';
import { RuleProperties, TopLevelCondition } from 'json-rules-engine';
import { Condition, Fact, Operator, Event, Path } from '../types';

export interface UseRulesProps {
  initialValue?: string;
  onChange?: (rules: string) => void;
  facts: Fact[];
  operators: Operator[];
  events: Event[];
}

export const useRules = ({
  initialValue = '',
  onChange,
  facts,
  operators,
  events,
}: UseRulesProps) => {
  const emptyCondition: Condition = {
    fact: facts[0]?.value || '',
    operator: operators[0]?.value || '',
    value: '',
  };

  const defaultRule = {
    conditions: { all: [emptyCondition] },
    event: { type: events[0]?.value || '', params: { value: '' } },
  };

  const [rules, setRules] = useState<RuleProperties[]>(() => {
    if (!initialValue) return [];
    try {
      const parsed = JSON.parse(initialValue);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error('Failed to parse rule value:', error);
      return [];
    }
  });

  const addRule = (): void => {
    setRules([...rules, defaultRule]);
  };

  const deleteRule = (index: number): void => {
    setRules(rules.filter((_, ruleIndex) => ruleIndex !== index));
  };

  const updateRules = (newRules: RuleProperties[]) => {
    setRules(newRules);
    if (onChange) {
      onChange(JSON.stringify(newRules));
    }
  };

  const getNestedConditions = (
    path: Path,
    conditions: TopLevelCondition,
  ): any => {
    return path.reduce(
      (nestedConditions, pathIndex) =>
        (nestedConditions as any)[Object.keys(nestedConditions)[0]][pathIndex],
      conditions,
    );
  };

  const addCondition = (ruleIndex: number, path: Path): void => {
    const newRules = [...rules];
    const conditions = getNestedConditions(
      path,
      newRules[ruleIndex].conditions,
    );
    conditions[Object.keys(conditions)[0]].push(emptyCondition);
    updateRules(newRules);
  };

  const deleteCondition = (ruleIndex: number, path: Path): void => {
    const newRules = [...rules];
    const currentRule = newRules[ruleIndex];
    const conditionIndex = path.pop()!;
    const conditions = getNestedConditions(path, currentRule.conditions);
    conditions[Object.keys(conditions)[0]].splice(conditionIndex, 1);
    updateRules(newRules);
  };

  const updateCondition = (
    ruleIndex: number,
    path: Path,
    updatedCondition: Condition,
  ): void => {
    const newRules = [...rules];
    const currentRule = newRules[ruleIndex];
    const conditionIndex = path.pop()!;
    const conditions = getNestedConditions(path, currentRule.conditions);
    conditions[Object.keys(conditions)[0]][conditionIndex] = updatedCondition;
    updateRules(newRules);
  };

  const addGroup = (ruleIndex: number, path: Path): void => {
    const newRules = [...rules];
    const currentRule = newRules[ruleIndex];
    const conditions = getNestedConditions(path, currentRule.conditions);
    conditions[Object.keys(conditions)[0]].push({ all: [emptyCondition] });
    updateRules(newRules);
  };

  const deleteGroup = (ruleIndex: number, path: Path): void => {
    const newRules = [...rules];
    const currentRule = newRules[ruleIndex];
    const groupIndex = path.pop()!;
    const conditions = getNestedConditions(path, currentRule.conditions);
    conditions[Object.keys(conditions)[0]].splice(groupIndex, 1);
    updateRules(newRules);
  };

  const updateGroupOperator = (
    ruleIndex: number,
    path: Path,
    newOperator: string,
  ): void => {
    const newRules = [...rules];
    const currentRule = newRules[ruleIndex];
    if (path.length === 0) {
      const group = (currentRule.conditions as any)[
        Object.keys(currentRule.conditions)[0]
      ];
      (currentRule.conditions as any) = { [newOperator]: group };
    } else {
      const groupIndex = path.pop()!;
      let conditions = getNestedConditions(path, currentRule.conditions);
      const group = conditions[Object.keys(conditions)[0]][groupIndex];
      conditions[Object.keys(conditions)[0]][groupIndex] = {
        [newOperator]: group[Object.keys(group)[0]],
      };
    }
    updateRules(newRules);
  };

  const updateEvent = (ruleIndex: number, type: string, value: any): void => {
    const newRules = [...rules];
    newRules[ruleIndex] = {
      ...newRules[ruleIndex],
      event: { type, params: { value } },
    };
    updateRules(newRules);
  };

  return {
    rules,
    addRule,
    deleteRule,
    addCondition,
    deleteCondition,
    updateCondition,
    addGroup,
    deleteGroup,
    updateGroupOperator,
    updateEvent,
    getNestedConditions,
    emptyCondition,
  };
};
