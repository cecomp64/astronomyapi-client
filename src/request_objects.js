const { format } = require('date-fns');
const axios = require('axios');
const { auth_header } = require('./authentication')

const APIBASE = 'https://api.astronomyapi.com/api/v2';

class ObserverParameters {
  constructor(args = {}) {
    const today = new Date();
    
    this.latitude = parseFloat(args.latitude || process.env.DEFAULT_LATITUDE);
    this.longitude = parseFloat(args.longitude || process.env.DEFAULT_LONGITUDE);
    this.elevation = args.elevation || process.env.DEFAULT_ELEVATION;
    this.from_date = args.from_date || format(today, 'yyyy-MM-dd');
    this.to_date = args.to_date || format(today, 'yyyy-MM-dd');
    this.time = args.time || format(today, 'HH:mm:ss');
    this.output = 'rows';
    this.date = args.date || format(today, 'yyyy-MM-dd');
  }
}

class ViewParameters {
  constructor(args = {}) {
    this.type = args.type || 'constellation';
    this.parameters = {
      constellation: args.constellation || 'ori',
      position: {
        equatorial: {
          rightAscension: parseFloat(args.rightAscension || 0),
          declination: parseFloat(args.declination || 0),
        },
        zoom: args.zoom || 3
      }
    };
  }
}

class BaseRequest {
  data = null;
  response = null;
  url = null;
  method = 'get';
  
  constructor(appId = null, appSecret = null) {
    if(appId == null || appSecret == null) {
      this.header = auth_header();
    } else {
      this.header = auth_header(appId, appSecret);
    }
  }
  
  // Make a request using the given parameters
  async fetch(parameters, body = null) {
    var request_url = `${APIBASE}${this.url}`;
    request_url = (body != null) ? `${request_url}/${body}` : request_url
    
    // Add a request interceptor for debug
    // axios.interceptors.request.use(request => {
      //   console.log('Starting Request', JSON.stringify(request, null, 2));
    //   return request;
    // });
    
    try {
      var resp;
      if(this.method == 'get') {
        resp = await axios.get(request_url, {
          headers: this.header,
          params: parameters
        });
      } else if(this.method == 'post') {
        resp = await axios.post(request_url, parameters, {headers: this.header});
      } else {
        return;
      }
      
      this.response = resp;
      
      this.data = resp.data.data;
      console.dir(resp.data.data, {depth: 8, colors: true})
      
    } catch (error) {
      console.log(`Could not complete request to ${request_url} with parameters ${JSON.stringify(parameters)} and header ${this.header}: ${error}`);
      console.dir(error, {depth: 6, colors: true})
    }
  }
}

class PositionRequest extends BaseRequest {
  constructor(appId = null, appSecret = null) {
    super(appId, appSecret);
    this.url = "/bodies/positions";
  }
}

class EventRequest extends BaseRequest {
  constructor(appId = null, appSecret = null) {
    super(appId, appSecret);
    this.url = "/bodies/events";
  }
}

class BodiesEnumRequest extends BaseRequest {
  constructor(appId = null, appSecret = null) {
    super(appId, appSecret);
    this.url = "/bodies";
  }
}

class StarChartRequest extends BaseRequest {
  constructor(appId = null, appSecret = null) {
    super(appId, appSecret);
    this.url = "/studio/star-chart";
    this.method = 'post';
  }
}

module.exports = { ObserverParameters, BaseRequest, PositionRequest, EventRequest, BodiesEnumRequest, ViewParameters, StarChartRequest }
