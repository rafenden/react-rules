import React, { useState } from 'react';
import { Engine } from 'json-rules-engine';
import { RuleTesterProps, TestFacts } from '../types';
import { defaultStyles } from './styles';

const RuleTester: React.FC<RuleTesterProps> = ({
  rules,
  styles: customStyles = {},
  facts,
  engine,
}) => {
  const styles = { ...defaultStyles, ...customStyles };

  const [testFacts, setTestFacts] = useState<TestFacts>(
    facts.reduce((acc: TestFacts, fact) => {
      acc[fact.value] = '';
      return acc;
    }, {}),
  );

  const [testFactsResult, setTestFactsResult] = useState<String | null>(null);

  const testRule = (): void => {
    const ruleEngine = engine || new Engine();
    rules.forEach((rule) => ruleEngine.addRule(rule));
    ruleEngine
      .run(testFacts)
      .then(({ events }) => {
        setTestFactsResult(JSON.stringify(events, null, 2));
      })
      .catch((e) => {
        setTestFactsResult(e.message);
      });
  };

  return (
    <details style={styles.testRulesContainer}>
      <summary style={styles.summary}>Test the rules</summary>
      <pre>{JSON.stringify(rules, null, 2)}</pre>

      <label>
        Facts
        <div>
          <textarea
            rows={5}
            cols={50}
            defaultValue={JSON.stringify(testFacts, null, 2)}
            onChange={(e) => {
              try {
                const parsedValues = JSON.parse(e.target.value);
                setTestFacts(parsedValues);
                setTestFactsResult(null);
              } catch (error: any) {
                setTestFactsResult(error.message);
              }
            }}
          />
          <p>{testFactsResult}</p>
        </div>
      </label>
      <div>
        <button onClick={testRule} style={styles.button}>
          ▶️ Execute
        </button>
      </div>
    </details>
  );
};

export default RuleTester;
