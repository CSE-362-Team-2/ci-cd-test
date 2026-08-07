# General API contract

The following are the rules that will generally apply to all the API endpoints
(unless explicitly stated otherwise):

- For any string input, the leading and trailing whitespace will get trimmed.
- If API request requires a JSON payload, the request must set `Content-Type`
to `application/json`
- API requests for protected API endpoints will need to have valid
authorization cookie associated with it. (For browsers, the frontend JavaScript
won't have to do anything for this as it will be handled by the server and the
browser using an HTTPS-only cookie) 

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
`firstName` and `lastName` can be non-unique.

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
- Any leading or trailing whitespace in the `password` field won't get trimmed off.

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


# Create draft Post

## Request

`POST /api/v1/create-post`

Example JSON request:
```json
{
  "title": "This is a sample post title",
  "body": "This is a sample post body.\nHello, world!\nBye!!!",
}
```

Acceptance criteria:

- `title` must be at least one character (UTF-8) long.
- `body` is optional. It can also be an empty string.

## Ok Response

HTTP 201

Example successful JSON response:
```json
{
  "postId": "pjfsk242kj42jjl",
}
```

## Err Response

HTTP 400

Example failed JSON response:
```json
{
  "respCode": 103,
  "respMsg": "Title must be at least one character long"
}
```

# Update draft Post

## Request

`PATCH /api/v1/update-draft-post`

Example JSON request:
```json
{
  "postId": "pjfsk242kj42jjl",
  "title": "This is an undate title...",
  "body": "Updated body...",
}
```

Acceptance criteria:

- `title` must be at least one character (UTF-8) long.
- `body` is optional. It can also be an empty string.
- Both `title` and `body` can be omitted if you don't want to modify the original title or body.
- To set the body to a blank string, the `body` field should be set to an empty string ("");

## Ok Response

HTTP 201

Example successful JSON response:
```json
{
  "postId": "pjfsk242kj42jjl",
}
```

## Err Response

HTTP 400

Example failed JSON response:
```json
{
  "respCode": 103,
  "respMsg": "Title must be at least one character long"
}
```

# Attach file(s) to (draft/published) post

## Request

`POST /api/v1/upload-attachment/:postId`

Example `POST` request:
`POST /api/v1/upload-attachment/pjfsk242kj42jjl`

Acceptance criteria:

- `postId` must be a valid postId of the current user.
- `Content-Type` must be set to `multipart/form-data` and the file should be encoded as so.
- The size must be set properly for the file and there is max file size limit of `512MiB`.

## Ok Response

HTTP 201

Example successful JSON response:
```json
{
  "postId": "pjfsk242kj42jjl",
  "fileId": "fjkjlafjlk22k"
}
```

## Err Response

HTTP 400

Example failed JSON response:
```json
{
  "respCode": 104,
  "respMsg": "Invalid postId provided"
}
```

# Publish draft Post

## Request

`POST /api/v1/publish-post`

Example JSON request:
```json
{
  "postId": "pjfsk242kj42jjl"
}
```

Acceptance criteria:

- `postId` must be valid postId of the current user.

## Ok Response

HTTP 200

## Err Response

HTTP 400

Example failed JSON response:
```json
{
  "respCode": 105,
  "respMsg": "Invalid postId provided"
}
```

# Remove attachment from a (draft/published) post

## Request

`POST /api/v1/remove-attachment`

Example `JSON` request:
```json
{
  "postId": "pjfsk242kj42jjl",
  "fileId": "fjkjlafjlk22k"
}
```

Acceptance criteria:

- `postId` must be a valid postId of the current user.
- `fileId` must be a valid fileId of a post that was created by the current user.

## Ok Response

HTTP 201

Example successful JSON response:
```json
{
  "postId": "pjfsk242kj42jjl",
}
```

## Err Response

HTTP 400

Example failed JSON response:
```json
{
  "respCode": 104,
  "respMsg": "Invalid postId provided"
}
```

# Delete (draft and published) post

## Request

`DELETE /api/v1/delete-post`

Example JSON request:
```json
{
  "postId": "pjfsk242kj42jjl"
}
```

Acceptance criteria:

- `postId` must be valid postId of the current user.

## Ok Response

HTTP 204

## Err Response

HTTP 404

Example failed JSON response:
```json
{
  "respCode": 106,
  "respMsg": "File not found in the post"
}
