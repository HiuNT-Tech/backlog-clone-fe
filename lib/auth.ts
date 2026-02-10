import { AuthService } from './apis/auth';

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
