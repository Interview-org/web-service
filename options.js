exports.getData = function (method, hostName, path, headers) {
  return {
    host: hostName,
    path: path,
    method: method,
    headers: headers,
  }
};
