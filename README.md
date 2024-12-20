# astronomyapi-client

This package exposes the astronomyapi.com API as handy classes and helper methods for easily querying the different endpoints
in this API.  See https://docs.astronomyapi.com for details about the API and what it returns.

## Defaults and Configuration

You will need your own Application ID and Application key from astronomyapi.com.  See the Getting Started section for instructions on how to get this (it is free).  Once you have it, you'll need to either set the `APPLICATION_ID` and `APPLICATION_SECRET` environment variables, or pass them into the constructors for Request objects.

This package uses some defaults for parameters that are based on environment variables.  You can set those defaults by setting the `DEFAULT*` environment variables below - either in a `.env` file or in your shell.  

Example:

```sh
DEFAULT_LATITUDE=37.25626720108698
DEFAULT_LONGITUDE=-121.94236276119172
DEFAULT_ELEVATION=3
APPLICATION_ID=your_id_from_astronomyapi.com
APPLICATION_SECRET=your_secret_from_astronomyapi.com
```

## Parameter Helpers

The API takes a few common objects as input parameters, and these are encapsualted as classes.  Generally, each class takes a hash of fields and values.  Each field listed in the docs is a valid field to include in the constructor hash.  Any hierarchy in the inputs described in the docs are flattened in these helper classes for convenience.  These classes are:

```js
{ ObserverParameters, ViewParameters, StyleParameters }
```


## Request Helpers

A class exists for each endpoint, and they all accept an object representing the parameters for that endpoint.  In some cases, the
endpoint will be a combination of the above parameter objects.  See the API docs for more details.  Each class has an asynchronous `fetch` method to initiate the request.  When the request completed the request object will have `response` and `data` fields populated for you to consume the results.  Here are some examples of the 
request helpers in action:

```js
const { format } = require('date-fns');
const { PositionRequest, ObserverParameters, EventRequest, BodiesEnumRequest, StarChartRequest, ViewParameters, MoonPhaseRequest, StyleParameters } = require('astronomyapi-client');

async function main() {
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
  
  // Make a position request
  pr = new PositionRequest();
  // override the `to_date` input parameter to be a month from now
  op = new ObserverParameters({to_date: format(nextMonth, 'yyyy-MM-dd')});
  await pr.fetch(op);

  er = new EventRequest();
  // EventRequest's `fetch` accepts an extra argument - the body id
  await er.fetch(op, "sun");

  br = new BodiesEnumRequest();
  await br.fetch(op);

  sr = new StarChartRequest();
  sr_params = {
    observer: op,
    view: new ViewParameters(),
  }
  await sr.fetch(sr_params);

  mr = new MoonPhaseRequest();
  mr_params = {
    observer: op,
    view: new ViewParameters({type: 'landscape-simple'}),
    style: new StyleParameters(),
  }
  await mr.fetch(mr_params);
}

main();

```