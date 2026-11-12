const WELCOME_SEEN_KEY = 'datadash.welcomeSeen';

/** True once the welcome dialog has been answered or closed in this browser. */
export function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(WELCOME_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_SEEN_KEY, 'true');
  } catch {
    /* Storage unavailable: the dialog may show again next visit, which is harmless. */
  }
}
