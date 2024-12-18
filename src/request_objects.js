const { format } = require('date-fns');
const axios = require('axios');
const { auth_header } = require('./authentication')

const APIBASE = 'https://api.astronomyapi.com/api/v2';

class ObserverParameters {
  constructor(args = {}) {
    const today = new Date();
    
    this.latitude = args.latitude || process.env.DEFAULT_LATITUDE;
    this.longitude = args.longitude || process.env.DEFAULT_LONGITUDE;
    this.elevation = args.elevation || process.env.DEFAULT_ELEVATION;
    this.from_date = args.from_date || format(today, 'yyyy-MM-dd');
    this.to_date = args.from_date || format(today, 'yyyy-MM-dd');
    this.time = args.time || format(today, 'HH:mm:ss');
    this.output = 'rows';
  }
}

class BaseRequest {
  data = null;
  response = null;
  
  constructor(appId = null, appSecret = null) {
    if(appId == null || appSecret == null) {
      this.header = auth_header();
    } else {
      this.header = auth_header(appId, appSecret);
    }
  }
}

class PositionRequest extends BaseRequest {
  url = "/bodies/positions";
  
  constructor(appId = null, appSecret = null) {
    super(appId, appSecret);
  }
  
  // Make a request using the given parameters
  async fetch(observer_parameters) {
    const request_url = `${APIBASE}${this.url}`;
    
    // Add a request interceptor for debug
    // axios.interceptors.request.use(request => {
      //   console.log('Starting Request', JSON.stringify(request, null, 2));
    //   return request;
    // });
    
    try {
      var resp = await axios.get(request_url, {
        headers: this.header,
        params: observer_parameters
      });
      
      this.response = resp;
      
      this.data = resp.data.data;
      console.dir(resp.data.data, {depth: 8, colors: true})
      
    } catch (error) {
      console.log(`Could not complete request to ${request_url} with parameters ${JSON.stringify(observer_parameters)} and header ${this.header}: ${error}`);
      console.dir(error, {depth: 6, colors: true})
    }
  }
}

module.exports = { ObserverParameters, BaseRequest, PositionRequest }
