/*
 * jQuery EasyTabs plugin 3.2.0
 *
 * Copyright (c) 2010-2011 Steve Schwartz (JangoSteve)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: Thu May 09 17:30:00 2013 -0500
 */


(function(a) {
	a.easytabs = function(j, e) {
		var f = this,
			q = a(j),
			i = {
				animate: true,
				panelActiveClass: "active",
				tabActiveClass: "active",
				defaultTab: "li:first-child",
				animationSpeed: "normal",
				tabs: "> ul > li",
				updateHash: true,
				cycle: false,
				collapsible: false,
				collapsedClass: "collapsed",
				collapsedByDefault: false,
				uiTabs: false,
				transitionIn: "fadeIn",
				transitionOut: "fadeOut",
				transitionInEasing: "swing",
				transitionOutEasing: "swing",
				transitionCollapse: false,
				transitionUncollapse: false,
				transitionCollapseEasing: false,
				transitionUncollapseEasing: false,
				containerClass: "",
				tabsClass: "",
				tabClass: "",
				panelClass: "",
				cache: true,
				event: "click",
				panelContext: q
			},
			h, l, v, m, d, t = {
				fast: 200,
				normal: 300,
				slow: 600
			},
			r;
		f.init = function() {
			f.settings = r = a.extend({}, i, e);
			r.bind_str = r.event + ".easytabs";
			if (r.uiTabs) {
				r.tabActiveClass = "ui-tabs-selected";
				r.containerClass = "ui-tabs ui-widget ui-widget-content ui-corner-all";
				r.tabsClass = "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all";
				r.tabClass = "ui-state-default ui-corner-top";
				r.panelClass = "ui-tabs-panel ui-widget-content ui-corner-bottom"
			}
			if (r.collapsible && e.defaultTab !== undefined && e.collpasedByDefault === undefined) {
				r.collapsedByDefault = false
			}
			if (typeof(r.animationSpeed) === "string") {
				r.animationSpeed = t[r.animationSpeed]
			}
			a("a.anchor").remove().prependTo("body");
			q.data("easytabs", {});
			f.setTransitions();
			f.getTabs();
			b();
			g();
			w();
			n();
			c();
			q.attr("data-easytabs", true)
		};
		f.setTransitions = function() {
			v = (r.animate) ? {
				show: r.transitionIn,
				hide: r.transitionOut,
				speed: r.animationSpeed,
				collapse: r.transitionCollapse,
				uncollapse: r.transitionUncollapse,
				halfSpeed: r.animationSpeed / 2
			} : {
				show: "show",
				hide: "hide",
				speed: 0,
				collapse: "hide",
				uncollapse: "show",
				halfSpeed: 0
			}
		};
		f.getTabs = function() {
			var x;
			f.tabs = q.find(r.tabs), f.panels = a(), f.tabs.each(function() {
				var A = a(this),
					z = A.children("a"),
					y = A.children("a").data("target");
				A.data("easytabs", {});
				if (y !== undefined && y !== null) {
					A.data("easytabs").ajax = z.attr("href")
				} else {
					y = z.attr("href")
				}
				y = y.match(/#([^\?]+)/)[1];
				x = r.panelContext.find("#" + y);
				if (x.length) {
					x.data("easytabs", {
						position: x.css("position"),
						visibility: x.css("visibility")
					});
					x.not(r.panelActiveClass).hide();
					f.panels = f.panels.add(x);
					A.data("easytabs").panel = x
				} else {
					f.tabs = f.tabs.not(A);
					if ("console" in window) {
						console.warn("Warning: tab without matching panel for selector '#" + y + "' removed from set")
					}
				}
			})
		};
		f.selectTab = function(x, C) {
			var y = window.location,
				B = y.hash.match(/^[^\?]*/)[0],
				z = x.parent().data("easytabs").panel,
				A = x.parent().data("easytabs").ajax;
			if (r.collapsible && !d && (x.hasClass(r.tabActiveClass) || x.hasClass(r.collapsedClass))) {
				f.toggleTabCollapse(x, z, A, C)
			} else {
				if (!x.hasClass(r.tabActiveClass) || !z.hasClass(r.panelActiveClass)) {
					o(x, z, A, C)
				} else {
					if (!r.cache) {
						o(x, z, A, C)
					}
				}
			}
		};
		f.toggleTabCollapse = function(x, y, z, A) {
			f.panels.stop(true, true);
			if (u(q, "easytabs:before", [x, y, r])) {
				f.tabs.filter("." + r.tabActiveClass).removeClass(r.tabActiveClass).children().removeClass(r.tabActiveClass);
				if (x.hasClass(r.collapsedClass)) {
					if (z && (!r.cache || !x.parent().data("easytabs").cached)) {
						q.trigger("easytabs:ajax:beforeSend", [x, y]);
						y.load(z, function(C, B, D) {
							x.parent().data("easytabs").cached = true;
							q.trigger("easytabs:ajax:complete", [x, y, C, B, D])
						})
					}
					x.parent().removeClass(r.collapsedClass).addClass(r.tabActiveClass).children().removeClass(r.collapsedClass).addClass(r.tabActiveClass);
					y.addClass(r.panelActiveClass)[v.uncollapse](v.speed, r.transitionUncollapseEasing, function() {
						q.trigger("easytabs:midTransition", [x, y, r]);
						if (typeof A == "function") {
							A()
						}
					})
				} else {
					x.addClass(r.collapsedClass).parent().addClass(r.collapsedClass);
					y.removeClass(r.panelActiveClass)[v.collapse](v.speed, r.transitionCollapseEasing, function() {
						q.trigger("easytabs:midTransition", [x, y, r]);
						if (typeof A == "function") {
							A()
						}
					})
				}
			}
		};
		f.matchTab = function(x) {
			return f.tabs.find("[href='" + x + "'],[data-target='" + x + "']").first()
		};
		f.matchInPanel = function(x) {
			return (x && f.validId(x) ? f.panels.filter(":has(" + x + ")").first() : [])
		};
		f.validId = function(x) {
			return x.substr(1).match(/^[A-Za-z]+[A-Za-z0-9\-_:\.].$/)
		};
		f.selectTabFromHashChange = function() {
			var y = window.location.hash.match(/^[^\?]*/)[0],
				x = f.matchTab(y),
				z;
			if (r.updateHash) {
				if (x.length) {
					d = true;
					f.selectTab(x)
				} else {
					z = f.matchInPanel(y);
					if (z.length) {
						y = "#" + z.attr("id");
						x = f.matchTab(y);
						d = true;
						f.selectTab(x)
					} else {
						if (!h.hasClass(r.tabActiveClass) && !r.cycle) {
							if (y === "" || f.matchTab(m).length || q.closest(y).length) {
								d = true;
								f.selectTab(l)
							}
						}
					}
				}
			}
		};
		f.cycleTabs = function(x) {
			if (r.cycle) {
				x = x % f.tabs.length;
				$tab = a(f.tabs[x]).children("a").first();
				d = true;
				f.selectTab($tab, function() {
					setTimeout(function() {
						f.cycleTabs(x + 1)
					}, r.cycle)
				})
			}
		};
		f.publicMethods = {
			select: function(x) {
				var y;
				if ((y = f.tabs.filter(x)).length === 0) {
					if ((y = f.tabs.find("a[href='" + x + "']")).length === 0) {
						if ((y = f.tabs.find("a" + x)).length === 0) {
							if ((y = f.tabs.find("[data-target='" + x + "']")).length === 0) {
								if ((y = f.tabs.find("a[href$='" + x + "']")).length === 0) {
									a.error("Tab '" + x + "' does not exist in tab set")
								}
							}
						}
					}
				} else {
					y = y.children("a").first()
				}
				f.selectTab(y)
			}
		};
		var u = function(A, x, z) {
			var y = a.Event(x);
			A.trigger(y, z);
			return y.result !== false
		};
		var b = function() {
			q.addClass(r.containerClass);
			f.tabs.parent().addClass(r.tabsClass);
			f.tabs.addClass(r.tabClass);
			f.panels.addClass(r.panelClass)
		};
		var g = function() {
			var y = window.location.hash.match(/^[^\?]*/)[0],
				x = f.matchTab(y).parent(),
				z;
			if (x.length === 1) {
				h = x;
				r.cycle = false
			} else {
				z = f.matchInPanel(y);
				if (z.length) {
					y = "#" + z.attr("id");
					h = f.matchTab(y).parent()
				} else {
					h = f.tabs.parent().find(r.defaultTab);
					if (h.length === 0) {
						a.error("The specified default tab ('" + r.defaultTab + "') could not be found in the tab set ('" + r.tabs + "') out of " + f.tabs.length + " tabs.")
					}
				}
			}
			l = h.children("a").first();
			p(x)
		};
		var p = function(z) {
			var y, x;
			if (r.collapsible && z.length === 0 && r.collapsedByDefault) {
				h.addClass(r.collapsedClass).children().addClass(r.collapsedClass)
			} else {
				y = a(h.data("easytabs").panel);
				x = h.data("easytabs").ajax;
				if (x && (!r.cache || !h.data("easytabs").cached)) {
					q.trigger("easytabs:ajax:beforeSend", [l, y]);
					y.load(x, function(B, A, C) {
						h.data("easytabs").cached = true;
						q.trigger("easytabs:ajax:complete", [l, y, B, A, C])
					})
				}
				h.data("easytabs").panel.show().addClass(r.panelActiveClass);
				h.addClass(r.tabActiveClass).children().addClass(r.tabActiveClass)
			}
			q.trigger("easytabs:initialised", [l, y])
		};
		var w = function() {
			f.tabs.children("a").bind(r.bind_str, function(x) {
				r.cycle = false;
				d = false;
				f.selectTab(a(this));
				x.preventDefault ? x.preventDefault() : x.returnValue = false
			})
		};
		var o = function(z, D, E, H) {
			f.panels.stop(true, true);
			if (u(q, "easytabs:before", [z, D, r])) {
				var A = f.panels.filter(":visible"),
					y = D.parent(),
					F, x, C, G, B = window.location.hash.match(/^[^\?]*/)[0];
				if (r.animate) {
					F = s(D);
					x = A.length ? k(A) : 0;
					C = F - x
				}
				m = B;
				G = function() {
					q.trigger("easytabs:midTransition", [z, D, r]);
					if (r.animate && r.transitionIn == "fadeIn") {
						if (C < 0) {
							y.animate({
								height: y.height() + C
							}, v.halfSpeed).css({
								"min-height": ""
							})
						}
					}
					if (r.updateHash && !d) {
						window.location.hash = "#" + D.attr("id")
					} else {
						d = false
					}
					D[v.show](v.speed, r.transitionInEasing, function() {
						y.css({
							height: "",
							"min-height": ""
						});
						q.trigger("easytabs:after", [z, D, r]);
						if (typeof H == "function") {
							H()
						}
					})
				};
				if (E && (!r.cache || !z.parent().data("easytabs").cached)) {
					q.trigger("easytabs:ajax:beforeSend", [z, D]);
					D.load(E, function(J, I, K) {
						z.parent().data("easytabs").cached = true;
						q.trigger("easytabs:ajax:complete", [z, D, J, I, K])
					})
				}
				if (r.animate && r.transitionOut == "fadeOut") {
					if (C > 0) {
						y.animate({
							height: (y.height() + C)
						}, v.halfSpeed)
					} else {
						y.css({
							"min-height": y.height()
						})
					}
				}
				f.tabs.filter("." + r.tabActiveClass).removeClass(r.tabActiveClass).children().removeClass(r.tabActiveClass);
				f.tabs.filter("." + r.collapsedClass).removeClass(r.collapsedClass).children().removeClass(r.collapsedClass);
				z.parent().addClass(r.tabActiveClass).children().addClass(r.tabActiveClass);
				f.panels.filter("." + r.panelActiveClass).removeClass(r.panelActiveClass);
				D.addClass(r.panelActiveClass);
				if (A.length) {
					A[v.hide](v.speed, r.transitionOutEasing, G)
				} else {
					D[v.uncollapse](v.speed, r.transitionUncollapseEasing, G)
				}
			}
		};
		var s = function(z) {
			if (z.data("easytabs") && z.data("easytabs").lastHeight) {
				return z.data("easytabs").lastHeight
			}
			var B = z.css("display"),
				y, x;
			try {
				y = a("<div></div>", {
					position: "absolute",
					visibility: "hidden",
					overflow: "hidden"
				})
			} catch (A) {
				y = a("<div></div>", {
					visibility: "hidden",
					overflow: "hidden"
				})
			}
			x = z.wrap(y).css({
				position: "relative",
				visibility: "hidden",
				display: "block"
			}).outerHeight();
			z.unwrap();
			z.css({
				position: z.data("easytabs").position,
				visibility: z.data("easytabs").visibility,
				display: B
			});
			z.data("easytabs").lastHeight = x;
			return x
		};
		var k = function(y) {
			var x = y.outerHeight();
			if (y.data("easytabs")) {
				y.data("easytabs").lastHeight = x
			} else {
				y.data("easytabs", {
					lastHeight: x
				})
			}
			return x
		};
		var n = function() {
			if (typeof a(window).hashchange === "function") {
				a(window).hashchange(function() {
					f.selectTabFromHashChange()
				})
			} else {
				if (a.address && typeof a.address.change === "function") {
					a.address.change(function() {
						f.selectTabFromHashChange()
					})
				}
			}
		};
		var c = function() {
			var x;
			if (r.cycle) {
				x = f.tabs.index(h);
				setTimeout(function() {
					f.cycleTabs(x + 1)
				}, r.cycle)
			}
		};
		f.init()
	};
	a.fn.easytabs = function(c) {
		var b = arguments;
		return this.each(function() {
			var e = a(this),
				d = e.data("easytabs");
			if (undefined === d) {
				d = new a.easytabs(this, c);
				e.data("easytabs", d)
			}
			if (d.publicMethods[c]) {
				return d.publicMethods[c](Array.prototype.slice.call(b, 1))
			}
		})
	}
})(jQuery);