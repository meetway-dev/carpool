async function parseErrorBody(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string } | null;
    return body?.error ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export async function fetchApi<T>(
  input: string,
  options?: RequestInit & { signal?: AbortSignal },
): Promise<T> {
  const { signal, ...fetchOptions } = options ?? {};

  let response: Response;
  try {
    response = await fetch(input, { ...fetchOptions, signal });
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Network error. Please check your connection and try again.");
    }
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
  }

  if (!response.ok) {
    const message = await parseErrorBody(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getApi<T>(url: string, signal?: AbortSignal): Promise<T> {
  return fetchApi<T>(url, { method: "GET", signal });
}

export async function postApi<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return fetchApi<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
}

export async function putApi<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return fetchApi<T>(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
}

export async function deleteApi<T>(url: string, signal?: AbortSignal): Promise<T> {
  return fetchApi<T>(url, { method: "DELETE", signal });
}
