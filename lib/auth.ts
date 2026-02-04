import { AuthService } from './apis/auth';

/**
 * Check if the user is authenticated by calling the backend API
 * This uses HTTP-only cookies for authentication
 */
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const result = await AuthService.checkAuth();
    return result.authenticated;
  } catch (error) {
    return false;
  }
}

/**
 * Logout the user by calling the backend logout endpoint
 * This will clear the HTTP-only cookies
 */
export async function logout(): Promise<void> {
  try {
    await AuthService.logout();
  } catch (error) {
    // Silently fail if logout fails
    console.error('Logout failed:', error);
  }
}
