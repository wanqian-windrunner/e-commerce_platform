import { randomBytes } from "node:crypto";

export function generateOrderNumber(): string{
  const randomPart = randomBytes(6).toString("base64url").toUpperCase();

  return `ORD-${randomPart}`;
};
