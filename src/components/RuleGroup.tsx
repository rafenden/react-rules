import React from 'react';
import { RuleGroupProps } from '../types';

const RuleGroup: React.FC<RuleGroupProps> = ({
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

export default RuleGroup;
