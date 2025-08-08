import React from 'react';
import { RuleEditor } from '../src';

export const facts = [
  { value: 'temperature', label: 'Temperature' },
  { value: 'humidity', label: 'Humidity' },
];

export const operators = [
  { value: 'equal', label: '==' },
  { value: 'notEqual', label: '!=' },
  { value: 'lessThan', label: '<' },
  { value: 'lessThanInclusive', label: '<=' },
  { value: 'greaterThan', label: '>' },
  { value: 'greaterThanInclusive', label: '>=' },
];

export const events = [
  { value: 'set_thermostat', label: 'Set Thermostat' },
  { value: 'set_fan', label: 'Set Fan' },
];

const rules = [
  {
    conditions: {
      all: [
        {
          fact: 'temperature',
          operator: 'lessThan',
          value: 20,
        },
      ],
    },
    event: {
      type: 'set_thermostat',
      params: {
        value: 22,
      },
    },
  },
];

const App: React.FC = () => (
  <div style={{ padding: 20 }}>
    <h1>React Rules Demo</h1>
    <RuleEditor
      value={JSON.stringify(rules)}
      onChange={console.log}
      facts={facts}
      operators={operators}
      events={events}
      styles={{
        container: {
          fontFamily: 'sans-serif',
        },
      }}
    />
  </div>
);

export default App;
