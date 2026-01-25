const en = {
  common: {
    add: 'Add',
    cancel: 'Cancel',
  },
  appBar: {
    title: {
      dashboard: 'Dashboard',
      project: 'Projects',
    },
    placeholder: {
      search: 'Search this Space',
    },
  },
  tooltip: {
    notification: 'Notification',
  },
  sidebar: {
    home: 'Home',
    addIssue: 'Add Issue',
    issue: 'Issue',
    board: 'Board',
  },
  toast: {
    success: {
      userVerified: 'User verified successfully',
    },
    error: {
      userVerificationFailed: 'User verification failed',
    },
  },
  column: {
    addNewCard: {
      popup: {
        title: 'Add new Card',
        placeholder: 'Enter card title',
      },
    },
  },
  auth: {
    login: {
      title: 'Login',
      emailLabel: 'Enter Email...',
      passwordLabel: 'Enter Password...',
      submitButton: 'Login',
      noAccount: 'New to Trello MERN Stack Advanced?',
      createAccount: 'Create account!',
      verifiedEmail:
        'Your email {{email}} has been verified. Now you can login to enjoy our services! Have a good day!',
      registeredEmail:
        'An email has been sent to {{email}}. Please check and verify your account before logging in!',
    },
    register: {
      title: 'Register',
      emailLabel: 'Enter Email...',
      passwordLabel: 'Enter Password...',
      confirmPasswordLabel: 'Enter Password Confirmation...',
      submitButton: 'Register',
      hasAccount: 'Already have an account?',
      loginLink: 'Log in!',
      pending: 'Registering...',
    },
    verification: {
      loading: 'Verifying your account...',
    },
    author: 'Author: TrungHieuDev',
  },
  notFound: {
    title: '404',
    message:
      "LOST IN SPACE {{author}}? Hmm, looks like that page doesn't exist.",
    goHome: 'Go Home',
  },
  validation: {
    fieldRequired: 'This field is required.',
    emailInvalid: 'Email is invalid. (example@trungquandev.com)',
    passwordRule:
      'Password must include at least 1 letter, a number, and at least 8 characters.',
    passwordConfirmation: 'Password Confirmation does not match!',
  },
};

export default en;
