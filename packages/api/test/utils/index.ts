import { env } from "@director_v2/env/server";

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
        propsToDelete
      );
    }
    return copy;
  }
  return obj;
};

/**
 * Get authentication token from director login endpoint
 */
export const getAuthToken = async (): Promise<string> => {
  const res = await fetch(new URL("/device/login", env.DIRECTOR_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: env.DIRECTOR_TEST_USER_EMAIL,
      password: env.DIRECTOR_TEST_USER_PASSWORD,
    }),
  });

  try {
    const data = (await res.json()) as { response: { access_token: string } };
    return data.response.access_token;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.log(
      "Make sure the director_web container is started, or `docker restart director_web`/`dev-run-with-v2.sh` in director"
    );
    throw error;
  }
};
