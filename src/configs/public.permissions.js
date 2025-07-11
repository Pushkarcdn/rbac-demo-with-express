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
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/roles",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/roles/:id",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/permissions",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/permissions/:id",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/role-permissions",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/role-permissions/:id",
  },
  {
    methods: ["GET"],
    route: "/api/set-dummy-data",
  },
];
