import React from 'react';
import { TopLevelCondition } from 'json-rules-engine';
import RulesSelect from './RulesSelect';
import RuleTester from './RuleTester';
import { defaultStyles } from './styles';
import { defaultLabels } from '../labels';
import { RuleEditorProps, Path, ConditionProps, GroupProps } from '../types';
import { useRules } from '../hooks/useRules';

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
    <fieldset style={styles.group}>
      <legend style={styles.groupLabel}>{labels?.conditionLabel}</legend>
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
    </fieldset>
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
      <legend style={styles.groupLabel}>{labels?.groupPrefix}</legend>
      {renderConditions(ruleIndex, condition, path)}

      <div style={styles.groupActions}>
        <button
          onClick={() => onAddCondition(ruleIndex, path)}
          style={styles.button}
        >
          {labels?.addCondition}
        </button>
        <button
          onClick={() => onAddGroup(ruleIndex, path)}
          style={styles.button}
        >
          {labels?.addGroup}
        </button>
        <button
          onClick={() => onDeleteGroup(ruleIndex, path)}
          style={styles.button}
        >
          {labels?.deleteGroup}
        </button>
      </div>
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

  const {
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
  } = useRules({
    initialValue: value,
    onChange,
    facts,
    operators,
    events,
  });

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
            {labels.rulePrefix} {ruleIndex + 1}
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

          <fieldset style={styles.group}>
            <legend style={styles.groupLabel}>{labels.eventLabel}</legend>
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
