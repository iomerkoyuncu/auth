import cookie from './cookie';

const auth = {
  isLoggedIn() {
    const token = cookie.getCookie('Bearer');
    const user = localStorage.getItem('user');
    const permissions = localStorage.getItem('permissions');

    return !!user && !!token && !!permissions;
  },

};

export { auth };
