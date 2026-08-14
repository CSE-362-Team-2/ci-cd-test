## GET /api/posts

### Request Headers
None required.

### Success Response
HTTP 200
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

### Server Failure
HTTP 500
```json
{
  "errCode": 110,
  "errMsg": "Failed to fetch posts"
}
```

## GET /api/posts/:id

### Path Parameters
| Param | Type     | Required | Description                  |
| :---- | :------- | :------- | :---------------------------- |
| `id`  | `number` | **Yes**  | The ID of the post to fetch. |

### Success Response
HTTP 200
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

### Missing ID
HTTP 400
```json
{
  "errCode": 111,
  "errMsg": "`id` is required for this request"
}
```

### Invalid ID
HTTP 400
```json
{
  "errCode": 112,
  "errMsg": "`id` must be a valid positive number"
}
```

### Not Found
HTTP 404
```json
{
  "errCode": 113,
  "errMsg": "Post not found"
}
```

### Server Failure
HTTP 500
```json
{
  "errCode": 110,
  "errMsg": "Failed to fetch post"
}
```