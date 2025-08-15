# React Rules

A flexible React component for building and managing business rules with [json-rules-engine](https://github.com/CacheControl/json-rules-engine/tree/master).

![Screenshot](./demo/screenshot2.png)

## Installation

```bash
npm install react-rules
```

## Usage

Here's a basic example of how to use the `RuleEditor` component:

```tsx
import React from 'react';
import { RuleEditor } from 'react-rules';

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
    "conditions": {
      "all": [
        {
          "fact": "temperature",
          "operator": "lessThan",
          "value": 20
        }
      ]
    },
    "event": {
      "type": "set_thermostat",
      "params": {
        "value": 22
      }
    }
  }
]

const App: React.FC = () => (
    <RuleEditor
      value={JSON.stringify(rules)}
      onChange={console.log}
      facts={facts}
      operators={operators}
      events={events}
    />
);

export default App;
```

## Props

### RuleEditor Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | JSON string of rules array |
| `onChange` | `(rules: string) => void` | No | - | Callback when rules change |
| `facts` | `Fact[]` | Yes | - | Available facts for conditions |
| `operators` | `Operator[]` | Yes | - | Available operators for conditions |
| `events` | `Event[]` | Yes | - | Available events for rule outcomes |
| `styles` | `Partial<StyleObject>` | No | `{}` | Custom styles object |
| `labels` | `LabelObject` | No | `{}` | Custom labels for UI text |
| `engine` | `Engine` | No | - | Custom json-rules-engine instance with pre-configured operators |
| `showRuleTester` | `boolean` | No | `true` | Whether to show the built-in rule tester |

### RuleTester Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `rules` | `RuleProperties[]` | Yes | - | Array of rules to test |
| `facts` | `Fact[]` | Yes | - | Available facts for testing |
| `styles` | `Partial<StyleObject>` | No | `{}` | Custom styles object |
| `engine` | `Engine` | No | - | Custom json-rules-engine instance |

## Custom Operators

You can extend the rules engine with custom operators by providing a pre-configured `Engine` instance:

```tsx
import React from 'react';
import { Engine, Operator } from 'json-rules-engine';
import { RuleEditor } from 'react-rules';

// Create custom operators
const customEngine = new Engine();
const betweenOperator = new Operator('between', (factValue, [min, max]) => {
  return factValue >= min && factValue <= max;
});
customEngine.addOperator(betweenOperator);

const App: React.FC = () => (
  <RuleEditor
    value={JSON.stringify(rules)}
    onChange={console.log}
    facts={facts}
    operators={[
      ...operators,
      { value: 'between', label: 'Between' }
    ]}
    events={events}
    engine={customEngine}
  />
);
```

## Customization

You can customize the styles by passing a `styles` object to the `RuleEditor` component. The default styles can be imported and extended:

```tsx
import { RuleEditor, defaultStyles } from 'react-rules';

const customStyles = {
  ...defaultStyles,
  container: {
    ...defaultStyles.container,
    border: '1px solid blue',
    padding: '20px',
  },
};

<RuleEditor styles={customStyles} {...otherProps} />
```

## Demo

To run the demo locally, clone the repository and run the following commands:

```bash
npm install
npm run dev
```

This will start a local development server. You can view the demo at `http://localhost:3000`.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Pull Request Checks**: Every PR runs automated tests to ensure code quality
- **Automated Releases**: Merging to `main` triggers automatic versioning and publishing
- **Semantic Versioning**: Version numbers are automatically determined based on commit messages
