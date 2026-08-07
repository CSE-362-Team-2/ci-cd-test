# User Registration

## Request

`POST /api/v1/register`

Example JSON request:
```json
{
  "username": "john_doe",
  "email": "john_doe@email.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Acceptance criteria:
`username` has to be unique.
`email` has to be unique.
`password` has to be at least 8 characters long, have both upper and lowercase letter(s), have number(s).
`firstName` and `lastName` can be non-unique and any leading or trailing whitespace will get trimmed off.

## Ok Response

HTTP 201

## Err Response

HTTP 400

Example failed JSON response:
```json
{
  "respCode": 101,
  "respMsg": "Password must be at least 8 characters long."
}
```

# User Login

## Request

`POST /api/v1/login`

Example JSON request:
```json
{
  "username": "john_doe",
  "email": "john_doe@email.com",
  "password": "password123",
}
```

Acceptance criteria:

- Must provide username or email, and password.
- Any leading or trailing whitespace in `username` and `email` fields will get trimmed off.

## Ok Response

HTTP 200

An HTTPS-only authorization cookie will be set on the client.

Example successful JSON response:
```json
{
  "userId": "sjfalfj23kj2jl",
  "username": "john_doe",
  "email": "john_doe@email.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Err Response

HTTP 400

Example failed JSON response:
```json
{
  "respCode": 102,
  "respMsg": "Username and/or password does not match."
}
```
