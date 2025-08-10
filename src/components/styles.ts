export const defaultStyles = {
  container: {},
  rule: {
    borderLeft: '3px solid silver',
    paddingLeft: '20px',
    marginBottom: '20px',
  },
  ruleHeader: {
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  select: {
    maxWidth: '200px',
    marginRight: '10px',
  },
  input: {
    maxWidth: '200px',
    marginRight: '10px',
  },
  button: {
    marginRight: '10px',
  },
  conditionsContainer: {
    marginBottom: '10px',
  },
  testRulesContainer: {
    margin: '20px 0',
  },
  summary: {
    cursor: 'pointer',
  },
  group: {
    border: '1px solid #ccc',
    margin: '15px 0',
  },
  groupActions: {
    display: 'flex',
    width: '100%',
  },
  groupLabel: {
    fontWeight: 'bold',
  },
};

export type StyleObject = typeof defaultStyles;
