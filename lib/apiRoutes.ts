export const API_ROUTES = {
  BASE_URL: "https://dark-caldron-448714-u5.appspot.com/",
  // Auth endpoints
  LOGIN: "https://dark-caldron-448714-u5.appspot.com/qwesi/login",
  SIGNUP: "https://dark-caldron-448714-u5.appspot.com/qwesi/signup",
  USER_DETAILS: "https://dark-caldron-448714-u5.appspot.com/qwesi-details",
  EDIT_PROFILE: "https://dark-caldron-448714-u5.appspot.com/qwesi-edit-profile",

  // Dashboard endpoints
  DASHBOARD_SUMMARY:
    "https://dark-caldron-448714-u5.appspot.com/QwesiDashbaordSummary/",

  // Subscription endpoints
  CREATE_CHECKOUT_SESSION:
    "https://dark-caldron-448714-u5.appspot.com/api/create-checkout-session",
  CANCEL_SUBSCRIPTION:
    "https://dark-caldron-448714-u5.appspot.com/api/cancel-subscription",

  // Registration endpoints
  REGISTER_ON_PAGE: "https://dark-caldron-448714-u5.appspot.com/register-on-page",

  JOBS: "https://dark-caldron-448714-u5.appspot.com/job",

  SUBMISSIONS: "https://dark-caldron-448714-u5.uc.r.appspot.com/pitch",
} as const;

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES];
