import type { ZodObject } from "zod";
import type { ValidatedResType } from "../types/validatedResType.ts";

export function schemaValidator(schema: ZodObject, payload: any): ValidatedResType {
  let validatedData = schema.safeParse(payload);
  if (!validatedData.success) {
    // we might get multiple schema validation errors, but we only return the
    // first validation error
    const [errCode, errMsg] = validatedData.error.issues[0].message.split(";");

    return { errCode: parseInt(errCode), errMsg };
  }

  return { errCode: 0, data: validatedData };
}
