const HMN = require('./index');

describe('parse', () => {
  describe('request', () => {
    test('no headers; no body', () => {
      expect(HMN.parse(`GET https://www.example.com/persons/1 HTTP/1.1`))
        .toEqual({
          method: 'GET',
          url: 'https://www.example.com/persons/1'
        });
    });

    test('no headers; uniline body', () => {
      expect(HMN.parse(`PUT https://www.example.com/persons/2 HTTP/1.1

{"living":"true"}`))
        .toEqual({
          method: 'PUT',
          url: 'https://www.example.com/persons/2',
          body: `{"living":"true"}`
        });
    });

    test('no headers; multiline body', () => {
      expect(HMN.parse(`PUT https://www.example.com/persons/3 HTTP/1.1

{
  "living": "true",
  "name": "Charlie"
}`))
        .toEqual({
          method: 'PUT',
          url: 'https://www.example.com/persons/3',
          body: `{\n  "living": "true",\n  "name": "Charlie"\n}`
        });
    });

    test('single header; no body', () => {
      expect(HMN.parse(`POST https://www.example.com/persons HTTP/1.1
content-type: application/json`))
        .toEqual({
          method: 'POST',
          url: 'https://www.example.com/persons',
          headers: {'content-type': 'application/json'}
        })
    });

    test('single headers; uniline body', () => {
      expect(HMN.parse(`PUT https://www.example.com/persons/9 HTTP/1.1
Content-Type: application/json

{"living":"true"}`))
        .toEqual({
          method: 'PUT',
          url: 'https://www.example.com/persons/9',
          headers: {'Content-Type': 'application/json'},
          body: `{"living":"true"}`
        });
    });

    test('single headers; multiline body', () => {
      expect(HMN.parse(`PUT https://www.example.com/persons/999 HTTP/1.1
Content-Type: application/json

{
  "living": "true",
  "name": "Charlie"
}`))
        .toEqual({
          method: 'PUT',
          url: 'https://www.example.com/persons/999',
          headers: {'Content-Type': 'application/json'},
          body: `{\n  "living": "true",\n  "name": "Charlie"\n}`
        });
    });
  });

  describe('response', () => {
    test('no headers; no body', () => {
      expect(HMN.parse(`HTTP/1.1 204 No Content`))
        .toEqual({
          status: 204,
          statusText: 'No Content'
        });
    });

    test('no headers; uniline body', () => {
      expect(HMN.parse(`HTTP/1.1 200 OK

Success`))
        .toEqual({
          status: 200,
          statusText: 'OK',
          body: `Success`
        });
    });

    test('no headers; multiline body', () => {
      expect(HMN.parse(`HTTP/1.1 400 Bad Request

You did something...
WRONG!!!`))
        .toEqual({
          status: 400,
          statusText: 'Bad Request',
          body: `You did something...\nWRONG!!!`
        });
    });

    test('single header; no body', () => {
      expect(HMN.parse(`HTTP/1.1 201 Created
Location: https://www.example.com/`))
        .toEqual({
          status: 201,
          statusText: 'Created',
          headers: {'Location': 'https://www.example.com/'}
        });
    });

    test('single header; uniline body', () => {
      expect(HMN.parse(`HTTP/1.1 201 Created
Location: https://www.example.com/

{"success":true}`))
        .toEqual({
          status: 201,
          statusText: 'Created',
          headers: {'Location': 'https://www.example.com/'},
          body: `{"success":true}`
        });
    });

    test('single headers; multiline body', () => {
      expect(HMN.parse(`HTTP/1.1 201 Created
Location: https://www.example.com/

{
  "success": true
}
`))
        .toEqual({
          status: 201,
          statusText: 'Created',
          headers: {'Location': 'https://www.example.com/'},
          body: `{\n  "success": true\n}\n`
        });
    });

    test('multiple headers; no body', () => {
      expect(HMN.parse(`HTTP/1.1 204 No Content
Allow: GET, HEAD, OPTIONS
Content-Type: application/json; charset=utf-8`))
        .toEqual({
          status: 204,
          statusText: 'No Content',
          headers: {
            'Allow': 'GET, HEAD, OPTIONS',
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
    });

    test('multiple headers; uniline body', () => {
      expect(HMN.parse(`HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Expires: -1

{"answer":42}`))
        .toEqual({
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Expires': '-1'
          },
          body: `{"answer":42}`
        });
    });

    test('multiple headers; multiline body', () => {
      expect(HMN.parse(`HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Expires: -1

{
  "answer": 42,
  "sweet": true
}
`))
        .toEqual({
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Expires': '-1'
          },
          body: `{\n  "answer": 42,\n  "sweet": true\n}\n`
        });
    });

    test('body with blank lines', () => {
      expect(HMN.parse(`HTTP/1.1 500 Internal Server Error

OOPS!

Something terrible happened.

Please try again later.`))
        .toEqual({
          status: 500,
          statusText: 'Internal Server Error',
          body: `OOPS!\n\nSomething terrible happened.\n\nPlease try again later.`
        });
    });
  });
});

describe('stringify', () => {
  describe('request', () => {
    test('no headers; no body', () => {
      expect(HMN.stringify({method: 'GET', url: 'https://www.example.com/'}))
        .toEqual(`GET https://www.example.com/ HTTP/1.1\r\n\r\n`);
    });

    test('no headers; yes body', () => {
      expect(HMN.stringify({method: 'POST', url: 'https://www.example.com/', body: `{"success":true}`}))
        .toEqual(`POST https://www.example.com/ HTTP/1.1\r\n\r\n{"success":true}`);
    });

    test('yes headers; no body', () => {
      expect(HMN.stringify({method: 'GET', url: 'https://www.example.com/', headers: {'Accept': '*/*'}}))
        .toEqual(`GET https://www.example.com/ HTTP/1.1\r\nAccept: */*\r\n\r\n`);
    });

    test('yes headers; yes body', () => {
      expect(HMN.stringify({
        method: 'POST',
        url: 'https://www.example.com/',
        headers: {'Accept': '*/*', 'Content-Type': 'application/json'},
        body: `{\n  "success": true\n}\n`
      }))
        .toEqual(`POST https://www.example.com/ HTTP/1.1\r\nAccept: */*\r\nContent-Type: application/json\r\n\r\n{\n  "success": true\n}\n`);
    });
  });

  describe('response', () => {
    test('no headers; no body', () => {
      expect(HMN.stringify({status: 204, statusText: 'No Content'}))
        .toEqual(`HTTP/1.1 204 No Content\r\n\r\n`);
    });

    test('no headers; yes body', () => {
      expect(HMN.stringify({status: 200, statusText: 'OK', body: 'Success'}))
        .toEqual(`HTTP/1.1 200 OK\r\n\r\nSuccess`);
    });
    test('yes headers; no body', () => {
      expect(HMN.stringify({
        status: 201,
        statusText: 'Created',
        headers: {'Location': 'https://www.example.com/persons/42'}
      }))
        .toEqual(`HTTP/1.1 201 Created\r\nLocation: https://www.example.com/persons/42\r\n\r\n`);
    });

    test('yes headers; yes body', () => {
      expect(HMN.stringify({
        status: 404,
        statusText: 'Not Found',
        headers: {'Allow': 'HEAD', 'Content-Type': 'text/plain'},
        body: 'Move along\nMove along'
      }))
        .toEqual(`HTTP/1.1 404 Not Found\r\nAllow: HEAD\r\nContent-Type: text/plain\r\n\r\nMove along\nMove along`);
    });
  });
});