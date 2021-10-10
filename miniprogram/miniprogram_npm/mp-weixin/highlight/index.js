"use strict";
var e = require("./prism.min"),
  r = require("./config"),
  s = require("../parser"),
  t = function (e) {
    this.vm = e
  };
t.prototype.onParse = function (t, a) {
  if ("pre" == t.name) {
    for (var n = t.children.length; n-- && "code" != t.children[n].name;);
    if (-1 == n) return;
    var l = t.children[n],
      i = l.attrs.class || "";
    n = i.indexOf("language-"), -1 == n && (i = t.attrs.class || "", n = i.indexOf("language-")), -1 == n && (i = "language-text", n = i.indexOf("language-")), n += 9;
    for (var c = n; c < i.length && " " != i[c]; c++);
    var h = i.substring(n, c);
    if (l.children.length && "text" == l.children[0].type) {
      var g = l.children[0].text.replace(/&amp;/g, "&");
      if (e.languages[h] && (l.children = new s(this.vm).parse("<pre>" + e.highlight(g, e.languages[h], h).replace(/token /g, "hl-") + "</pre>")[0].children), t.attrs.class = "hl-pre", l.attrs.class = "hl-code", r.showLanguageName && t.children.push({
          name: "div",
          attrs: {
            class: "hl-language",
            style: "user-select:none"
          },
          children: [{
            type: "text",
            text: h
          }]
        }), r.copyByLongPress && (t.attrs.style += (t.attrs.style || "") + ";user-select:none", t.attrs["data-content"] = g, a.expose()), r.showLineNumber) {
        for (var p = g.split("\n").length, u = [], o = p; o--;) u.push({
          name: "span",
          attrs: {
            class: "span"
          }
        });
        t.children.push({
          name: "span",
          attrs: {
            class: "line-numbers-rows"
          },
          children: u
        })
      }
    }
  }
}, module.exports = t;