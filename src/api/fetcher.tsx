const API_URL = import.meta.env.VITE_APP_API_URL;

export const apiFetch = async (
    url: string,
    getToken: () => Promise<string | null>,
    options: RequestInit = {}
) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}${url}`, {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token} `,
        ...(options.headers || {}),
        },
        ...options,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const message = data?.detail || data?.message || "Request failed";
        throw new Error(message);
    }

    return data;
};