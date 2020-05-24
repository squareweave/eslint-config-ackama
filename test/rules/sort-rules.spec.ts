import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../../.eslintplugin/sort-rules';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { sourceType: 'module' }
});

ruleTester.run('sort-rules', rule, {
  valid: [
    {
      code: `
module.exports = [...[]];
`
    },
    {
      code: `
const o = {
  rules: {
    'no-shadow': 'error'
  }
}
`
    },
    {
      code: `
module.exports = {
  rules: {
    'no-shadow': 'error'
  }
}
`
    },
    {
      code: `
module.exports = {
  rules: {
    [\`no-shadow\`]: 'error'
  }
}
`
    },
    {
      code: `
module.exports = {
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-expression': 'error',
    'no-unused-expression': 'error'
  }
}
`
    },
    {
      code: `
const identifier = '@typescript-eslint/camelcase';

module.exports = {
  rules: {
    'no-unused-expression': 'error',
    [identifier]: 'error'
  }
}
`
    },
    {
      code: `
const identifier = '@typescript-eslint/camelcase';

module.exports = {
  rules: {
    'no-unused-expression': 'error',
    [\`$\{identifier}\`]: 'error'
  }
}
`
    },
    {
      code: `
const o = {
  '@typescript-eslint/array-type': 'error'
}

module.exports = {
  rules: {
    'no-shadow': 'error'
  }
}
`
    },
    {
      code: `
const moreRules = {
  '@typescript-eslint/camelcase': 'error'
}

module.exports = {
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'react/no-danger': 'error',
    'no-shadow': 'error',
    ...moreRules,
    '@typescript-eslint/camelcase': 'error'
  }
};
`
    }
  ],
  invalid: [
    {
      code: `
module.exports = {
  rules: {
    'no-unused-var': 'error',
    'no-shadow': 'error'
  }
};
`,
      output: `
module.exports = {
  rules: {
    'no-shadow': 'error',
    'no-unused-var': 'error'
  }
};
`,
      errors: [
        {
          line: 5,
          column: 5,
          messageId: 'incorrectOrder',
          data: {
            thisName: 'no-shadow',
            prevName: 'no-unused-var'
          }
        }
      ]
    },
    {
      code: `
module.exports = {
  plugins: ['react'],
  rules: {
    'no-shadow': 'error',
    'react/no-danger': 'error'
  }
};
`,
      output: `
module.exports = {
  plugins: ['react'],
  rules: {
    'react/no-danger': 'error',
    'no-shadow': 'error'
  }
};
`,
      errors: [
        {
          line: 6,
          column: 5,
          messageId: 'incorrectOrder',
          data: {
            thisName: 'react/no-danger',
            prevName: 'no-shadow'
          }
        }
      ]
    },
    {
      code: `
module.exports = {
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    '@typescript-eslint/camelcase': 'error',
    'no-shadow': 'error',
    'react/no-danger': 'error'
  }
};
`,
      output: `
module.exports = {
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    '@typescript-eslint/camelcase': 'error',
    'react/no-danger': 'error',
    'no-shadow': 'error'
  }
};
`,
      errors: [
        {
          line: 7,
          column: 5,
          messageId: 'incorrectOrder',
          data: {
            thisName: 'react/no-danger',
            prevName: 'no-shadow'
          }
        }
      ]
    },
    {
      code: `
module.exports = {
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off'
  }
};
`,
      output: `
module.exports = {
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-namespace': 'off'
  }
};
`,
      errors: [
        {
          line: 6,
          column: 5,
          messageId: 'incorrectOrder',
          data: {
            thisName: '@typescript-eslint/no-dynamic-delete',
            prevName: '@typescript-eslint/no-namespace'
          }
        }
      ]
    },
    {
      code: `
module.exports = {
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'no-shadow': 'error',
    'react/no-danger': 'error',
    '@typescript-eslint/camelcase': 'error'
  }
};
`,
      output: `
module.exports = {
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'react/no-danger': 'error',
    'no-shadow': 'error',
    '@typescript-eslint/camelcase': 'error'
  }
};
`,
      errors: [
        {
          line: 6,
          column: 5,
          messageId: 'incorrectOrder',
          data: {
            thisName: 'react/no-danger',
            prevName: 'no-shadow'
          }
        },
        {
          line: 7,
          column: 5,
          messageId: 'incorrectOrder',
          data: {
            thisName: '@typescript-eslint/camelcase',
            prevName: 'react/no-danger'
          }
        }
      ]
    }
  ]
});
