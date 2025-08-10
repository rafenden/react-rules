import React from 'react';
import { RuleConditionProps } from '../types';
import RulesSelect from './RulesSelect';
import { parseRuleValue } from '../utils';

const RuleCondition: React.FC<RuleConditionProps> = ({
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

export default RuleCondition;
