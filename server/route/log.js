/**
 * Provides routing for the express application
 *
 * @module routing
 **/

var thunkify = require('co-thunkify');

var Logger = require('../module/Logger');
var LOG = 'log-router';

var Log = require('../../schema/Log');

var findBrews = thunkify(Log.findBrews);


/**
 * Find brew logs
 *
 * @method findBrewLogs
 * @param {Function} next
 */
exports.findBrewLogs = function *(next) {
  var brews;

  // Query database
  try {
    brews = yield findBrews();
  } catch (err) {
    Logger.error('find: DB error', LOG, { err: err });
    this.throw(500, 'DB error');
  }

  // Res
  yield next;
  this.body = {
    brews: brews
  };
};


/**
 * Find one brew log
 *
 * @method findBrewLogs
 * @param {Function} next
 */
module.exports.findOneBrewLog = function *(next) {
  var params = {
    name: this.query.name,
    from: this.query.from,
    to: this.query.to
  };

  var brews;

  if(!params.name || !params.from || !params.to) {
    this.throw(400, 'Invalid query');
  }

  // Query database
  try {
    brews = yield Log.findOneBrew(params);
  } catch (err) {
    Logger.error('find: DB error', LOG, { err: err });
    this.throw(500, 'DB error');
  }

  // Res
  yield next;
  this.body = {
    brews: brews
  };
};