export const requireAuth = (to, from, next) => {
    if (!store.getters['auth/isAuthenticated']) {
      next({ 
        path: '/login', 
        query: { redirect: to.fullPath } 
      });
    } else {
      next();
    }
  };
  
  export const requireAdmin = (to, from, next) => {
    if (!store.getters['auth/isAdmin']) {
      next({ path: '/' });
    } else {
      next();
    }
  };