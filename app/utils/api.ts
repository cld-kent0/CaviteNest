// utils/api.ts (or whatever you prefer to name it)

export interface ResetPasswordResponse {
    success: boolean;
    error?: string;
  }
  
  export const resetPassword = async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        return { success: false, error: errorResponse.error || "Failed to reset password" };
      }
  
      return { success: true };
    } catch (error) {
      return { success: false, error: "An error occurred while resetting the password" };
    }
  };
  