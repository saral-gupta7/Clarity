export const navItems = (isAuthenticated: boolean) => [
  { title: "About", key: "about" },
  ...(isAuthenticated ? [{ title: "Dashboard", key: "dashboard" }] : []),
  { title: "Create", key: "/admin/create" },
];
