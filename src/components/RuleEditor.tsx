import React, { useState } from 'react';
import { RuleProperties, TopLevelCondition } from 'json-rules-engine';
import RulesSelect from './RulesSelect';
import RuleTester from './RuleTester';
import { defaultStyles } from './styles';
import { defaultLabels } from './labels';
import {
  RuleEditorProps,
  ConditionProperties,
  Path,
  ConditionProps,
  GroupProps,
} from './types';

const parseRuleValue = (value: string) => {
  if (
    value &&
    value.indexOf('.') !== value.length - 1 &&
    !isNaN(Number(value))
  ) {
    return parseFloat(value);
  }
  return value;
};

const Condition: React.FC<ConditionProps> = ({
  ruleIndex,
  conditionOrGroup,
  path,
  onUpdateCondition,
  onDeleteCondition,
  facts,
  operators,
  styles,
  labels,
}) => {
  const { fact, operator, value } = conditionOrGroup;
  return (
    <div style={styles.condition}>
      <strong>{labels?.ifLabel}</strong>
      <RulesSelect
        style={styles.select}
        value={fact}
        onChange={(option) =>
          onUpdateCondition(ruleIndex, path, {
            ...conditionOrGroup,
            fact: option.value,
          })
        }
        options={facts}
      />
      <strong>{labels?.isLabel}</strong>
      <RulesSelect
        style={styles.select}
        value={operator}
        onChange={(option) =>
          onUpdateCondition(ruleIndex, path, {
            ...conditionOrGroup,
            operator: option.value,
          })
        }
        options={operators}
      />
      <input
        style={styles.input}
        placeholder={labels?.conditionValuePlaceholder}
        onChange={(e) =>
          onUpdateCondition(ruleIndex, path, {
            ...conditionOrGroup,
            value: parseRuleValue(e.target.value),
          })
        }
        value={value || ''}
      />
      <button
        onClick={() => onDeleteCondition(ruleIndex, path)}
        style={styles.button}
      >
        {labels?.deleteCondition}
      </button>
    </div>
  );
};

const Group: React.FC<GroupProps> = ({
  ruleIndex,
  condition,
  path,
  renderConditions,
  onAddCondition,
  onAddGroup,
  onDeleteGroup,
  styles,
  labels,
}) => {
  const colors = [
    '#F4A261',
    '#7ad761',
    '#A8DADC',
    '#e1bd1f',
    '#1D3557',
    '#E76F51',
    '#2A9D8F',
    '#264653',
    '#E9C46A',
    '#E63946',
  ];
  const borderColor = colors[path.length - 1];

  return (
    <fieldset style={{ ...styles.group, border: `1px solid ${borderColor}` }}>
      <legend>
        {labels?.groupPrefix} {path.join('.')}
      </legend>
      {renderConditions(ruleIndex, condition, path)}
      <button
        onClick={() => onAddCondition(ruleIndex, path)}
        style={styles.button}
      >
        {labels?.addCondition}
      </button>
      <button onClick={() => onAddGroup(ruleIndex, path)} style={styles.button}>
        {labels?.addGroup}
      </button>
      <button
        onClick={() => onDeleteGroup(ruleIndex, path)}
        style={styles.button}
      >
        {labels?.deleteGroup}
      </button>
    </fieldset>
  );
};

const RuleEditor: React.FC<RuleEditorProps> = ({
  value,
  onChange,
  styles: customStyles = {},
  labels: customLabels = {},
  facts,
  operators,
  events,
}) => {
  const styles = { ...defaultStyles, ...customStyles };
  const labels = { ...defaultLabels, ...customLabels };

  const emptyCondition: ConditionProperties = {
    fact: facts[0].value,
    operator: operators[0].value,
    value: '',
  };

  const defaultRule = {
    conditions: { all: [emptyCondition] },
    event: { type: events[0].value, params: { value: '' } },
  };

  const [rules, setRules] = useState<RuleProperties[]>(() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
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
    updatedCondition: ConditionProperties,
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

  const renderConditions = (
    ruleIndex: number,
    conditions: TopLevelCondition,
    path: Path,
  ): JSX.Element[] => {
    return Object.entries(conditions).map(
      ([operator, conditionsOrGroups], index) => {
        return (
          <div key={index.toString()} style={styles.conditionsContainer}>
            {conditionsOrGroups && conditionsOrGroups.length > 0 && (
              <label>
                <RulesSelect
                  style={styles.select}
                  value={operator}
                  onChange={(option) =>
                    updateGroupOperator(ruleIndex, path, option.value)
                  }
                  options={[
                    { label: labels.requireAllConditions, value: 'all' },
                    { label: labels.requireAnyConditions, value: 'any' },
                  ]}
                />
              </label>
            )}
            {(conditionsOrGroups as any[]).map(
              (conditionOrGroup: any, index: number) => {
                const newPath: any = [...path, index];
                if (conditionOrGroup.all || conditionOrGroup.any) {
                  return (
                    <Group
                      labels={labels}
                      key={newPath.join('.')}
                      ruleIndex={ruleIndex}
                      condition={conditionOrGroup}
                      path={newPath}
                      renderConditions={renderConditions}
                      onAddCondition={addCondition}
                      onAddGroup={addGroup}
                      onDeleteGroup={deleteGroup}
                      styles={styles}
                    />
                  );
                } else {
                  return (
                    <Condition
                      labels={labels}
                      key={newPath.join('.')}
                      ruleIndex={ruleIndex}
                      conditionOrGroup={conditionOrGroup}
                      path={newPath}
                      onUpdateCondition={updateCondition}
                      onDeleteCondition={deleteCondition}
                      facts={facts}
                      operators={operators}
                      styles={styles}
                    />
                  );
                }
              },
            )}
          </div>
        );
      },
    );
  };

  return (
    <div style={styles.container}>
      {rules.map((rule, ruleIndex) => (
        <div style={styles.rule} key={ruleIndex}>
          <header style={styles.ruleHeader}>
            {labels.rulePrefix} #{ruleIndex + 1}
          </header>
          {renderConditions(ruleIndex, rule.conditions, [])}

          <button
            onClick={() => addCondition(ruleIndex, [])}
            style={styles.button}
          >
            {labels.addCondition}
          </button>
          <button onClick={() => addGroup(ruleIndex, [])} style={styles.button}>
            {labels.addGroup}
          </button>

          <fieldset style={styles.event}>
            <legend>{labels.eventLabel}</legend>
            <RulesSelect
              style={styles.select}
              onChange={(option) =>
                updateEvent(
                  ruleIndex,
                  option.value,
                  parseRuleValue(rule.event?.params?.value),
                )
              }
              options={events}
              value={rule.event?.type || ''}
            />
            <input
              style={styles.input}
              placeholder={labels.eventValuePlaceholder}
              onChange={(e) =>
                updateEvent(
                  ruleIndex,
                  rule.event.type,
                  parseRuleValue(e.target.value),
                )
              }
              value={rule.event?.params?.value || ''}
            />
          </fieldset>
          <button onClick={() => deleteRule(ruleIndex)} style={styles.button}>
            {labels.deleteRule}
          </button>
        </div>
      ))}
      <button onClick={addRule} style={styles.button}>
        {labels.addRule}
      </button>

      {rules.length > 0 && (
        <RuleTester rules={rules} styles={styles} facts={facts} />
      )}
    </div>
  );
};

export default RuleEditor;
