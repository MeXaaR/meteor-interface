Package.describe({
  name: 'mexar:meteor-interface',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Simple Content Management System to generate your administration interface for Meteor and React.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/MeXaaR/meteor-interface.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.7.0.3');
  api.use('ecmascript');
  api.mainModule('index.js');
  api.use([
    'ecmascript',
    'check',
    'accounts-password@1.5.1',
    'check@1.3.1',
    'alanning:roles@1.2.16',
    'npm-bcrypt@0.9.3',
    'react-meteor-data@0.2.16',
    'reactive-var@1.0.11',
    'tmeasday:publish-counts@0.8.0',
    'random@1.1.0'
  ]);
  Npm.depends({
    "aws-sdk": "2.263.1",
    "bcrypt": "2.0.1",
    "loadable-components": "2.2.2",
    "react-datetime-picker": "1.3.4",
    "moment": "2.22.2",
    "react": "16.4.1",
    "react-dom": "16.4.1",
    "react-helmet": "5.2.0",
    "react-router-dom": "4.3.1",
    "react-spring": "5.3.18",
    "react-sortable-hoc": "0.8.3",
    "react-tinymce": "0.7.0",
    "react-toastify": "4.1.0",
    "semantic-ui-react": "0.81.1",
    "slugify": "1.3.0",
    "styled-components": "3.3.3"
  });
});
