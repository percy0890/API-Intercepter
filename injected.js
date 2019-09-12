const WHITELISTED_URLS = [
  "url",
];

(function (xhr) {

  var XHR = XMLHttpRequest.prototype;

  var open = XHR.open;
  var send = XHR.send;
  var setRequestHeader = XHR.setRequestHeader;

  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = (new Date()).toISOString();

    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function () {

    this.addEventListener('load', function () {

      var myUrl = this._url ? this._url.toLowerCase() : this._url;
      // if (myUrl && WHITELISTED_URLS.indexOf(myUrl) >= 0) { // enable it when you want to intercept the white listed urls only
      if (myUrl) {  // it will intercept all urls and download the response in data.json file

        if (this.responseType != 'blob' && this.responseText) {
          try {
            // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
            let json = this.responseText,
              blob = new Blob([json], { type: "octet/stream" }),
              url = window.URL.createObjectURL(blob);
              
            const fileName = 'data.json';
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url)

          } catch (err) {
            console.log("Error in responseType try catch", err);
          }
        }

      }
    });

    return send.apply(this, arguments);
  };

})(XMLHttpRequest);