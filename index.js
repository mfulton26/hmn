const messageSectionsRegExp = /^([^]*?)(?:(?:\r?\n){2}([^]*))?$/;
const requestLineRegExp = /^(\S+) (\S+) HTTP\/1\.1$/;
const statusLineRegExp = /^HTTP\/1\.1 (\d+)(?: (.*))?$/;
const headerLineRegExp = /^([^:\s]*?)\s*:\s*(.*)$/;

/**
 * An intrinsic object that provides functions to convert JavaScript objects representing HTTP messages to and
 * from the HTTP Message Notation (HMN) format (see RFC 2616).
 */
const HMN = {
  /**
   * Converts a HTTP Message Notation (HMN) string into a JavaScript object representing a HTTP message.
   * @param text A valid HMN string.
   */
  parse(text) {
    const message = {};
    const [, preBody, body] = messageSectionsRegExp.exec(text);
    const [messageLine, ...headerLines] = preBody.split(/\r?\n/);
    if (requestLineRegExp.test(messageLine)) {
      const [, method, url] = requestLineRegExp.exec(messageLine);
      message.method = method;
      message.url = url;
    } else if (statusLineRegExp.test(messageLine)) {
      const [, status, statusText] = statusLineRegExp.exec(messageLine);
      message.status = parseInt(status);
      message.statusText = statusText;
    } else {
      throw new Error('first line does not represent a request nor a response');
    }
    if (headerLines.length) {
      const headers = {};
      for (const headerLine of headerLines) {
        const [, key, value] = headerLineRegExp.exec(headerLine);
        headers[key] = value;
      }
      message.headers = headers;
    }
    if (body !== undefined) {
      message.body = body;
    }
    return message;
  },
  /**
   * Converts a JavaScript object representing a HTTP message to a HTTP Message Notation (HMN) string.
   * @param message A JavaScript object representing a HTTP message.
   * @param message.method A request method. e.g. `GET`
   * @param message.url A request url. e.g. `https://www.example.com/`
   * @param message.status A response status. e.g. `200`
   * @param message.statusText A response reason phrase. e.g. `OK`
   * @param message.headers An object with key/value pairs representing request or response headers. e.g. `{'Content-Type': 'application/json'}`
   * @param message.body A request or response body. e.g. `{"success": true}`
   */
  stringify({method, url, status, statusText, headers = {}, body}) {
    let text = '';
    if (method && url) {
      text += `${method} ${url} HTTP/1.1\r\n`;
    } else if (status && statusText) {
      text += `HTTP/1.1 ${status} ${statusText}\r\n`;
    } else {
      throw new Error('missing sufficient properties to build a request or a response');
    }
    for (const [key, value] of Object.entries(headers)) {
      text += `${key}: ${value}\r\n`;
    }
    text += `\r\n`;
    if (body != null) {
      text += body;
    }
    return text;
  }
};

module.exports = HMN;