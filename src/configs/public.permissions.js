export default [
  {
    methods: ["GET"],
    route: "/",
  },
  {
    methods: ["GET"],
    route: "/favicon.ico",
  },
  {
    methods: ["GET"],
    route: "/api/auth/reset-superadmin",
  },
  {
    methods: ["POST"],
    route: "/api/auth/register",
  },
  {
    methods: ["POST"],
    route: "/api/auth/login",
  },
  {
    methods: ["GET"],
    route: "/api/auth/logout",
  },
  // {
  //   methods: ["GET"],
  //   route: "/api/auth/me",
  // },
];
