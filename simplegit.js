
/*
 * SimpleGit
 * @author Dustan Kasten <dustan@skookum.com>
 */

var exec = require('child_process').exec;
var async = require('async');

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
      branch: obj.branch || simplegit.currentBranch || 'master'
    }, cb);
  },

  push: function(obj, cb) {
    var obj = obj || {};
    this.action({
      action: 'push',
      remote: obj.remote || 'origin',
      branch: obj.branch || simplegit.currentBranch || 'master'
    }, cb);
  },

  'git-sync': function(data, callback) {
    var self = this;

    // clean up data for the git commands
    data['add-files'] = data['add-files'] || null;
    data['commit-message'] = data['commit-message'] || null;

    async.series([
        function add(cb) {
          self.add(data['commit-files'], function() {
            cb(null, 'add')
          });
        },
        function commit(cb) {
          self.commit(data['commit-message'], function() {
            cb(null, 'commit')
          });
        },
        function pull(cb) {
          self.pull({}, function() {
            cb(null, 'pull') }
          );
        },
        function push(cb) {
          self.push({}, function() {
            cb(null, 'push')
          });
        },
      ],
      function collectedCallback(err, results) {
        if (err) {
          err = {
            "status": "error",
            "message" : "Something went wrong syncing with Github. View developer logs to debug"
          };
        }
        results = {
          "status": "success",
          "data": {
            "message": "You have successfully sync’d with Github"
          }
        };

        callback(err || results);
      }
    )
  }

};

exec("git symbolic-ref -q HEAD", function(err, stdout, stderr) {
  if (err) throw err;
  var branch = stdout.split('/');
  branch = branch[branch.length-1];
  simplegit.currentBranch = branch;
});

module.exports = simplegit;

