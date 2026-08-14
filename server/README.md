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
  "success": true,
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
  "success": false,
  "error": "Title, content, and author are required"
}
```

3. Server Failure (`500 Internal Server Error`)

```json
{
  "success": false,
  "error": "Failed to create pospt"
}
```
