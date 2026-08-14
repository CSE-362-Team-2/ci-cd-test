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
  "errCode": 500,
  "errMsg": "Failed to fetch posts"
}
```

## GET /api/posts/:id
### Path Parameters
| Param | Type     | Required | Description                  |
| :---- | :------- | :------- | :---------------------------- |
| `id`  | `number` | **Yes**  | The ID of the post to fetch. |
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
  "errCode": 130,
  "errMsg": "`id` is required for this request"
}
```
3. Invalid ID (`400 Bad Request`)
```json
{
  "errCode": 132,
  "errMsg": "`id` must be a valid positive number"
}
```
4. Not Found (`404 Not Found`)
```json
{
  "errCode": 131,
  "errMsg": "Post not found"
}
```
5. Server Failure (`500 Internal Server Error`)
```json
{
  "errCode": 500,
  "errMsg": "Failed to fetch post"
}
```