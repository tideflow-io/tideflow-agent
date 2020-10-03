module.exports = {
  apps : [
    {
      name: 'agent',
      script: 'index.js',
      post_update: ['npm install']
    }
  ]
};
