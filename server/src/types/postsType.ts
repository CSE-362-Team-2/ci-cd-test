import z from "zod";

export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: Date;
  updated_at: Date;
};

export const postCreateReqSchema = z.object({
  title: z.string("105;`title` needs to be of type string").trim()
    .min(1, "100;`title` is required to be at least one character long"),
  content: z.string("106;`content` needs to be of type string").trim()
    .min(1, "107;`content` is required to be at least one character long"),
  author: z.string("108;`author` needs to be of type string").trim()
    .min(1, "102;`author` is required to be at least one character long"),
});
