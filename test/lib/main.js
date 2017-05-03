// Generated by CoffeeScript 1.12.5
(function() {
  var BASEURL, BUTTON_CLASS, GITHUB_API_BASEURL, ICON_CLASS, ICON_CLASS_DEFAULT, Math, UUID, ceilPixel, createAnchor, createElement, createTextNode, decodeURIComponent, defer, document, encodeURIComponent, getFrameContentSize, jsonp, onEvent, onceEvent, onceScriptLoad, parseConfig, parseQueryString, render, renderAll, renderButton, renderCount, renderFrameContent, setFrameSize, stringifyQueryString;

  if (typeof window === "undefined") {
    return;
  }

  document = window.document;

  encodeURIComponent = window.encodeURIComponent;

  decodeURIComponent = window.decodeURIComponent;

  createElement = function(tag) {
    return document.createElement(tag);
  };

  createTextNode = function(text) {
    return document.createTextNode(text);
  };

  Math = window.Math;

  BASEURL = (/^http:/.test(document.location) ? "http" : "https") + "://buttons.github.io/";

  BUTTON_CLASS = "github-button";

  GITHUB_API_BASEURL = "https://api.github.com";

  ICON_CLASS = "octicon";

  ICON_CLASS_DEFAULT = ICON_CLASS + "-mark-github";

  UUID = "faa75404-3b97-5585-b449-4bc51338fbd1";

  stringifyQueryString = function(obj) {
    var name, params, value;
    params = [];
    for (name in obj) {
      value = obj[name];
      if (value != null) {
        params.push((encodeURIComponent(name)) + "=" + (encodeURIComponent(value)));
      }
    }
    return params.join("&");
  };

  parseQueryString = function(str) {
    var j, len, pair, params, ref, ref1;
    params = {};
    ref1 = str.split("&");
    for (j = 0, len = ref1.length; j < len; j++) {
      pair = ref1[j];
      if (!(pair !== "")) {
        continue;
      }
      ref = pair.split("=");
      if (ref[0] !== "") {
        params[decodeURIComponent(ref[0])] = decodeURIComponent(ref.slice(1).join("="));
      }
    }
    return params;
  };

  onEvent = function(target, eventName, func) {
    if (target.addEventListener) {
      target.addEventListener("" + eventName, func);
    } else {
      target.attachEvent("on" + eventName, func);
    }
  };

  onceEvent = function(target, eventName, func) {
    var callback;
    callback = function(event) {
      if (target.removeEventListener) {
        target.removeEventListener("" + eventName, callback);
      } else {
        target.detachEvent("on" + eventName, callback);
      }
      return func(event || window.event);
    };
    onEvent(target, eventName, callback);
  };

  onceScriptLoad = function(script, func) {
    var callback, token;
    token = 0;
    callback = function() {
      if (!token && (token = 1)) {
        func();
      }
    };
    onEvent(script, "load", callback);
    onEvent(script, "error", callback);
    onEvent(script, "readystatechange", function() {
      if (!/i/.test(script.readyState)) {
        callback();
      }
    });
  };

  defer = function(func) {
    var callback;
    if (/m/.test(document.readyState) || (!/g/.test(document.readyState) && !document.documentElement.doScroll)) {
      window.setTimeout(func);
    } else {
      if (document.addEventListener) {
        onceEvent(document, "DOMContentLoaded", func);
      } else {
        callback = function() {
          if (/m/.test(document.readyState)) {
            document.detachEvent("onreadystatechange", callback);
            func();
          }
        };
        document.attachEvent("onreadystatechange", callback);
      }
    }
  };

  jsonp = function(url, func) {
    var head, query, ref, script;
    script = createElement("script");
    script.async = true;
    ref = url.split("?");
    query = parseQueryString(ref.slice(1).join("?"));
    query.callback = "_";
    script.src = ref[0] + "?" + stringifyQueryString(query);
    window._ = function(json) {
      delete window._;
      func(json);
    };
    window._.$ = script;
    onEvent(script, "error", function() {
      delete window._;
    });
    if (script.readyState) {
      onEvent(script, "readystatechange", function() {
        if (script.readyState === "loaded" && script.children && script.readyState === "loading") {
          delete window._;
        }
      });
    }
    head = document.getElementsByTagName("head")[0];
    if ("[object Opera]" === {}.toString.call(window.opera)) {
      onEvent(document, "DOMContentLoaded", function() {
        head.appendChild(script);
      });
    } else {
      head.appendChild(script);
    }
  };

  ceilPixel = function(px) {
    var devicePixelRatio;
    devicePixelRatio = window.devicePixelRatio || 1;
    return (devicePixelRatio > 1 ? Math.ceil(Math.round(px * devicePixelRatio) / devicePixelRatio * 2) / 2 : Math.ceil(px)) || 0;
  };

  getFrameContentSize = function(iframe) {
    var body, boundingClientRect, contentDocument, height, html, width;
    contentDocument = iframe.contentWindow.document;
    html = contentDocument.documentElement;
    body = contentDocument.body;
    width = html.scrollWidth;
    height = html.scrollHeight;
    if (body.getBoundingClientRect) {
      body.style.display = "inline-block";
      boundingClientRect = body.getBoundingClientRect();
      width = Math.max(width, ceilPixel(boundingClientRect.width || boundingClientRect.right - boundingClientRect.left));
      height = Math.max(height, ceilPixel(boundingClientRect.height || boundingClientRect.bottom - boundingClientRect.top));
      body.style.display = "";
    }
    return [width, height];
  };

  setFrameSize = function(iframe, size) {
    iframe.style.width = size[0] + "px";
    iframe.style.height = size[1] + "px";
  };

  parseConfig = function(anchor) {
    var attribute, config, j, len, ref1;
    config = {
      "href": anchor.href,
      "aria-label": anchor.getAttribute("aria-label")
    };
    ref1 = ["text", "show-count", "style", "icon"];
    for (j = 0, len = ref1.length; j < len; j++) {
      attribute = ref1[j];
      attribute = "data-" + attribute;
      config[attribute] = anchor.getAttribute(attribute);
    }
    if (config["data-text"] == null) {
      config["data-text"] = anchor.textContent || anchor.innerText;
    }
    if (anchor.getAttribute("data-count-api")) {
      console && console.warn("GitHub Buttons deprecated `data-count-api`: use `data-show-count` instead. Please refer to https://github.com/ntkme/github-buttons for more info.");
      config["data-show-count"] = 1;
    }
    return config;
  };

  createAnchor = function(url, baseUrl) {
    var anchor, base, div, href, javascript;
    anchor = createElement("a");
    javascript = "javascript:";
    if ((anchor.href = baseUrl) && anchor.protocol !== javascript) {
      try {
        href = new URL(url, baseUrl).href;
        if (href == null) {
          throw href;
        }
        anchor.href = href;
      } catch (error) {
        base = document.getElementsByTagName("base")[0];
        base.href = baseUrl;
        anchor.href = url;
        div = createElement("div");
        div.innerHTML = anchor.outerHTML;
        anchor.href = div.lastChild.href;
        div = null;
        base.href = document.location.href;
        base.removeAttribute("href");
      }
    } else {
      anchor.href = url;
    }
    if (anchor.protocol === javascript || !/\.github\.com$/.test("." + anchor.hostname)) {
      anchor.href = "#";
      anchor.target = "_self";
    }
    if (/^https?:\/\/((gist\.)?github\.com\/[^\/?#]+\/[^\/?#]+\/archive\/|github\.com\/[^\/?#]+\/[^\/?#]+\/releases\/download\/|codeload\.github\.com\/)/.test(anchor.href)) {
      anchor.target = "_top";
    }
    return anchor;
  };

  renderButton = function(config) {
    var a, ariaLabel, i, span;
    a = createAnchor(config.href, null);
    a.className = "button";
    if (ariaLabel = config["aria-label"]) {
      a.setAttribute("aria-label", ariaLabel);
    }
    i = a.appendChild(createElement("i"));
    i.className = ICON_CLASS + " " + (config["data-icon"] || ICON_CLASS_DEFAULT);
    i.setAttribute("aria-hidden", "true");
    a.appendChild(createTextNode(" "));
    span = a.appendChild(createElement("span"));
    span.appendChild(createTextNode(config["data-text"] || ""));
    return document.body.appendChild(a);
  };

  renderCount = function(button) {
    var api, href, match, property;
    if (button.hostname !== "github.com") {
      return;
    }
    match = button.pathname.replace(/^(?!\/)/, "/").match(/^\/([^\/?#]+)(?:\/([^\/?#]+)(?:\/(?:(subscription)|(fork)|(issues)|([^\/?#]+)))?)?(?:[\/?#]|$)/);
    if (!(match && !match[6])) {
      return;
    }
    if (match[2]) {
      href = "/" + match[1] + "/" + match[2];
      api = "/repos" + href;
      if (match[3]) {
        property = "subscribers_count";
        href += "/watchers";
      } else if (match[4]) {
        property = "forks_count";
        href += "/network";
      } else if (match[5]) {
        property = "open_issues_count";
        href += "/issues";
      } else {
        property = "stargazers_count";
        href += "/stargazers";
      }
    } else {
      api = "/users/" + match[1];
      property = "followers";
      href = "/" + match[1] + "/" + property;
    }
    jsonp(GITHUB_API_BASEURL + api, function(json) {
      var a, data, span;
      if (json.meta.status === 200) {
        data = json.data[property];
        a = createAnchor(href, button.href);
        a.className = "count";
        a.setAttribute("aria-label", data + " " + (property.replace(/_count$/, "").replace("_", " ")) + " on GitHub");
        a.appendChild(createElement("b"));
        a.appendChild(createElement("i"));
        span = a.appendChild(createElement("span"));
        span.appendChild(createTextNode(("" + data).replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
        button.parentNode.insertBefore(a, button.nextSibling);
      }
    });
  };

  renderFrameContent = function(config) {
    var button;
    if (!config) {
      return;
    }
    document.body.className = config["data-style"] || "";
    button = renderButton(config);
    if (/^(true|1)$/i.test(config["data-show-count"])) {
      renderCount(button);
    }
  };

  render = function(targetNode, config) {
    var contentDocument, hash, iframe, name, onload, ref1, value;
    if (targetNode == null) {
      return renderAll();
    }
    if (config == null) {
      config = parseConfig(targetNode);
    }
    hash = "#" + stringifyQueryString(config);
    iframe = createElement("iframe");
    ref1 = {
      allowtransparency: true,
      scrolling: "no",
      frameBorder: 0
    };
    for (name in ref1) {
      value = ref1[name];
      iframe.setAttribute(name, value);
    }
    setFrameSize(iframe, [1, 0]);
    iframe.style.border = "none";
    iframe.src = "javascript:0";
    document.body.appendChild(iframe);
    onload = function() {
      var size;
      size = getFrameContentSize(iframe);
      iframe.parentNode.removeChild(iframe);
      onceEvent(iframe, "load", function() {
        setFrameSize(iframe, size);
      });
      iframe.src = BASEURL + "buttons.html" + hash;
      targetNode.parentNode.replaceChild(iframe, targetNode);
    };
    onceEvent(iframe, "load", function() {
      var callback;
      if (callback = iframe.contentWindow._) {
        onceScriptLoad(callback.$, onload);
      } else {
        onload();
      }
    });
    contentDocument = iframe.contentWindow.document;
    contentDocument.open().write("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>" + UUID + "</title><base><!--[if lte IE 6]></base><![endif]--><link rel=\"stylesheet\" href=\"" + BASEURL + "assets/css/buttons.css\"><script>document.location.hash = \"" + hash + "\";</script></head><body><script src=\"" + BASEURL + "buttons.js\"></script></body></html>");
    contentDocument.close();
  };

  renderAll = function() {
    var anchor, anchors, j, k, len, len1, ref1;
    anchors = [];
    if (document.querySelectorAll) {
      anchors = anchors.slice.call(document.querySelectorAll("a." + BUTTON_CLASS));
    } else {
      ref1 = document.getElementsByTagName("a");
      for (j = 0, len = ref1.length; j < len; j++) {
        anchor = ref1[j];
        if (~(" " + anchor.className + " ").replace(/[ \t\n\f\r]+/g, " ").indexOf(" " + BUTTON_CLASS + " ")) {
          anchors.push(anchor);
        }
      }
    }
    for (k = 0, len1 = anchors.length; k < len1; k++) {
      anchor = anchors[k];
      render(anchor);
    }
  };

  if (typeof define === "function" && define.amd) {
    define([], {
      render: render
    });
  } else if (typeof exports === "object" && typeof exports.nodeName !== "string") {
    exports.render = render;
  } else {
    if (!{}.hasOwnProperty.call(document, "currentScript") && delete document.currentScript && document.currentScript) {
      BASEURL = document.currentScript.src.replace(/[^\/]*([?#].*)?$/, "");
    }
    if (document.title === UUID) {
      renderFrameContent(parseQueryString(document.location.hash.replace(/^#/, "")));
    } else {
      render();
    }
  }

  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
      var lastIndex, subjectString;
      subjectString = this.toString();
      if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }

  describe("QueryString", function() {
    describe("stringifyQueryString(obj)", function() {
      it("should stringify object when object is empty", function() {
        return expect(stringifyQueryString({})).to.equal("");
      });
      it("should not stringify object when key in object does not have value", function() {
        return expect(stringifyQueryString({
          test: null
        })).to.equal("");
      });
      it("should stringify object when key in object does have value", function() {
        expect(stringifyQueryString({
          hello: "world"
        })).to.equal("hello=world");
        expect(stringifyQueryString({
          hello: ""
        })).to.equal("hello=");
        return expect(stringifyQueryString({
          hello: false
        })).to.equal("hello=false");
      });
      return it("should stringify object", function() {
        return expect(stringifyQueryString({
          hello: "world",
          test: null
        })).to.equal("hello=world");
      });
    });
    return describe("parseQueryString(str)", function() {
      it("should parse string when string is empty", function() {
        return expect(parseQueryString("")).to.deep.equal({});
      });
      return it("should parse string", function() {
        return expect(parseQueryString("hello=world&test=")).to.deep.equal({
          hello: "world",
          test: ""
        });
      });
    });
  });

  describe("Event", function() {
    var input;
    input = null;
    beforeEach(function() {
      return input = document.body.appendChild(createElement("input"));
    });
    afterEach(function() {
      return input.parentNode.removeChild(input);
    });
    describe("onEvent(target, eventName, func)", function() {
      return it("should call the function on event", function() {
        var spy;
        spy = sinon.spy();
        onEvent(input, "click", spy);
        input.click();
        expect(spy).to.have.been.calledOnce;
        input.click();
        return expect(spy).to.have.been.calledTwice;
      });
    });
    return describe("onceEvent(target, eventName, func)", function() {
      return it("should call the function on event only once", function() {
        var spy;
        spy = sinon.spy();
        onceEvent(input, "click", spy);
        input.click();
        expect(spy).to.have.been.calledOnce;
        input.click();
        expect(spy).to.have.been.calledOnce;
        input.click();
        return expect(spy).to.have.been.calledOnce;
      });
    });
  });

  describe("ScriptEvent", function() {
    return describe("onceScriptLoad", function() {
      var head, script;
      head = document.getElementsByTagName("head")[0];
      script = null;
      beforeEach(function() {
        return script = createElement("script");
      });
      afterEach(function() {
        return script.parentNode.removeChild(script);
      });
      it("should call the function on script load only once", function(done) {
        script.src = "../buttons.js";
        onceScriptLoad(script, done);
        return head.appendChild(script);
      });
      return it("should call the function on script error only once", function(done) {
        script.src = "404.js";
        onceScriptLoad(script, done);
        return head.appendChild(script);
      });
    });
  });

  describe("Defer", function() {
    return describe("defer(func)", function() {
      return it("should call the function", function(done) {
        return defer(function() {
          return done();
        });
      });
    });
  });

  describe("JSON-P", function() {
    return describe("jsonp(url, func)", function() {
      var head;
      head = document.getElementsByTagName("head")[0];
      before(function() {
        return sinon.stub(head, "appendChild");
      });
      after(function() {
        return head.appendChild.restore();
      });
      return it("should setup the script and callback", function(done) {
        var data, url;
        data = {
          test: "test"
        };
        url = "/random/url/" + new Date().getTime();
        jsonp(url, function(json) {
          expect(window._).to.be.undefined;
          expect(json).to.deep.equal(data);
          return done();
        });
        expect(window._).to.be.a("function");
        expect(window._.$).to.have.property("tagName").to.equal("SCRIPT");
        expect(window._.$.src.endsWith(url + "?callback=_")).to.be["true"];
        expect(head.appendChild).to.have.been.calledOnce.and.have.been.calledWith(window._.$);
        return window._(data);
      });
    });
  });

  describe("Pixel", function() {
    return describe("ceilPixel(px)", function() {
      var devicePixelRatio;
      devicePixelRatio = window.devicePixelRatio;
      afterEach(function() {
        return window.devicePixelRatio = devicePixelRatio;
      });
      it("should ceil the pixel when devicePixelRatio is 1", function() {
        window.devicePixelRatio = 1;
        expect(ceilPixel(1)).to.equal(1);
        expect(ceilPixel(1.5)).to.equal(2);
        return expect(ceilPixel(1.25)).to.equal(2);
      });
      it("should ceil the pixel to 1/2 when devicePixelRatio is 2", function() {
        window.devicePixelRatio = 2;
        expect(ceilPixel(1)).to.equal(1);
        expect(ceilPixel(1.25)).to.equal(1.5);
        expect(ceilPixel(1.5)).to.equal(1.5);
        return expect(ceilPixel(1.75)).to.equal(2);
      });
      return it("should round the pixel to 1/3 then ceil the pixel to 1/2 when devicePixelRatio is 3", function() {
        window.devicePixelRatio = 3;
        expect(ceilPixel(1)).to.equal(1);
        expect(ceilPixel(1.16)).to.equal(1);
        expect(ceilPixel(1.17)).to.equal(1.5);
        expect(ceilPixel(1.25)).to.equal(1.5);
        expect(ceilPixel(1.33)).to.equal(1.5);
        expect(ceilPixel(1.34)).to.equal(1.5);
        expect(ceilPixel(1.5)).to.equal(2);
        expect(ceilPixel(1.66)).to.equal(2);
        expect(ceilPixel(1.67)).to.equal(2);
        expect(ceilPixel(1.75)).to.equal(2);
        expect(ceilPixel(1.83)).to.equal(2);
        expect(ceilPixel(1.84)).to.equal(2);
        return expect(ceilPixel(2)).to.equal(2);
      });
    });
  });

  describe("Frame", function() {
    var getRandomInt, html, iframe;
    iframe = null;
    getRandomInt = function(min, max) {
      if (min == null) {
        min = 0;
      }
      if (max == null) {
        max = 1000;
      }
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };
    html = function(size) {
      return "<!DOCTYPE html>\n<html lang=\"ja\">\n<head>\n  <meta charset=\"utf-8\">\n  <title></title>\n</head>\n<body style=\"margin: 0;\">\n  <div style=\"width: " + size[0] + "px; height: " + size[1] + "px;\"></div>\n</body>\n</html>";
    };
    beforeEach(function() {
      return iframe = document.body.appendChild(createElement("iframe"));
    });
    afterEach(function() {
      return iframe.parentNode.removeChild(iframe);
    });
    describe("getFrameContentSize(iframe)", function() {
      return it("should return iframe content size", function(done) {
        var contentDocument, size;
        size = [getRandomInt(), getRandomInt()];
        setFrameSize(iframe, [1, 0]);
        onEvent(iframe, "load", function() {
          expect(getFrameContentSize(iframe)).to.deep.equal(size);
          return done();
        });
        contentDocument = iframe.contentWindow.document;
        contentDocument.open().write(html(size));
        return contentDocument.close();
      });
    });
    return describe("setFrameSize(iframe, size)", function() {
      return it("should set width and height on iframe", function() {
        setFrameSize(iframe, [0, 0]);
        expect(iframe.scrollWidth).to.equal(0);
        expect(iframe.scrollHeight).to.equal(0);
        setFrameSize(iframe, [50, 100]);
        expect(iframe.scrollWidth).to.equal(50);
        return expect(iframe.scrollHeight).to.equal(100);
      });
    });
  });

  describe("Config", function() {
    var a;
    a = null;
    beforeEach(function() {
      return a = createElement("a");
    });
    return describe("parseConfig(anchor)", function() {
      it("should parse the anchor without attribute", function() {
        return expect(parseConfig(a)).to.deep.equal({
          "href": "",
          "data-text": "",
          "aria-label": null,
          "data-icon": null,
          "data-show-count": null,
          "data-style": null
        });
      });
      it("should parse the attribute href", function() {
        a.href = "https://buttons.github.io/";
        return expect(parseConfig(a)).to.have.property("href").and.equal(a.href);
      });
      it("should parse the attribute data-text", function() {
        var text;
        text = "test";
        a.setAttribute("data-text", text);
        return expect(parseConfig(a)).to.have.property("data-text").and.equal(text);
      });
      it("should parse the text content", function() {
        var text;
        text = "something";
        a.appendChild(createTextNode(text));
        return expect(parseConfig(a)).to.have.property("data-text").and.equal(text);
      });
      it("should ignore the text content when the attribute data-text is given", function() {
        var text;
        text = "something";
        a.setAttribute("data-text", text);
        a.appendChild(createTextNode("something else"));
        return expect(parseConfig(a)).to.have.property("data-text").and.equal(text);
      });
      it("should parse the attribute data-count-api for backward compatibility", function() {
        var api;
        api = "/repos/:user/:repo#item";
        a.setAttribute("data-count-api", api);
        return expect(parseConfig(a)).to.have.property("data-show-count");
      });
      it("should parse the attribute data-style", function() {
        var style;
        style = "mega";
        a.setAttribute("data-style", style);
        return expect(parseConfig(a)).to.have.property("data-style").and.equal(style);
      });
      return it("should parse the attribute data-icon", function() {
        var icon;
        icon = "octicon";
        a.setAttribute("data-icon", icon);
        return expect(parseConfig(a)).to.have.property("data-icon").and.equal(icon);
      });
    });
  });

  describe("Anchor", function() {
    var base;
    base = null;
    before(function() {
      return base = document.getElementsByTagName("head")[0].appendChild(createElement("base"));
    });
    after(function() {
      return base.parentNode.removeChild(base);
    });
    return describe("createAnchor(url, baseUrl)", function() {
      it("should create an anchor element", function() {
        return expect(createAnchor()).to.have.property("tagName").to.equal("A");
      });
      it("should create an anchor with given url", function() {
        var url;
        url = "https://github.com/";
        return expect(createAnchor(url)).to.have.property("href").to.equal(url);
      });
      it("should create an anchor with given relative url", function() {
        return expect(createAnchor("/ntkme/github-buttons", "https://github.com/ntkme")).to.have.property("href").to.equal("https://github.com/ntkme/github-buttons");
      });
      it("should create an anchor with given relative url without using new URL()", function() {
        sinon.stub(window, "URL").throws();
        expect(createAnchor("/ntkme/github-buttons", "https://github.com/ntkme")).to.have.property("href").to.equal("https://github.com/ntkme/github-buttons");
        if (typeof window.URL !== "function") {
          return;
        }
        return window.URL.restore();
      });
      it("should not set base href", function() {
        sinon.stub(window, "URL").throws();
        createAnchor("/ntkme/github-buttons", "https://github.com/ntkme");
        expect(base.getAttribute("href")).to.be["null"];
        if (typeof window.URL !== "function") {
          return;
        }
        return window.URL.restore();
      });
      it("should create an anchor with href # if domain is not github", function() {
        var anchor;
        anchor = createAnchor("https://twitter/ntkme");
        expect(anchor).to.have.property("href").to.equal(document.location.href + "#");
        return expect(anchor).to.have.property("target").to.equal("_self");
      });
      it("should create an anchor with href # if url contains javascript", function() {
        var anchor, j, len, protocol, ref1, results;
        ref1 = ["javascript:", "JAVASCRIPT:", "JavaScript:", " javascript:", "   javascript:", "\tjavascript:", "\njavascript:", "\rjavascript:", "\fjavascript:"];
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          protocol = ref1[j];
          anchor = createAnchor(protocol);
          expect(anchor).to.have.property("href").to.equal(document.location.href + "#");
          results.push(expect(anchor).to.have.property("target").to.equal("_self"));
        }
        return results;
      });
      return it("should create an anchor with target _top if url is a download link", function() {
        var j, len, ref1, results, url;
        ref1 = ["https://github.com/ntkme/github-buttons/archive/master.zip", "https://codeload.github.com/ntkme/github-buttons/zip/master", "https://github.com/octocat/Hello-World/releases/download/v1.0.0/example.zip"];
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          url = ref1[j];
          results.push(expect(createAnchor(url)).to.have.property("target").to.equal("_top"));
        }
        return results;
      });
    });
  });

  describe("Render", function() {
    var base;
    base = null;
    before(function() {
      return base = document.getElementsByTagName("head")[0].appendChild(createElement("base"));
    });
    after(function() {
      return base.parentNode.removeChild(base);
    });
    describe("renderButton(config)", function() {
      beforeEach(function() {
        return sinon.stub(document.body, "appendChild");
      });
      afterEach(function() {
        return document.body.appendChild.restore();
      });
      it("should append the button to document.body when the necessary config is given", function() {
        var button;
        renderButton({});
        expect(document.body.appendChild).to.have.been.calledOnce;
        button = document.body.appendChild.args[0][0];
        return expect(button).to.have.property("className").and.equal("button");
      });
      it("should append the button with given href", function() {
        var button, config;
        config = {
          "href": "https://ntkme.github.com/"
        };
        renderButton(config);
        button = document.body.appendChild.args[0][0];
        return expect(button.getAttribute("href")).to.equal(config.href);
      });
      it("should append the button with the default icon", function() {
        var button;
        renderButton({});
        button = document.body.appendChild.args[0][0];
        return expect((" " + button.firstChild.className + " ").indexOf(" " + ICON_CLASS_DEFAULT + " ")).to.be.at.least(0);
      });
      it("should append the button with given icon", function() {
        var button, config;
        config = {
          "data-icon": "octicon-star"
        };
        renderButton(config);
        button = document.body.appendChild.args[0][0];
        return expect((" " + button.firstChild.className + " ").indexOf(" " + config["data-icon"] + " ")).to.be.at.least(0);
      });
      it("should append the button with given text", function() {
        var button, config;
        config = {
          "data-text": "Follow"
        };
        renderButton(config);
        button = document.body.appendChild.args[0][0];
        return expect(button.lastChild.innerHTML).to.equal(config["data-text"]);
      });
      return it("should append the button with given aria label", function() {
        var button, config;
        config = {
          "aria-label": "GitHub"
        };
        renderButton(config);
        button = document.body.appendChild.args[0][0];
        return expect(button.getAttribute("aria-label")).to.equal(config["aria-label"]);
      });
    });
    describe("rednerCount(button)", function() {
      var REAL_GITHUB_API_BASEURL, button, head, real_jsonp, testRenderCount;
      button = null;
      head = document.getElementsByTagName("head")[0];
      REAL_GITHUB_API_BASEURL = GITHUB_API_BASEURL;
      real_jsonp = jsonp;
      beforeEach(function() {
        GITHUB_API_BASEURL = "./api.github.com";
        button = document.body.appendChild(createElement("a"));
        sinon.stub(document.body, "insertBefore");
        return jsonp = sinon.spy(jsonp);
      });
      afterEach(function() {
        GITHUB_API_BASEURL = REAL_GITHUB_API_BASEURL;
        button.parentNode.removeChild(button);
        document.body.insertBefore.restore();
        return jsonp = real_jsonp;
      });
      testRenderCount = function(url, func) {
        sinon.stub(head, "appendChild").callsFake(function() {
          var script;
          sinon.stub(window, "_").callsFake(function() {
            var args;
            args = window._.args[0];
            window._.restore();
            window._.apply(null, args);
            return func();
          });
          script = head.appendChild.args[0][0];
          head.appendChild.restore();
          return head.appendChild(script);
        });
        button.href = url;
        return renderCount(button);
      };
      it("should append the count when a known button type is given", function(done) {
        return testRenderCount("https://github.com/ntkme", function() {
          var count;
          expect(jsonp).to.have.been.calledOnce;
          expect(document.body.insertBefore).to.have.been.calledOnce;
          count = document.body.insertBefore.args[0][0];
          expect(count).to.have.property("className").and.equal("count");
          return done();
        });
      });
      it("should append the count for follow button", function(done) {
        return testRenderCount("https://github.com/ntkme", function() {
          var count;
          count = document.body.insertBefore.args[0][0];
          expect(jsonp.args[0][0]).to.equal(GITHUB_API_BASEURL + "/users/ntkme");
          expect(count.href).to.equal("https://github.com/ntkme/followers");
          expect(count.lastChild.innerHTML).to.equal("53");
          expect(count.getAttribute("aria-label")).to.equal("53 followers on GitHub");
          return done();
        });
      });
      it("should append the count for watch button", function(done) {
        return testRenderCount("https://github.com/ntkme/github-buttons/subscription", function() {
          var count;
          count = document.body.insertBefore.args[0][0];
          expect(jsonp.args[0][0]).to.equal(GITHUB_API_BASEURL + "/repos/ntkme/github-buttons");
          expect(count.href).to.equal("https://github.com/ntkme/github-buttons/watchers");
          expect(count.lastChild.innerHTML).to.equal("14");
          expect(count.getAttribute("aria-label")).to.equal("14 subscribers on GitHub");
          return done();
        });
      });
      it("should append the count for star button", function(done) {
        return testRenderCount("https://github.com/ntkme/github-buttons", function() {
          var count;
          count = document.body.insertBefore.args[0][0];
          expect(jsonp.args[0][0]).to.equal(GITHUB_API_BASEURL + "/repos/ntkme/github-buttons");
          expect(count.href).to.equal("https://github.com/ntkme/github-buttons/stargazers");
          expect(count.lastChild.innerHTML).to.equal("302");
          expect(count.getAttribute("aria-label")).to.equal("302 stargazers on GitHub");
          return done();
        });
      });
      it("should append the count for fork button", function(done) {
        return testRenderCount("https://github.com/ntkme/github-buttons/fork", function() {
          var count;
          count = document.body.insertBefore.args[0][0];
          expect(jsonp.args[0][0]).to.equal(GITHUB_API_BASEURL + "/repos/ntkme/github-buttons");
          expect(count.href).to.equal("https://github.com/ntkme/github-buttons/network");
          expect(count.lastChild.innerHTML).to.equal("42");
          expect(count.getAttribute("aria-label")).to.equal("42 forks on GitHub");
          return done();
        });
      });
      it("should append the count for issue button", function(done) {
        return testRenderCount("https://github.com/ntkme/github-buttons/issues", function() {
          var count;
          count = document.body.insertBefore.args[0][0];
          expect(jsonp.args[0][0]).to.equal(GITHUB_API_BASEURL + "/repos/ntkme/github-buttons");
          expect(count.href).to.equal("https://github.com/ntkme/github-buttons/issues");
          expect(count.lastChild.innerHTML).to.equal("1");
          expect(count.getAttribute("aria-label")).to.equal("1 open issues on GitHub");
          return done();
        });
      });
      it("should not append the count for unknown button type", function() {
        button.href = "https://github.com/";
        renderCount(button);
        expect(jsonp).to.have.not.been.called;
        return expect(document.body.insertBefore).to.have.not.been.called;
      });
      return it("should not append the count when it fails to pull api data", function() {
        sinon.stub(head, "appendChild").callsFake(function() {
          head.appendChild.restore();
          window._({
            meta: {
              status: 404
            }
          });
          return expect(document.body.insertBefore).to.have.not.been.called;
        });
        button.href = "https://github.com/ntkme";
        return renderCount(button);
      });
    });
    return describe("renderFrameContent(config)", function() {
      var _renderButton, _renderCount, className;
      className = document.body.className;
      _renderButton = renderButton;
      _renderCount = renderCount;
      before(function() {
        return sinon.stub(document.body, "appendChild");
      });
      after(function() {
        document.body.className = className;
        return document.body.appendChild.restore();
      });
      beforeEach(function() {
        renderButton = sinon.stub().returns(createElement("a"));
        return renderCount = sinon.stub();
      });
      afterEach(function() {
        renderButton = _renderButton;
        return renderCount = _renderCount;
      });
      it("should do nothing when config is missing", function() {
        renderFrameContent();
        return expect(document.body.appendChild).to.have.not.been.called;
      });
      it("should set document.body.className when data-style is given", function() {
        var config;
        config = {
          "data-style": "mega"
        };
        renderFrameContent(config);
        return expect(document.body.className).to.equal(config["data-style"]);
      });
      it("should call renderButton(config)", function() {
        renderFrameContent({});
        expect(renderButton).to.have.been.calledOnce;
        return expect(renderCount).to.have.not.been.called;
      });
      return it("should call renderCount(config) when data-show-count is true", function() {
        renderFrameContent({
          "data-show-count": true
        });
        expect(renderButton).to.have.been.calledOnce;
        return expect(renderCount).to.have.been.calledOnce;
      });
    });
  });

}).call(this);