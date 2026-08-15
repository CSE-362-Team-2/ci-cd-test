# CRUD API Documentation

## POST /api/posts

### Request Headers

| Header         | Type     | Value              | Required |
| :------------- | :------- | :----------------- | :------- |
| `Content-Type` | `string` | `application/json` | Yes      |

### Request Body Schema

| Field     | Type     | Required | Description                                |
| :-------- | :------- | :------- | :----------------------------------------- |
| `title`   | `string` | **Yes**  | The title of the post.                     |
| `content` | `string` | **Yes**  | The main body text or content of the post. |
| `author`  | `string` | **Yes**  | The author of the post.                    |

### Example Request Body

```json
{
  "title": "Welcome to the Forum!",
  "content": "This is my very first post on this forum.",
  "author": "John"
}
```

### Example Response

1. Success (`201 Created`)

```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "title": "Welcome to the Forum!",
    "content": "This is my very first post on this forum.",
    "author": "John",
    "created_at": "2026-08-14T14:30:58.231Z",
    "updated_at": "2026-08-14T14:30:58.231Z"
  }
}
```

2. Validation Failure (`400 Bad Request`)

```json
{
  "errCode": 100,
  "errMsg": "Title is required"
}
```

```json
{
  "errCode": 101,
  "errMsg": "Content is required"
}
```

```json
{
  "errCode": 102,
  "errMsg": "Author is required"
}
```

5. Server Failure (`500 Internal Server Error`)

```json
{
  "errCode": 104,
  "errMsg": "Failed to create post due to internal server error"
}
```

## GET /api/posts

### Request Headers

None required.

### Example Response

1. Success (`200 OK`)

```json
{
  "posts": [
    {
      "id": 1,
      "title": "Welcome to the Forum!",
      "content": "This is my very first post on this forum.",
      "author": "John",
      "created_at": "2026-08-14T14:30:58.231Z",
      "updated_at": "2026-08-14T14:30:58.231Z"
    }
  ],
  "count": 1
}
```

2. Server Failure (`500 Internal Server Error`)

```json
{
  "errCode": 110,
  "errMsg": "Failed to fetch posts"
}
```

## DELETE /api/posts/:id

### Path Parameters

| Param | Type     | Required | Description                  |
| :---- | :------- | :------- | :---------------------------- |
| `id`  | `string` | **Yes**  | The ID of the post to delete. |

### Example Request

`DELETE /api/posts/1`

### Example Response

1. Success (`200 OK`)

```json
{
  "id": "1"
}
```

2. Missing ID (`400 Bad Request`)

```json
{
  "errCode": 130,
  "errMsg": "`id` is required for this request"
}
```

3. Server Failure (`500 Internal Server Error`)

```json
{
  "errCode": 131,
  "errMsg": "Failed to delete post"
}
```

## GET /api/posts/:id

### Path Parameters

| Param | Type     | Required | Description                   |
| :---- | :------- | :------- | :----------------------------- |
| `id`  | `number` | **Yes**  | The ID of the post to fetch.  |

### Example Response

1. Success (`200 OK`)

```json
{
  "post": {
    "id": 1,
    "title": "Welcome to the Forum!",
    "content": "This is my very first post on this forum.",
    "author": "John",
    "created_at": "2026-08-14T14:30:58.231Z",
    "updated_at": "2026-08-14T14:30:58.231Z"
  }
}
```

2. Missing ID (`400 Bad Request`)

```json
{
  "errCode": 111,
  "errMsg": "`id` is required for this request"
}
```

3. Invalid ID (`400 Bad Request`)

```json
{
  "errCode": 112,
  "errMsg": "`id` must be a valid positive number"
}
```

4. Not Found (`404 Not Found`)

```json
{
  "errCode": 113,
  "errMsg": "Post not found"
}
```

5. Server Failure (`500 Internal Server Error`)

```json
{
  "errCode": 110,
  "errMsg": "Failed to fetch post"
}
```
