// src/hooks/useInviteMember.ts
import { inviteMemberApi, InviteMemberPayload, removeMemberApi, RemoveMemberPayload } from "@/api/inviteMemberApi";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { toast } from "sonner"; // hoặc react-toastify, tùy bạn dùng

export const useInviteMember = (onSuccess?: () => void) => {
    const [isInviting, setIsInviting] = useState(false);
    const { getToken } = useAuth();

    const inviteMember = async (payload: InviteMemberPayload) => {
        if (!payload.email) {
            toast.error("Email is required");
            return;
        }
        try {
            setIsInviting(true);
            await inviteMemberApi(payload, getToken);
            toast.success(`Invitation sent to ${payload.email}`);
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to send invitation");
        } finally {
            setIsInviting(false);
        }
    };

    const removeMember = async (payload: RemoveMemberPayload) => {
        if (!payload.user_id) {
            toast.error("Member ID is required");
            return;
        }
        try {
            setIsInviting(true); 
            await removeMemberApi(payload,  getToken);  
            onSuccess?.(); 
        } catch (error: any) {
            toast.error(error?.message || "Failed to remove member");
        } finally {
            setIsInviting(false);
        }
    };

    return {
        inviteMember,
        removeMember,
        isInviting,
    };
};
