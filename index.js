const { PositionRequest, ObserverParameters } = require('./src/request_objects');

async function main() {
  // Make a test request
  pr = new PositionRequest();
  await pr.fetch(new ObserverParameters());
  console.log(`Response Data: ${pr.data}`)
}

main();