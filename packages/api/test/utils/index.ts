import { env } from "@director_v2/config";

export { deleteProps } from "./deleteProps";

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
      "Make sure the director_web container is started, or `docker restart director_web`/`dev-run-with-v2.sh` in director",
    );
    throw error;
  }
};
