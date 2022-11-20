import { jest } from '@jest/globals';

class TestRequest {
  body = {};
  query = {};
  params = {};
  cookies = {};
  user = {};
}

class TestResponse {
  json = jest.fn();

  status = jest.fn(() => this);
  cookie = jest.fn(() => this);
}

export { TestRequest, TestResponse };
