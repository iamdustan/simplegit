
/*
 * SimpleGit
 * @author Dustan Kasten <dustan@skookum.com>
 */

var exec = require('child_process').exec;

var simplegit = {
  currentBranch: 'master',

  execute: function(action, cb) {
    exec(action, function(err, stdout, stderr) {
      if (err) throw err;
      console.log(action);
      console.log(stdout);
      cb && cb();
    });
  },

  add: function(files, cb) {
    var files = files ? files.join(' ') : '.',
        action = [ 'git', 'add', files ];
    this.execute(action.join(' '), cb);
  },

  commit: function(message, cb) {
    var message = message ? '"' + message + '"' : "Commit from nodeapp",
        action = [ 'git', 'commit -m', message, '-a' ];
    this.execute(action.join(' '), cb);
  },

  /* obj = {}
   * action, remote, branch
   */
  action: function(obj, cb) {
    var obj = obj || {},
        action = [ 'git',
        obj.action || 'pull',
        obj.remote || 'origin',
        obj.branch || 'master'
    ];
    this.execute(action.join(' '), cb);
  },

  pull: function(obj, cb) {
    var obj = obj || {};
    this.action({
      action: 'pull',
      remote: obj.remote || 'origin',
      branch: obj.branch || this.currentBranch || 'master'
    }, cb);
  },

  push: function(obj, cb) {
    var obj = obj || {};
    this.action({
      action: 'push',
      remote: obj.remote || 'origin',
      branch: obj.branch || this.currentBranch || 'master'
    }, cb);
  }
};

exec("git symbolic-ref -q HEAD", function(err, stdout, stderr) {
  if (err) throw err;
  var branch = stdout.split('/');
  branch = branch[branch.length-1];
  simplegit.currentBranch = branch;
});

module.exports = simplegit;


