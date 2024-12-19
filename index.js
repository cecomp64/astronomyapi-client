const { format } = require('date-fns');
const { PositionRequest, ObserverParameters, EventRequest, BodiesEnumRequest, StarChartRequest, ViewParameters, MoonPhaseRequest, StyleParameters } = require('./src/request_objects');

async function main() {
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
  
  // Make a test request
  pr = new PositionRequest();
  op = new ObserverParameters({to_date: format(nextMonth, 'yyyy-MM-dd')});
 // await pr.fetch(op);

  er = new EventRequest();
 // await er.fetch(op, "sun");

  br = new BodiesEnumRequest();
  //await br.fetch(op);

  sr = new StarChartRequest();
  sr_params = {
    observer: op,
    view: new ViewParameters(),
  }
  //await sr.fetch(sr_params);

  mr = new MoonPhaseRequest();
  mr_params = {
    observer: op,
    view: new ViewParameters({type: 'landscape-simple'}),
    style: new StyleParameters(),
  }
  await mr.fetch(mr_params);
}

main();