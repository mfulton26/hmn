# HMN
HTTP Message Notation parser/stringifier

`HMN` is to HTTP Messages as `JSON` is to JavaScript Objects.

See [RFC 2616 - Hypertext Transfer Protocol -- HTTP/1.1](https://tools.ietf.org/html/rfc2616).

## `parse(text)`

Takes a string and returns an object with the meaningful message properties extracted.

```js
HMN.parse(`GET https://www.npmjs.com/ HTTP/1.1`);
// {method: 'GET', url: 'https://www.npmjs.com/'}
```

```js
HMN.parse(`HTTP/1.1 200 OK`);
// {status: 200, statusText: 'OK'}
```

```js
HMN.parse(`POST /persons
Content-Type: application/json; charset=utf-8

{"name": "Adam"}`);
/* {
  method: 'POST',
  url: '/persons',
  headers: {'Content-Type': 'application/json; charset=utf-8'},
  body: '{"name": "Adam"}'
} */
```

```js
HMN.parse(`HTTP/1.1 500 Internal Server Error
Content-Type: text/plain

Oops!`);
/* {
  status: 500,
  statusText: 'Internal Server Error',
  headers: {'Content-Type': 'text/plain'},
  body: 'Oops!'
} */
```

## `stringify(message)`

Takes a message object (see the properties returned by `parse`) and converts it to an HTTP Message Notation string.

```js
HMN.stringify({method: 'GET', url: 'https://www.npmjs.com/'});
/*
GET https://www.npmjs.com/ HTTP/1.1


*/
```

```js
HMN.stringify({status: 200, statusText: 'OK'});
/*
HTTP/1.1 200 OK


*/
```

```js
HMN.stringify({
  method: 'POST',
  url: '/persons',
  headers: {'Content-Type': 'application/json; charset=utf-8'},
  body: '{"name": "Adam"}'
});
/*
POST /persons
Content-Type: application/json; charset=utf-8

{"name": "Adam"}
*/
```

```js
HMN.stringify({
  status: 500,
  statusText: 'Internal Server Error',
  headers: {'Content-Type': 'text/plain'},
  body: 'Oops!'
});
/*
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain

Oops!
*/
```