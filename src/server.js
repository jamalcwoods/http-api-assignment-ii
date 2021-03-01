const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse');
const jsonHandler = require('./jsonResponse');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handleGET = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedURL.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else if (parsedURL.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedURL.pathname === '/notReal') {
    jsonHandler.notFound(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

const handlePOST = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addUser') {
    const body = [];

    request.on('error', (err) => {
      console.log(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};

const handleHEAD = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/getUsers') {
    jsonHandler.getUsersMeta(request, response);
  } else if (parsedURL.pathname === '/notReal') {
    jsonHandler.notFoundMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (request.method === 'POST') {
    handlePOST(request, response, parsedURL);
  } else if (request.method === 'HEAD') {
    handleHEAD(request, response, parsedURL);
  } else {
    handleGET(request, response, parsedURL);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
