require('dotenv').config();

function auth_header(appId = process.env.APPLICATION_ID, appSecret = process.env.APPLICATION_SECRET) {
  const authString = btoa(`${appId}:${appSecret}`);
  return {'Authorization' : `Basic ${authString}`};
  //return `Authorization: Basic ${authString}`;
}

module.exports = {auth_header};