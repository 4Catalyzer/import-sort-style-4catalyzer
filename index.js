// this isn't great but we don't have any path info
const aliased = [
  'components',
  'messages',
  'mutations',
  'queries',
  'routes',
  'schema',
  'subscriptions',
  'utils',
];

function isAliasedModule({ moduleName }) {
  return aliased.some(n => moduleName.startsWith(n));
}

function isCssModule({ moduleName }) {
  return moduleName.includes('.css');
}

module.exports = (styleApi) => {
  const {
    alias,
    and,
    not,
    dotSegmentCount,
    hasNoMember,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = styleApi;

  const byModuleName = moduleName(naturally);
  const isAbsoluteModule = and(
    not(isAliasedModule),
    not(isRelativeModule)
  );

  return [
    {
      match: and(isNodeModule, not(isCssModule)),
      sort: byModuleName,
      sortNamedMembers: alias(unicode),
    },
    {
      match: and(isAbsoluteModule, not(isCssModule)),
      sort: byModuleName,
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    {
      match: and(isAliasedModule, not(isCssModule)),
      sort: byModuleName,
      sortNamedMembers: alias(unicode),
    },
    {
      match: and(isRelativeModule, not(isCssModule)),
      sort: [dotSegmentCount, byModuleName],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // finally css
    { match: and(hasNoMember, isCssModule), sort: byModuleName },
    { match: and(isAbsoluteModule, isCssModule), sort: byModuleName },
    { match: and(isAliasedModule, isCssModule), sort: byModuleName },
    { match: isCssModule, sort: [dotSegmentCount, byModuleName] },
  ];
};
