import { apiFetch } from "./fetcher";

export interface InviteMemberPayload {
  email: string;
  organization_id: string;
  role?: string;
}

export interface RemoveMemberPayload {
  user_id: string;
}

export const inviteMemberApi = (
  payload: InviteMemberPayload,
  getToken: () => Promise<string | null>
) => {
  return apiFetch("/auth/invite-member", getToken, {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      role: payload.role || "org:member",
    }),
  });
};

export const removeMemberApi = (
  payload: RemoveMemberPayload,
  getToken: () => Promise<string | null>
) => {
  return apiFetch("/auth/remove-member", getToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
