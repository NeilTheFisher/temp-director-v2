/**
 * Delete properties that differ between API and RPC responses.
 * Recursively processes objects and arrays.
 * @param obj - The object or array to process
 * @param propsToDelete - Array of property names to delete
 */
export const deleteProps = (obj: unknown, propsToDelete: string[]): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deleteProps(item, propsToDelete));
  }
  if (obj !== null && typeof obj === "object") {
    const copy = { ...obj };
    propsToDelete.forEach((prop) => {
      delete (copy as Record<string, unknown>)[prop];
    });
    for (const key in copy) {
      (copy as Record<string, unknown>)[key] = deleteProps(
        (copy as Record<string, unknown>)[key],
        propsToDelete,
      );
    }
    return copy;
  }
  return obj;
};
