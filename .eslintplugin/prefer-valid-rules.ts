import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';
import { tryCollectConfigFileInfo } from './shared';

export = ESLintUtils.RuleCreator(name => name)({
  name: __filename,
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensures rules are valid.',
      category: 'Best Practices',
      recommended: 'error'
    },
    messages: {
      unknownRule: "Unknown rule '{{ ruleId }}' - Have you forgotten a plugin?",
      invalidRule:
        "The configuration for '{{ ruleId }}' is invalid: {{ reason }}"
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const results = tryCollectConfigFileInfo(context.getSourceCode().getText());

    if (!results) {
      return {};
    }

    return {
      Literal(node: TSESTree.Literal): void {
        if (node.value === null) {
          return;
        }

        const ruleId = node.value.toString();

        if (results.unknownRules.includes(ruleId.toString())) {
          context.report({
            data: { ruleId },
            messageId: 'unknownRule',
            node
          });

          return;
        }

        if (ruleId in results.invalidRules) {
          context.report({
            data: { ruleId, reason: results.invalidRules[ruleId].trimRight() },
            messageId: 'invalidRule',
            node
          });
        }
      }
    };
  }
});
