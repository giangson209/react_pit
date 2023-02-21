export const Routers = {
  HOME: "/",
  WORKS: "/works",
  PROJECTS: "/works/projects",
  INSPRIRATION: "/works/inspriration",
  SERVICES: "/services",
  STUDIO: "/studio",
  CONTACT: "/contact",

  PROJECT_DETAIL(id: string | number) {
    return "/works/projects/detail/" + id;
  },
};
