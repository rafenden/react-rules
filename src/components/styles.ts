export const defaultStyles = {
  container: {},
  rule: {
    borderLeft: '3px solid silver',
    paddingLeft: '20px',
    marginBottom: '20px',
  },
  ruleHeader: {
    color: 'gray',
    textTransform: 'uppercase' as const,
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  select: {
    width: '300px',
    paddingRight: '10px',
  },
  input: {
    width: '200px',
  },
  button: {
    marginRight: '10px',
  },
  conditionsContainer: {
    marginBottom: '10px',
  },
  condition: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    margin: '10px 0',
  },
  event: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    margin: '10px 0',
    border: '1px solid #ccc',
    padding: '10px',
  },
  group: {
    padding: '10px',
    border: '1px solid #ccc',
    margin: '5px 0',
  },
  testRulesContainer: {
    margin: '20px 0',
  },
  summary: {
    cursor: 'pointer',
  },
};

export type StyleObject = typeof defaultStyles;
