const Task = require('ember-cli/lib/models/task');
const opn = require('opn');

export const DocTask: any = Task.extend({
  run: function(keyword: string) {
    const searchUrl = `https://angular.io/docs/ts/latest/api/#!?apiFilter=${keyword}`;
    return opn(searchUrl, { wait: false });
  }
});
