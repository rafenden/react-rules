import React from 'react';
import { TopLevelCondition } from 'json-rules-engine';
import { defaultStyles } from './styles';
import { defaultLabels } from '../labels';
import { RuleEditorProps, Path } from '../types';
import { useRules } from '../hooks/useRules';
import RulesSelect from './RulesSelect';
import RuleTester from './RuleTester';
import RuleCondition from './RuleCondition';
import RuleGroup from './RuleGroup';
import { parseRuleValue } from '../utils';

const RuleEditor: React.FC<RuleEditorProps> = ({
  value,
  onChange,
  styles: customStyles = {},
  labels: customLabels = {},
  facts,
  operators,
  events,
  engine,
  showRuleTester = true,
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
                    <RuleGroup
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
                    <RuleCondition
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

      {rules.length > 0 && showRuleTester && (
        <RuleTester
          rules={rules}
          styles={styles}
          facts={facts}
          engine={engine}
        />
      )}
    </div>
  );
};

export default RuleEditor;
