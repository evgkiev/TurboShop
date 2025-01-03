!(function (e) {
	var t = "countdown",
		i = 0,
		s = 1,
		n = 2,
		o = 3,
		r = 4,
		a = 5,
		l = 6;
	e.JQPlugin.createPlugin({
		name: t,
		defaultOptions: {
			until: null,
			since: null,
			timezone: null,
			serverSync: null,
			format: "dHMS",
			layout: "",
			compact: !1,
			padZeroes: !1,
			significant: 0,
			description: "",
			expiryUrl: "",
			expiryText: "",
			alwaysExpire: !1,
			onExpiry: null,
			onTick: null,
			tickInterval: 1,
		},
		regionalOptions: {
			"": {
				labels: ["Years", "Months", "Weeks", "Days", "Hours", "Minutes", "Seconds"],
				labels1: ["Year", "Month", "Week", "Day", "Hour", "Minute", "Second"],
				compactLabels: ["y", "m", "w", "d"],
				whichLabels: null,
				digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
				timeSeparator: ":",
				isRTL: !1,
			},
		},
		_getters: ["getTimes"],
		_rtlClass: t + "-rtl",
		_sectionClass: t + "-section",
		_amountClass: t + "-amount",
		_periodClass: t + "-period",
		_rowClass: t + "-row",
		_holdingClass: t + "-holding",
		_showClass: t + "-show",
		_descrClass: t + "-descr",
		_timerElems: [],
		_init: function () {
			function t(e) {
				var a = 1e12 > e ? (n ? performance.now() + performance.timing.navigationStart : s()) : e || s();
				a - r >= 1e3 && (i._updateElems(), (r = a)), o(t);
			}
			var i = this;
			this._super(), (this._serverSyncs = []);

			//   console.log(i);
			var s =
				"function" == typeof Date.now
					? Date.now
					: function () {
						return new Date().getTime();
					},
				n = window.performance && "function" == typeof window.performance.now,
				o =
					window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					null,
				r = 0;
			!o || e.noRequestAnimationFrame
				? ((e.noRequestAnimationFrame = null),
					setInterval(function () {
						i._updateElems();
					}, 980))
				: ((r =
					window.animationStartTime ||
					window.webkitAnimationStartTime ||
					window.mozAnimationStartTime ||
					window.oAnimationStartTime ||
					window.msAnimationStartTime ||
					s()),
					o(t));
		},
		UTCDate: function (e, t, i, s, n, o, r, a) {
			"object" == typeof t &&
				t.constructor == Date &&
				((a = t.getMilliseconds()),
					(r = t.getSeconds()),
					(o = t.getMinutes()),
					(n = t.getHours()),
					(s = t.getDate()),
					(i = t.getMonth()),
					(t = t.getFullYear()));
			var l = new Date();
			return (
				l.setUTCFullYear(t),
				l.setUTCDate(1),
				l.setUTCMonth(i || 0),
				l.setUTCDate(s || 1),
				l.setUTCHours(n || 0),
				l.setUTCMinutes((o || 0) - (Math.abs(e) < 30 ? 60 * e : e)),
				l.setUTCSeconds(r || 0),
				l.setUTCMilliseconds(a || 0),
				l
			);
		},
		periodsToSeconds: function (e) {
			return 31557600 * e[0] + 2629800 * e[1] + 604800 * e[2] + 86400 * e[3] + 3600 * e[4] + 60 * e[5] + e[6];
		},
		resync: function () {
			var t = this;
			e("." + this._getMarker()).each(function () {
				var i = e.data(this, t.name);
				if (i.options.serverSync) {
					for (var s = null, n = 0; n < t._serverSyncs.length; n++)
						if (t._serverSyncs[n][0] == i.options.serverSync) {
							s = t._serverSyncs[n];
							break;
						}
					if (null == s[2]) {
						var o = e.isFunction(i.options.serverSync) ? i.options.serverSync.apply(this, []) : null;
						s[2] = (o ? new Date().getTime() - o.getTime() : 0) - s[1];
					}
					i._since && i._since.setMilliseconds(i._since.getMilliseconds() + s[2]),
						i._until.setMilliseconds(i._until.getMilliseconds() + s[2]);
				}
			});
			for (var i = 0; i < t._serverSyncs.length; i++)
				null != t._serverSyncs[i][2] && ((t._serverSyncs[i][1] += t._serverSyncs[i][2]), delete t._serverSyncs[i][2]);
		},
		_instSettings: function (e, t) {
			return { _periods: [0, 0, 0, 0, 0, 0, 0] };
		},
		_addElem: function (e) {
			// console.log(e);
			this._hasElem(e) || this._timerElems.push(e);

		},
		_hasElem: function (t) {
			return e.inArray(t, this._timerElems) > -1;
		},
		_removeElem: function (t) {
			this._timerElems = e.map(this._timerElems, function (e) {
				return e == t ? null : e;
			});
		},
		_updateElems: function () {
			for (var e = this._timerElems.length - 1; e >= 0; e--) this._updateCountdown(this._timerElems[e]);
		},
		_optionsChanged: function (t, i, s) {
			s.layout && (s.layout = s.layout.replace(/&lt;/g, "<").replace(/&gt;/g, ">")),
				this._resetExtraLabels(i.options, s);
			var n = i.options.timezone != s.timezone;
			e.extend(i.options, s), this._adjustSettings(t, i, null != s.until || null != s.since || n);
			var o = new Date();
			((i._since && i._since < o) || (i._until && i._until > o)) && this._addElem(t[0]), this._updateCountdown(t, i);
		},
		_updateCountdown: function (t, i) {
			if (((t = t.jquery ? t : e(t)), (i = i || this._getInst(t)), i && i.options)) {
				if (
					(t.html(this._generateHTML(i)).toggleClass(this._rtlClass, i.options.isRTL), e.isFunction(i.options.onTick))
				) {
					var s = "lap" != i._hold ? i._periods : this._calculatePeriods(i, i._show, i.options.significant, new Date());
					(1 == i.options.tickInterval || this.periodsToSeconds(s) % i.options.tickInterval == 0) &&
						i.options.onTick.apply(t[0], [s]);
				}
				var n =
					"pause" != i._hold &&
					(i._since ? i._now.getTime() < i._since.getTime() : i._now.getTime() >= i._until.getTime());
				if (n && !i._expiring) {
					if (((i._expiring = !0), this._hasElem(t[0]) || i.options.alwaysExpire)) {
						if (
							(this._removeElem(t[0]),
								e.isFunction(i.options.onExpiry) && i.options.onExpiry.apply(t[0], []),
								i.options.expiryText)
						) {
							var o = i.options.layout;
							(i.options.layout = i.options.expiryText), this._updateCountdown(t[0], i), (i.options.layout = o);
						}
						i.options.expiryUrl && (window.location = i.options.expiryUrl);
					}
					i._expiring = !1;
				} else "pause" == i._hold && this._removeElem(t[0]);
			}
		},
		_resetExtraLabels: function (e, t) {
			for (var i in t) i.match(/[Ll]abels[02-9]|compactLabels1/) && (e[i] = t[i]);
			for (var i in e) i.match(/[Ll]abels[02-9]|compactLabels1/) && "undefined" == typeof t[i] && (e[i] = null);
		},
		_adjustSettings: function (t, i, s) {
			for (var n = null, o = 0; o < this._serverSyncs.length; o++)
				if (this._serverSyncs[o][0] == i.options.serverSync) {
					n = this._serverSyncs[o][1];
					break;
				}
			if (null != n)
				var r = i.options.serverSync ? n : 0,
					a = new Date();
			else {
				var l = e.isFunction(i.options.serverSync) ? i.options.serverSync.apply(t[0], []) : null,
					a = new Date(),
					r = l ? a.getTime() - l.getTime() : 0;
				this._serverSyncs.push([i.options.serverSync, r]);
			}
			var _ = i.options.timezone;
			(_ = null == _ ? -a.getTimezoneOffset() : _),
				(s || (!s && null == i._until && null == i._since)) &&
				((i._since = i.options.since),
					null != i._since &&
					((i._since = this.UTCDate(_, this._determineTime(i._since, null))),
						i._since && r && i._since.setMilliseconds(i._since.getMilliseconds() + r)),
					(i._until = this.UTCDate(_, this._determineTime(i.options.until, a))),
					r && i._until.setMilliseconds(i._until.getMilliseconds() + r)),
				(i._show = this._determineShow(i));
		},
		_preDestroy: function (e, t) {
			this._removeElem(e[0]), e.empty();
		},
		pause: function (e) {
			this._hold(e, "pause");
		},
		lap: function (e) {
			this._hold(e, "lap");
		},
		resume: function (e) {
			this._hold(e, null);
		},
		toggle: function (t) {
			var i = e.data(t, this.name) || {};
			this[i._hold ? "resume" : "pause"](t);
		},
		toggleLap: function (t) {
			var i = e.data(t, this.name) || {};
			this[i._hold ? "resume" : "lap"](t);
		},
		_hold: function (t, i) {
			var s = e.data(t, this.name);
			if (s) {
				if ("pause" == s._hold && !i) {
					s._periods = s._savePeriods;
					var n = s._since ? "-" : "+";
					(s[s._since ? "_since" : "_until"] = this._determineTime(
						n +
						s._periods[0] +
						"y" +
						n +
						s._periods[1] +
						"o" +
						n +
						s._periods[2] +
						"w" +
						n +
						s._periods[3] +
						"d" +
						n +
						s._periods[4] +
						"h" +
						n +
						s._periods[5] +
						"m" +
						n +
						s._periods[6] +
						"s"
					)),
						this._addElem(t);
				}
				(s._hold = i),
					(s._savePeriods = "pause" == i ? s._periods : null),
					e.data(t, this.name, s),
					this._updateCountdown(t, s);
			}
		},
		getTimes: function (t) {
			var i = e.data(t, this.name);
			return i
				? "pause" == i._hold
					? i._savePeriods
					: i._hold
						? this._calculatePeriods(i, i._show, i.options.significant, new Date())
						: i._periods
				: null;
		},
		_determineTime: function (e, t) {
			var i = this,
				s = function (e) {
					var t = new Date();
					return t.setTime(t.getTime() + 1e3 * e), t;
				},
				n = function (e) {
					e = e.toLowerCase();
					for (
						var t = new Date(),
						s = t.getFullYear(),
						n = t.getMonth(),
						o = t.getDate(),
						r = t.getHours(),
						a = t.getMinutes(),
						l = t.getSeconds(),
						_ = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g,
						p = _.exec(e);
						p;

					) {
						switch (p[2] || "s") {
							case "s":
								l += parseInt(p[1], 10);
								break;
							case "m":
								a += parseInt(p[1], 10);
								break;
							case "h":
								r += parseInt(p[1], 10);
								break;
							case "d":
								o += parseInt(p[1], 10);
								break;
							case "w":
								o += 7 * parseInt(p[1], 10);
								break;
							case "o":
								(n += parseInt(p[1], 10)), (o = Math.min(o, i._getDaysInMonth(s, n)));
								break;
							case "y":
								(s += parseInt(p[1], 10)), (o = Math.min(o, i._getDaysInMonth(s, n)));
						}
						p = _.exec(e);
					}
					return new Date(s, n, o, r, a, l, 0);
				},
				o = null == e ? t : "string" == typeof e ? n(e) : "number" == typeof e ? s(e) : e;
			return o && o.setMilliseconds(0), o;
		},
		_getDaysInMonth: function (e, t) {
			return 32 - new Date(e, t, 32).getDate();
		},
		_normalLabels: function (e) {
			return e;
		},
		_generateHTML: function (t) {
			var _ = this;
			t._periods = t._hold ? t._periods : this._calculatePeriods(t, t._show, t.options.significant, new Date());
			for (var p = !1, c = 0, u = t.options.significant, d = e.extend({}, t._show), h = i; l >= h; h++)
				(p |= "?" == t._show[h] && t._periods[h] > 0),
					(d[h] = "?" != t._show[h] || p ? t._show[h] : null),
					(c += d[h] ? 1 : 0),
					(u -= t._periods[h] > 0 ? 1 : 0);
			for (var m = [!1, !1, !1, !1, !1, !1, !1], h = l; h >= i; h--)
				t._show[h] && (t._periods[h] ? (m[h] = !0) : ((m[h] = u > 0), u--));
			var g = t.options.compact ? t.options.compactLabels : t.options.labels,
				f = t.options.whichLabels || this._normalLabels,
				w = function (e) {
					var i = t.options["compactLabels" + f(t._periods[e])];
					return d[e] ? _._translateDigits(t, t._periods[e]) + (i ? i[e] : g[e]) + " " : "";
				},
				y = t.options.padZeroes ? 2 : 1,
				v = function (e) {
					var i = t.options["labels" + f(t._periods[e])];
					return (!t.options.significant && d[e]) || (t.options.significant && m[e])
						? '<span class="' +
						_._sectionClass +
						'"><span class="' +
						_._amountClass +
						'">' +
						_._minDigits(t, t._periods[e], y) +
						'</span><span class="' +
						_._periodClass +
						'">' +
						(i ? i[e] : g[e]) +
						"</span></span>"
						: "";
				};
			return t.options.layout
				? this._buildLayout(t, d, t.options.layout, t.options.compact, t.options.significant, m)
				: (t.options.compact
					? '<span class="' +
					this._rowClass +
					" " +
					this._amountClass +
					(t._hold ? " " + this._holdingClass : "") +
					'">' +
					w(i) +
					w(s) +
					w(n) +
					w(o) +
					(d[r] ? this._minDigits(t, t._periods[r], 2) : "") +
					(d[a] ? (d[r] ? t.options.timeSeparator : "") + this._minDigits(t, t._periods[a], 2) : "") +
					(d[l] ? (d[r] || d[a] ? t.options.timeSeparator : "") + this._minDigits(t, t._periods[l], 2) : "")
					: '<span class="' +
					this._rowClass +
					" " +
					this._showClass +
					(t.options.significant || c) +
					(t._hold ? " " + this._holdingClass : "") +
					'">' +
					v(i) +
					v(s) +
					v(n) +
					v(o) +
					v(r) +
					v(a) +
					v(l)) +
				"</span>" +
				(t.options.description
					? '<span class="' + this._rowClass + " " + this._descrClass + '">' + t.options.description + "</span>"
					: "");
		},
		_buildLayout: function (t, _, p, c, u, d) {
			for (
				var h = t.options[c ? "compactLabels" : "labels"],
				m = t.options.whichLabels || this._normalLabels,
				g = function (e) {
					return (t.options[(c ? "compactLabels" : "labels") + m(t._periods[e])] || h)[e];
				},
				f = function (e, i) {
					return t.options.digits[Math.floor(e / i) % 10];
				},
				w = {
					desc: t.options.description,
					sep: t.options.timeSeparator,
					yl: g(i),
					yn: this._minDigits(t, t._periods[i], 1),
					ynn: this._minDigits(t, t._periods[i], 2),
					ynnn: this._minDigits(t, t._periods[i], 3),
					y1: f(t._periods[i], 1),
					y10: f(t._periods[i], 10),
					y100: f(t._periods[i], 100),
					y1000: f(t._periods[i], 1e3),
					ol: g(s),
					on: this._minDigits(t, t._periods[s], 1),
					onn: this._minDigits(t, t._periods[s], 2),
					onnn: this._minDigits(t, t._periods[s], 3),
					o1: f(t._periods[s], 1),
					o10: f(t._periods[s], 10),
					o100: f(t._periods[s], 100),
					o1000: f(t._periods[s], 1e3),
					wl: g(n),
					wn: this._minDigits(t, t._periods[n], 1),
					wnn: this._minDigits(t, t._periods[n], 2),
					wnnn: this._minDigits(t, t._periods[n], 3),
					w1: f(t._periods[n], 1),
					w10: f(t._periods[n], 10),
					w100: f(t._periods[n], 100),
					w1000: f(t._periods[n], 1e3),
					dl: g(o),
					dn: this._minDigits(t, t._periods[o], 1),
					dnn: this._minDigits(t, t._periods[o], 2),
					dnnn: this._minDigits(t, t._periods[o], 3),
					d1: f(t._periods[o], 1),
					d10: f(t._periods[o], 10),
					d100: f(t._periods[o], 100),
					d1000: f(t._periods[o], 1e3),
					hl: g(r),
					hn: this._minDigits(t, t._periods[r], 1),
					hnn: this._minDigits(t, t._periods[r], 2),
					hnnn: this._minDigits(t, t._periods[r], 3),
					h1: f(t._periods[r], 1),
					h10: f(t._periods[r], 10),
					h100: f(t._periods[r], 100),
					h1000: f(t._periods[r], 1e3),
					ml: g(a),
					mn: this._minDigits(t, t._periods[a], 1),
					mnn: this._minDigits(t, t._periods[a], 2),
					mnnn: this._minDigits(t, t._periods[a], 3),
					m1: f(t._periods[a], 1),
					m10: f(t._periods[a], 10),
					m100: f(t._periods[a], 100),
					m1000: f(t._periods[a], 1e3),
					sl: g(l),
					sn: this._minDigits(t, t._periods[l], 1),
					snn: this._minDigits(t, t._periods[l], 2),
					snnn: this._minDigits(t, t._periods[l], 3),
					s1: f(t._periods[l], 1),
					s10: f(t._periods[l], 10),
					s100: f(t._periods[l], 100),
					s1000: f(t._periods[l], 1e3),
				},
				y = p,
				v = i;
				l >= v;
				v++
			) {
				var D = "yowdhms".charAt(v),
					T = new RegExp("\\{" + D + "<\\}([\\s\\S]*)\\{" + D + ">\\}", "g");
				y = y.replace(T, (!u && _[v]) || (u && d[v]) ? "$1" : "");
			}
			return (
				e.each(w, function (e, t) {
					var i = new RegExp("\\{" + e + "\\}", "g");
					y = y.replace(i, t);
				}),
				y
			);
		},
		_minDigits: function (e, t, i) {
			return (
				(t = "" + t),
				t.length >= i
					? this._translateDigits(e, t)
					: ((t = "0000000000" + t), this._translateDigits(e, t.substr(t.length - i)))
			);
		},
		_translateDigits: function (e, t) {
			return ("" + t).replace(/[0-9]/g, function (t) {
				return e.options.digits[t];
			});
		},
		_determineShow: function (e) {
			var t = e.options.format,
				_ = [];
			return (
				(_[i] = t.match("y") ? "?" : t.match("Y") ? "!" : null),
				(_[s] = t.match("o") ? "?" : t.match("O") ? "!" : null),
				(_[n] = t.match("w") ? "?" : t.match("W") ? "!" : null),
				(_[o] = t.match("d") ? "?" : t.match("D") ? "!" : null),
				(_[r] = t.match("h") ? "?" : t.match("H") ? "!" : null),
				(_[a] = t.match("m") ? "?" : t.match("M") ? "!" : null),
				(_[l] = t.match("s") ? "?" : t.match("S") ? "!" : null),
				_
			);
		},
		_calculatePeriods: function (e, t, _, p) {
			(e._now = p), e._now.setMilliseconds(0);
			var c = new Date(e._now.getTime());
			e._since
				? p.getTime() < e._since.getTime()
					? (e._now = p = c)
					: (p = e._since)
				: (c.setTime(e._until.getTime()), p.getTime() > e._until.getTime() && (e._now = p = c));
			var u = [0, 0, 0, 0, 0, 0, 0];
			if (t[i] || t[s]) {
				var d = this._getDaysInMonth(p.getFullYear(), p.getMonth()),
					h = this._getDaysInMonth(c.getFullYear(), c.getMonth()),
					m = c.getDate() == p.getDate() || (c.getDate() >= Math.min(d, h) && p.getDate() >= Math.min(d, h)),
					g = function (e) {
						return 60 * (60 * e.getHours() + e.getMinutes()) + e.getSeconds();
					},
					f = Math.max(
						0,
						12 * (c.getFullYear() - p.getFullYear()) +
						c.getMonth() -
						p.getMonth() +
						((c.getDate() < p.getDate() && !m) || (m && g(c) < g(p)) ? -1 : 0)
					);
				(u[i] = t[i] ? Math.floor(f / 12) : 0), (u[s] = t[s] ? f - 12 * u[i] : 0), (p = new Date(p.getTime()));
				var w = p.getDate() == d,
					y = this._getDaysInMonth(p.getFullYear() + u[i], p.getMonth() + u[s]);
				p.getDate() > y && p.setDate(y),
					p.setFullYear(p.getFullYear() + u[i]),
					p.setMonth(p.getMonth() + u[s]),
					w && p.setDate(y);
			}
			var v = Math.floor((c.getTime() - p.getTime()) / 1e3),
				D = function (e, i) {
					(u[e] = t[e] ? Math.floor(v / i) : 0), (v -= u[e] * i);
				};
			if ((D(n, 604800), D(o, 86400), D(r, 3600), D(a, 60), D(l, 1), v > 0 && !e._since))
				for (var T = [1, 12, 4.3482, 7, 24, 60, 60], M = l, S = 1, b = l; b >= i; b--)
					t[b] && (u[M] >= S && ((u[M] = 0), (v = 1)), v > 0 && (u[b]++, (v = 0), (M = b), (S = 1))), (S *= T[b]);
			if (_) for (var b = i; l >= b; b++) _ && u[b] ? _-- : _ || (u[b] = 0);
			return u;
		},
	});
})(jQuery);
