function until(asyncFunction) {
  return asyncFunction
    .then(outcome =>  { return [outcome, null] })
    .catch(failure => { return [null, failure] })
}
module.exports = until;