const cookie = {
  getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length >= 2) return parts.pop().split(';').shift();
  },

  setCookie(name, value, days, dateType) {
    let expires = '';

    if (days && !dateType) {
      const date = this.convertDayToMiliSecond(days);
      expires = '; expires=' + date.toUTCString();
    } else if (days && dateType) {
      const date = new Date(days);
      expires = '; expires=' + date;
    }

    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  },

};

export default cookie;
