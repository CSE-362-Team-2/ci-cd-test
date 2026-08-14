# CRUD API Documentation

## POST /api/posts

### Request Headers

| Header         | Type     | Value              | Required |
| :------------- | :------- | :----------------- | :------- |
| `Content-Type` | `string` | `application/json` | Yes      |

### Request Body Schema

| Field     | Type     | Required | Description                                |
| :-------- | :------- | :------- | :----------------------------------------- |
| `title`   | `string` | **Yes**  | The title of the post (non-empty).         |
| `content` | `string` | **Yes**  | The main body text or content of the post. |
| `author`  | `string` | **Yes**  | The main body text or content of the post. |

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
  "errCode": 101,
  "errMsg": "Content is required"
}
```

3. Server Failure (`500 Internal Server Error`)

```json
{
  "errCode": 104,
  "errMsg": "Failed to create post due to internal server error"
}
```
