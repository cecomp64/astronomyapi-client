const { format } = require('date-fns');
const { PositionRequest, ObserverParameters, EventRequest, BodiesEnumRequest, StarChartRequest, ViewParameters } = require('./src/request_objects');

async function main() {
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
  
  // Make a test request
  pr = new PositionRequest();
  op = new ObserverParameters({to_date: format(nextMonth, 'yyyy-MM-dd')});
  await pr.fetch(op);

  er = new EventRequest();
  await er.fetch(op, "sun");

  br = new BodiesEnumRequest();
  await br.fetch(op);

  sr = new StarChartRequest();
  sr_params = {
    observer: op,
    view: new ViewParameters(),
  }
  await sr.fetch(sr_params);
}

main();