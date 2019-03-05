const JSONP = {
  newGuid: function() {
    return new Date().getTime().toString() + Math.floor(Math.random() * 1000000);
  },

  encode: function(str) {
    return encodeURIComponent(str);
  },

  injectScript: function(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.addEventListener('load', resolve);
      script.addEventListener('error', () => reject('Error loading script.'));
      script.addEventListener('abort', () => reject('Script loading aborted.'));
      document.head.appendChild(script);
    });
  },

  post: function(url, params, callback) {
    // let query = (url).includes('?') ? '&' : '?';
    console.log('url, params, callback', url, params, callback);
    let query = '?';

    const uniqueName = `callback_json${this.newGuid()}`;

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        query += `${this.encode(key)}=${this.encode(params[key])}&`;
      }
    }

    window[uniqueName] = function(data) {
      callback(data);
      try {
        delete window[uniqueName];
      } catch (error) {}
      window[uniqueName] = null;
    };

    this.injectScript(`${url}${query}`)
      .then(() => {})
      .catch(error => {});

    return uniqueName;
  },
};

export default JSONP;
