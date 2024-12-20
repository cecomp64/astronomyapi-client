require('dotenv').config();

function auth_header(appId = process.env.ASTRONOMYAPI_APPLICATION_ID, appSecret = process.env.ASTRONOMYAPI_APPLICATION_SECRET) {
  const authString = btoa(`${appId}:${appSecret}`);
  return {'Authorization' : `Basic ${authString}`};
  //return `Authorization: Basic ${authString}`;
}

module.exports = {auth_header};