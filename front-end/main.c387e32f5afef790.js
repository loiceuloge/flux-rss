'use strict';
(self.webpackChunkfluxRss_front = self.webpackChunkfluxRss_front || []).push([
	[179],
	{
		919: () => {
			function Y(e) {
				return 'function' == typeof e;
			}
			function _o(e) {
				const n = e((r) => {
					Error.call(r), (r.stack = new Error().stack);
				});
				return (n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n;
			}
			const Do = _o(
				(e) =>
					function (n) {
						e(this),
							(this.message = n
								? `${n.length} errors occurred during unsubscription:\n${n
										.map((r, o) => `${o + 1}) ${r.toString()}`)
										.join('\n  ')}`
								: ''),
							(this.name = 'UnsubscriptionError'),
							(this.errors = n);
					}
			);
			function Cr(e, t) {
				if (e) {
					const n = e.indexOf(t);
					0 <= n && e.splice(n, 1);
				}
			}
			class Dt {
				constructor(t) {
					(this.initialTeardown = t), (this.closed = !1), (this._parentage = null), (this._finalizers = null);
				}
				unsubscribe() {
					let t;
					if (!this.closed) {
						this.closed = !0;
						const { _parentage: n } = this;
						if (n)
							if (((this._parentage = null), Array.isArray(n))) for (const i of n) i.remove(this);
							else n.remove(this);
						const { initialTeardown: r } = this;
						if (Y(r))
							try {
								r();
							} catch (i) {
								t = i instanceof Do ? i.errors : [i];
							}
						const { _finalizers: o } = this;
						if (o) {
							this._finalizers = null;
							for (const i of o)
								try {
									ic(i);
								} catch (s) {
									(t = null != t ? t : []), s instanceof Do ? (t = [...t, ...s.errors]) : t.push(s);
								}
						}
						if (t) throw new Do(t);
					}
				}
				add(t) {
					var n;
					if (t && t !== this)
						if (this.closed) ic(t);
						else {
							if (t instanceof Dt) {
								if (t.closed || t._hasParent(this)) return;
								t._addParent(this);
							}
							(this._finalizers = null !== (n = this._finalizers) && void 0 !== n ? n : []).push(t);
						}
				}
				_hasParent(t) {
					const { _parentage: n } = this;
					return n === t || (Array.isArray(n) && n.includes(t));
				}
				_addParent(t) {
					const { _parentage: n } = this;
					this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
				}
				_removeParent(t) {
					const { _parentage: n } = this;
					n === t ? (this._parentage = null) : Array.isArray(n) && Cr(n, t);
				}
				remove(t) {
					const { _finalizers: n } = this;
					n && Cr(n, t), t instanceof Dt && t._removeParent(this);
				}
			}
			Dt.EMPTY = (() => {
				const e = new Dt();
				return (e.closed = !0), e;
			})();
			const rc = Dt.EMPTY;
			function oc(e) {
				return e instanceof Dt || (e && 'closed' in e && Y(e.remove) && Y(e.add) && Y(e.unsubscribe));
			}
			function ic(e) {
				Y(e) ? e() : e.unsubscribe();
			}
			const ln = {
					onUnhandledError: null,
					onStoppedNotification: null,
					Promise: void 0,
					useDeprecatedSynchronousErrorHandling: !1,
					useDeprecatedNextContext: !1,
				},
				vo = {
					setTimeout(e, t, ...n) {
						const { delegate: r } = vo;
						return (null == r ? void 0 : r.setTimeout) ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
					},
					clearTimeout(e) {
						const { delegate: t } = vo;
						return ((null == t ? void 0 : t.clearTimeout) || clearTimeout)(e);
					},
					delegate: void 0,
				};
			function sc(e) {
				vo.setTimeout(() => {
					const { onUnhandledError: t } = ln;
					if (!t) throw e;
					t(e);
				});
			}
			function ac() {}
			const i_ = hs('C', void 0, void 0);
			function hs(e, t, n) {
				return { kind: e, value: t, error: n };
			}
			let cn = null;
			function Co(e) {
				if (ln.useDeprecatedSynchronousErrorHandling) {
					const t = !cn;
					if ((t && (cn = { errorThrown: !1, error: null }), e(), t)) {
						const { errorThrown: n, error: r } = cn;
						if (((cn = null), n)) throw r;
					}
				} else e();
			}
			class ps extends Dt {
				constructor(t) {
					super(), (this.isStopped = !1), t ? ((this.destination = t), oc(t) && t.add(this)) : (this.destination = f_);
				}
				static create(t, n, r) {
					return new wo(t, n, r);
				}
				next(t) {
					this.isStopped
						? ms(
								(function a_(e) {
									return hs('N', e, void 0);
								})(t),
								this
						  )
						: this._next(t);
				}
				error(t) {
					this.isStopped
						? ms(
								(function s_(e) {
									return hs('E', void 0, e);
								})(t),
								this
						  )
						: ((this.isStopped = !0), this._error(t));
				}
				complete() {
					this.isStopped ? ms(i_, this) : ((this.isStopped = !0), this._complete());
				}
				unsubscribe() {
					this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
				}
				_next(t) {
					this.destination.next(t);
				}
				_error(t) {
					try {
						this.destination.error(t);
					} finally {
						this.unsubscribe();
					}
				}
				_complete() {
					try {
						this.destination.complete();
					} finally {
						this.unsubscribe();
					}
				}
			}
			const l_ = Function.prototype.bind;
			function gs(e, t) {
				return l_.call(e, t);
			}
			class c_ {
				constructor(t) {
					this.partialObserver = t;
				}
				next(t) {
					const { partialObserver: n } = this;
					if (n.next)
						try {
							n.next(t);
						} catch (r) {
							Eo(r);
						}
				}
				error(t) {
					const { partialObserver: n } = this;
					if (n.error)
						try {
							n.error(t);
						} catch (r) {
							Eo(r);
						}
					else Eo(t);
				}
				complete() {
					const { partialObserver: t } = this;
					if (t.complete)
						try {
							t.complete();
						} catch (n) {
							Eo(n);
						}
				}
			}
			class wo extends ps {
				constructor(t, n, r) {
					let o;
					if ((super(), Y(t) || !t))
						o = { next: null != t ? t : void 0, error: null != n ? n : void 0, complete: null != r ? r : void 0 };
					else {
						let i;
						this && ln.useDeprecatedNextContext
							? ((i = Object.create(t)),
							  (i.unsubscribe = () => this.unsubscribe()),
							  (o = {
									next: t.next && gs(t.next, i),
									error: t.error && gs(t.error, i),
									complete: t.complete && gs(t.complete, i),
							  }))
							: (o = t);
					}
					this.destination = new c_(o);
				}
			}
			function Eo(e) {
				ln.useDeprecatedSynchronousErrorHandling
					? (function u_(e) {
							ln.useDeprecatedSynchronousErrorHandling && cn && ((cn.errorThrown = !0), (cn.error = e));
					  })(e)
					: sc(e);
			}
			function ms(e, t) {
				const { onStoppedNotification: n } = ln;
				n && vo.setTimeout(() => n(e, t));
			}
			const f_ = {
					closed: !0,
					next: ac,
					error: function d_(e) {
						throw e;
					},
					complete: ac,
				},
				ys = ('function' == typeof Symbol && Symbol.observable) || '@@observable';
			function uc(e) {
				return e;
			}
			let Ce = (() => {
				class e {
					constructor(n) {
						n && (this._subscribe = n);
					}
					lift(n) {
						const r = new e();
						return (r.source = this), (r.operator = n), r;
					}
					subscribe(n, r, o) {
						const i = (function p_(e) {
							return (
								(e && e instanceof ps) ||
								((function h_(e) {
									return e && Y(e.next) && Y(e.error) && Y(e.complete);
								})(e) &&
									oc(e))
							);
						})(n)
							? n
							: new wo(n, r, o);
						return (
							Co(() => {
								const { operator: s, source: a } = this;
								i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i));
							}),
							i
						);
					}
					_trySubscribe(n) {
						try {
							return this._subscribe(n);
						} catch (r) {
							n.error(r);
						}
					}
					forEach(n, r) {
						return new (r = cc(r))((o, i) => {
							const s = new wo({
								next: (a) => {
									try {
										n(a);
									} catch (u) {
										i(u), s.unsubscribe();
									}
								},
								error: i,
								complete: o,
							});
							this.subscribe(s);
						});
					}
					_subscribe(n) {
						var r;
						return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(n);
					}
					[ys]() {
						return this;
					}
					pipe(...n) {
						return (function lc(e) {
							return 0 === e.length
								? uc
								: 1 === e.length
								? e[0]
								: function (n) {
										return e.reduce((r, o) => o(r), n);
								  };
						})(n)(this);
					}
					toPromise(n) {
						return new (n = cc(n))((r, o) => {
							let i;
							this.subscribe(
								(s) => (i = s),
								(s) => o(s),
								() => r(i)
							);
						});
					}
				}
				return (e.create = (t) => new e(t)), e;
			})();
			function cc(e) {
				var t;
				return null !== (t = null != e ? e : ln.Promise) && void 0 !== t ? t : Promise;
			}
			const g_ = _o(
				(e) =>
					function () {
						e(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed');
					}
			);
			let _s = (() => {
				class e extends Ce {
					constructor() {
						super(),
							(this.closed = !1),
							(this.currentObservers = null),
							(this.observers = []),
							(this.isStopped = !1),
							(this.hasError = !1),
							(this.thrownError = null);
					}
					lift(n) {
						const r = new dc(this, this);
						return (r.operator = n), r;
					}
					_throwIfClosed() {
						if (this.closed) throw new g_();
					}
					next(n) {
						Co(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								this.currentObservers || (this.currentObservers = Array.from(this.observers));
								for (const r of this.currentObservers) r.next(n);
							}
						});
					}
					error(n) {
						Co(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								(this.hasError = this.isStopped = !0), (this.thrownError = n);
								const { observers: r } = this;
								for (; r.length; ) r.shift().error(n);
							}
						});
					}
					complete() {
						Co(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								this.isStopped = !0;
								const { observers: n } = this;
								for (; n.length; ) n.shift().complete();
							}
						});
					}
					unsubscribe() {
						(this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
					}
					get observed() {
						var n;
						return (null === (n = this.observers) || void 0 === n ? void 0 : n.length) > 0;
					}
					_trySubscribe(n) {
						return this._throwIfClosed(), super._trySubscribe(n);
					}
					_subscribe(n) {
						return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
					}
					_innerSubscribe(n) {
						const { hasError: r, isStopped: o, observers: i } = this;
						return r || o
							? rc
							: ((this.currentObservers = null),
							  i.push(n),
							  new Dt(() => {
									(this.currentObservers = null), Cr(i, n);
							  }));
					}
					_checkFinalizedStatuses(n) {
						const { hasError: r, thrownError: o, isStopped: i } = this;
						r ? n.error(o) : i && n.complete();
					}
					asObservable() {
						const n = new Ce();
						return (n.source = this), n;
					}
				}
				return (e.create = (t, n) => new dc(t, n)), e;
			})();
			class dc extends _s {
				constructor(t, n) {
					super(), (this.destination = t), (this.source = n);
				}
				next(t) {
					var n, r;
					null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.next) || void 0 === r || r.call(n, t);
				}
				error(t) {
					var n, r;
					null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.error) || void 0 === r || r.call(n, t);
				}
				complete() {
					var t, n;
					null === (n = null === (t = this.destination) || void 0 === t ? void 0 : t.complete) || void 0 === n || n.call(t);
				}
				_subscribe(t) {
					var n, r;
					return null !== (r = null === (n = this.source) || void 0 === n ? void 0 : n.subscribe(t)) && void 0 !== r ? r : rc;
				}
			}
			function dn(e) {
				return (t) => {
					if (
						(function m_(e) {
							return Y(null == e ? void 0 : e.lift);
						})(t)
					)
						return t.lift(function (n) {
							try {
								return e(n, this);
							} catch (r) {
								this.error(r);
							}
						});
					throw new TypeError('Unable to lift unknown Observable type');
				};
			}
			function fn(e, t, n, r, o) {
				return new y_(e, t, n, r, o);
			}
			class y_ extends ps {
				constructor(t, n, r, o, i, s) {
					super(t),
						(this.onFinalize = i),
						(this.shouldUnsubscribe = s),
						(this._next = n
							? function (a) {
									try {
										n(a);
									} catch (u) {
										t.error(u);
									}
							  }
							: super._next),
						(this._error = o
							? function (a) {
									try {
										o(a);
									} catch (u) {
										t.error(u);
									} finally {
										this.unsubscribe();
									}
							  }
							: super._error),
						(this._complete = r
							? function () {
									try {
										r();
									} catch (a) {
										t.error(a);
									} finally {
										this.unsubscribe();
									}
							  }
							: super._complete);
				}
				unsubscribe() {
					var t;
					if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
						const { closed: n } = this;
						super.unsubscribe(), !n && (null === (t = this.onFinalize) || void 0 === t || t.call(this));
					}
				}
			}
			function hn(e, t) {
				return dn((n, r) => {
					let o = 0;
					n.subscribe(
						fn(r, (i) => {
							r.next(e.call(t, i, o++));
						})
					);
				});
			}
			function pn(e) {
				return this instanceof pn ? ((this.v = e), this) : new pn(e);
			}
			function v_(e, t, n) {
				if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
				var o,
					r = n.apply(e, t || []),
					i = [];
				return (
					(o = {}),
					s('next'),
					s('throw'),
					s('return'),
					(o[Symbol.asyncIterator] = function () {
						return this;
					}),
					o
				);
				function s(f) {
					r[f] &&
						(o[f] = function (h) {
							return new Promise(function (p, m) {
								i.push([f, h, p, m]) > 1 || a(f, h);
							});
						});
				}
				function a(f, h) {
					try {
						!(function u(f) {
							f.value instanceof pn ? Promise.resolve(f.value.v).then(l, c) : d(i[0][2], f);
						})(r[f](h));
					} catch (p) {
						d(i[0][3], p);
					}
				}
				function l(f) {
					a('next', f);
				}
				function c(f) {
					a('throw', f);
				}
				function d(f, h) {
					f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
				}
			}
			function C_(e) {
				if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
				var n,
					t = e[Symbol.asyncIterator];
				return t
					? t.call(e)
					: ((e = (function pc(e) {
							var t = 'function' == typeof Symbol && Symbol.iterator,
								n = t && e[t],
								r = 0;
							if (n) return n.call(e);
							if (e && 'number' == typeof e.length)
								return {
									next: function () {
										return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
									},
								};
							throw new TypeError(t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
					  })(e)),
					  (n = {}),
					  r('next'),
					  r('throw'),
					  r('return'),
					  (n[Symbol.asyncIterator] = function () {
							return this;
					  }),
					  n);
				function r(i) {
					n[i] =
						e[i] &&
						function (s) {
							return new Promise(function (a, u) {
								!(function o(i, s, a, u) {
									Promise.resolve(u).then(function (l) {
										i({ value: l, done: a });
									}, s);
								})(a, u, (s = e[i](s)).done, s.value);
							});
						};
				}
			}
			const gc = (e) => e && 'number' == typeof e.length && 'function' != typeof e;
			function mc(e) {
				return Y(null == e ? void 0 : e.then);
			}
			function yc(e) {
				return Y(e[ys]);
			}
			function _c(e) {
				return Symbol.asyncIterator && Y(null == e ? void 0 : e[Symbol.asyncIterator]);
			}
			function Dc(e) {
				return new TypeError(
					`You provided ${
						null !== e && 'object' == typeof e ? 'an invalid object' : `'${e}'`
					} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
				);
			}
			const vc = (function E_() {
				return 'function' == typeof Symbol && Symbol.iterator ? Symbol.iterator : '@@iterator';
			})();
			function Cc(e) {
				return Y(null == e ? void 0 : e[vc]);
			}
			function wc(e) {
				return v_(this, arguments, function* () {
					const n = e.getReader();
					try {
						for (;;) {
							const { value: r, done: o } = yield pn(n.read());
							if (o) return yield pn(void 0);
							yield yield pn(r);
						}
					} finally {
						n.releaseLock();
					}
				});
			}
			function Ec(e) {
				return Y(null == e ? void 0 : e.getReader);
			}
			function gn(e) {
				if (e instanceof Ce) return e;
				if (null != e) {
					if (yc(e))
						return (function b_(e) {
							return new Ce((t) => {
								const n = e[ys]();
								if (Y(n.subscribe)) return n.subscribe(t);
								throw new TypeError('Provided object does not correctly implement Symbol.observable');
							});
						})(e);
					if (gc(e))
						return (function M_(e) {
							return new Ce((t) => {
								for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
								t.complete();
							});
						})(e);
					if (mc(e))
						return (function I_(e) {
							return new Ce((t) => {
								e.then(
									(n) => {
										t.closed || (t.next(n), t.complete());
									},
									(n) => t.error(n)
								).then(null, sc);
							});
						})(e);
					if (_c(e)) return bc(e);
					if (Cc(e))
						return (function A_(e) {
							return new Ce((t) => {
								for (const n of e) if ((t.next(n), t.closed)) return;
								t.complete();
							});
						})(e);
					if (Ec(e))
						return (function S_(e) {
							return bc(wc(e));
						})(e);
				}
				throw Dc(e);
			}
			function bc(e) {
				return new Ce((t) => {
					(function T_(e, t) {
						var n, r, o, i;
						return (function __(e, t, n, r) {
							return new (n || (n = Promise))(function (i, s) {
								function a(c) {
									try {
										l(r.next(c));
									} catch (d) {
										s(d);
									}
								}
								function u(c) {
									try {
										l(r.throw(c));
									} catch (d) {
										s(d);
									}
								}
								function l(c) {
									c.done
										? i(c.value)
										: (function o(i) {
												return i instanceof n
													? i
													: new n(function (s) {
															s(i);
													  });
										  })(c.value).then(a, u);
								}
								l((r = r.apply(e, t || [])).next());
							});
						})(this, void 0, void 0, function* () {
							try {
								for (n = C_(e); !(r = yield n.next()).done; ) if ((t.next(r.value), t.closed)) return;
							} catch (s) {
								o = { error: s };
							} finally {
								try {
									r && !r.done && (i = n.return) && (yield i.call(n));
								} finally {
									if (o) throw o.error;
								}
							}
							t.complete();
						});
					})(e, t).catch((n) => t.error(n));
				});
			}
			function qt(e, t, n, r = 0, o = !1) {
				const i = t.schedule(function () {
					n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
				}, r);
				if ((e.add(i), !o)) return i;
			}
			function bo(e, t, n = 1 / 0) {
				return Y(t)
					? bo((r, o) => hn((i, s) => t(r, i, o, s))(gn(e(r, o))), n)
					: ('number' == typeof t && (n = t),
					  dn((r, o) =>
							(function N_(e, t, n, r, o, i, s, a) {
								const u = [];
								let l = 0,
									c = 0,
									d = !1;
								const f = () => {
										d && !u.length && !l && t.complete();
									},
									h = (m) => (l < r ? p(m) : u.push(m)),
									p = (m) => {
										i && t.next(m), l++;
										let D = !1;
										gn(n(m, c++)).subscribe(
											fn(
												t,
												(_) => {
													null == o || o(_), i ? h(_) : t.next(_);
												},
												() => {
													D = !0;
												},
												void 0,
												() => {
													if (D)
														try {
															for (l--; u.length && l < r; ) {
																const _ = u.shift();
																s ? qt(t, s, () => p(_)) : p(_);
															}
															f();
														} catch (_) {
															t.error(_);
														}
												}
											)
										);
									};
								return (
									e.subscribe(
										fn(t, h, () => {
											(d = !0), f();
										})
									),
									() => {
										null == a || a();
									}
								);
							})(r, o, e, n)
					  ));
			}
			const vs = new Ce((e) => e.complete());
			function Cs(e) {
				return e[e.length - 1];
			}
			function Mc(e) {
				return (function P_(e) {
					return e && Y(e.schedule);
				})(Cs(e))
					? e.pop()
					: void 0;
			}
			function Ic(e, t = 0) {
				return dn((n, r) => {
					n.subscribe(
						fn(
							r,
							(o) => qt(r, e, () => r.next(o), t),
							() => qt(r, e, () => r.complete(), t),
							(o) => qt(r, e, () => r.error(o), t)
						)
					);
				});
			}
			function Ac(e, t = 0) {
				return dn((n, r) => {
					r.add(e.schedule(() => n.subscribe(r), t));
				});
			}
			function Sc(e, t) {
				if (!e) throw new Error('Iterable cannot be null');
				return new Ce((n) => {
					qt(n, t, () => {
						const r = e[Symbol.asyncIterator]();
						qt(
							n,
							t,
							() => {
								r.next().then((o) => {
									o.done ? n.complete() : n.next(o.value);
								});
							},
							0,
							!0
						);
					});
				});
			}
			function Mo(e, t) {
				return t
					? (function j_(e, t) {
							if (null != e) {
								if (yc(e))
									return (function V_(e, t) {
										return gn(e).pipe(Ac(t), Ic(t));
									})(e, t);
								if (gc(e))
									return (function L_(e, t) {
										return new Ce((n) => {
											let r = 0;
											return t.schedule(function () {
												r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
											});
										});
									})(e, t);
								if (mc(e))
									return (function k_(e, t) {
										return gn(e).pipe(Ac(t), Ic(t));
									})(e, t);
								if (_c(e)) return Sc(e, t);
								if (Cc(e))
									return (function B_(e, t) {
										return new Ce((n) => {
											let r;
											return (
												qt(n, t, () => {
													(r = e[vc]()),
														qt(
															n,
															t,
															() => {
																let o, i;
																try {
																	({ value: o, done: i } = r.next());
																} catch (s) {
																	return void n.error(s);
																}
																i ? n.complete() : n.next(o);
															},
															0,
															!0
														);
												}),
												() => Y(null == r ? void 0 : r.return) && r.return()
											);
										});
									})(e, t);
								if (Ec(e))
									return (function H_(e, t) {
										return Sc(wc(e), t);
									})(e, t);
							}
							throw Dc(e);
					  })(e, t)
					: gn(e);
			}
			function ws(e, t, ...n) {
				return !0 === t
					? (e(), null)
					: !1 === t
					? null
					: t(...n)
							.pipe(
								(function U_(e) {
									return e <= 0
										? () => vs
										: dn((t, n) => {
												let r = 0;
												t.subscribe(
													fn(n, (o) => {
														++r <= e && (n.next(o), e <= r && n.complete());
													})
												);
										  });
								})(1)
							)
							.subscribe(() => e());
			}
			function q(e) {
				for (let t in e) if (e[t] === q) return t;
				throw Error('Could not find renamed property on target object.');
			}
			function Es(e, t) {
				for (const n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
			}
			function U(e) {
				if ('string' == typeof e) return e;
				if (Array.isArray(e)) return '[' + e.map(U).join(', ') + ']';
				if (null == e) return '' + e;
				if (e.overriddenName) return `${e.overriddenName}`;
				if (e.name) return `${e.name}`;
				const t = e.toString();
				if (null == t) return '' + t;
				const n = t.indexOf('\n');
				return -1 === n ? t : t.substring(0, n);
			}
			function bs(e, t) {
				return null == e || '' === e ? (null === t ? '' : t) : null == t || '' === t ? e : e + ' ' + t;
			}
			const z_ = q({ __forward_ref__: q });
			function Q(e) {
				return (
					(e.__forward_ref__ = Q),
					(e.toString = function () {
						return U(this());
					}),
					e
				);
			}
			function x(e) {
				return Tc(e) ? e() : e;
			}
			function Tc(e) {
				return 'function' == typeof e && e.hasOwnProperty(z_) && e.__forward_ref__ === Q;
			}
			class B extends Error {
				constructor(t, n) {
					super(
						(function Ms(e, t) {
							return `NG0${Math.abs(e)}${t ? ': ' + t : ''}`;
						})(t, n)
					),
						(this.code = t);
				}
			}
			function A(e) {
				return 'string' == typeof e ? e : null == e ? '' : String(e);
			}
			function Se(e) {
				return 'function' == typeof e
					? e.name || e.toString()
					: 'object' == typeof e && null != e && 'function' == typeof e.type
					? e.type.name || e.type.toString()
					: A(e);
			}
			function Io(e, t) {
				const n = t ? ` in ${t}` : '';
				throw new B(-201, `No provider for ${Se(e)} found${n}`);
			}
			function je(e, t) {
				null == e &&
					(function K(e, t, n, r) {
						throw new Error(`ASSERTION ERROR: ${e}` + (null == r ? '' : ` [Expected=> ${n} ${r} ${t} <=Actual]`));
					})(t, e, null, '!=');
			}
			function $(e) {
				return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
			}
			function ot(e) {
				return { providers: e.providers || [], imports: e.imports || [] };
			}
			function Is(e) {
				return Nc(e, Ao) || Nc(e, xc);
			}
			function Nc(e, t) {
				return e.hasOwnProperty(t) ? e[t] : null;
			}
			function Fc(e) {
				return e && (e.hasOwnProperty(As) || e.hasOwnProperty(Y_)) ? e[As] : null;
			}
			const Ao = q({ ɵprov: q }),
				As = q({ ɵinj: q }),
				xc = q({ ngInjectableDef: q }),
				Y_ = q({ ngInjectorDef: q });
			var N = (() => (
				((N = N || {})[(N.Default = 0)] = 'Default'),
				(N[(N.Host = 1)] = 'Host'),
				(N[(N.Self = 2)] = 'Self'),
				(N[(N.SkipSelf = 4)] = 'SkipSelf'),
				(N[(N.Optional = 8)] = 'Optional'),
				N
			))();
			let Ss;
			function Wt(e) {
				const t = Ss;
				return (Ss = e), t;
			}
			function Pc(e, t, n) {
				const r = Is(e);
				return r && 'root' == r.providedIn
					? void 0 === r.value
						? (r.value = r.factory())
						: r.value
					: n & N.Optional
					? null
					: void 0 !== t
					? t
					: void Io(U(e), 'Injector');
			}
			function Qt(e) {
				return { toString: e }.toString();
			}
			var it = (() => (((it = it || {})[(it.OnPush = 0)] = 'OnPush'), (it[(it.Default = 1)] = 'Default'), it))(),
				vt = (() => {
					return (
						((e = vt || (vt = {}))[(e.Emulated = 0)] = 'Emulated'),
						(e[(e.None = 2)] = 'None'),
						(e[(e.ShadowDom = 3)] = 'ShadowDom'),
						vt
					);
					var e;
				})();
			const eD = 'undefined' != typeof globalThis && globalThis,
				tD = 'undefined' != typeof window && window,
				nD = 'undefined' != typeof self && 'undefined' != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && self,
				z = eD || ('undefined' != typeof global && global) || tD || nD,
				Nn = {},
				W = [],
				So = q({ ɵcmp: q }),
				Ts = q({ ɵdir: q }),
				Ns = q({ ɵpipe: q }),
				Oc = q({ ɵmod: q }),
				Vt = q({ ɵfac: q }),
				wr = q({ __NG_ELEMENT_ID__: q });
			let rD = 0;
			function kt(e) {
				return Qt(() => {
					const n = {},
						r = {
							type: e.type,
							providersResolver: null,
							decls: e.decls,
							vars: e.vars,
							factory: null,
							template: e.template || null,
							consts: e.consts || null,
							ngContentSelectors: e.ngContentSelectors,
							hostBindings: e.hostBindings || null,
							hostVars: e.hostVars || 0,
							hostAttrs: e.hostAttrs || null,
							contentQueries: e.contentQueries || null,
							declaredInputs: n,
							inputs: null,
							outputs: null,
							exportAs: e.exportAs || null,
							onPush: e.changeDetection === it.OnPush,
							directiveDefs: null,
							pipeDefs: null,
							selectors: e.selectors || W,
							viewQuery: e.viewQuery || null,
							features: e.features || null,
							data: e.data || {},
							encapsulation: e.encapsulation || vt.Emulated,
							id: 'c',
							styles: e.styles || W,
							_: null,
							setInput: null,
							schemas: e.schemas || null,
							tView: null,
						},
						o = e.directives,
						i = e.features,
						s = e.pipes;
					return (
						(r.id += rD++),
						(r.inputs = Lc(e.inputs, n)),
						(r.outputs = Lc(e.outputs)),
						i && i.forEach((a) => a(r)),
						(r.directiveDefs = o ? () => ('function' == typeof o ? o() : o).map(Rc) : null),
						(r.pipeDefs = s ? () => ('function' == typeof s ? s() : s).map(Vc) : null),
						r
					);
				});
			}
			function Rc(e) {
				return (
					we(e) ||
					(function Zt(e) {
						return e[Ts] || null;
					})(e)
				);
			}
			function Vc(e) {
				return (function mn(e) {
					return e[Ns] || null;
				})(e);
			}
			const kc = {};
			function Ct(e) {
				return Qt(() => {
					const t = {
						type: e.type,
						bootstrap: e.bootstrap || W,
						declarations: e.declarations || W,
						imports: e.imports || W,
						exports: e.exports || W,
						transitiveCompileScopes: null,
						schemas: e.schemas || null,
						id: e.id || null,
					};
					return null != e.id && (kc[e.id] = e.type), t;
				});
			}
			function Lc(e, t) {
				if (null == e) return Nn;
				const n = {};
				for (const r in e)
					if (e.hasOwnProperty(r)) {
						let o = e[r],
							i = o;
						Array.isArray(o) && ((i = o[1]), (o = o[0])), (n[o] = r), t && (t[o] = i);
					}
				return n;
			}
			const S = kt;
			function we(e) {
				return e[So] || null;
			}
			function Je(e, t) {
				const n = e[Oc] || null;
				if (!n && !0 === t) throw new Error(`Type ${U(e)} does not have '\u0275mod' property.`);
				return n;
			}
			const P = 11,
				Z = 20;
			function wt(e) {
				return Array.isArray(e) && 'object' == typeof e[1];
			}
			function at(e) {
				return Array.isArray(e) && !0 === e[1];
			}
			function Ps(e) {
				return 0 != (8 & e.flags);
			}
			function xo(e) {
				return 2 == (2 & e.flags);
			}
			function Po(e) {
				return 1 == (1 & e.flags);
			}
			function ut(e) {
				return null !== e.template;
			}
			function lD(e) {
				return 0 != (512 & e[2]);
			}
			function vn(e, t) {
				return e.hasOwnProperty(Vt) ? e[Vt] : null;
			}
			class fD {
				constructor(t, n, r) {
					(this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
				}
				isFirstChange() {
					return this.firstChange;
				}
			}
			function Lt() {
				return Hc;
			}
			function Hc(e) {
				return e.type.prototype.ngOnChanges && (e.setInput = pD), hD;
			}
			function hD() {
				const e = $c(this),
					t = null == e ? void 0 : e.current;
				if (t) {
					const n = e.previous;
					if (n === Nn) e.previous = t;
					else for (let r in t) n[r] = t[r];
					(e.current = null), this.ngOnChanges(t);
				}
			}
			function pD(e, t, n, r) {
				const o =
						$c(e) ||
						(function gD(e, t) {
							return (e[jc] = t);
						})(e, { previous: Nn, current: null }),
					i = o.current || (o.current = {}),
					s = o.previous,
					a = this.declaredInputs[n],
					u = s[a];
				(i[a] = new fD(u && u.currentValue, t, s === Nn)), (e[r] = t);
			}
			Lt.ngInherit = !0;
			const jc = '__ngSimpleChanges__';
			function $c(e) {
				return e[jc] || null;
			}
			let Ls;
			function oe(e) {
				return !!e.listen;
			}
			const Uc = {
				createRenderer: (e, t) =>
					(function Bs() {
						return void 0 !== Ls ? Ls : 'undefined' != typeof document ? document : void 0;
					})(),
			};
			function le(e) {
				for (; Array.isArray(e); ) e = e[0];
				return e;
			}
			function Oo(e, t) {
				return le(t[e]);
			}
			function Xe(e, t) {
				return le(t[e.index]);
			}
			function Hs(e, t) {
				return e.data[t];
			}
			function Ue(e, t) {
				const n = t[e];
				return wt(n) ? n : n[0];
			}
			function js(e) {
				return 128 == (128 & e[2]);
			}
			function Jt(e, t) {
				return null == t ? null : e[t];
			}
			function zc(e) {
				e[18] = 0;
			}
			function $s(e, t) {
				e[5] += t;
				let n = e,
					r = e[3];
				for (; null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5])); ) (r[5] += t), (n = r), (r = r[3]);
			}
			const I = { lFrame: Xc(null), bindingsEnabled: !0, isInCheckNoChangesMode: !1 };
			function qc() {
				return I.bindingsEnabled;
			}
			function y() {
				return I.lFrame.lView;
			}
			function H() {
				return I.lFrame.tView;
			}
			function Us(e) {
				return (I.lFrame.contextLView = e), e[8];
			}
			function pe() {
				let e = Wc();
				for (; null !== e && 64 === e.type; ) e = e.parent;
				return e;
			}
			function Wc() {
				return I.lFrame.currentTNode;
			}
			function Et(e, t) {
				const n = I.lFrame;
				(n.currentTNode = e), (n.isParent = t);
			}
			function Gs() {
				return I.lFrame.isParent;
			}
			function zs() {
				I.lFrame.isParent = !1;
			}
			function Ro() {
				return I.isInCheckNoChangesMode;
			}
			function Vo(e) {
				I.isInCheckNoChangesMode = e;
			}
			function Vn() {
				return I.lFrame.bindingIndex++;
			}
			function xD(e, t) {
				const n = I.lFrame;
				(n.bindingIndex = n.bindingRootIndex = e), qs(t);
			}
			function qs(e) {
				I.lFrame.currentDirectiveIndex = e;
			}
			function Qs(e) {
				I.lFrame.currentQueryIndex = e;
			}
			function OD(e) {
				const t = e[1];
				return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
			}
			function Kc(e, t, n) {
				if (n & N.SkipSelf) {
					let o = t,
						i = e;
					for (; !((o = o.parent), null !== o || n & N.Host || ((o = OD(i)), null === o || ((i = i[15]), 10 & o.type))); );
					if (null === o) return !1;
					(t = o), (e = i);
				}
				const r = (I.lFrame = Yc());
				return (r.currentTNode = t), (r.lView = e), !0;
			}
			function ko(e) {
				const t = Yc(),
					n = e[1];
				(I.lFrame = t),
					(t.currentTNode = n.firstChild),
					(t.lView = e),
					(t.tView = n),
					(t.contextLView = e),
					(t.bindingIndex = n.bindingStartIndex),
					(t.inI18n = !1);
			}
			function Yc() {
				const e = I.lFrame,
					t = null === e ? null : e.child;
				return null === t ? Xc(e) : t;
			}
			function Xc(e) {
				const t = {
					currentTNode: null,
					isParent: !0,
					lView: null,
					tView: null,
					selectedIndex: -1,
					contextLView: null,
					elementDepthCount: 0,
					currentNamespace: null,
					currentDirectiveIndex: -1,
					bindingRootIndex: -1,
					bindingIndex: -1,
					currentQueryIndex: 0,
					parent: e,
					child: null,
					inI18n: !1,
				};
				return null !== e && (e.child = t), t;
			}
			function ed() {
				const e = I.lFrame;
				return (I.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
			}
			const td = ed;
			function Lo() {
				const e = ed();
				(e.isParent = !0),
					(e.tView = null),
					(e.selectedIndex = -1),
					(e.contextLView = null),
					(e.elementDepthCount = 0),
					(e.currentDirectiveIndex = -1),
					(e.currentNamespace = null),
					(e.bindingRootIndex = -1),
					(e.bindingIndex = -1),
					(e.currentQueryIndex = 0);
			}
			function Ne() {
				return I.lFrame.selectedIndex;
			}
			function Kt(e) {
				I.lFrame.selectedIndex = e;
			}
			function ie() {
				const e = I.lFrame;
				return Hs(e.tView, e.selectedIndex);
			}
			function Bo(e, t) {
				for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
					const i = e.data[n].type.prototype,
						{ ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: u, ngAfterViewChecked: l, ngOnDestroy: c } = i;
					s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
						a &&
							((e.contentHooks || (e.contentHooks = [])).push(n, a),
							(e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
						u && (e.viewHooks || (e.viewHooks = [])).push(-n, u),
						l && ((e.viewHooks || (e.viewHooks = [])).push(n, l), (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, l)),
						null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
				}
			}
			function Ho(e, t, n) {
				nd(e, t, 3, n);
			}
			function jo(e, t, n, r) {
				(3 & e[2]) === n && nd(e, t, n, r);
			}
			function Zs(e, t) {
				let n = e[2];
				(3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
			}
			function nd(e, t, n, r) {
				const i = null != r ? r : -1,
					s = t.length - 1;
				let a = 0;
				for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++)
					if ('number' == typeof t[u + 1]) {
						if (((a = t[u]), null != r && a >= r)) break;
					} else
						t[u] < 0 && (e[18] += 65536), (a < i || -1 == i) && (UD(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)), u++;
			}
			function UD(e, t, n, r) {
				const o = n[r] < 0,
					i = n[r + 1],
					a = e[o ? -n[r] : n[r]];
				if (o) {
					if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
						e[2] += 2048;
						try {
							i.call(a);
						} finally {
						}
					}
				} else
					try {
						i.call(a);
					} finally {
					}
			}
			class Ar {
				constructor(t, n, r) {
					(this.factory = t), (this.resolving = !1), (this.canSeeViewProviders = n), (this.injectImpl = r);
				}
			}
			function $o(e, t, n) {
				const r = oe(e);
				let o = 0;
				for (; o < n.length; ) {
					const i = n[o];
					if ('number' == typeof i) {
						if (0 !== i) break;
						o++;
						const s = n[o++],
							a = n[o++],
							u = n[o++];
						r ? e.setAttribute(t, a, u, s) : t.setAttributeNS(s, a, u);
					} else {
						const s = i,
							a = n[++o];
						Ks(s) ? r && e.setProperty(t, s, a) : r ? e.setAttribute(t, s, a) : t.setAttribute(s, a), o++;
					}
				}
				return o;
			}
			function rd(e) {
				return 3 === e || 4 === e || 6 === e;
			}
			function Ks(e) {
				return 64 === e.charCodeAt(0);
			}
			function Uo(e, t) {
				if (null !== t && 0 !== t.length)
					if (null === e || 0 === e.length) e = t.slice();
					else {
						let n = -1;
						for (let r = 0; r < t.length; r++) {
							const o = t[r];
							'number' == typeof o ? (n = o) : 0 === n || od(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
						}
					}
				return e;
			}
			function od(e, t, n, r, o) {
				let i = 0,
					s = e.length;
				if (-1 === t) s = -1;
				else
					for (; i < e.length; ) {
						const a = e[i++];
						if ('number' == typeof a) {
							if (a === t) {
								s = -1;
								break;
							}
							if (a > t) {
								s = i - 1;
								break;
							}
						}
					}
				for (; i < e.length; ) {
					const a = e[i];
					if ('number' == typeof a) break;
					if (a === n) {
						if (null === r) return void (null !== o && (e[i + 1] = o));
						if (r === e[i + 1]) return void (e[i + 2] = o);
					}
					i++, null !== r && i++, null !== o && i++;
				}
				-1 !== s && (e.splice(s, 0, t), (i = s + 1)),
					e.splice(i++, 0, n),
					null !== r && e.splice(i++, 0, r),
					null !== o && e.splice(i++, 0, o);
			}
			function id(e) {
				return -1 !== e;
			}
			function kn(e) {
				return 32767 & e;
			}
			function Ln(e, t) {
				let n = (function QD(e) {
						return e >> 16;
					})(e),
					r = t;
				for (; n > 0; ) (r = r[15]), n--;
				return r;
			}
			let Ys = !0;
			function Go(e) {
				const t = Ys;
				return (Ys = e), t;
			}
			let ZD = 0;
			function Tr(e, t) {
				const n = ea(e, t);
				if (-1 !== n) return n;
				const r = t[1];
				r.firstCreatePass && ((e.injectorIndex = t.length), Xs(r.data, e), Xs(t, null), Xs(r.blueprint, null));
				const o = zo(e, t),
					i = e.injectorIndex;
				if (id(o)) {
					const s = kn(o),
						a = Ln(o, t),
						u = a[1].data;
					for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
				}
				return (t[i + 8] = o), i;
			}
			function Xs(e, t) {
				e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
			}
			function ea(e, t) {
				return -1 === e.injectorIndex ||
					(e.parent && e.parent.injectorIndex === e.injectorIndex) ||
					null === t[e.injectorIndex + 8]
					? -1
					: e.injectorIndex;
			}
			function zo(e, t) {
				if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
				let n = 0,
					r = null,
					o = t;
				for (; null !== o; ) {
					const i = o[1],
						s = i.type;
					if (((r = 2 === s ? i.declTNode : 1 === s ? o[6] : null), null === r)) return -1;
					if ((n++, (o = o[15]), -1 !== r.injectorIndex)) return r.injectorIndex | (n << 16);
				}
				return -1;
			}
			function qo(e, t, n) {
				!(function JD(e, t, n) {
					let r;
					'string' == typeof n ? (r = n.charCodeAt(0) || 0) : n.hasOwnProperty(wr) && (r = n[wr]),
						null == r && (r = n[wr] = ZD++);
					const o = 255 & r;
					t.data[e + (o >> 5)] |= 1 << o;
				})(e, t, n);
			}
			function ud(e, t, n) {
				if (n & N.Optional) return e;
				Io(t, 'NodeInjector');
			}
			function ld(e, t, n, r) {
				if ((n & N.Optional && void 0 === r && (r = null), 0 == (n & (N.Self | N.Host)))) {
					const o = e[9],
						i = Wt(void 0);
					try {
						return o ? o.get(t, r, n & N.Optional) : Pc(t, r, n & N.Optional);
					} finally {
						Wt(i);
					}
				}
				return ud(r, t, n);
			}
			function cd(e, t, n, r = N.Default, o) {
				if (null !== e) {
					const i = (function ev(e) {
						if ('string' == typeof e) return e.charCodeAt(0) || 0;
						const t = e.hasOwnProperty(wr) ? e[wr] : void 0;
						return 'number' == typeof t ? (t >= 0 ? 255 & t : YD) : t;
					})(n);
					if ('function' == typeof i) {
						if (!Kc(t, e, r)) return r & N.Host ? ud(o, n, r) : ld(t, n, r, o);
						try {
							const s = i(r);
							if (null != s || r & N.Optional) return s;
							Io(n);
						} finally {
							td();
						}
					} else if ('number' == typeof i) {
						let s = null,
							a = ea(e, t),
							u = -1,
							l = r & N.Host ? t[16][6] : null;
						for (
							(-1 === a || r & N.SkipSelf) &&
							((u = -1 === a ? zo(e, t) : t[a + 8]),
							-1 !== u && hd(r, !1) ? ((s = t[1]), (a = kn(u)), (t = Ln(u, t))) : (a = -1));
							-1 !== a;

						) {
							const c = t[1];
							if (fd(i, a, c.data)) {
								const d = XD(a, t, n, s, r, l);
								if (d !== dd) return d;
							}
							(u = t[a + 8]),
								-1 !== u && hd(r, t[1].data[a + 8] === l) && fd(i, a, t) ? ((s = c), (a = kn(u)), (t = Ln(u, t))) : (a = -1);
						}
					}
				}
				return ld(t, n, r, o);
			}
			const dd = {};
			function YD() {
				return new Bn(pe(), y());
			}
			function XD(e, t, n, r, o, i) {
				const s = t[1],
					a = s.data[e + 8],
					c = (function Wo(e, t, n, r, o) {
						const i = e.providerIndexes,
							s = t.data,
							a = 1048575 & i,
							u = e.directiveStart,
							c = i >> 20,
							f = o ? a + c : e.directiveEnd;
						for (let h = r ? a : a + c; h < f; h++) {
							const p = s[h];
							if ((h < u && n === p) || (h >= u && p.type === n)) return h;
						}
						if (o) {
							const h = s[u];
							if (h && ut(h) && h.type === n) return u;
						}
						return null;
					})(a, s, n, null == r ? xo(a) && Ys : r != s && 0 != (3 & a.type), o & N.Host && i === a);
				return null !== c ? Nr(t, s, c, a) : dd;
			}
			function Nr(e, t, n, r) {
				let o = e[n];
				const i = t.data;
				if (
					(function GD(e) {
						return e instanceof Ar;
					})(o)
				) {
					const s = o;
					s.resolving &&
						(function q_(e, t) {
							const n = t ? `. Dependency path: ${t.join(' > ')} > ${e}` : '';
							throw new B(-200, `Circular dependency in DI detected for ${e}${n}`);
						})(Se(i[n]));
					const a = Go(s.canSeeViewProviders);
					s.resolving = !0;
					const u = s.injectImpl ? Wt(s.injectImpl) : null;
					Kc(e, r, N.Default);
					try {
						(o = e[n] = s.factory(void 0, i, e, r)),
							t.firstCreatePass &&
								n >= r.directiveStart &&
								(function $D(e, t, n) {
									const { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
									if (r) {
										const s = Hc(t);
										(n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
											(n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, s);
									}
									o && (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
										i &&
											((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
											(n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, i));
								})(n, i[n], t);
					} finally {
						null !== u && Wt(u), Go(a), (s.resolving = !1), td();
					}
				}
				return o;
			}
			function fd(e, t, n) {
				return !!(n[t + (e >> 5)] & (1 << e));
			}
			function hd(e, t) {
				return !(e & N.Self || (e & N.Host && t));
			}
			class Bn {
				constructor(t, n) {
					(this._tNode = t), (this._lView = n);
				}
				get(t, n, r) {
					return cd(this._tNode, this._lView, t, r, n);
				}
			}
			function ta(e) {
				return Tc(e)
					? () => {
							const t = ta(x(e));
							return t && t();
					  }
					: vn(e);
			}
			const jn = '__parameters__';
			function Un(e, t, n) {
				return Qt(() => {
					const r = (function ra(e) {
						return function (...n) {
							if (e) {
								const r = e(...n);
								for (const o in r) this[o] = r[o];
							}
						};
					})(t);
					function o(...i) {
						if (this instanceof o) return r.apply(this, i), this;
						const s = new o(...i);
						return (a.annotation = s), a;
						function a(u, l, c) {
							const d = u.hasOwnProperty(jn) ? u[jn] : Object.defineProperty(u, jn, { value: [] })[jn];
							for (; d.length <= c; ) d.push(null);
							return (d[c] = d[c] || []).push(s), u;
						}
					}
					return n && (o.prototype = Object.create(n.prototype)), (o.prototype.ngMetadataName = e), (o.annotationCls = o), o;
				});
			}
			class L {
				constructor(t, n) {
					(this._desc = t),
						(this.ngMetadataName = 'InjectionToken'),
						(this.ɵprov = void 0),
						'number' == typeof n
							? (this.__NG_ELEMENT_ID__ = n)
							: void 0 !== n && (this.ɵprov = $({ token: this, providedIn: n.providedIn || 'root', factory: n.factory }));
				}
				toString() {
					return `InjectionToken ${this._desc}`;
				}
			}
			function bt(e, t) {
				e.forEach((n) => (Array.isArray(n) ? bt(n, t) : t(n)));
			}
			function gd(e, t, n) {
				t >= e.length ? e.push(n) : e.splice(t, 0, n);
			}
			function Qo(e, t) {
				return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
			}
			function Ge(e, t, n) {
				let r = Gn(e, t);
				return (
					r >= 0
						? (e[1 | r] = n)
						: ((r = ~r),
						  (function ov(e, t, n, r) {
								let o = e.length;
								if (o == t) e.push(n, r);
								else if (1 === o) e.push(r, e[0]), (e[0] = n);
								else {
									for (o--, e.push(e[o - 1], e[o]); o > t; ) (e[o] = e[o - 2]), o--;
									(e[t] = n), (e[t + 1] = r);
								}
						  })(e, r, t, n)),
					r
				);
			}
			function ia(e, t) {
				const n = Gn(e, t);
				if (n >= 0) return e[1 | n];
			}
			function Gn(e, t) {
				return (function _d(e, t, n) {
					let r = 0,
						o = e.length >> n;
					for (; o !== r; ) {
						const i = r + ((o - r) >> 1),
							s = e[i << n];
						if (t === s) return i << n;
						s > t ? (o = i) : (r = i + 1);
					}
					return ~(o << n);
				})(e, t, 1);
			}
			const Or = {},
				aa = '__NG_DI_FLAG__',
				Jo = 'ngTempTokenPath',
				dv = /\n/gm,
				vd = '__source',
				hv = q({ provide: String, useValue: q });
			let Rr;
			function Cd(e) {
				const t = Rr;
				return (Rr = e), t;
			}
			function pv(e, t = N.Default) {
				if (void 0 === Rr) throw new B(203, '');
				return null === Rr ? Pc(e, void 0, t) : Rr.get(e, t & N.Optional ? null : void 0, t);
			}
			function V(e, t = N.Default) {
				return (
					(function X_() {
						return Ss;
					})() || pv
				)(x(e), t);
			}
			const gv = V;
			function ua(e) {
				const t = [];
				for (let n = 0; n < e.length; n++) {
					const r = x(e[n]);
					if (Array.isArray(r)) {
						if (0 === r.length) throw new B(900, '');
						let o,
							i = N.Default;
						for (let s = 0; s < r.length; s++) {
							const a = r[s],
								u = mv(a);
							'number' == typeof u ? (-1 === u ? (o = a.token) : (i |= u)) : (o = a);
						}
						t.push(V(o, i));
					} else t.push(V(r));
				}
				return t;
			}
			function Vr(e, t) {
				return (e[aa] = t), (e.prototype[aa] = t), e;
			}
			function mv(e) {
				return e[aa];
			}
			const Ko = Vr(Un('Optional'), 8),
				Yo = Vr(Un('SkipSelf'), 4);
			class Nd {
				constructor(t) {
					this.changingThisBreaksApplicationSecurity = t;
				}
				toString() {
					return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
				}
			}
			function Xt(e) {
				return e instanceof Nd ? e.changingThisBreaksApplicationSecurity : e;
			}
			const Lv = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi,
				Bv =
					/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
			var ce = (() => (
				((ce = ce || {})[(ce.NONE = 0)] = 'NONE'),
				(ce[(ce.HTML = 1)] = 'HTML'),
				(ce[(ce.STYLE = 2)] = 'STYLE'),
				(ce[(ce.SCRIPT = 3)] = 'SCRIPT'),
				(ce[(ce.URL = 4)] = 'URL'),
				(ce[(ce.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
				ce
			))();
			function oi(e) {
				const t = (function Hr() {
					const e = y();
					return e && e[12];
				})();
				return t
					? t.sanitize(ce.URL, e) || ''
					: (function Lr(e, t) {
							const n = (function Ov(e) {
								return (e instanceof Nd && e.getTypeName()) || null;
							})(e);
							if (null != n && n !== t) {
								if ('ResourceURL' === n && 'URL' === t) return !0;
								throw new Error(`Required a safe ${t}, got a ${n} (see https://g.co/ng/security#xss)`);
							}
							return n === t;
					  })(e, 'URL')
					? Xt(e)
					: (function ni(e) {
							return (e = String(e)).match(Lv) || e.match(Bv) ? e : 'unsafe:' + e;
					  })(A(e));
			}
			const Hd = '__ngContext__';
			function Me(e, t) {
				e[Hd] = t;
			}
			function _a(e) {
				const t = (function jr(e) {
					return e[Hd] || null;
				})(e);
				return t ? (Array.isArray(t) ? t : t.lView) : null;
			}
			function va(e) {
				return e.ngOriginalError;
			}
			function uC(e, ...t) {
				e.error(...t);
			}
			class $r {
				constructor() {
					this._console = console;
				}
				handleError(t) {
					const n = this._findOriginalError(t),
						r = (function aC(e) {
							return (e && e.ngErrorLogger) || uC;
						})(t);
					r(this._console, 'ERROR', t), n && r(this._console, 'ORIGINAL ERROR', n);
				}
				_findOriginalError(t) {
					let n = t && va(t);
					for (; n && va(n); ) n = va(n);
					return n || null;
				}
			}
			const _C = (() => (('undefined' != typeof requestAnimationFrame && requestAnimationFrame) || setTimeout).bind(z))();
			function It(e) {
				return e instanceof Function ? e() : e;
			}
			var ze = (() => (((ze = ze || {})[(ze.Important = 1)] = 'Important'), (ze[(ze.DashCase = 2)] = 'DashCase'), ze))();
			function wa(e, t) {
				return undefined(e, t);
			}
			function Ur(e) {
				const t = e[3];
				return at(t) ? t[3] : t;
			}
			function Ea(e) {
				return Zd(e[13]);
			}
			function ba(e) {
				return Zd(e[4]);
			}
			function Zd(e) {
				for (; null !== e && !at(e); ) e = e[4];
				return e;
			}
			function Qn(e, t, n, r, o) {
				if (null != r) {
					let i,
						s = !1;
					at(r) ? (i = r) : wt(r) && ((s = !0), (r = r[0]));
					const a = le(r);
					0 === e && null !== n
						? null == o
							? tf(t, n, a)
							: Cn(t, n, a, o || null, !0)
						: 1 === e && null !== n
						? Cn(t, n, a, o || null, !0)
						: 2 === e
						? (function lf(e, t, n) {
								const r = ii(e, t);
								r &&
									(function xC(e, t, n, r) {
										oe(e) ? e.removeChild(t, n, r) : t.removeChild(n);
									})(e, r, t, n);
						  })(t, a, s)
						: 3 === e && t.destroyNode(a),
						null != i &&
							(function RC(e, t, n, r, o) {
								const i = n[7];
								i !== le(n) && Qn(t, e, r, i, o);
								for (let a = 10; a < n.length; a++) {
									const u = n[a];
									Gr(u[1], u, e, t, r, i);
								}
							})(t, e, i, n, o);
				}
			}
			function Ia(e, t, n) {
				if (oe(e)) return e.createElement(t, n);
				{
					const r =
						null !== n
							? (function DD(e) {
									const t = e.toLowerCase();
									return 'svg' === t ? 'http://www.w3.org/2000/svg' : 'math' === t ? 'http://www.w3.org/1998/MathML/' : null;
							  })(n)
							: null;
					return null === r ? e.createElement(t) : e.createElementNS(r, t);
				}
			}
			function Kd(e, t) {
				const n = e[9],
					r = n.indexOf(t),
					o = t[3];
				1024 & t[2] && ((t[2] &= -1025), $s(o, -1)), n.splice(r, 1);
			}
			function Aa(e, t) {
				if (e.length <= 10) return;
				const n = 10 + t,
					r = e[n];
				if (r) {
					const o = r[17];
					null !== o && o !== e && Kd(o, r), t > 0 && (e[n - 1][4] = r[4]);
					const i = Qo(e, 10 + t);
					!(function bC(e, t) {
						Gr(e, t, t[P], 2, null, null), (t[0] = null), (t[6] = null);
					})(r[1], r);
					const s = i[19];
					null !== s && s.detachView(i[1]), (r[3] = null), (r[4] = null), (r[2] &= -129);
				}
				return r;
			}
			function Yd(e, t) {
				if (!(256 & t[2])) {
					const n = t[P];
					oe(n) && n.destroyNode && Gr(e, t, n, 3, null, null),
						(function AC(e) {
							let t = e[13];
							if (!t) return Sa(e[1], e);
							for (; t; ) {
								let n = null;
								if (wt(t)) n = t[13];
								else {
									const r = t[10];
									r && (n = r);
								}
								if (!n) {
									for (; t && !t[4] && t !== e; ) wt(t) && Sa(t[1], t), (t = t[3]);
									null === t && (t = e), wt(t) && Sa(t[1], t), (n = t && t[4]);
								}
								t = n;
							}
						})(t);
				}
			}
			function Sa(e, t) {
				if (!(256 & t[2])) {
					(t[2] &= -129),
						(t[2] |= 256),
						(function FC(e, t) {
							let n;
							if (null != e && null != (n = e.destroyHooks))
								for (let r = 0; r < n.length; r += 2) {
									const o = t[n[r]];
									if (!(o instanceof Ar)) {
										const i = n[r + 1];
										if (Array.isArray(i))
											for (let s = 0; s < i.length; s += 2) {
												const a = o[i[s]],
													u = i[s + 1];
												try {
													u.call(a);
												} finally {
												}
											}
										else
											try {
												i.call(o);
											} finally {
											}
									}
								}
						})(e, t),
						(function NC(e, t) {
							const n = e.cleanup,
								r = t[7];
							let o = -1;
							if (null !== n)
								for (let i = 0; i < n.length - 1; i += 2)
									if ('string' == typeof n[i]) {
										const s = n[i + 1],
											a = 'function' == typeof s ? s(t) : le(t[s]),
											u = r[(o = n[i + 2])],
											l = n[i + 3];
										'boolean' == typeof l ? a.removeEventListener(n[i], u, l) : l >= 0 ? r[(o = l)]() : r[(o = -l)].unsubscribe(),
											(i += 2);
									} else {
										const s = r[(o = n[i + 1])];
										n[i].call(s);
									}
							if (null !== r) {
								for (let i = o + 1; i < r.length; i++) r[i]();
								t[7] = null;
							}
						})(e, t),
						1 === t[1].type && oe(t[P]) && t[P].destroy();
					const n = t[17];
					if (null !== n && at(t[3])) {
						n !== t[3] && Kd(n, t);
						const r = t[19];
						null !== r && r.detachView(e);
					}
				}
			}
			function Xd(e, t, n) {
				return (function ef(e, t, n) {
					let r = t;
					for (; null !== r && 40 & r.type; ) r = (t = r).parent;
					if (null === r) return n[0];
					if (2 & r.flags) {
						const o = e.data[r.directiveStart].encapsulation;
						if (o === vt.None || o === vt.Emulated) return null;
					}
					return Xe(r, n);
				})(e, t.parent, n);
			}
			function Cn(e, t, n, r, o) {
				oe(e) ? e.insertBefore(t, n, r, o) : t.insertBefore(n, r, o);
			}
			function tf(e, t, n) {
				oe(e) ? e.appendChild(t, n) : t.appendChild(n);
			}
			function nf(e, t, n, r, o) {
				null !== r ? Cn(e, t, n, r, o) : tf(e, t, n);
			}
			function ii(e, t) {
				return oe(e) ? e.parentNode(t) : t.parentNode;
			}
			let sf = function of(e, t, n) {
				return 40 & e.type ? Xe(e, n) : null;
			};
			function si(e, t, n, r) {
				const o = Xd(e, r, t),
					i = t[P],
					a = (function rf(e, t, n) {
						return sf(e, t, n);
					})(r.parent || t[6], r, t);
				if (null != o)
					if (Array.isArray(n)) for (let u = 0; u < n.length; u++) nf(i, o, n[u], a, !1);
					else nf(i, o, n, a, !1);
			}
			function ai(e, t) {
				if (null !== t) {
					const n = t.type;
					if (3 & n) return Xe(t, e);
					if (4 & n) return Na(-1, e[t.index]);
					if (8 & n) {
						const r = t.child;
						if (null !== r) return ai(e, r);
						{
							const o = e[t.index];
							return at(o) ? Na(-1, o) : le(o);
						}
					}
					if (32 & n) return wa(t, e)() || le(e[t.index]);
					{
						const r = uf(e, t);
						return null !== r ? (Array.isArray(r) ? r[0] : ai(Ur(e[16]), r)) : ai(e, t.next);
					}
				}
				return null;
			}
			function uf(e, t) {
				return null !== t ? e[16][6].projection[t.projection] : null;
			}
			function Na(e, t) {
				const n = 10 + e + 1;
				if (n < t.length) {
					const r = t[n],
						o = r[1].firstChild;
					if (null !== o) return ai(r, o);
				}
				return t[7];
			}
			function Fa(e, t, n, r, o, i, s) {
				for (; null != n; ) {
					const a = r[n.index],
						u = n.type;
					if ((s && 0 === t && (a && Me(le(a), r), (n.flags |= 4)), 64 != (64 & n.flags)))
						if (8 & u) Fa(e, t, n.child, r, o, i, !1), Qn(t, e, o, a, i);
						else if (32 & u) {
							const l = wa(n, r);
							let c;
							for (; (c = l()); ) Qn(t, e, o, c, i);
							Qn(t, e, o, a, i);
						} else 16 & u ? cf(e, t, r, n, o, i) : Qn(t, e, o, a, i);
					n = s ? n.projectionNext : n.next;
				}
			}
			function Gr(e, t, n, r, o, i) {
				Fa(n, r, e.firstChild, t, o, i, !1);
			}
			function cf(e, t, n, r, o, i) {
				const s = n[16],
					u = s[6].projection[r.projection];
				if (Array.isArray(u)) for (let l = 0; l < u.length; l++) Qn(t, e, o, u[l], i);
				else Fa(e, t, u, s[3], o, i, !0);
			}
			function df(e, t, n) {
				oe(e) ? e.setAttribute(t, 'style', n) : (t.style.cssText = n);
			}
			function xa(e, t, n) {
				oe(e) ? ('' === n ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n)) : (t.className = n);
			}
			function ff(e, t, n) {
				let r = e.length;
				for (;;) {
					const o = e.indexOf(t, n);
					if (-1 === o) return o;
					if (0 === o || e.charCodeAt(o - 1) <= 32) {
						const i = t.length;
						if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
					}
					n = o + 1;
				}
			}
			const hf = 'ng-template';
			function kC(e, t, n) {
				let r = 0;
				for (; r < e.length; ) {
					let o = e[r++];
					if (n && 'class' === o) {
						if (((o = e[r]), -1 !== ff(o.toLowerCase(), t, 0))) return !0;
					} else if (1 === o) {
						for (; r < e.length && 'string' == typeof (o = e[r++]); ) if (o.toLowerCase() === t) return !0;
						return !1;
					}
				}
				return !1;
			}
			function pf(e) {
				return 4 === e.type && e.value !== hf;
			}
			function LC(e, t, n) {
				return t === (4 !== e.type || n ? e.value : hf);
			}
			function BC(e, t, n) {
				let r = 4;
				const o = e.attrs || [],
					i = (function $C(e) {
						for (let t = 0; t < e.length; t++) if (rd(e[t])) return t;
						return e.length;
					})(o);
				let s = !1;
				for (let a = 0; a < t.length; a++) {
					const u = t[a];
					if ('number' != typeof u) {
						if (!s)
							if (4 & r) {
								if (((r = 2 | (1 & r)), ('' !== u && !LC(e, u, n)) || ('' === u && 1 === t.length))) {
									if (lt(r)) return !1;
									s = !0;
								}
							} else {
								const l = 8 & r ? u : t[++a];
								if (8 & r && null !== e.attrs) {
									if (!kC(e.attrs, l, n)) {
										if (lt(r)) return !1;
										s = !0;
									}
									continue;
								}
								const d = HC(8 & r ? 'class' : u, o, pf(e), n);
								if (-1 === d) {
									if (lt(r)) return !1;
									s = !0;
									continue;
								}
								if ('' !== l) {
									let f;
									f = d > i ? '' : o[d + 1].toLowerCase();
									const h = 8 & r ? f : null;
									if ((h && -1 !== ff(h, l, 0)) || (2 & r && l !== f)) {
										if (lt(r)) return !1;
										s = !0;
									}
								}
							}
					} else {
						if (!s && !lt(r) && !lt(u)) return !1;
						if (s && lt(u)) continue;
						(s = !1), (r = u | (1 & r));
					}
				}
				return lt(r) || s;
			}
			function lt(e) {
				return 0 == (1 & e);
			}
			function HC(e, t, n, r) {
				if (null === t) return -1;
				let o = 0;
				if (r || !n) {
					let i = !1;
					for (; o < t.length; ) {
						const s = t[o];
						if (s === e) return o;
						if (3 === s || 6 === s) i = !0;
						else {
							if (1 === s || 2 === s) {
								let a = t[++o];
								for (; 'string' == typeof a; ) a = t[++o];
								continue;
							}
							if (4 === s) break;
							if (0 === s) {
								o += 4;
								continue;
							}
						}
						o += i ? 1 : 2;
					}
					return -1;
				}
				return (function UC(e, t) {
					let n = e.indexOf(4);
					if (n > -1)
						for (n++; n < e.length; ) {
							const r = e[n];
							if ('number' == typeof r) return -1;
							if (r === t) return n;
							n++;
						}
					return -1;
				})(t, e);
			}
			function gf(e, t, n = !1) {
				for (let r = 0; r < t.length; r++) if (BC(e, t[r], n)) return !0;
				return !1;
			}
			function mf(e, t) {
				return e ? ':not(' + t.trim() + ')' : t;
			}
			function zC(e) {
				let t = e[0],
					n = 1,
					r = 2,
					o = '',
					i = !1;
				for (; n < e.length; ) {
					let s = e[n];
					if ('string' == typeof s)
						if (2 & r) {
							const a = e[++n];
							o += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
						} else 8 & r ? (o += '.' + s) : 4 & r && (o += ' ' + s);
					else '' !== o && !lt(s) && ((t += mf(i, o)), (o = '')), (r = s), (i = i || !lt(r));
					n++;
				}
				return '' !== o && (t += mf(i, o)), t;
			}
			const T = {};
			function ke(e) {
				yf(H(), y(), Ne() + e, Ro());
			}
			function yf(e, t, n, r) {
				if (!r)
					if (3 == (3 & t[2])) {
						const i = e.preOrderCheckHooks;
						null !== i && Ho(t, i, n);
					} else {
						const i = e.preOrderHooks;
						null !== i && jo(t, i, 0, n);
					}
				Kt(n);
			}
			function ui(e, t) {
				return (e << 17) | (t << 2);
			}
			function ct(e) {
				return (e >> 17) & 32767;
			}
			function Pa(e) {
				return 2 | e;
			}
			function jt(e) {
				return (131068 & e) >> 2;
			}
			function Oa(e, t) {
				return (-131069 & e) | (t << 2);
			}
			function Ra(e) {
				return 1 | e;
			}
			function Sf(e, t) {
				const n = e.contentQueries;
				if (null !== n)
					for (let r = 0; r < n.length; r += 2) {
						const o = n[r],
							i = n[r + 1];
						if (-1 !== i) {
							const s = e.data[i];
							Qs(o), s.contentQueries(2, t[i], i);
						}
					}
			}
			function zr(e, t, n, r, o, i, s, a, u, l) {
				const c = t.blueprint.slice();
				return (
					(c[0] = o),
					(c[2] = 140 | r),
					zc(c),
					(c[3] = c[15] = e),
					(c[8] = n),
					(c[10] = s || (e && e[10])),
					(c[P] = a || (e && e[P])),
					(c[12] = u || (e && e[12]) || null),
					(c[9] = l || (e && e[9]) || null),
					(c[6] = i),
					(c[16] = 2 == t.type ? e[16] : c),
					c
				);
			}
			function Zn(e, t, n, r, o) {
				let i = e.data[t];
				if (null === i)
					(i = (function Ga(e, t, n, r, o) {
						const i = Wc(),
							s = Gs(),
							u = (e.data[t] = (function lw(e, t, n, r, o, i) {
								return {
									type: n,
									index: r,
									insertBeforeIndex: null,
									injectorIndex: t ? t.injectorIndex : -1,
									directiveStart: -1,
									directiveEnd: -1,
									directiveStylingLast: -1,
									propertyBindings: null,
									flags: 0,
									providerIndexes: 0,
									value: o,
									attrs: i,
									mergedAttrs: null,
									localNames: null,
									initialInputs: void 0,
									inputs: null,
									outputs: null,
									tViews: null,
									next: null,
									projectionNext: null,
									child: null,
									parent: t,
									projection: null,
									styles: null,
									stylesWithoutHost: null,
									residualStyles: void 0,
									classes: null,
									classesWithoutHost: null,
									residualClasses: void 0,
									classBindings: 0,
									styleBindings: 0,
								};
							})(0, s ? i : i && i.parent, n, t, r, o));
						return (
							null === e.firstChild && (e.firstChild = u),
							null !== i && (s ? null == i.child && null !== u.parent && (i.child = u) : null === i.next && (i.next = u)),
							u
						);
					})(e, t, n, r, o)),
						(function FD() {
							return I.lFrame.inI18n;
						})() && (i.flags |= 64);
				else if (64 & i.type) {
					(i.type = n), (i.value = r), (i.attrs = o);
					const s = (function Ir() {
						const e = I.lFrame,
							t = e.currentTNode;
						return e.isParent ? t : t.parent;
					})();
					i.injectorIndex = null === s ? -1 : s.injectorIndex;
				}
				return Et(i, !0), i;
			}
			function Jn(e, t, n, r) {
				if (0 === n) return -1;
				const o = t.length;
				for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
				return o;
			}
			function qr(e, t, n) {
				ko(t);
				try {
					const r = e.viewQuery;
					null !== r && Xa(1, r, n);
					const o = e.template;
					null !== o && Tf(e, t, o, 1, n),
						e.firstCreatePass && (e.firstCreatePass = !1),
						e.staticContentQueries && Sf(e, t),
						e.staticViewQueries && Xa(2, e.viewQuery, n);
					const i = e.components;
					null !== i &&
						(function sw(e, t) {
							for (let n = 0; n < t.length; n++) Aw(e, t[n]);
						})(t, i);
				} catch (r) {
					throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
				} finally {
					(t[2] &= -5), Lo();
				}
			}
			function Kn(e, t, n, r) {
				const o = t[2];
				if (256 == (256 & o)) return;
				ko(t);
				const i = Ro();
				try {
					zc(t),
						(function Qc(e) {
							return (I.lFrame.bindingIndex = e);
						})(e.bindingStartIndex),
						null !== n && Tf(e, t, n, 2, r);
					const s = 3 == (3 & o);
					if (!i)
						if (s) {
							const l = e.preOrderCheckHooks;
							null !== l && Ho(t, l, null);
						} else {
							const l = e.preOrderHooks;
							null !== l && jo(t, l, 0, null), Zs(t, 0);
						}
					if (
						((function Mw(e) {
							for (let t = Ea(e); null !== t; t = ba(t)) {
								if (!t[2]) continue;
								const n = t[9];
								for (let r = 0; r < n.length; r++) {
									const o = n[r],
										i = o[3];
									0 == (1024 & o[2]) && $s(i, 1), (o[2] |= 1024);
								}
							}
						})(t),
						(function bw(e) {
							for (let t = Ea(e); null !== t; t = ba(t))
								for (let n = 10; n < t.length; n++) {
									const r = t[n],
										o = r[1];
									js(r) && Kn(o, r, o.template, r[8]);
								}
						})(t),
						null !== e.contentQueries && Sf(e, t),
						!i)
					)
						if (s) {
							const l = e.contentCheckHooks;
							null !== l && Ho(t, l);
						} else {
							const l = e.contentHooks;
							null !== l && jo(t, l, 1), Zs(t, 1);
						}
					!(function ow(e, t) {
						const n = e.hostBindingOpCodes;
						if (null !== n)
							try {
								for (let r = 0; r < n.length; r++) {
									const o = n[r];
									if (o < 0) Kt(~o);
									else {
										const i = o,
											s = n[++r],
											a = n[++r];
										xD(s, i), a(2, t[i]);
									}
								}
							} finally {
								Kt(-1);
							}
					})(e, t);
					const a = e.components;
					null !== a &&
						(function iw(e, t) {
							for (let n = 0; n < t.length; n++) Iw(e, t[n]);
						})(t, a);
					const u = e.viewQuery;
					if ((null !== u && Xa(2, u, r), !i))
						if (s) {
							const l = e.viewCheckHooks;
							null !== l && Ho(t, l);
						} else {
							const l = e.viewHooks;
							null !== l && jo(t, l, 2), Zs(t, 2);
						}
					!0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
						i || (t[2] &= -73),
						1024 & t[2] && ((t[2] &= -1025), $s(t[3], -1));
				} finally {
					Lo();
				}
			}
			function aw(e, t, n, r) {
				const o = t[10],
					i = !Ro(),
					s = (function Gc(e) {
						return 4 == (4 & e[2]);
					})(t);
				try {
					i && !s && o.begin && o.begin(), s && qr(e, t, r), Kn(e, t, n, r);
				} finally {
					i && !s && o.end && o.end();
				}
			}
			function Tf(e, t, n, r, o) {
				const i = Ne(),
					s = 2 & r;
				try {
					Kt(-1), s && t.length > Z && yf(e, t, Z, Ro()), n(r, o);
				} finally {
					Kt(i);
				}
			}
			function Nf(e, t, n) {
				if (Ps(t)) {
					const o = t.directiveEnd;
					for (let i = t.directiveStart; i < o; i++) {
						const s = e.data[i];
						s.contentQueries && s.contentQueries(1, n[i], i);
					}
				}
			}
			function za(e, t, n) {
				!qc() ||
					((function mw(e, t, n, r) {
						const o = n.directiveStart,
							i = n.directiveEnd;
						e.firstCreatePass || Tr(n, t), Me(r, t);
						const s = n.initialInputs;
						for (let a = o; a < i; a++) {
							const u = e.data[a],
								l = ut(u);
							l && Cw(t, n, u);
							const c = Nr(t, e, a, n);
							Me(c, t), null !== s && ww(0, a - o, c, u, 0, s), l && (Ue(n.index, t)[8] = c);
						}
					})(e, t, n, Xe(n, t)),
					128 == (128 & n.flags) &&
						(function yw(e, t, n) {
							const r = n.directiveStart,
								o = n.directiveEnd,
								s = n.index,
								a = (function PD() {
									return I.lFrame.currentDirectiveIndex;
								})();
							try {
								Kt(s);
								for (let u = r; u < o; u++) {
									const l = e.data[u],
										c = t[u];
									qs(u), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && Lf(l, c);
								}
							} finally {
								Kt(-1), qs(a);
							}
						})(e, t, n));
			}
			function qa(e, t, n = Xe) {
				const r = t.localNames;
				if (null !== r) {
					let o = t.index + 1;
					for (let i = 0; i < r.length; i += 2) {
						const s = r[i + 1],
							a = -1 === s ? n(t, e) : e[s];
						e[o++] = a;
					}
				}
			}
			function Ff(e) {
				const t = e.tView;
				return null === t || t.incompleteFirstPass
					? (e.tView = di(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts))
					: t;
			}
			function di(e, t, n, r, o, i, s, a, u, l) {
				const c = Z + r,
					d = c + o,
					f = (function uw(e, t) {
						const n = [];
						for (let r = 0; r < t; r++) n.push(r < e ? null : T);
						return n;
					})(c, d),
					h = 'function' == typeof l ? l() : l;
				return (f[1] = {
					type: e,
					blueprint: f,
					template: n,
					queries: null,
					viewQuery: a,
					declTNode: t,
					data: f.slice().fill(null, c),
					bindingStartIndex: c,
					expandoStartIndex: d,
					hostBindingOpCodes: null,
					firstCreatePass: !0,
					firstUpdatePass: !0,
					staticViewQueries: !1,
					staticContentQueries: !1,
					preOrderHooks: null,
					preOrderCheckHooks: null,
					contentHooks: null,
					contentCheckHooks: null,
					viewHooks: null,
					viewCheckHooks: null,
					destroyHooks: null,
					cleanup: null,
					contentQueries: null,
					components: null,
					directiveRegistry: 'function' == typeof i ? i() : i,
					pipeRegistry: 'function' == typeof s ? s() : s,
					firstChild: null,
					schemas: u,
					consts: h,
					incompleteFirstPass: !1,
				});
			}
			function Rf(e, t, n) {
				for (let r in e)
					if (e.hasOwnProperty(r)) {
						const o = e[r];
						(n = null === n ? {} : n).hasOwnProperty(r) ? n[r].push(t, o) : (n[r] = [t, o]);
					}
				return n;
			}
			function qe(e, t, n, r, o, i, s, a) {
				const u = Xe(t, n);
				let c,
					l = t.inputs;
				!a && null != l && (c = l[r])
					? (Qf(e, n, c, r, o),
					  xo(t) &&
							(function fw(e, t) {
								const n = Ue(t, e);
								16 & n[2] || (n[2] |= 64);
							})(n, t.index))
					: 3 & t.type &&
					  ((r = (function dw(e) {
							return 'class' === e
								? 'className'
								: 'for' === e
								? 'htmlFor'
								: 'formaction' === e
								? 'formAction'
								: 'innerHtml' === e
								? 'innerHTML'
								: 'readonly' === e
								? 'readOnly'
								: 'tabindex' === e
								? 'tabIndex'
								: e;
					  })(r)),
					  (o = null != s ? s(o, t.value || '', r) : o),
					  oe(i) ? i.setProperty(u, r, o) : Ks(r) || (u.setProperty ? u.setProperty(r, o) : (u[r] = o)));
			}
			function Wa(e, t, n, r) {
				let o = !1;
				if (qc()) {
					const i = (function _w(e, t, n) {
							const r = e.directiveRegistry;
							let o = null;
							if (r)
								for (let i = 0; i < r.length; i++) {
									const s = r[i];
									gf(n, s.selectors, !1) &&
										(o || (o = []), qo(Tr(n, t), e, s.type), ut(s) ? (Bf(e, n), o.unshift(s)) : o.push(s));
								}
							return o;
						})(e, t, n),
						s = null === r ? null : { '': -1 };
					if (null !== i) {
						(o = !0), Hf(n, e.data.length, i.length);
						for (let c = 0; c < i.length; c++) {
							const d = i[c];
							d.providersResolver && d.providersResolver(d);
						}
						let a = !1,
							u = !1,
							l = Jn(e, t, i.length, null);
						for (let c = 0; c < i.length; c++) {
							const d = i[c];
							(n.mergedAttrs = Uo(n.mergedAttrs, d.hostAttrs)),
								jf(e, n, t, l, d),
								vw(l, d, s),
								null !== d.contentQueries && (n.flags |= 8),
								(null !== d.hostBindings || null !== d.hostAttrs || 0 !== d.hostVars) && (n.flags |= 128);
							const f = d.type.prototype;
							!a &&
								(f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
								((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index), (a = !0)),
								!u &&
									(f.ngOnChanges || f.ngDoCheck) &&
									((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(n.index), (u = !0)),
								l++;
						}
						!(function cw(e, t) {
							const r = t.directiveEnd,
								o = e.data,
								i = t.attrs,
								s = [];
							let a = null,
								u = null;
							for (let l = t.directiveStart; l < r; l++) {
								const c = o[l],
									d = c.inputs,
									f = null === i || pf(t) ? null : Ew(d, i);
								s.push(f), (a = Rf(d, l, a)), (u = Rf(c.outputs, l, u));
							}
							null !== a && (a.hasOwnProperty('class') && (t.flags |= 16), a.hasOwnProperty('style') && (t.flags |= 32)),
								(t.initialInputs = s),
								(t.inputs = a),
								(t.outputs = u);
						})(e, n);
					}
					s &&
						(function Dw(e, t, n) {
							if (t) {
								const r = (e.localNames = []);
								for (let o = 0; o < t.length; o += 2) {
									const i = n[t[o + 1]];
									if (null == i) throw new B(-301, !1);
									r.push(t[o], i);
								}
							}
						})(n, r, s);
				}
				return (n.mergedAttrs = Uo(n.mergedAttrs, n.attrs)), o;
			}
			function kf(e, t, n, r, o, i) {
				const s = i.hostBindings;
				if (s) {
					let a = e.hostBindingOpCodes;
					null === a && (a = e.hostBindingOpCodes = []);
					const u = ~t.index;
					(function gw(e) {
						let t = e.length;
						for (; t > 0; ) {
							const n = e[--t];
							if ('number' == typeof n && n < 0) return n;
						}
						return 0;
					})(a) != u && a.push(u),
						a.push(r, o, s);
				}
			}
			function Lf(e, t) {
				null !== e.hostBindings && e.hostBindings(1, t);
			}
			function Bf(e, t) {
				(t.flags |= 2), (e.components || (e.components = [])).push(t.index);
			}
			function vw(e, t, n) {
				if (n) {
					if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
					ut(t) && (n[''] = e);
				}
			}
			function Hf(e, t, n) {
				(e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t);
			}
			function jf(e, t, n, r, o) {
				e.data[r] = o;
				const i = o.factory || (o.factory = vn(o.type)),
					s = new Ar(i, ut(o), null);
				(e.blueprint[r] = s), (n[r] = s), kf(e, t, 0, r, Jn(e, n, o.hostVars, T), o);
			}
			function Cw(e, t, n) {
				const r = Xe(t, e),
					o = Ff(n),
					i = e[10],
					s = fi(e, zr(e, o, null, n.onPush ? 64 : 16, r, t, i, i.createRenderer(r, n), null, null));
				e[t.index] = s;
			}
			function ww(e, t, n, r, o, i) {
				const s = i[t];
				if (null !== s) {
					const a = r.setInput;
					for (let u = 0; u < s.length; ) {
						const l = s[u++],
							c = s[u++],
							d = s[u++];
						null !== a ? r.setInput(n, d, l, c) : (n[c] = d);
					}
				}
			}
			function Ew(e, t) {
				let n = null,
					r = 0;
				for (; r < t.length; ) {
					const o = t[r];
					if (0 !== o)
						if (5 !== o) {
							if ('number' == typeof o) break;
							e.hasOwnProperty(o) && (null === n && (n = []), n.push(o, e[o], t[r + 1])), (r += 2);
						} else r += 2;
					else r += 4;
				}
				return n;
			}
			function $f(e, t, n, r) {
				return new Array(e, !0, !1, t, null, 0, r, n, null, null);
			}
			function Iw(e, t) {
				const n = Ue(t, e);
				if (js(n)) {
					const r = n[1];
					80 & n[2] ? Kn(r, n, r.template, n[8]) : n[5] > 0 && Za(n);
				}
			}
			function Za(e) {
				for (let r = Ea(e); null !== r; r = ba(r))
					for (let o = 10; o < r.length; o++) {
						const i = r[o];
						if (1024 & i[2]) {
							const s = i[1];
							Kn(s, i, s.template, i[8]);
						} else i[5] > 0 && Za(i);
					}
				const n = e[1].components;
				if (null !== n)
					for (let r = 0; r < n.length; r++) {
						const o = Ue(n[r], e);
						js(o) && o[5] > 0 && Za(o);
					}
			}
			function Aw(e, t) {
				const n = Ue(t, e),
					r = n[1];
				(function Sw(e, t) {
					for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
				})(r, n),
					qr(r, n, n[8]);
			}
			function fi(e, t) {
				return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
			}
			function Ja(e) {
				for (; e; ) {
					e[2] |= 64;
					const t = Ur(e);
					if (lD(e) && !t) return e;
					e = t;
				}
				return null;
			}
			function Ya(e, t, n) {
				const r = t[10];
				r.begin && r.begin();
				try {
					Kn(e, t, e.template, n);
				} catch (o) {
					throw (Wf(t, o), o);
				} finally {
					r.end && r.end();
				}
			}
			function Uf(e) {
				!(function Ka(e) {
					for (let t = 0; t < e.components.length; t++) {
						const n = e.components[t],
							r = _a(n),
							o = r[1];
						aw(o, r, o.template, n);
					}
				})(e[8]);
			}
			function Xa(e, t, n) {
				Qs(0), t(e, n);
			}
			const xw = (() => Promise.resolve(null))();
			function Gf(e) {
				return e[7] || (e[7] = []);
			}
			function zf(e) {
				return e.cleanup || (e.cleanup = []);
			}
			function Wf(e, t) {
				const n = e[9],
					r = n ? n.get($r, null) : null;
				r && r.handleError(t);
			}
			function Qf(e, t, n, r, o) {
				for (let i = 0; i < n.length; ) {
					const s = n[i++],
						a = n[i++],
						u = t[s],
						l = e.data[s];
					null !== l.setInput ? l.setInput(u, o, r, a) : (u[a] = o);
				}
			}
			function $t(e, t, n) {
				const r = Oo(t, e);
				!(function Jd(e, t, n) {
					oe(e) ? e.setValue(t, n) : (t.textContent = n);
				})(e[P], r, n);
			}
			function hi(e, t, n) {
				let r = n ? e.styles : null,
					o = n ? e.classes : null,
					i = 0;
				if (null !== t)
					for (let s = 0; s < t.length; s++) {
						const a = t[s];
						'number' == typeof a ? (i = a) : 1 == i ? (o = bs(o, a)) : 2 == i && (r = bs(r, a + ': ' + t[++s] + ';'));
					}
				n ? (e.styles = r) : (e.stylesWithoutHost = r), n ? (e.classes = o) : (e.classesWithoutHost = o);
			}
			const eu = new L('INJECTOR', -1);
			class Zf {
				get(t, n = Or) {
					if (n === Or) {
						const r = new Error(`NullInjectorError: No provider for ${U(t)}!`);
						throw ((r.name = 'NullInjectorError'), r);
					}
					return n;
				}
			}
			const tu = new L('Set Injector scope.'),
				Wr = {},
				Rw = {};
			let nu;
			function Jf() {
				return void 0 === nu && (nu = new Zf()), nu;
			}
			function Kf(e, t = null, n = null, r) {
				const o = Yf(e, t, n, r);
				return o._resolveInjectorDefTypes(), o;
			}
			function Yf(e, t = null, n = null, r) {
				return new Vw(e, n, t || Jf(), r);
			}
			class Vw {
				constructor(t, n, r, o = null) {
					(this.parent = r),
						(this.records = new Map()),
						(this.injectorDefTypes = new Set()),
						(this.onDestroy = new Set()),
						(this._destroyed = !1);
					const i = [];
					n && bt(n, (a) => this.processProvider(a, t, n)),
						bt([t], (a) => this.processInjectorType(a, [], i)),
						this.records.set(eu, Yn(void 0, this));
					const s = this.records.get(tu);
					(this.scope = null != s ? s.value : null), (this.source = o || ('object' == typeof t ? null : U(t)));
				}
				get destroyed() {
					return this._destroyed;
				}
				destroy() {
					this.assertNotDestroyed(), (this._destroyed = !0);
					try {
						this.onDestroy.forEach((t) => t.ngOnDestroy());
					} finally {
						this.records.clear(), this.onDestroy.clear(), this.injectorDefTypes.clear();
					}
				}
				get(t, n = Or, r = N.Default) {
					this.assertNotDestroyed();
					const o = Cd(this),
						i = Wt(void 0);
					try {
						if (!(r & N.SkipSelf)) {
							let a = this.records.get(t);
							if (void 0 === a) {
								const u =
									(function Gw(e) {
										return 'function' == typeof e || ('object' == typeof e && e instanceof L);
									})(t) && Is(t);
								(a = u && this.injectableDefInScope(u) ? Yn(ru(t), Wr) : null), this.records.set(t, a);
							}
							if (null != a) return this.hydrate(t, a);
						}
						return (r & N.Self ? Jf() : this.parent).get(t, (n = r & N.Optional && n === Or ? null : n));
					} catch (s) {
						if ('NullInjectorError' === s.name) {
							if (((s[Jo] = s[Jo] || []).unshift(U(t)), o)) throw s;
							return (function yv(e, t, n, r) {
								const o = e[Jo];
								throw (
									(t[vd] && o.unshift(t[vd]),
									(e.message = (function _v(e, t, n, r = null) {
										e = e && '\n' === e.charAt(0) && '\u0275' == e.charAt(1) ? e.substr(2) : e;
										let o = U(t);
										if (Array.isArray(t)) o = t.map(U).join(' -> ');
										else if ('object' == typeof t) {
											let i = [];
											for (let s in t)
												if (t.hasOwnProperty(s)) {
													let a = t[s];
													i.push(s + ':' + ('string' == typeof a ? JSON.stringify(a) : U(a)));
												}
											o = `{${i.join(', ')}}`;
										}
										return `${n}${r ? '(' + r + ')' : ''}[${o}]: ${e.replace(dv, '\n  ')}`;
									})('\n' + e.message, o, n, r)),
									(e.ngTokenPath = o),
									(e[Jo] = null),
									e)
								);
							})(s, t, 'R3InjectorError', this.source);
						}
						throw s;
					} finally {
						Wt(i), Cd(o);
					}
				}
				_resolveInjectorDefTypes() {
					this.injectorDefTypes.forEach((t) => this.get(t));
				}
				toString() {
					const t = [];
					return this.records.forEach((r, o) => t.push(U(o))), `R3Injector[${t.join(', ')}]`;
				}
				assertNotDestroyed() {
					if (this._destroyed) throw new B(205, !1);
				}
				processInjectorType(t, n, r) {
					if (!(t = x(t))) return !1;
					let o = Fc(t);
					const i = (null == o && t.ngModule) || void 0,
						s = void 0 === i ? t : i,
						a = -1 !== r.indexOf(s);
					if ((void 0 !== i && (o = Fc(i)), null == o)) return !1;
					if (null != o.imports && !a) {
						let c;
						r.push(s);
						try {
							bt(o.imports, (d) => {
								this.processInjectorType(d, n, r) && (void 0 === c && (c = []), c.push(d));
							});
						} finally {
						}
						if (void 0 !== c)
							for (let d = 0; d < c.length; d++) {
								const { ngModule: f, providers: h } = c[d];
								bt(h, (p) => this.processProvider(p, f, h || W));
							}
					}
					this.injectorDefTypes.add(s);
					const u = vn(s) || (() => new s());
					this.records.set(s, Yn(u, Wr));
					const l = o.providers;
					if (null != l && !a) {
						const c = t;
						bt(l, (d) => this.processProvider(d, c, l));
					}
					return void 0 !== i && void 0 !== t.providers;
				}
				processProvider(t, n, r) {
					let o = Xn((t = x(t))) ? t : x(t && t.provide);
					const i = (function Lw(e, t, n) {
						return eh(e) ? Yn(void 0, e.useValue) : Yn(Xf(e), Wr);
					})(t);
					if (Xn(t) || !0 !== t.multi) this.records.get(o);
					else {
						let s = this.records.get(o);
						s || ((s = Yn(void 0, Wr, !0)), (s.factory = () => ua(s.multi)), this.records.set(o, s)), (o = t), s.multi.push(t);
					}
					this.records.set(o, i);
				}
				hydrate(t, n) {
					return (
						n.value === Wr && ((n.value = Rw), (n.value = n.factory())),
						'object' == typeof n.value &&
							n.value &&
							(function Uw(e) {
								return null !== e && 'object' == typeof e && 'function' == typeof e.ngOnDestroy;
							})(n.value) &&
							this.onDestroy.add(n.value),
						n.value
					);
				}
				injectableDefInScope(t) {
					if (!t.providedIn) return !1;
					const n = x(t.providedIn);
					return 'string' == typeof n ? 'any' === n || n === this.scope : this.injectorDefTypes.has(n);
				}
			}
			function ru(e) {
				const t = Is(e),
					n = null !== t ? t.factory : vn(e);
				if (null !== n) return n;
				if (e instanceof L) throw new B(204, !1);
				if (e instanceof Function)
					return (function kw(e) {
						const t = e.length;
						if (t > 0)
							throw (
								((function Pr(e, t) {
									const n = [];
									for (let r = 0; r < e; r++) n.push(t);
									return n;
								})(t, '?'),
								new B(204, !1))
							);
						const n = (function J_(e) {
							const t = e && (e[Ao] || e[xc]);
							if (t) {
								const n = (function K_(e) {
									if (e.hasOwnProperty('name')) return e.name;
									const t = ('' + e).match(/^function\s*([^\s(]+)/);
									return null === t ? '' : t[1];
								})(e);
								return (
									console.warn(
										`DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
									),
									t
								);
							}
							return null;
						})(e);
						return null !== n ? () => n.factory(e) : () => new e();
					})(e);
				throw new B(204, !1);
			}
			function Xf(e, t, n) {
				let r;
				if (Xn(e)) {
					const o = x(e);
					return vn(o) || ru(o);
				}
				if (eh(e)) r = () => x(e.useValue);
				else if (
					(function Hw(e) {
						return !(!e || !e.useFactory);
					})(e)
				)
					r = () => e.useFactory(...ua(e.deps || []));
				else if (
					(function Bw(e) {
						return !(!e || !e.useExisting);
					})(e)
				)
					r = () => V(x(e.useExisting));
				else {
					const o = x(e && (e.useClass || e.provide));
					if (
						!(function $w(e) {
							return !!e.deps;
						})(e)
					)
						return vn(o) || ru(o);
					r = () => new o(...ua(e.deps));
				}
				return r;
			}
			function Yn(e, t, n = !1) {
				return { factory: e, value: t, multi: n ? [] : void 0 };
			}
			function eh(e) {
				return null !== e && 'object' == typeof e && hv in e;
			}
			function Xn(e) {
				return 'function' == typeof e;
			}
			let We = (() => {
				class e {
					static create(n, r) {
						var o;
						if (Array.isArray(n)) return Kf({ name: '' }, r, n, '');
						{
							const i = null !== (o = n.name) && void 0 !== o ? o : '';
							return Kf({ name: i }, n.parent, n.providers, i);
						}
					}
				}
				return (
					(e.THROW_IF_NOT_FOUND = Or),
					(e.NULL = new Zf()),
					(e.ɵprov = $({ token: e, providedIn: 'any', factory: () => V(eu) })),
					(e.__NG_ELEMENT_ID__ = -1),
					e
				);
			})();
			function Yw(e, t) {
				Bo(_a(e)[1], pe());
			}
			function G(e) {
				let t = (function fh(e) {
						return Object.getPrototypeOf(e.prototype).constructor;
					})(e.type),
					n = !0;
				const r = [e];
				for (; t; ) {
					let o;
					if (ut(e)) o = t.ɵcmp || t.ɵdir;
					else {
						if (t.ɵcmp) throw new B(903, '');
						o = t.ɵdir;
					}
					if (o) {
						if (n) {
							r.push(o);
							const s = e;
							(s.inputs = su(e.inputs)), (s.declaredInputs = su(e.declaredInputs)), (s.outputs = su(e.outputs));
							const a = o.hostBindings;
							a && nE(e, a);
							const u = o.viewQuery,
								l = o.contentQueries;
							if (
								(u && eE(e, u),
								l && tE(e, l),
								Es(e.inputs, o.inputs),
								Es(e.declaredInputs, o.declaredInputs),
								Es(e.outputs, o.outputs),
								ut(o) && o.data.animation)
							) {
								const c = e.data;
								c.animation = (c.animation || []).concat(o.data.animation);
							}
						}
						const i = o.features;
						if (i)
							for (let s = 0; s < i.length; s++) {
								const a = i[s];
								a && a.ngInherit && a(e), a === G && (n = !1);
							}
					}
					t = Object.getPrototypeOf(t);
				}
				!(function Xw(e) {
					let t = 0,
						n = null;
					for (let r = e.length - 1; r >= 0; r--) {
						const o = e[r];
						(o.hostVars = t += o.hostVars), (o.hostAttrs = Uo(o.hostAttrs, (n = Uo(n, o.hostAttrs))));
					}
				})(r);
			}
			function su(e) {
				return e === Nn ? {} : e === W ? [] : e;
			}
			function eE(e, t) {
				const n = e.viewQuery;
				e.viewQuery = n
					? (r, o) => {
							t(r, o), n(r, o);
					  }
					: t;
			}
			function tE(e, t) {
				const n = e.contentQueries;
				e.contentQueries = n
					? (r, o, i) => {
							t(r, o, i), n(r, o, i);
					  }
					: t;
			}
			function nE(e, t) {
				const n = e.hostBindings;
				e.hostBindings = n
					? (r, o) => {
							t(r, o), n(r, o);
					  }
					: t;
			}
			let pi = null;
			function er() {
				if (!pi) {
					const e = z.Symbol;
					if (e && e.iterator) pi = e.iterator;
					else {
						const t = Object.getOwnPropertyNames(Map.prototype);
						for (let n = 0; n < t.length; ++n) {
							const r = t[n];
							'entries' !== r && 'size' !== r && Map.prototype[r] === Map.prototype.entries && (pi = r);
						}
					}
				}
				return pi;
			}
			function Qr(e) {
				return (
					!!(function au(e) {
						return null !== e && ('function' == typeof e || 'object' == typeof e);
					})(e) &&
					(Array.isArray(e) || (!(e instanceof Map) && er() in e))
				);
			}
			function Ie(e, t, n) {
				return !Object.is(e[t], n) && ((e[t] = n), !0);
			}
			function nr(e, t, n, r) {
				return Ie(e, Vn(), n) ? t + A(n) + r : T;
			}
			function mi(e, t, n, r, o, i, s, a) {
				const u = y(),
					l = H(),
					c = e + Z,
					d = l.firstCreatePass
						? (function lE(e, t, n, r, o, i, s, a, u) {
								const l = t.consts,
									c = Zn(t, e, 4, s || null, Jt(l, a));
								Wa(t, n, c, Jt(l, u)), Bo(t, c);
								const d = (c.tViews = di(2, c, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, l));
								return null !== t.queries && (t.queries.template(t, c), (d.queries = t.queries.embeddedTView(c))), c;
						  })(c, l, u, t, n, r, o, i, s)
						: l.data[c];
				Et(d, !1);
				const f = u[P].createComment('');
				si(l, u, f, d), Me(f, u), fi(u, (u[c] = $f(f, u, f, d))), Po(d) && za(l, u, d), null != s && qa(u, d, a);
			}
			function v(e, t = N.Default) {
				const n = y();
				return null === n ? V(e, t) : cd(pe(), n, x(e), t);
			}
			function Tt(e, t, n) {
				const r = y();
				return Ie(r, Vn(), t) && qe(H(), ie(), r, e, t, r[P], n, !1), Tt;
			}
			function fu(e, t, n, r, o) {
				const s = o ? 'class' : 'style';
				Qf(e, n, t.inputs[s], s, r);
			}
			function te(e, t, n, r) {
				const o = y(),
					i = H(),
					s = Z + e,
					a = o[P],
					u = (o[s] = Ia(
						a,
						t,
						(function jD() {
							return I.lFrame.currentNamespace;
						})()
					)),
					l = i.firstCreatePass
						? (function xE(e, t, n, r, o, i, s) {
								const a = t.consts,
									l = Zn(t, e, 2, o, Jt(a, i));
								return (
									Wa(t, n, l, Jt(a, s)),
									null !== l.attrs && hi(l, l.attrs, !1),
									null !== l.mergedAttrs && hi(l, l.mergedAttrs, !0),
									null !== t.queries && t.queries.elementStart(t, l),
									l
								);
						  })(s, i, o, 0, t, n, r)
						: i.data[s];
				Et(l, !0);
				const c = l.mergedAttrs;
				null !== c && $o(a, u, c);
				const d = l.classes;
				null !== d && xa(a, u, d);
				const f = l.styles;
				return (
					null !== f && df(a, u, f),
					64 != (64 & l.flags) && si(i, o, u, l),
					0 ===
						(function MD() {
							return I.lFrame.elementDepthCount;
						})() && Me(u, o),
					(function ID() {
						I.lFrame.elementDepthCount++;
					})(),
					Po(l) && (za(i, o, l), Nf(i, l, o)),
					null !== r && qa(o, l),
					te
				);
			}
			function ne() {
				let e = pe();
				Gs() ? zs() : ((e = e.parent), Et(e, !1));
				const t = e;
				!(function AD() {
					I.lFrame.elementDepthCount--;
				})();
				const n = H();
				return (
					n.firstCreatePass && (Bo(n, e), Ps(e) && n.queries.elementEnd(e)),
					null != t.classesWithoutHost &&
						(function qD(e) {
							return 0 != (16 & e.flags);
						})(t) &&
						fu(n, t, y(), t.classesWithoutHost, !0),
					null != t.stylesWithoutHost &&
						(function WD(e) {
							return 0 != (32 & e.flags);
						})(t) &&
						fu(n, t, y(), t.stylesWithoutHost, !1),
					ne
				);
			}
			function dr(e, t, n, r) {
				return te(e, t, n, r), ne(), dr;
			}
			function _i(e, t, n) {
				const r = y(),
					o = H(),
					i = e + Z,
					s = o.firstCreatePass
						? (function PE(e, t, n, r, o) {
								const i = t.consts,
									s = Jt(i, r),
									a = Zn(t, e, 8, 'ng-container', s);
								return null !== s && hi(a, s, !0), Wa(t, n, a, Jt(i, o)), null !== t.queries && t.queries.elementStart(t, a), a;
						  })(i, o, r, t, n)
						: o.data[i];
				Et(s, !0);
				const a = (r[i] = r[P].createComment(''));
				return si(o, r, a, s), Me(a, r), Po(s) && (za(o, r, s), Nf(o, s, r)), null != n && qa(r, s), _i;
			}
			function Di() {
				let e = pe();
				const t = H();
				return Gs() ? zs() : ((e = e.parent), Et(e, !1)), t.firstCreatePass && (Bo(t, e), Ps(e) && t.queries.elementEnd(e)), Di;
			}
			function hu() {
				return y();
			}
			function vi(e) {
				return !!e && 'function' == typeof e.then;
			}
			const Oh = function Ph(e) {
				return !!e && 'function' == typeof e.subscribe;
			};
			function me(e, t, n, r) {
				const o = y(),
					i = H(),
					s = pe();
				return (
					(function Vh(e, t, n, r, o, i, s, a) {
						const u = Po(r),
							c = e.firstCreatePass && zf(e),
							d = t[8],
							f = Gf(t);
						let h = !0;
						if (3 & r.type || a) {
							const D = Xe(r, t),
								_ = a ? a(D) : D,
								g = f.length,
								E = a ? (F) => a(le(F[r.index])) : r.index;
							if (oe(n)) {
								let F = null;
								if (
									(!a &&
										u &&
										(F = (function OE(e, t, n, r) {
											const o = e.cleanup;
											if (null != o)
												for (let i = 0; i < o.length - 1; i += 2) {
													const s = o[i];
													if (s === n && o[i + 1] === r) {
														const a = t[7],
															u = o[i + 2];
														return a.length > u ? a[u] : null;
													}
													'string' == typeof s && (i += 2);
												}
											return null;
										})(e, t, o, r.index)),
									null !== F)
								)
									((F.__ngLastListenerFn__ || F).__ngNextListenerFn__ = i), (F.__ngLastListenerFn__ = i), (h = !1);
								else {
									i = pu(r, t, d, i, !1);
									const j = n.listen(_, o, i);
									f.push(i, j), c && c.push(o, E, g, g + 1);
								}
							} else (i = pu(r, t, d, i, !0)), _.addEventListener(o, i, s), f.push(i), c && c.push(o, E, g, s);
						} else i = pu(r, t, d, i, !1);
						const p = r.outputs;
						let m;
						if (h && null !== p && (m = p[o])) {
							const D = m.length;
							if (D)
								for (let _ = 0; _ < D; _ += 2) {
									const Ze = t[m[_]][m[_ + 1]].subscribe(i),
										Tn = f.length;
									f.push(i, Ze), c && c.push(o, r.index, Tn, -(Tn + 1));
								}
						}
					})(i, o, o[P], s, e, t, !!n, r),
					me
				);
			}
			function kh(e, t, n, r) {
				try {
					return !1 !== n(r);
				} catch (o) {
					return Wf(e, o), !1;
				}
			}
			function pu(e, t, n, r, o) {
				return function i(s) {
					if (s === Function) return r;
					const a = 2 & e.flags ? Ue(e.index, t) : t;
					0 == (32 & t[2]) && Ja(a);
					let u = kh(t, 0, r, s),
						l = i.__ngNextListenerFn__;
					for (; l; ) (u = kh(t, 0, l, s) && u), (l = l.__ngNextListenerFn__);
					return o && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
				};
			}
			function Ci(e = 1) {
				return (function RD(e) {
					return (I.lFrame.contextLView = (function VD(e, t) {
						for (; e > 0; ) (t = t[15]), e--;
						return t;
					})(e, I.lFrame.contextLView))[8];
				})(e);
			}
			function Jr(e, t, n) {
				return gu(e, '', t, '', n), Jr;
			}
			function gu(e, t, n, r, o) {
				const i = y(),
					s = nr(i, t, n, r);
				return s !== T && qe(H(), ie(), i, e, s, i[P], o, !1), gu;
			}
			function qh(e, t, n, r, o) {
				const i = e[n + 1],
					s = null === t;
				let a = r ? ct(i) : jt(i),
					u = !1;
				for (; 0 !== a && (!1 === u || s); ) {
					const c = e[a + 1];
					HE(e[a], t) && ((u = !0), (e[a + 1] = r ? Ra(c) : Pa(c))), (a = r ? ct(c) : jt(c));
				}
				u && (e[n + 1] = r ? Pa(i) : Ra(i));
			}
			function HE(e, t) {
				return (
					null === e ||
					null == t ||
					(Array.isArray(e) ? e[1] : e) === t ||
					(!(!Array.isArray(e) || 'string' != typeof t) && Gn(e, t) >= 0)
				);
			}
			function wi(e, t) {
				return (
					(function ft(e, t, n, r) {
						const o = y(),
							i = H(),
							s = (function Ht(e) {
								const t = I.lFrame,
									n = t.bindingIndex;
								return (t.bindingIndex = t.bindingIndex + e), n;
							})(2);
						i.firstUpdatePass &&
							(function tp(e, t, n, r) {
								const o = e.data;
								if (null === o[n + 1]) {
									const i = o[Ne()],
										s = (function ep(e, t) {
											return t >= e.expandoStartIndex;
										})(e, n);
									(function ip(e, t) {
										return 0 != (e.flags & (t ? 16 : 32));
									})(i, r) &&
										null === t &&
										!s &&
										(t = !1),
										(t = (function ZE(e, t, n, r) {
											const o = (function Ws(e) {
												const t = I.lFrame.currentDirectiveIndex;
												return -1 === t ? null : e[t];
											})(e);
											let i = r ? t.residualClasses : t.residualStyles;
											if (null === o)
												0 === (r ? t.classBindings : t.styleBindings) &&
													((n = Kr((n = mu(null, e, t, n, r)), t.attrs, r)), (i = null));
											else {
												const s = t.directiveStylingLast;
												if (-1 === s || e[s] !== o)
													if (((n = mu(o, e, t, n, r)), null === i)) {
														let u = (function JE(e, t, n) {
															const r = n ? t.classBindings : t.styleBindings;
															if (0 !== jt(r)) return e[ct(r)];
														})(e, t, r);
														void 0 !== u &&
															Array.isArray(u) &&
															((u = mu(null, e, t, u[1], r)),
															(u = Kr(u, t.attrs, r)),
															(function KE(e, t, n, r) {
																e[ct(n ? t.classBindings : t.styleBindings)] = r;
															})(e, t, r, u));
													} else
														i = (function YE(e, t, n) {
															let r;
															const o = t.directiveEnd;
															for (let i = 1 + t.directiveStylingLast; i < o; i++) r = Kr(r, e[i].hostAttrs, n);
															return Kr(r, t.attrs, n);
														})(e, t, r);
											}
											return void 0 !== i && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n;
										})(o, i, t, r)),
										(function LE(e, t, n, r, o, i) {
											let s = i ? t.classBindings : t.styleBindings,
												a = ct(s),
												u = jt(s);
											e[r] = n;
											let c,
												l = !1;
											if (Array.isArray(n)) {
												const d = n;
												(c = d[1]), (null === c || Gn(d, c) > 0) && (l = !0);
											} else c = n;
											if (o)
												if (0 !== u) {
													const f = ct(e[a + 1]);
													(e[r + 1] = ui(f, a)),
														0 !== f && (e[f + 1] = Oa(e[f + 1], r)),
														(e[a + 1] = (function QC(e, t) {
															return (131071 & e) | (t << 17);
														})(e[a + 1], r));
												} else (e[r + 1] = ui(a, 0)), 0 !== a && (e[a + 1] = Oa(e[a + 1], r)), (a = r);
											else (e[r + 1] = ui(u, 0)), 0 === a ? (a = r) : (e[u + 1] = Oa(e[u + 1], r)), (u = r);
											l && (e[r + 1] = Pa(e[r + 1])),
												qh(e, c, r, !0),
												qh(e, c, r, !1),
												(function BE(e, t, n, r, o) {
													const i = o ? e.residualClasses : e.residualStyles;
													null != i && 'string' == typeof t && Gn(i, t) >= 0 && (n[r + 1] = Ra(n[r + 1]));
												})(t, c, e, r, i),
												(s = ui(a, u)),
												i ? (t.classBindings = s) : (t.styleBindings = s);
										})(o, i, t, n, s, r);
								}
							})(i, e, s, r),
							t !== T &&
								Ie(o, s, t) &&
								(function rp(e, t, n, r, o, i, s, a) {
									if (!(3 & t.type)) return;
									const u = e.data,
										l = u[a + 1];
									Ei(
										(function vf(e) {
											return 1 == (1 & e);
										})(l)
											? op(u, t, n, o, jt(l), s)
											: void 0
									) ||
										(Ei(i) ||
											((function Df(e) {
												return 2 == (2 & e);
											})(l) &&
												(i = op(u, null, n, o, a, s))),
										(function VC(e, t, n, r, o) {
											const i = oe(e);
											if (t) o ? (i ? e.addClass(n, r) : n.classList.add(r)) : i ? e.removeClass(n, r) : n.classList.remove(r);
											else {
												let s = -1 === r.indexOf('-') ? void 0 : ze.DashCase;
												if (null == o) i ? e.removeStyle(n, r, s) : n.style.removeProperty(r);
												else {
													const a = 'string' == typeof o && o.endsWith('!important');
													a && ((o = o.slice(0, -10)), (s |= ze.Important)),
														i ? e.setStyle(n, r, o, s) : n.style.setProperty(r, o, a ? 'important' : '');
												}
											}
										})(r, s, Oo(Ne(), n), o, i));
								})(
									i,
									i.data[Ne()],
									o,
									o[P],
									e,
									(o[s + 1] = (function tb(e, t) {
										return null == e || ('string' == typeof t ? (e += t) : 'object' == typeof e && (e = U(Xt(e)))), e;
									})(t, n)),
									r,
									s
								);
					})(e, t, null, !0),
					wi
				);
			}
			function mu(e, t, n, r, o) {
				let i = null;
				const s = n.directiveEnd;
				let a = n.directiveStylingLast;
				for (-1 === a ? (a = n.directiveStart) : a++; a < s && ((i = t[a]), (r = Kr(r, i.hostAttrs, o)), i !== e); ) a++;
				return null !== e && (n.directiveStylingLast = a), r;
			}
			function Kr(e, t, n) {
				const r = n ? 1 : 2;
				let o = -1;
				if (null !== t)
					for (let i = 0; i < t.length; i++) {
						const s = t[i];
						'number' == typeof s
							? (o = s)
							: o === r && (Array.isArray(e) || (e = void 0 === e ? [] : ['', e]), Ge(e, s, !!n || t[++i]));
					}
				return void 0 === e ? null : e;
			}
			function op(e, t, n, r, o, i) {
				const s = null === t;
				let a;
				for (; o > 0; ) {
					const u = e[o],
						l = Array.isArray(u),
						c = l ? u[1] : u,
						d = null === c;
					let f = n[o + 1];
					f === T && (f = d ? W : void 0);
					let h = d ? ia(f, r) : c === r ? f : void 0;
					if ((l && !Ei(h) && (h = ia(u, r)), Ei(h) && ((a = h), s))) return a;
					const p = e[o + 1];
					o = s ? ct(p) : jt(p);
				}
				if (null !== t) {
					let u = i ? t.residualClasses : t.residualStyles;
					null != u && (a = ia(u, r));
				}
				return a;
			}
			function Ei(e) {
				return void 0 !== e;
			}
			function Qe(e, t = '') {
				const n = y(),
					r = H(),
					o = e + Z,
					i = r.firstCreatePass ? Zn(r, o, 1, t, null) : r.data[o],
					s = (n[o] = (function Ma(e, t) {
						return oe(e) ? e.createText(t) : e.createTextNode(t);
					})(n[P], t));
				si(r, n, s, i), Et(i, !1);
			}
			function bi(e) {
				return hr('', e, ''), bi;
			}
			function hr(e, t, n) {
				const r = y(),
					o = nr(r, e, t, n);
				return o !== T && $t(r, Ne(), o), hr;
			}
			const Mi = 'en-US';
			let Ap = Mi;
			function Du(e, t, n, r, o) {
				if (((e = x(e)), Array.isArray(e))) for (let i = 0; i < e.length; i++) Du(e[i], t, n, r, o);
				else {
					const i = H(),
						s = y();
					let a = Xn(e) ? e : x(e.provide),
						u = Xf(e);
					const l = pe(),
						c = 1048575 & l.providerIndexes,
						d = l.directiveStart,
						f = l.providerIndexes >> 20;
					if (Xn(e) || !e.multi) {
						const h = new Ar(u, o, v),
							p = Cu(a, t, o ? c : c + f, d);
						-1 === p
							? (qo(Tr(l, s), i, a),
							  vu(i, e, t.length),
							  t.push(a),
							  l.directiveStart++,
							  l.directiveEnd++,
							  o && (l.providerIndexes += 1048576),
							  n.push(h),
							  s.push(h))
							: ((n[p] = h), (s[p] = h));
					} else {
						const h = Cu(a, t, c + f, d),
							p = Cu(a, t, c, c + f),
							m = h >= 0 && n[h],
							D = p >= 0 && n[p];
						if ((o && !D) || (!o && !m)) {
							qo(Tr(l, s), i, a);
							const _ = (function vM(e, t, n, r, o) {
								const i = new Ar(e, n, v);
								return (i.multi = []), (i.index = t), (i.componentProviders = 0), Kp(i, o, r && !n), i;
							})(o ? DM : _M, n.length, o, r, u);
							!o && D && (n[p].providerFactory = _),
								vu(i, e, t.length, 0),
								t.push(a),
								l.directiveStart++,
								l.directiveEnd++,
								o && (l.providerIndexes += 1048576),
								n.push(_),
								s.push(_);
						} else vu(i, e, h > -1 ? h : p, Kp(n[o ? p : h], u, !o && r));
						!o && r && D && n[p].componentProviders++;
					}
				}
			}
			function vu(e, t, n, r) {
				const o = Xn(t),
					i = (function jw(e) {
						return !!e.useClass;
					})(t);
				if (o || i) {
					const u = (i ? x(t.useClass) : t).prototype.ngOnDestroy;
					if (u) {
						const l = e.destroyHooks || (e.destroyHooks = []);
						if (!o && t.multi) {
							const c = l.indexOf(n);
							-1 === c ? l.push(n, [r, u]) : l[c + 1].push(r, u);
						} else l.push(n, u);
					}
				}
			}
			function Kp(e, t, n) {
				return n && e.componentProviders++, e.multi.push(t) - 1;
			}
			function Cu(e, t, n, r) {
				for (let o = n; o < r; o++) if (t[o] === e) return o;
				return -1;
			}
			function _M(e, t, n, r) {
				return wu(this.multi, []);
			}
			function DM(e, t, n, r) {
				const o = this.multi;
				let i;
				if (this.providerFactory) {
					const s = this.providerFactory.componentProviders,
						a = Nr(n, n[1], this.providerFactory.index, r);
					(i = a.slice(0, s)), wu(o, i);
					for (let u = s; u < a.length; u++) i.push(a[u]);
				} else (i = []), wu(o, i);
				return i;
			}
			function wu(e, t) {
				for (let n = 0; n < e.length; n++) t.push((0, e[n])());
				return t;
			}
			function ee(e, t = []) {
				return (n) => {
					n.providersResolver = (r, o) =>
						(function yM(e, t, n) {
							const r = H();
							if (r.firstCreatePass) {
								const o = ut(e);
								Du(n, r.data, r.blueprint, o, !0), Du(t, r.data, r.blueprint, o, !1);
							}
						})(r, o ? o(e) : e, t);
				};
			}
			class Yp {}
			class EM {
				resolveComponentFactory(t) {
					throw (function wM(e) {
						const t = Error(`No component factory found for ${U(e)}. Did you add it to @NgModule.entryComponents?`);
						return (t.ngComponent = e), t;
					})(t);
				}
			}
			let Ni = (() => {
				class e {}
				return (e.NULL = new EM()), e;
			})();
			function bM() {
				return mr(pe(), y());
			}
			function mr(e, t) {
				return new pt(Xe(e, t));
			}
			let pt = (() => {
				class e {
					constructor(n) {
						this.nativeElement = n;
					}
				}
				return (e.__NG_ELEMENT_ID__ = bM), e;
			})();
			class eg {}
			let bn = (() => {
					class e {}
					return (
						(e.__NG_ELEMENT_ID__ = () =>
							(function AM() {
								const e = y(),
									n = Ue(pe().index, e);
								return (function IM(e) {
									return e[P];
								})(wt(n) ? n : e);
							})()),
						e
					);
				})(),
				SM = (() => {
					class e {}
					return (e.ɵprov = $({ token: e, providedIn: 'root', factory: () => null })), e;
				})();
			class Fi {
				constructor(t) {
					(this.full = t),
						(this.major = t.split('.')[0]),
						(this.minor = t.split('.')[1]),
						(this.patch = t.split('.').slice(2).join('.'));
				}
			}
			const TM = new Fi('13.2.7'),
				Eu = {};
			function xi(e, t, n, r, o = !1) {
				for (; null !== n; ) {
					const i = t[n.index];
					if ((null !== i && r.push(le(i)), at(i)))
						for (let a = 10; a < i.length; a++) {
							const u = i[a],
								l = u[1].firstChild;
							null !== l && xi(u[1], u, l, r);
						}
					const s = n.type;
					if (8 & s) xi(e, t, n.child, r);
					else if (32 & s) {
						const a = wa(n, t);
						let u;
						for (; (u = a()); ) r.push(u);
					} else if (16 & s) {
						const a = uf(t, n);
						if (Array.isArray(a)) r.push(...a);
						else {
							const u = Ur(t[16]);
							xi(u[1], u, a, r, !0);
						}
					}
					n = o ? n.projectionNext : n.next;
				}
				return r;
			}
			class no {
				constructor(t, n) {
					(this._lView = t), (this._cdRefInjectingView = n), (this._appRef = null), (this._attachedToViewContainer = !1);
				}
				get rootNodes() {
					const t = this._lView,
						n = t[1];
					return xi(n, t, n.firstChild, []);
				}
				get context() {
					return this._lView[8];
				}
				set context(t) {
					this._lView[8] = t;
				}
				get destroyed() {
					return 256 == (256 & this._lView[2]);
				}
				destroy() {
					if (this._appRef) this._appRef.detachView(this);
					else if (this._attachedToViewContainer) {
						const t = this._lView[3];
						if (at(t)) {
							const n = t[8],
								r = n ? n.indexOf(this) : -1;
							r > -1 && (Aa(t, r), Qo(n, r));
						}
						this._attachedToViewContainer = !1;
					}
					Yd(this._lView[1], this._lView);
				}
				onDestroy(t) {
					!(function Of(e, t, n, r) {
						const o = Gf(t);
						null === n ? o.push(r) : (o.push(n), e.firstCreatePass && zf(e).push(r, o.length - 1));
					})(this._lView[1], this._lView, null, t);
				}
				markForCheck() {
					Ja(this._cdRefInjectingView || this._lView);
				}
				detach() {
					this._lView[2] &= -129;
				}
				reattach() {
					this._lView[2] |= 128;
				}
				detectChanges() {
					Ya(this._lView[1], this._lView, this.context);
				}
				checkNoChanges() {
					!(function Nw(e, t, n) {
						Vo(!0);
						try {
							Ya(e, t, n);
						} finally {
							Vo(!1);
						}
					})(this._lView[1], this._lView, this.context);
				}
				attachToViewContainerRef() {
					if (this._appRef) throw new B(902, '');
					this._attachedToViewContainer = !0;
				}
				detachFromAppRef() {
					(this._appRef = null),
						(function IC(e, t) {
							Gr(e, t, t[P], 2, null, null);
						})(this._lView[1], this._lView);
				}
				attachToAppRef(t) {
					if (this._attachedToViewContainer) throw new B(902, '');
					this._appRef = t;
				}
			}
			class NM extends no {
				constructor(t) {
					super(t), (this._view = t);
				}
				detectChanges() {
					Uf(this._view);
				}
				checkNoChanges() {
					!(function Fw(e) {
						Vo(!0);
						try {
							Uf(e);
						} finally {
							Vo(!1);
						}
					})(this._view);
				}
				get context() {
					return null;
				}
			}
			class tg extends Ni {
				constructor(t) {
					super(), (this.ngModule = t);
				}
				resolveComponentFactory(t) {
					const n = we(t);
					return new bu(n, this.ngModule);
				}
			}
			function ng(e) {
				const t = [];
				for (let n in e) e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
				return t;
			}
			class bu extends Yp {
				constructor(t, n) {
					super(),
						(this.componentDef = t),
						(this.ngModule = n),
						(this.componentType = t.type),
						(this.selector = (function qC(e) {
							return e.map(zC).join(',');
						})(t.selectors)),
						(this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : []),
						(this.isBoundToModule = !!n);
				}
				get inputs() {
					return ng(this.componentDef.inputs);
				}
				get outputs() {
					return ng(this.componentDef.outputs);
				}
				create(t, n, r, o) {
					const i = (o = o || this.ngModule)
							? (function xM(e, t) {
									return {
										get: (n, r, o) => {
											const i = e.get(n, Eu, o);
											return i !== Eu || r === Eu ? i : t.get(n, r, o);
										},
									};
							  })(t, o.injector)
							: t,
						s = i.get(eg, Uc),
						a = i.get(SM, null),
						u = s.createRenderer(null, this.componentDef),
						l = this.componentDef.selectors[0][0] || 'div',
						c = r
							? (function Pf(e, t, n) {
									if (oe(e)) return e.selectRootElement(t, n === vt.ShadowDom);
									let r = 'string' == typeof t ? e.querySelector(t) : t;
									return (r.textContent = ''), r;
							  })(u, r, this.componentDef.encapsulation)
							: Ia(
									s.createRenderer(null, this.componentDef),
									l,
									(function FM(e) {
										const t = e.toLowerCase();
										return 'svg' === t ? 'svg' : 'math' === t ? 'math' : null;
									})(l)
							  ),
						d = this.componentDef.onPush ? 576 : 528,
						f = (function dh(e, t) {
							return { components: [], scheduler: e || _C, clean: xw, playerHandler: t || null, flags: 0 };
						})(),
						h = di(0, null, null, 1, 0, null, null, null, null, null),
						p = zr(null, h, f, d, null, null, s, u, a, i);
					let m, D;
					ko(p);
					try {
						const _ = (function lh(e, t, n, r, o, i) {
							const s = n[1];
							n[20] = e;
							const u = Zn(s, 20, 2, '#host', null),
								l = (u.mergedAttrs = t.hostAttrs);
							null !== l &&
								(hi(u, l, !0),
								null !== e && ($o(o, e, l), null !== u.classes && xa(o, e, u.classes), null !== u.styles && df(o, e, u.styles)));
							const c = r.createRenderer(e, t),
								d = zr(n, Ff(t), null, t.onPush ? 64 : 16, n[20], u, r, c, i || null, null);
							return s.firstCreatePass && (qo(Tr(u, n), s, t.type), Bf(s, u), Hf(u, n.length, 1)), fi(n, d), (n[20] = d);
						})(c, this.componentDef, p, s, u);
						if (c)
							if (r) $o(u, c, ['ng-version', TM.full]);
							else {
								const { attrs: g, classes: E } = (function WC(e) {
									const t = [],
										n = [];
									let r = 1,
										o = 2;
									for (; r < e.length; ) {
										let i = e[r];
										if ('string' == typeof i) 2 === o ? '' !== i && t.push(i, e[++r]) : 8 === o && n.push(i);
										else {
											if (!lt(o)) break;
											o = i;
										}
										r++;
									}
									return { attrs: t, classes: n };
								})(this.componentDef.selectors[0]);
								g && $o(u, c, g), E && E.length > 0 && xa(u, c, E.join(' '));
							}
						if (((D = Hs(h, Z)), void 0 !== n)) {
							const g = (D.projection = []);
							for (let E = 0; E < this.ngContentSelectors.length; E++) {
								const F = n[E];
								g.push(null != F ? Array.from(F) : null);
							}
						}
						(m = (function ch(e, t, n, r, o) {
							const i = n[1],
								s = (function pw(e, t, n) {
									const r = pe();
									e.firstCreatePass && (n.providersResolver && n.providersResolver(n), jf(e, r, t, Jn(e, t, 1, null), n));
									const o = Nr(t, e, r.directiveStart, r);
									Me(o, t);
									const i = Xe(r, t);
									return i && Me(i, t), o;
								})(i, n, t);
							if ((r.components.push(s), (e[8] = s), o && o.forEach((u) => u(s, t)), t.contentQueries)) {
								const u = pe();
								t.contentQueries(1, s, u.directiveStart);
							}
							const a = pe();
							return (
								!i.firstCreatePass ||
									(null === t.hostBindings && null === t.hostAttrs) ||
									(Kt(a.index), kf(n[1], a, 0, a.directiveStart, a.directiveEnd, t), Lf(t, s)),
								s
							);
						})(_, this.componentDef, p, f, [Yw])),
							qr(h, p, null);
					} finally {
						Lo();
					}
					return new OM(this.componentType, m, mr(D, p), p, D);
				}
			}
			class OM extends class CM {} {
				constructor(t, n, r, o, i) {
					super(),
						(this.location = r),
						(this._rootLView = o),
						(this._tNode = i),
						(this.instance = n),
						(this.hostView = this.changeDetectorRef = new NM(o)),
						(this.componentType = t);
				}
				get injector() {
					return new Bn(this._tNode, this._rootLView);
				}
				destroy() {
					this.hostView.destroy();
				}
				onDestroy(t) {
					this.hostView.onDestroy(t);
				}
			}
			class yr {}
			const _r = new Map();
			class ig extends yr {
				constructor(t, n) {
					super(),
						(this._parent = n),
						(this._bootstrapComponents = []),
						(this.injector = this),
						(this.destroyCbs = []),
						(this.componentFactoryResolver = new tg(this));
					const r = Je(t);
					(this._bootstrapComponents = It(r.bootstrap)),
						(this._r3Injector = Yf(
							t,
							n,
							[
								{ provide: yr, useValue: this },
								{ provide: Ni, useValue: this.componentFactoryResolver },
							],
							U(t)
						)),
						this._r3Injector._resolveInjectorDefTypes(),
						(this.instance = this.get(t));
				}
				get(t, n = We.THROW_IF_NOT_FOUND, r = N.Default) {
					return t === We || t === yr || t === eu ? this : this._r3Injector.get(t, n, r);
				}
				destroy() {
					const t = this._r3Injector;
					!t.destroyed && t.destroy(), this.destroyCbs.forEach((n) => n()), (this.destroyCbs = null);
				}
				onDestroy(t) {
					this.destroyCbs.push(t);
				}
			}
			class Mu extends class VM {} {
				constructor(t) {
					super(),
						(this.moduleType = t),
						null !== Je(t) &&
							(function kM(e) {
								const t = new Set();
								!(function n(r) {
									const o = Je(r, !0),
										i = o.id;
									null !== i &&
										((function rg(e, t, n) {
											if (t && t !== n) throw new Error(`Duplicate module registered for ${e} - ${U(t)} vs ${U(t.name)}`);
										})(i, _r.get(i), r),
										_r.set(i, r));
									const s = It(o.imports);
									for (const a of s) t.has(a) || (t.add(a), n(a));
								})(e);
							})(t);
				}
				create(t) {
					return new ig(this.moduleType, t);
				}
			}
			function Iu(e) {
				return (t) => {
					setTimeout(e, void 0, t);
				};
			}
			const _e = class t0 extends _s {
				constructor(t = !1) {
					super(), (this.__isAsync = t);
				}
				emit(t) {
					super.next(t);
				}
				subscribe(t, n, r) {
					var o, i, s;
					let a = t,
						u = n || (() => null),
						l = r;
					if (t && 'object' == typeof t) {
						const d = t;
						(a = null === (o = d.next) || void 0 === o ? void 0 : o.bind(d)),
							(u = null === (i = d.error) || void 0 === i ? void 0 : i.bind(d)),
							(l = null === (s = d.complete) || void 0 === s ? void 0 : s.bind(d));
					}
					this.__isAsync && ((u = Iu(u)), a && (a = Iu(a)), l && (l = Iu(l)));
					const c = super.subscribe({ next: a, error: u, complete: l });
					return t instanceof Dt && t.add(c), c;
				}
			};
			Symbol;
			let Gt = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = s0), e;
			})();
			const r0 = Gt,
				o0 = class extends r0 {
					constructor(t, n, r) {
						super(), (this._declarationLView = t), (this._declarationTContainer = n), (this.elementRef = r);
					}
					createEmbeddedView(t) {
						const n = this._declarationTContainer.tViews,
							r = zr(this._declarationLView, n, t, 16, null, n.declTNode, null, null, null, null);
						r[17] = this._declarationLView[this._declarationTContainer.index];
						const i = this._declarationLView[19];
						return null !== i && (r[19] = i.createEmbeddedView(n)), qr(n, r, t), new no(r);
					}
				};
			function s0() {
				return (function Pi(e, t) {
					return 4 & e.type ? new o0(t, e, mr(e, t)) : null;
				})(pe(), y());
			}
			let xt = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = a0), e;
			})();
			function a0() {
				return (function hg(e, t) {
					let n;
					const r = t[e.index];
					if (at(r)) n = r;
					else {
						let o;
						if (8 & e.type) o = le(r);
						else {
							const i = t[P];
							o = i.createComment('');
							const s = Xe(e, t);
							Cn(
								i,
								ii(i, s),
								o,
								(function PC(e, t) {
									return oe(e) ? e.nextSibling(t) : t.nextSibling;
								})(i, s),
								!1
							);
						}
						(t[e.index] = n = $f(r, t, o, e)), fi(t, n);
					}
					return new dg(n, e, t);
				})(pe(), y());
			}
			const u0 = xt,
				dg = class extends u0 {
					constructor(t, n, r) {
						super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r);
					}
					get element() {
						return mr(this._hostTNode, this._hostLView);
					}
					get injector() {
						return new Bn(this._hostTNode, this._hostLView);
					}
					get parentInjector() {
						const t = zo(this._hostTNode, this._hostLView);
						if (id(t)) {
							const n = Ln(t, this._hostLView),
								r = kn(t);
							return new Bn(n[1].data[r + 8], n);
						}
						return new Bn(null, this._hostLView);
					}
					clear() {
						for (; this.length > 0; ) this.remove(this.length - 1);
					}
					get(t) {
						const n = fg(this._lContainer);
						return (null !== n && n[t]) || null;
					}
					get length() {
						return this._lContainer.length - 10;
					}
					createEmbeddedView(t, n, r) {
						const o = t.createEmbeddedView(n || {});
						return this.insert(o, r), o;
					}
					createComponent(t, n, r, o, i) {
						const s =
							t &&
							!(function xr(e) {
								return 'function' == typeof e;
							})(t);
						let a;
						if (s) a = n;
						else {
							const d = n || {};
							(a = d.index), (r = d.injector), (o = d.projectableNodes), (i = d.ngModuleRef);
						}
						const u = s ? t : new bu(we(t)),
							l = r || this.parentInjector;
						if (!i && null == u.ngModule) {
							const f = (s ? l : this.parentInjector).get(yr, null);
							f && (i = f);
						}
						const c = u.create(l, o, void 0, i);
						return this.insert(c.hostView, a), c;
					}
					insert(t, n) {
						const r = t._lView,
							o = r[1];
						if (
							(function bD(e) {
								return at(e[3]);
							})(r)
						) {
							const c = this.indexOf(t);
							if (-1 !== c) this.detach(c);
							else {
								const d = r[3],
									f = new dg(d, d[6], d[3]);
								f.detach(f.indexOf(t));
							}
						}
						const i = this._adjustIndex(n),
							s = this._lContainer;
						!(function SC(e, t, n, r) {
							const o = 10 + r,
								i = n.length;
							r > 0 && (n[o - 1][4] = t), r < i - 10 ? ((t[4] = n[o]), gd(n, 10 + r, t)) : (n.push(t), (t[4] = null)), (t[3] = n);
							const s = t[17];
							null !== s &&
								n !== s &&
								(function TC(e, t) {
									const n = e[9];
									t[16] !== t[3][3][16] && (e[2] = !0), null === n ? (e[9] = [t]) : n.push(t);
								})(s, t);
							const a = t[19];
							null !== a && a.insertView(e), (t[2] |= 128);
						})(o, r, s, i);
						const a = Na(i, s),
							u = r[P],
							l = ii(u, s[7]);
						return (
							null !== l &&
								(function MC(e, t, n, r, o, i) {
									(r[0] = o), (r[6] = t), Gr(e, r, n, 1, o, i);
								})(o, s[6], u, r, l, a),
							t.attachToViewContainerRef(),
							gd(Su(s), i, t),
							t
						);
					}
					move(t, n) {
						return this.insert(t, n);
					}
					indexOf(t) {
						const n = fg(this._lContainer);
						return null !== n ? n.indexOf(t) : -1;
					}
					remove(t) {
						const n = this._adjustIndex(t, -1),
							r = Aa(this._lContainer, n);
						r && (Qo(Su(this._lContainer), n), Yd(r[1], r));
					}
					detach(t) {
						const n = this._adjustIndex(t, -1),
							r = Aa(this._lContainer, n);
						return r && null != Qo(Su(this._lContainer), n) ? new no(r) : null;
					}
					_adjustIndex(t, n = 0) {
						return null == t ? this.length + n : t;
					}
				};
			function fg(e) {
				return e[8];
			}
			function Su(e) {
				return e[8] || (e[8] = []);
			}
			function Vi(...e) {}
			const Rg = new L('Application Initializer');
			let Bu = (() => {
				class e {
					constructor(n) {
						(this.appInits = n),
							(this.resolve = Vi),
							(this.reject = Vi),
							(this.initialized = !1),
							(this.done = !1),
							(this.donePromise = new Promise((r, o) => {
								(this.resolve = r), (this.reject = o);
							}));
					}
					runInitializers() {
						if (this.initialized) return;
						const n = [],
							r = () => {
								(this.done = !0), this.resolve();
							};
						if (this.appInits)
							for (let o = 0; o < this.appInits.length; o++) {
								const i = this.appInits[o]();
								if (vi(i)) n.push(i);
								else if (Oh(i)) {
									const s = new Promise((a, u) => {
										i.subscribe({ complete: a, error: u });
									});
									n.push(s);
								}
							}
						Promise.all(n)
							.then(() => {
								r();
							})
							.catch((o) => {
								this.reject(o);
							}),
							0 === n.length && r(),
							(this.initialized = !0);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(Rg, 8));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac, providedIn: 'root' })),
					e
				);
			})();
			const so = new L('AppId', {
				providedIn: 'root',
				factory: function Vg() {
					return `${Hu()}${Hu()}${Hu()}`;
				},
			});
			function Hu() {
				return String.fromCharCode(97 + Math.floor(25 * Math.random()));
			}
			const kg = new L('Platform Initializer'),
				ki = new L('Platform ID'),
				L0 = new L('appBootstrapListener');
			let B0 = (() => {
				class e {
					log(n) {
						console.log(n);
					}
					warn(n) {
						console.warn(n);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const nn = new L('LocaleId', {
					providedIn: 'root',
					factory: () =>
						gv(nn, N.Optional | N.SkipSelf) ||
						(function H0() {
							return ('undefined' != typeof $localize && $localize.locale) || Mi;
						})(),
				}),
				G0 = (() => Promise.resolve(0))();
			function ju(e) {
				'undefined' == typeof Zone
					? G0.then(() => {
							e && e.apply(null, null);
					  })
					: Zone.current.scheduleMicroTask('scheduleMicrotask', e);
			}
			class Le {
				constructor({
					enableLongStackTrace: t = !1,
					shouldCoalesceEventChangeDetection: n = !1,
					shouldCoalesceRunChangeDetection: r = !1,
				}) {
					if (
						((this.hasPendingMacrotasks = !1),
						(this.hasPendingMicrotasks = !1),
						(this.isStable = !0),
						(this.onUnstable = new _e(!1)),
						(this.onMicrotaskEmpty = new _e(!1)),
						(this.onStable = new _e(!1)),
						(this.onError = new _e(!1)),
						'undefined' == typeof Zone)
					)
						throw new Error('In this configuration Angular requires Zone.js');
					Zone.assertZonePatched();
					const o = this;
					(o._nesting = 0),
						(o._outer = o._inner = Zone.current),
						Zone.TaskTrackingZoneSpec && (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
						t && Zone.longStackTraceZoneSpec && (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
						(o.shouldCoalesceEventChangeDetection = !r && n),
						(o.shouldCoalesceRunChangeDetection = r),
						(o.lastRequestAnimationFrameId = -1),
						(o.nativeRequestAnimationFrame = (function z0() {
							let e = z.requestAnimationFrame,
								t = z.cancelAnimationFrame;
							if ('undefined' != typeof Zone && e && t) {
								const n = e[Zone.__symbol__('OriginalDelegate')];
								n && (e = n);
								const r = t[Zone.__symbol__('OriginalDelegate')];
								r && (t = r);
							}
							return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: t };
						})().nativeRequestAnimationFrame),
						(function Q0(e) {
							const t = () => {
								!(function W0(e) {
									e.isCheckStableRunning ||
										-1 !== e.lastRequestAnimationFrameId ||
										((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(z, () => {
											e.fakeTopEventTask ||
												(e.fakeTopEventTask = Zone.root.scheduleEventTask(
													'fakeTopEventTask',
													() => {
														(e.lastRequestAnimationFrameId = -1),
															Uu(e),
															(e.isCheckStableRunning = !0),
															$u(e),
															(e.isCheckStableRunning = !1);
													},
													void 0,
													() => {},
													() => {}
												)),
												e.fakeTopEventTask.invoke();
										})),
										Uu(e));
								})(e);
							};
							e._inner = e._inner.fork({
								name: 'angular',
								properties: { isAngularZone: !0 },
								onInvokeTask: (n, r, o, i, s, a) => {
									try {
										return Lg(e), n.invokeTask(o, i, s, a);
									} finally {
										((e.shouldCoalesceEventChangeDetection && 'eventTask' === i.type) || e.shouldCoalesceRunChangeDetection) &&
											t(),
											Bg(e);
									}
								},
								onInvoke: (n, r, o, i, s, a, u) => {
									try {
										return Lg(e), n.invoke(o, i, s, a, u);
									} finally {
										e.shouldCoalesceRunChangeDetection && t(), Bg(e);
									}
								},
								onHasTask: (n, r, o, i) => {
									n.hasTask(o, i),
										r === o &&
											('microTask' == i.change
												? ((e._hasPendingMicrotasks = i.microTask), Uu(e), $u(e))
												: 'macroTask' == i.change && (e.hasPendingMacrotasks = i.macroTask));
								},
								onHandleError: (n, r, o, i) => (n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1),
							});
						})(o);
				}
				static isInAngularZone() {
					return 'undefined' != typeof Zone && !0 === Zone.current.get('isAngularZone');
				}
				static assertInAngularZone() {
					if (!Le.isInAngularZone()) throw new Error('Expected to be in Angular Zone, but it is not!');
				}
				static assertNotInAngularZone() {
					if (Le.isInAngularZone()) throw new Error('Expected to not be in Angular Zone, but it is!');
				}
				run(t, n, r) {
					return this._inner.run(t, n, r);
				}
				runTask(t, n, r, o) {
					const i = this._inner,
						s = i.scheduleEventTask('NgZoneEvent: ' + o, t, q0, Vi, Vi);
					try {
						return i.runTask(s, n, r);
					} finally {
						i.cancelTask(s);
					}
				}
				runGuarded(t, n, r) {
					return this._inner.runGuarded(t, n, r);
				}
				runOutsideAngular(t) {
					return this._outer.run(t);
				}
			}
			const q0 = {};
			function $u(e) {
				if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
					try {
						e._nesting++, e.onMicrotaskEmpty.emit(null);
					} finally {
						if ((e._nesting--, !e.hasPendingMicrotasks))
							try {
								e.runOutsideAngular(() => e.onStable.emit(null));
							} finally {
								e.isStable = !0;
							}
					}
			}
			function Uu(e) {
				e.hasPendingMicrotasks = !!(
					e._hasPendingMicrotasks ||
					((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && -1 !== e.lastRequestAnimationFrameId)
				);
			}
			function Lg(e) {
				e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
			}
			function Bg(e) {
				e._nesting--, $u(e);
			}
			class Z0 {
				constructor() {
					(this.hasPendingMicrotasks = !1),
						(this.hasPendingMacrotasks = !1),
						(this.isStable = !0),
						(this.onUnstable = new _e()),
						(this.onMicrotaskEmpty = new _e()),
						(this.onStable = new _e()),
						(this.onError = new _e());
				}
				run(t, n, r) {
					return t.apply(n, r);
				}
				runGuarded(t, n, r) {
					return t.apply(n, r);
				}
				runOutsideAngular(t) {
					return t();
				}
				runTask(t, n, r, o) {
					return t.apply(n, r);
				}
			}
			let Gu = (() => {
					class e {
						constructor(n) {
							(this._ngZone = n),
								(this._pendingCount = 0),
								(this._isZoneStable = !0),
								(this._didWork = !1),
								(this._callbacks = []),
								(this.taskTrackingZone = null),
								this._watchAngularEvents(),
								n.run(() => {
									this.taskTrackingZone = 'undefined' == typeof Zone ? null : Zone.current.get('TaskTrackingZone');
								});
						}
						_watchAngularEvents() {
							this._ngZone.onUnstable.subscribe({
								next: () => {
									(this._didWork = !0), (this._isZoneStable = !1);
								},
							}),
								this._ngZone.runOutsideAngular(() => {
									this._ngZone.onStable.subscribe({
										next: () => {
											Le.assertNotInAngularZone(),
												ju(() => {
													(this._isZoneStable = !0), this._runCallbacksIfReady();
												});
										},
									});
								});
						}
						increasePendingRequestCount() {
							return (this._pendingCount += 1), (this._didWork = !0), this._pendingCount;
						}
						decreasePendingRequestCount() {
							if (((this._pendingCount -= 1), this._pendingCount < 0)) throw new Error('pending async requests below zero');
							return this._runCallbacksIfReady(), this._pendingCount;
						}
						isStable() {
							return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks;
						}
						_runCallbacksIfReady() {
							if (this.isStable())
								ju(() => {
									for (; 0 !== this._callbacks.length; ) {
										let n = this._callbacks.pop();
										clearTimeout(n.timeoutId), n.doneCb(this._didWork);
									}
									this._didWork = !1;
								});
							else {
								let n = this.getPendingTasks();
								(this._callbacks = this._callbacks.filter(
									(r) => !r.updateCb || !r.updateCb(n) || (clearTimeout(r.timeoutId), !1)
								)),
									(this._didWork = !0);
							}
						}
						getPendingTasks() {
							return this.taskTrackingZone
								? this.taskTrackingZone.macroTasks.map((n) => ({
										source: n.source,
										creationLocation: n.creationLocation,
										data: n.data,
								  }))
								: [];
						}
						addCallback(n, r, o) {
							let i = -1;
							r &&
								r > 0 &&
								(i = setTimeout(() => {
									(this._callbacks = this._callbacks.filter((s) => s.timeoutId !== i)), n(this._didWork, this.getPendingTasks());
								}, r)),
								this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
						}
						whenStable(n, r, o) {
							if (o && !this.taskTrackingZone)
								throw new Error(
									'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
								);
							this.addCallback(n, r, o), this._runCallbacksIfReady();
						}
						getPendingRequestCount() {
							return this._pendingCount;
						}
						findProviders(n, r, o) {
							return [];
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(Le));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				Hg = (() => {
					class e {
						constructor() {
							(this._applications = new Map()), zu.addToWindow(this);
						}
						registerApplication(n, r) {
							this._applications.set(n, r);
						}
						unregisterApplication(n) {
							this._applications.delete(n);
						}
						unregisterAllApplications() {
							this._applications.clear();
						}
						getTestability(n) {
							return this._applications.get(n) || null;
						}
						getAllTestabilities() {
							return Array.from(this._applications.values());
						}
						getAllRootElements() {
							return Array.from(this._applications.keys());
						}
						findTestabilityInTree(n, r = !0) {
							return zu.findTestabilityInTree(this, n, r);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})();
			class J0 {
				addToWindow(t) {}
				findTestabilityInTree(t, n, r) {
					return null;
				}
			}
			let gt,
				zu = new J0();
			const jg = new L('AllowMultipleToken');
			function $g(e, t, n = []) {
				const r = `Platform: ${t}`,
					o = new L(r);
				return (i = []) => {
					let s = Ug();
					if (!s || s.injector.get(jg, !1))
						if (e) e(n.concat(i).concat({ provide: o, useValue: !0 }));
						else {
							const a = n.concat(i).concat({ provide: o, useValue: !0 }, { provide: tu, useValue: 'platform' });
							!(function eI(e) {
								if (gt && !gt.destroyed && !gt.injector.get(jg, !1)) throw new B(400, '');
								gt = e.get(Gg);
								const t = e.get(kg, null);
								t && t.forEach((n) => n());
							})(We.create({ providers: a, name: r }));
						}
					return (function tI(e) {
						const t = Ug();
						if (!t) throw new B(401, '');
						return t;
					})();
				};
			}
			function Ug() {
				return gt && !gt.destroyed ? gt : null;
			}
			let Gg = (() => {
				class e {
					constructor(n) {
						(this._injector = n), (this._modules = []), (this._destroyListeners = []), (this._destroyed = !1);
					}
					bootstrapModuleFactory(n, r) {
						const a = (function nI(e, t) {
								let n;
								return (
									(n =
										'noop' === e
											? new Z0()
											: ('zone.js' === e ? void 0 : e) ||
											  new Le({
													enableLongStackTrace: !1,
													shouldCoalesceEventChangeDetection: !!(null == t ? void 0 : t.ngZoneEventCoalescing),
													shouldCoalesceRunChangeDetection: !!(null == t ? void 0 : t.ngZoneRunCoalescing),
											  })),
									n
								);
							})(r ? r.ngZone : void 0, {
								ngZoneEventCoalescing: (r && r.ngZoneEventCoalescing) || !1,
								ngZoneRunCoalescing: (r && r.ngZoneRunCoalescing) || !1,
							}),
							u = [{ provide: Le, useValue: a }];
						return a.run(() => {
							const l = We.create({ providers: u, parent: this.injector, name: n.moduleType.name }),
								c = n.create(l),
								d = c.injector.get($r, null);
							if (!d) throw new B(402, '');
							return (
								a.runOutsideAngular(() => {
									const f = a.onError.subscribe({
										next: (h) => {
											d.handleError(h);
										},
									});
									c.onDestroy(() => {
										qu(this._modules, c), f.unsubscribe();
									});
								}),
								(function rI(e, t, n) {
									try {
										const r = n();
										return vi(r)
											? r.catch((o) => {
													throw (t.runOutsideAngular(() => e.handleError(o)), o);
											  })
											: r;
									} catch (r) {
										throw (t.runOutsideAngular(() => e.handleError(r)), r);
									}
								})(d, a, () => {
									const f = c.injector.get(Bu);
									return (
										f.runInitializers(),
										f.donePromise.then(
											() => (
												(function Ib(e) {
													je(e, 'Expected localeId to be defined'),
														'string' == typeof e && (Ap = e.toLowerCase().replace(/_/g, '-'));
												})(c.injector.get(nn, Mi) || Mi),
												this._moduleDoBootstrap(c),
												c
											)
										)
									);
								})
							);
						});
					}
					bootstrapModule(n, r = []) {
						const o = zg({}, r);
						return (function Y0(e, t, n) {
							const r = new Mu(n);
							return Promise.resolve(r);
						})(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
					}
					_moduleDoBootstrap(n) {
						const r = n.injector.get(qg);
						if (n._bootstrapComponents.length > 0) n._bootstrapComponents.forEach((o) => r.bootstrap(o));
						else {
							if (!n.instance.ngDoBootstrap) throw new B(403, '');
							n.instance.ngDoBootstrap(r);
						}
						this._modules.push(n);
					}
					onDestroy(n) {
						this._destroyListeners.push(n);
					}
					get injector() {
						return this._injector;
					}
					destroy() {
						if (this._destroyed) throw new B(404, '');
						this._modules.slice().forEach((n) => n.destroy()), this._destroyListeners.forEach((n) => n()), (this._destroyed = !0);
					}
					get destroyed() {
						return this._destroyed;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(We));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function zg(e, t) {
				return Array.isArray(t) ? t.reduce(zg, e) : Object.assign(Object.assign({}, e), t);
			}
			let qg = (() => {
				class e {
					constructor(n, r, o, i, s) {
						(this._zone = n),
							(this._injector = r),
							(this._exceptionHandler = o),
							(this._componentFactoryResolver = i),
							(this._initStatus = s),
							(this._bootstrapListeners = []),
							(this._views = []),
							(this._runningTick = !1),
							(this._stable = !0),
							(this.componentTypes = []),
							(this.components = []),
							(this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
								next: () => {
									this._zone.run(() => {
										this.tick();
									});
								},
							}));
						const a = new Ce((l) => {
								(this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks),
									this._zone.runOutsideAngular(() => {
										l.next(this._stable), l.complete();
									});
							}),
							u = new Ce((l) => {
								let c;
								this._zone.runOutsideAngular(() => {
									c = this._zone.onStable.subscribe(() => {
										Le.assertNotInAngularZone(),
											ju(() => {
												!this._stable &&
													!this._zone.hasPendingMacrotasks &&
													!this._zone.hasPendingMicrotasks &&
													((this._stable = !0), l.next(!0));
											});
									});
								});
								const d = this._zone.onUnstable.subscribe(() => {
									Le.assertInAngularZone(),
										this._stable &&
											((this._stable = !1),
											this._zone.runOutsideAngular(() => {
												l.next(!1);
											}));
								});
								return () => {
									c.unsubscribe(), d.unsubscribe();
								};
							});
						this.isStable = (function $_(...e) {
							const t = Mc(e),
								n = (function R_(e, t) {
									return 'number' == typeof Cs(e) ? e.pop() : t;
								})(e, 1 / 0),
								r = e;
							return r.length
								? 1 === r.length
									? gn(r[0])
									: (function F_(e = 1 / 0) {
											return bo(uc, e);
									  })(n)(Mo(r, t))
								: vs;
						})(
							a,
							u.pipe(
								(function G_(e = {}) {
									const {
										connector: t = () => new _s(),
										resetOnError: n = !0,
										resetOnComplete: r = !0,
										resetOnRefCountZero: o = !0,
									} = e;
									return (i) => {
										let s = null,
											a = null,
											u = null,
											l = 0,
											c = !1,
											d = !1;
										const f = () => {
												null == a || a.unsubscribe(), (a = null);
											},
											h = () => {
												f(), (s = u = null), (c = d = !1);
											},
											p = () => {
												const m = s;
												h(), null == m || m.unsubscribe();
											};
										return dn((m, D) => {
											l++, !d && !c && f();
											const _ = (u = null != u ? u : t());
											D.add(() => {
												l--, 0 === l && !d && !c && (a = ws(p, o));
											}),
												_.subscribe(D),
												s ||
													((s = new wo({
														next: (g) => _.next(g),
														error: (g) => {
															(d = !0), f(), (a = ws(h, n, g)), _.error(g);
														},
														complete: () => {
															(c = !0), f(), (a = ws(h, r)), _.complete();
														},
													})),
													Mo(m).subscribe(s));
										})(i);
									};
								})()
							)
						);
					}
					bootstrap(n, r) {
						if (!this._initStatus.done) throw new B(405, '');
						let o;
						(o = n instanceof Yp ? n : this._componentFactoryResolver.resolveComponentFactory(n)),
							this.componentTypes.push(o.componentType);
						const i = (function X0(e) {
								return e.isBoundToModule;
							})(o)
								? void 0
								: this._injector.get(yr),
							a = o.create(We.NULL, [], r || o.selector, i),
							u = a.location.nativeElement,
							l = a.injector.get(Gu, null),
							c = l && a.injector.get(Hg);
						return (
							l && c && c.registerApplication(u, l),
							a.onDestroy(() => {
								this.detachView(a.hostView), qu(this.components, a), c && c.unregisterApplication(u);
							}),
							this._loadComponent(a),
							a
						);
					}
					tick() {
						if (this._runningTick) throw new B(101, '');
						try {
							this._runningTick = !0;
							for (let n of this._views) n.detectChanges();
						} catch (n) {
							this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(n));
						} finally {
							this._runningTick = !1;
						}
					}
					attachView(n) {
						const r = n;
						this._views.push(r), r.attachToAppRef(this);
					}
					detachView(n) {
						const r = n;
						qu(this._views, r), r.detachFromAppRef();
					}
					_loadComponent(n) {
						this.attachView(n.hostView),
							this.tick(),
							this.components.push(n),
							this._injector
								.get(L0, [])
								.concat(this._bootstrapListeners)
								.forEach((o) => o(n));
					}
					ngOnDestroy() {
						this._views.slice().forEach((n) => n.destroy()), this._onMicrotaskEmptySubscription.unsubscribe();
					}
					get viewCount() {
						return this._views.length;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(Le), V(We), V($r), V(Ni), V(Bu));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac, providedIn: 'root' })),
					e
				);
			})();
			function qu(e, t) {
				const n = e.indexOf(t);
				n > -1 && e.splice(n, 1);
			}
			let Qg = !0,
				Kg = (() => {
					class e {}
					return (e.__NG_ELEMENT_ID__ = sI), e;
				})();
			function sI(e) {
				return (function aI(e, t, n) {
					if (xo(e) && !n) {
						const r = Ue(e.index, t);
						return new no(r, r);
					}
					return 47 & e.type ? new no(t[16], t) : null;
				})(pe(), y(), 16 == (16 & e));
			}
			class em {
				constructor() {}
				supports(t) {
					return Qr(t);
				}
				create(t) {
					return new hI(t);
				}
			}
			const fI = (e, t) => t;
			class hI {
				constructor(t) {
					(this.length = 0),
						(this._linkedRecords = null),
						(this._unlinkedRecords = null),
						(this._previousItHead = null),
						(this._itHead = null),
						(this._itTail = null),
						(this._additionsHead = null),
						(this._additionsTail = null),
						(this._movesHead = null),
						(this._movesTail = null),
						(this._removalsHead = null),
						(this._removalsTail = null),
						(this._identityChangesHead = null),
						(this._identityChangesTail = null),
						(this._trackByFn = t || fI);
				}
				forEachItem(t) {
					let n;
					for (n = this._itHead; null !== n; n = n._next) t(n);
				}
				forEachOperation(t) {
					let n = this._itHead,
						r = this._removalsHead,
						o = 0,
						i = null;
					for (; n || r; ) {
						const s = !r || (n && n.currentIndex < nm(r, o, i)) ? n : r,
							a = nm(s, o, i),
							u = s.currentIndex;
						if (s === r) o--, (r = r._nextRemoved);
						else if (((n = n._next), null == s.previousIndex)) o++;
						else {
							i || (i = []);
							const l = a - o,
								c = u - o;
							if (l != c) {
								for (let f = 0; f < l; f++) {
									const h = f < i.length ? i[f] : (i[f] = 0),
										p = h + f;
									c <= p && p < l && (i[f] = h + 1);
								}
								i[s.previousIndex] = c - l;
							}
						}
						a !== u && t(s, a, u);
					}
				}
				forEachPreviousItem(t) {
					let n;
					for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
				}
				forEachAddedItem(t) {
					let n;
					for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
				}
				forEachMovedItem(t) {
					let n;
					for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
				}
				forEachRemovedItem(t) {
					let n;
					for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
				}
				forEachIdentityChange(t) {
					let n;
					for (n = this._identityChangesHead; null !== n; n = n._nextIdentityChange) t(n);
				}
				diff(t) {
					if ((null == t && (t = []), !Qr(t))) throw new B(900, '');
					return this.check(t) ? this : null;
				}
				onDestroy() {}
				check(t) {
					this._reset();
					let o,
						i,
						s,
						n = this._itHead,
						r = !1;
					if (Array.isArray(t)) {
						this.length = t.length;
						for (let a = 0; a < this.length; a++)
							(i = t[a]),
								(s = this._trackByFn(a, i)),
								null !== n && Object.is(n.trackById, s)
									? (r && (n = this._verifyReinsertion(n, i, s, a)), Object.is(n.item, i) || this._addIdentityChange(n, i))
									: ((n = this._mismatch(n, i, s, a)), (r = !0)),
								(n = n._next);
					} else
						(o = 0),
							(function uE(e, t) {
								if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
								else {
									const n = e[er()]();
									let r;
									for (; !(r = n.next()).done; ) t(r.value);
								}
							})(t, (a) => {
								(s = this._trackByFn(o, a)),
									null !== n && Object.is(n.trackById, s)
										? (r && (n = this._verifyReinsertion(n, a, s, o)), Object.is(n.item, a) || this._addIdentityChange(n, a))
										: ((n = this._mismatch(n, a, s, o)), (r = !0)),
									(n = n._next),
									o++;
							}),
							(this.length = o);
					return this._truncate(n), (this.collection = t), this.isDirty;
				}
				get isDirty() {
					return (
						null !== this._additionsHead ||
						null !== this._movesHead ||
						null !== this._removalsHead ||
						null !== this._identityChangesHead
					);
				}
				_reset() {
					if (this.isDirty) {
						let t;
						for (t = this._previousItHead = this._itHead; null !== t; t = t._next) t._nextPrevious = t._next;
						for (t = this._additionsHead; null !== t; t = t._nextAdded) t.previousIndex = t.currentIndex;
						for (this._additionsHead = this._additionsTail = null, t = this._movesHead; null !== t; t = t._nextMoved)
							t.previousIndex = t.currentIndex;
						(this._movesHead = this._movesTail = null),
							(this._removalsHead = this._removalsTail = null),
							(this._identityChangesHead = this._identityChangesTail = null);
					}
				}
				_mismatch(t, n, r, o) {
					let i;
					return (
						null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
						null !== (t = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null))
							? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, o))
							: null !== (t = null === this._linkedRecords ? null : this._linkedRecords.get(r, o))
							? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, o))
							: (t = this._addAfter(new pI(n, r), i, o)),
						t
					);
				}
				_verifyReinsertion(t, n, r, o) {
					let i = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
					return (
						null !== i
							? (t = this._reinsertAfter(i, t._prev, o))
							: t.currentIndex != o && ((t.currentIndex = o), this._addToMoves(t, o)),
						t
					);
				}
				_truncate(t) {
					for (; null !== t; ) {
						const n = t._next;
						this._addToRemovals(this._unlink(t)), (t = n);
					}
					null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
						null !== this._additionsTail && (this._additionsTail._nextAdded = null),
						null !== this._movesTail && (this._movesTail._nextMoved = null),
						null !== this._itTail && (this._itTail._next = null),
						null !== this._removalsTail && (this._removalsTail._nextRemoved = null),
						null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null);
				}
				_reinsertAfter(t, n, r) {
					null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
					const o = t._prevRemoved,
						i = t._nextRemoved;
					return (
						null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
						null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
						this._insertAfter(t, n, r),
						this._addToMoves(t, r),
						t
					);
				}
				_moveAfter(t, n, r) {
					return this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t;
				}
				_addAfter(t, n, r) {
					return (
						this._insertAfter(t, n, r),
						(this._additionsTail =
							null === this._additionsTail ? (this._additionsHead = t) : (this._additionsTail._nextAdded = t)),
						t
					);
				}
				_insertAfter(t, n, r) {
					const o = null === n ? this._itHead : n._next;
					return (
						(t._next = o),
						(t._prev = n),
						null === o ? (this._itTail = t) : (o._prev = t),
						null === n ? (this._itHead = t) : (n._next = t),
						null === this._linkedRecords && (this._linkedRecords = new tm()),
						this._linkedRecords.put(t),
						(t.currentIndex = r),
						t
					);
				}
				_remove(t) {
					return this._addToRemovals(this._unlink(t));
				}
				_unlink(t) {
					null !== this._linkedRecords && this._linkedRecords.remove(t);
					const n = t._prev,
						r = t._next;
					return null === n ? (this._itHead = r) : (n._next = r), null === r ? (this._itTail = n) : (r._prev = n), t;
				}
				_addToMoves(t, n) {
					return (
						t.previousIndex === n ||
							(this._movesTail = null === this._movesTail ? (this._movesHead = t) : (this._movesTail._nextMoved = t)),
						t
					);
				}
				_addToRemovals(t) {
					return (
						null === this._unlinkedRecords && (this._unlinkedRecords = new tm()),
						this._unlinkedRecords.put(t),
						(t.currentIndex = null),
						(t._nextRemoved = null),
						null === this._removalsTail
							? ((this._removalsTail = this._removalsHead = t), (t._prevRemoved = null))
							: ((t._prevRemoved = this._removalsTail), (this._removalsTail = this._removalsTail._nextRemoved = t)),
						t
					);
				}
				_addIdentityChange(t, n) {
					return (
						(t.item = n),
						(this._identityChangesTail =
							null === this._identityChangesTail
								? (this._identityChangesHead = t)
								: (this._identityChangesTail._nextIdentityChange = t)),
						t
					);
				}
			}
			class pI {
				constructor(t, n) {
					(this.item = t),
						(this.trackById = n),
						(this.currentIndex = null),
						(this.previousIndex = null),
						(this._nextPrevious = null),
						(this._prev = null),
						(this._next = null),
						(this._prevDup = null),
						(this._nextDup = null),
						(this._prevRemoved = null),
						(this._nextRemoved = null),
						(this._nextAdded = null),
						(this._nextMoved = null),
						(this._nextIdentityChange = null);
				}
			}
			class gI {
				constructor() {
					(this._head = null), (this._tail = null);
				}
				add(t) {
					null === this._head
						? ((this._head = this._tail = t), (t._nextDup = null), (t._prevDup = null))
						: ((this._tail._nextDup = t), (t._prevDup = this._tail), (t._nextDup = null), (this._tail = t));
				}
				get(t, n) {
					let r;
					for (r = this._head; null !== r; r = r._nextDup)
						if ((null === n || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
					return null;
				}
				remove(t) {
					const n = t._prevDup,
						r = t._nextDup;
					return (
						null === n ? (this._head = r) : (n._nextDup = r),
						null === r ? (this._tail = n) : (r._prevDup = n),
						null === this._head
					);
				}
			}
			class tm {
				constructor() {
					this.map = new Map();
				}
				put(t) {
					const n = t.trackById;
					let r = this.map.get(n);
					r || ((r = new gI()), this.map.set(n, r)), r.add(t);
				}
				get(t, n) {
					const o = this.map.get(t);
					return o ? o.get(t, n) : null;
				}
				remove(t) {
					const n = t.trackById;
					return this.map.get(n).remove(t) && this.map.delete(n), t;
				}
				get isEmpty() {
					return 0 === this.map.size;
				}
				clear() {
					this.map.clear();
				}
			}
			function nm(e, t, n) {
				const r = e.previousIndex;
				if (null === r) return r;
				let o = 0;
				return n && r < n.length && (o = n[r]), r + t + o;
			}
			function om() {
				return new Hi([new em()]);
			}
			let Hi = (() => {
				class e {
					constructor(n) {
						this.factories = n;
					}
					static create(n, r) {
						if (null != r) {
							const o = r.factories.slice();
							n = n.concat(o);
						}
						return new e(n);
					}
					static extend(n) {
						return { provide: e, useFactory: (r) => e.create(n, r || om()), deps: [[e, new Yo(), new Ko()]] };
					}
					find(n) {
						const r = this.factories.find((o) => o.supports(n));
						if (null != r) return r;
						throw new B(901, '');
					}
				}
				return (e.ɵprov = $({ token: e, providedIn: 'root', factory: om })), e;
			})();
			const vI = $g(null, 'core', [
				{ provide: ki, useValue: 'unknown' },
				{ provide: Gg, deps: [We] },
				{ provide: Hg, deps: [] },
				{ provide: B0, deps: [] },
			]);
			let CI = (() => {
					class e {
						constructor(n) {}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(qg));
						}),
						(e.ɵmod = Ct({ type: e })),
						(e.ɵinj = ot({})),
						e
					);
				})(),
				ji = null;
			function In() {
				return ji;
			}
			const mt = new L('DocumentToken');
			function mm(e, t) {
				t = encodeURIComponent(t);
				for (const n of e.split(';')) {
					const r = n.indexOf('='),
						[o, i] = -1 == r ? [n, ''] : [n.slice(0, r), n.slice(r + 1)];
					if (o.trim() === t) return decodeURIComponent(i);
				}
				return null;
			}
			class fA {
				constructor(t, n, r, o) {
					(this.$implicit = t), (this.ngForOf = n), (this.index = r), (this.count = o);
				}
				get first() {
					return 0 === this.index;
				}
				get last() {
					return this.index === this.count - 1;
				}
				get even() {
					return this.index % 2 == 0;
				}
				get odd() {
					return !this.even;
				}
			}
			let sl = (() => {
				class e {
					constructor(n, r, o) {
						(this._viewContainer = n),
							(this._template = r),
							(this._differs = o),
							(this._ngForOf = null),
							(this._ngForOfDirty = !0),
							(this._differ = null);
					}
					set ngForOf(n) {
						(this._ngForOf = n), (this._ngForOfDirty = !0);
					}
					set ngForTrackBy(n) {
						this._trackByFn = n;
					}
					get ngForTrackBy() {
						return this._trackByFn;
					}
					set ngForTemplate(n) {
						n && (this._template = n);
					}
					ngDoCheck() {
						if (this._ngForOfDirty) {
							this._ngForOfDirty = !1;
							const n = this._ngForOf;
							!this._differ && n && (this._differ = this._differs.find(n).create(this.ngForTrackBy));
						}
						if (this._differ) {
							const n = this._differ.diff(this._ngForOf);
							n && this._applyChanges(n);
						}
					}
					_applyChanges(n) {
						const r = this._viewContainer;
						n.forEachOperation((o, i, s) => {
							if (null == o.previousIndex)
								r.createEmbeddedView(this._template, new fA(o.item, this._ngForOf, -1, -1), null === s ? void 0 : s);
							else if (null == s) r.remove(null === i ? void 0 : i);
							else if (null !== i) {
								const a = r.get(i);
								r.move(a, s), ym(a, o);
							}
						});
						for (let o = 0, i = r.length; o < i; o++) {
							const a = r.get(o).context;
							(a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
						}
						n.forEachIdentityChange((o) => {
							ym(r.get(o.currentIndex), o);
						});
					}
					static ngTemplateContextGuard(n, r) {
						return !0;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(v(xt), v(Gt), v(Hi));
					}),
					(e.ɵdir = S({
						type: e,
						selectors: [['', 'ngFor', '', 'ngForOf', '']],
						inputs: { ngForOf: 'ngForOf', ngForTrackBy: 'ngForTrackBy', ngForTemplate: 'ngForTemplate' },
					})),
					e
				);
			})();
			function ym(e, t) {
				e.context.$implicit = t.item;
			}
			let _m = (() => {
				class e {
					constructor(n, r) {
						(this._viewContainer = n),
							(this._context = new hA()),
							(this._thenTemplateRef = null),
							(this._elseTemplateRef = null),
							(this._thenViewRef = null),
							(this._elseViewRef = null),
							(this._thenTemplateRef = r);
					}
					set ngIf(n) {
						(this._context.$implicit = this._context.ngIf = n), this._updateView();
					}
					set ngIfThen(n) {
						Dm('ngIfThen', n), (this._thenTemplateRef = n), (this._thenViewRef = null), this._updateView();
					}
					set ngIfElse(n) {
						Dm('ngIfElse', n), (this._elseTemplateRef = n), (this._elseViewRef = null), this._updateView();
					}
					_updateView() {
						this._context.$implicit
							? this._thenViewRef ||
							  (this._viewContainer.clear(),
							  (this._elseViewRef = null),
							  this._thenTemplateRef &&
									(this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context)))
							: this._elseViewRef ||
							  (this._viewContainer.clear(),
							  (this._thenViewRef = null),
							  this._elseTemplateRef &&
									(this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)));
					}
					static ngTemplateContextGuard(n, r) {
						return !0;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(v(xt), v(Gt));
					}),
					(e.ɵdir = S({
						type: e,
						selectors: [['', 'ngIf', '']],
						inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
					})),
					e
				);
			})();
			class hA {
				constructor() {
					(this.$implicit = null), (this.ngIf = null);
				}
			}
			function Dm(e, t) {
				if (t && !t.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${U(t)}'.`);
			}
			let HA = (() => {
				class e {}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵmod = Ct({ type: e })),
					(e.ɵinj = ot({})),
					e
				);
			})();
			class bm {}
			class dl extends class zA extends class bI {} {
				constructor() {
					super(...arguments), (this.supportsDOMEvents = !0);
				}
			} {
				static makeCurrent() {
					!(function EI(e) {
						ji || (ji = e);
					})(new dl());
				}
				onAndCancel(t, n, r) {
					return (
						t.addEventListener(n, r, !1),
						() => {
							t.removeEventListener(n, r, !1);
						}
					);
				}
				dispatchEvent(t, n) {
					t.dispatchEvent(n);
				}
				remove(t) {
					t.parentNode && t.parentNode.removeChild(t);
				}
				createElement(t, n) {
					return (n = n || this.getDefaultDocument()).createElement(t);
				}
				createHtmlDocument() {
					return document.implementation.createHTMLDocument('fakeTitle');
				}
				getDefaultDocument() {
					return document;
				}
				isElementNode(t) {
					return t.nodeType === Node.ELEMENT_NODE;
				}
				isShadowRoot(t) {
					return t instanceof DocumentFragment;
				}
				getGlobalEventTarget(t, n) {
					return 'window' === n ? window : 'document' === n ? t : 'body' === n ? t.body : null;
				}
				getBaseHref(t) {
					const n = (function qA() {
						return (co = co || document.querySelector('base')), co ? co.getAttribute('href') : null;
					})();
					return null == n
						? null
						: (function WA(e) {
								(Ki = Ki || document.createElement('a')), Ki.setAttribute('href', e);
								const t = Ki.pathname;
								return '/' === t.charAt(0) ? t : `/${t}`;
						  })(n);
				}
				resetBaseElement() {
					co = null;
				}
				getUserAgent() {
					return window.navigator.userAgent;
				}
				getCookie(t) {
					return mm(document.cookie, t);
				}
			}
			let Ki,
				co = null;
			const Mm = new L('TRANSITION_ID'),
				ZA = [
					{
						provide: Rg,
						useFactory: function QA(e, t, n) {
							return () => {
								n.get(Bu).donePromise.then(() => {
									const r = In(),
										o = t.querySelectorAll(`style[ng-transition="${e}"]`);
									for (let i = 0; i < o.length; i++) r.remove(o[i]);
								});
							};
						},
						deps: [Mm, mt, We],
						multi: !0,
					},
				];
			class fl {
				static init() {
					!(function K0(e) {
						zu = e;
					})(new fl());
				}
				addToWindow(t) {
					(z.getAngularTestability = (r, o = !0) => {
						const i = t.findTestabilityInTree(r, o);
						if (null == i) throw new Error('Could not find testability for element.');
						return i;
					}),
						(z.getAllAngularTestabilities = () => t.getAllTestabilities()),
						(z.getAllAngularRootElements = () => t.getAllRootElements()),
						z.frameworkStabilizers || (z.frameworkStabilizers = []),
						z.frameworkStabilizers.push((r) => {
							const o = z.getAllAngularTestabilities();
							let i = o.length,
								s = !1;
							const a = function (u) {
								(s = s || u), i--, 0 == i && r(s);
							};
							o.forEach(function (u) {
								u.whenStable(a);
							});
						});
				}
				findTestabilityInTree(t, n, r) {
					if (null == n) return null;
					const o = t.getTestability(n);
					return null != o
						? o
						: r
						? In().isShadowRoot(n)
							? this.findTestabilityInTree(t, n.host, !0)
							: this.findTestabilityInTree(t, n.parentElement, !0)
						: null;
				}
			}
			let JA = (() => {
				class e {
					build() {
						return new XMLHttpRequest();
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const Yi = new L('EventManagerPlugins');
			let Xi = (() => {
				class e {
					constructor(n, r) {
						(this._zone = r),
							(this._eventNameToPlugin = new Map()),
							n.forEach((o) => (o.manager = this)),
							(this._plugins = n.slice().reverse());
					}
					addEventListener(n, r, o) {
						return this._findPluginFor(r).addEventListener(n, r, o);
					}
					addGlobalEventListener(n, r, o) {
						return this._findPluginFor(r).addGlobalEventListener(n, r, o);
					}
					getZone() {
						return this._zone;
					}
					_findPluginFor(n) {
						const r = this._eventNameToPlugin.get(n);
						if (r) return r;
						const o = this._plugins;
						for (let i = 0; i < o.length; i++) {
							const s = o[i];
							if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
						}
						throw new Error(`No event manager plugin found for event ${n}`);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(Yi), V(Le));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class Im {
				constructor(t) {
					this._doc = t;
				}
				addGlobalEventListener(t, n, r) {
					const o = In().getGlobalEventTarget(this._doc, t);
					if (!o) throw new Error(`Unsupported event target ${o} for event ${n}`);
					return this.addEventListener(o, n, r);
				}
			}
			let Am = (() => {
					class e {
						constructor() {
							this._stylesSet = new Set();
						}
						addStyles(n) {
							const r = new Set();
							n.forEach((o) => {
								this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
							}),
								this.onStylesAdded(r);
						}
						onStylesAdded(n) {}
						getAllStyles() {
							return Array.from(this._stylesSet);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				fo = (() => {
					class e extends Am {
						constructor(n) {
							super(), (this._doc = n), (this._hostNodes = new Map()), this._hostNodes.set(n.head, []);
						}
						_addStylesToHost(n, r, o) {
							n.forEach((i) => {
								const s = this._doc.createElement('style');
								(s.textContent = i), o.push(r.appendChild(s));
							});
						}
						addHost(n) {
							const r = [];
							this._addStylesToHost(this._stylesSet, n, r), this._hostNodes.set(n, r);
						}
						removeHost(n) {
							const r = this._hostNodes.get(n);
							r && r.forEach(Sm), this._hostNodes.delete(n);
						}
						onStylesAdded(n) {
							this._hostNodes.forEach((r, o) => {
								this._addStylesToHost(n, o, r);
							});
						}
						ngOnDestroy() {
							this._hostNodes.forEach((n) => n.forEach(Sm));
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(mt));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})();
			function Sm(e) {
				In().remove(e);
			}
			const hl = {
					svg: 'http://www.w3.org/2000/svg',
					xhtml: 'http://www.w3.org/1999/xhtml',
					xlink: 'http://www.w3.org/1999/xlink',
					xml: 'http://www.w3.org/XML/1998/namespace',
					xmlns: 'http://www.w3.org/2000/xmlns/',
					math: 'http://www.w3.org/1998/MathML/',
				},
				pl = /%COMP%/g;
			function es(e, t, n) {
				for (let r = 0; r < t.length; r++) {
					let o = t[r];
					Array.isArray(o) ? es(e, o, n) : ((o = o.replace(pl, e)), n.push(o));
				}
				return n;
			}
			function Fm(e) {
				return (t) => {
					if ('__ngUnwrap__' === t) return e;
					!1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
				};
			}
			let gl = (() => {
				class e {
					constructor(n, r, o) {
						(this.eventManager = n),
							(this.sharedStylesHost = r),
							(this.appId = o),
							(this.rendererByCompId = new Map()),
							(this.defaultRenderer = new ml(n));
					}
					createRenderer(n, r) {
						if (!n || !r) return this.defaultRenderer;
						switch (r.encapsulation) {
							case vt.Emulated: {
								let o = this.rendererByCompId.get(r.id);
								return (
									o ||
										((o = new nS(this.eventManager, this.sharedStylesHost, r, this.appId)), this.rendererByCompId.set(r.id, o)),
									o.applyToHost(n),
									o
								);
							}
							case 1:
							case vt.ShadowDom:
								return new rS(this.eventManager, this.sharedStylesHost, n, r);
							default:
								if (!this.rendererByCompId.has(r.id)) {
									const o = es(r.id, r.styles, []);
									this.sharedStylesHost.addStyles(o), this.rendererByCompId.set(r.id, this.defaultRenderer);
								}
								return this.defaultRenderer;
						}
					}
					begin() {}
					end() {}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(Xi), V(fo), V(so));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class ml {
				constructor(t) {
					(this.eventManager = t), (this.data = Object.create(null)), (this.destroyNode = null);
				}
				destroy() {}
				createElement(t, n) {
					return n ? document.createElementNS(hl[n] || n, t) : document.createElement(t);
				}
				createComment(t) {
					return document.createComment(t);
				}
				createText(t) {
					return document.createTextNode(t);
				}
				appendChild(t, n) {
					t.appendChild(n);
				}
				insertBefore(t, n, r) {
					t && t.insertBefore(n, r);
				}
				removeChild(t, n) {
					t && t.removeChild(n);
				}
				selectRootElement(t, n) {
					let r = 'string' == typeof t ? document.querySelector(t) : t;
					if (!r) throw new Error(`The selector "${t}" did not match any elements`);
					return n || (r.textContent = ''), r;
				}
				parentNode(t) {
					return t.parentNode;
				}
				nextSibling(t) {
					return t.nextSibling;
				}
				setAttribute(t, n, r, o) {
					if (o) {
						n = o + ':' + n;
						const i = hl[o];
						i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
					} else t.setAttribute(n, r);
				}
				removeAttribute(t, n, r) {
					if (r) {
						const o = hl[r];
						o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
					} else t.removeAttribute(n);
				}
				addClass(t, n) {
					t.classList.add(n);
				}
				removeClass(t, n) {
					t.classList.remove(n);
				}
				setStyle(t, n, r, o) {
					o & (ze.DashCase | ze.Important) ? t.style.setProperty(n, r, o & ze.Important ? 'important' : '') : (t.style[n] = r);
				}
				removeStyle(t, n, r) {
					r & ze.DashCase ? t.style.removeProperty(n) : (t.style[n] = '');
				}
				setProperty(t, n, r) {
					t[n] = r;
				}
				setValue(t, n) {
					t.nodeValue = n;
				}
				listen(t, n, r) {
					return 'string' == typeof t
						? this.eventManager.addGlobalEventListener(t, n, Fm(r))
						: this.eventManager.addEventListener(t, n, Fm(r));
				}
			}
			class nS extends ml {
				constructor(t, n, r, o) {
					super(t), (this.component = r);
					const i = es(o + '-' + r.id, r.styles, []);
					n.addStyles(i),
						(this.contentAttr = (function XA(e) {
							return '_ngcontent-%COMP%'.replace(pl, e);
						})(o + '-' + r.id)),
						(this.hostAttr = (function eS(e) {
							return '_nghost-%COMP%'.replace(pl, e);
						})(o + '-' + r.id));
				}
				applyToHost(t) {
					super.setAttribute(t, this.hostAttr, '');
				}
				createElement(t, n) {
					const r = super.createElement(t, n);
					return super.setAttribute(r, this.contentAttr, ''), r;
				}
			}
			class rS extends ml {
				constructor(t, n, r, o) {
					super(t),
						(this.sharedStylesHost = n),
						(this.hostEl = r),
						(this.shadowRoot = r.attachShadow({ mode: 'open' })),
						this.sharedStylesHost.addHost(this.shadowRoot);
					const i = es(o.id, o.styles, []);
					for (let s = 0; s < i.length; s++) {
						const a = document.createElement('style');
						(a.textContent = i[s]), this.shadowRoot.appendChild(a);
					}
				}
				nodeOrShadowRoot(t) {
					return t === this.hostEl ? this.shadowRoot : t;
				}
				destroy() {
					this.sharedStylesHost.removeHost(this.shadowRoot);
				}
				appendChild(t, n) {
					return super.appendChild(this.nodeOrShadowRoot(t), n);
				}
				insertBefore(t, n, r) {
					return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
				}
				removeChild(t, n) {
					return super.removeChild(this.nodeOrShadowRoot(t), n);
				}
				parentNode(t) {
					return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
				}
			}
			let oS = (() => {
				class e extends Im {
					constructor(n) {
						super(n);
					}
					supports(n) {
						return !0;
					}
					addEventListener(n, r, o) {
						return n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o);
					}
					removeEventListener(n, r, o) {
						return n.removeEventListener(r, o);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(mt));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const Pm = ['alt', 'control', 'meta', 'shift'],
				sS = {
					'\b': 'Backspace',
					'\t': 'Tab',
					'\x7f': 'Delete',
					'\x1b': 'Escape',
					Del: 'Delete',
					Esc: 'Escape',
					Left: 'ArrowLeft',
					Right: 'ArrowRight',
					Up: 'ArrowUp',
					Down: 'ArrowDown',
					Menu: 'ContextMenu',
					Scroll: 'ScrollLock',
					Win: 'OS',
				},
				Om = {
					A: '1',
					B: '2',
					C: '3',
					D: '4',
					E: '5',
					F: '6',
					G: '7',
					H: '8',
					I: '9',
					J: '*',
					K: '+',
					M: '-',
					N: '.',
					O: '/',
					'`': '0',
					'\x90': 'NumLock',
				},
				aS = { alt: (e) => e.altKey, control: (e) => e.ctrlKey, meta: (e) => e.metaKey, shift: (e) => e.shiftKey };
			let uS = (() => {
				class e extends Im {
					constructor(n) {
						super(n);
					}
					supports(n) {
						return null != e.parseEventName(n);
					}
					addEventListener(n, r, o) {
						const i = e.parseEventName(r),
							s = e.eventCallback(i.fullKey, o, this.manager.getZone());
						return this.manager.getZone().runOutsideAngular(() => In().onAndCancel(n, i.domEventName, s));
					}
					static parseEventName(n) {
						const r = n.toLowerCase().split('.'),
							o = r.shift();
						if (0 === r.length || ('keydown' !== o && 'keyup' !== o)) return null;
						const i = e._normalizeKey(r.pop());
						let s = '';
						if (
							(Pm.forEach((u) => {
								const l = r.indexOf(u);
								l > -1 && (r.splice(l, 1), (s += u + '.'));
							}),
							(s += i),
							0 != r.length || 0 === i.length)
						)
							return null;
						const a = {};
						return (a.domEventName = o), (a.fullKey = s), a;
					}
					static getEventFullKey(n) {
						let r = '',
							o = (function lS(e) {
								let t = e.key;
								if (null == t) {
									if (((t = e.keyIdentifier), null == t)) return 'Unidentified';
									t.startsWith('U+') &&
										((t = String.fromCharCode(parseInt(t.substring(2), 16))),
										3 === e.location && Om.hasOwnProperty(t) && (t = Om[t]));
								}
								return sS[t] || t;
							})(n);
						return (
							(o = o.toLowerCase()),
							' ' === o ? (o = 'space') : '.' === o && (o = 'dot'),
							Pm.forEach((i) => {
								i != o && aS[i](n) && (r += i + '.');
							}),
							(r += o),
							r
						);
					}
					static eventCallback(n, r, o) {
						return (i) => {
							e.getEventFullKey(i) === n && o.runGuarded(() => r(i));
						};
					}
					static _normalizeKey(n) {
						return 'esc' === n ? 'escape' : n;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(mt));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const hS = $g(vI, 'browser', [
					{ provide: ki, useValue: 'browser' },
					{
						provide: kg,
						useValue: function cS() {
							dl.makeCurrent(), fl.init();
						},
						multi: !0,
					},
					{
						provide: mt,
						useFactory: function fS() {
							return (
								(function vD(e) {
									Ls = e;
								})(document),
								document
							);
						},
						deps: [],
					},
				]),
				pS = [
					{ provide: tu, useValue: 'root' },
					{
						provide: $r,
						useFactory: function dS() {
							return new $r();
						},
						deps: [],
					},
					{ provide: Yi, useClass: oS, multi: !0, deps: [mt, Le, ki] },
					{ provide: Yi, useClass: uS, multi: !0, deps: [mt] },
					{ provide: gl, useClass: gl, deps: [Xi, fo, so] },
					{ provide: eg, useExisting: gl },
					{ provide: Am, useExisting: fo },
					{ provide: fo, useClass: fo, deps: [mt] },
					{ provide: Gu, useClass: Gu, deps: [Le] },
					{ provide: Xi, useClass: Xi, deps: [Yi, Le] },
					{ provide: bm, useClass: JA, deps: [] },
				];
			let gS = (() => {
				class e {
					constructor(n) {
						if (n)
							throw new Error(
								'BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.'
							);
					}
					static withServerTransition(n) {
						return { ngModule: e, providers: [{ provide: so, useValue: n.appId }, { provide: Mm, useExisting: so }, ZA] };
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(e, 12));
					}),
					(e.ɵmod = Ct({ type: e })),
					(e.ɵinj = ot({ providers: pS, imports: [HA, CI] })),
					e
				);
			})();
			'undefined' != typeof window && window;
			class km {}
			class Lm {}
			class Pt {
				constructor(t) {
					(this.normalizedNames = new Map()),
						(this.lazyUpdate = null),
						t
							? (this.lazyInit =
									'string' == typeof t
										? () => {
												(this.headers = new Map()),
													t.split('\n').forEach((n) => {
														const r = n.indexOf(':');
														if (r > 0) {
															const o = n.slice(0, r),
																i = o.toLowerCase(),
																s = n.slice(r + 1).trim();
															this.maybeSetNormalizedName(o, i),
																this.headers.has(i) ? this.headers.get(i).push(s) : this.headers.set(i, [s]);
														}
													});
										  }
										: () => {
												(this.headers = new Map()),
													Object.keys(t).forEach((n) => {
														let r = t[n];
														const o = n.toLowerCase();
														'string' == typeof r && (r = [r]),
															r.length > 0 && (this.headers.set(o, r), this.maybeSetNormalizedName(n, o));
													});
										  })
							: (this.headers = new Map());
				}
				has(t) {
					return this.init(), this.headers.has(t.toLowerCase());
				}
				get(t) {
					this.init();
					const n = this.headers.get(t.toLowerCase());
					return n && n.length > 0 ? n[0] : null;
				}
				keys() {
					return this.init(), Array.from(this.normalizedNames.values());
				}
				getAll(t) {
					return this.init(), this.headers.get(t.toLowerCase()) || null;
				}
				append(t, n) {
					return this.clone({ name: t, value: n, op: 'a' });
				}
				set(t, n) {
					return this.clone({ name: t, value: n, op: 's' });
				}
				delete(t, n) {
					return this.clone({ name: t, value: n, op: 'd' });
				}
				maybeSetNormalizedName(t, n) {
					this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
				}
				init() {
					this.lazyInit &&
						(this.lazyInit instanceof Pt ? this.copyFrom(this.lazyInit) : this.lazyInit(),
						(this.lazyInit = null),
						this.lazyUpdate && (this.lazyUpdate.forEach((t) => this.applyUpdate(t)), (this.lazyUpdate = null)));
				}
				copyFrom(t) {
					t.init(),
						Array.from(t.headers.keys()).forEach((n) => {
							this.headers.set(n, t.headers.get(n)), this.normalizedNames.set(n, t.normalizedNames.get(n));
						});
				}
				clone(t) {
					const n = new Pt();
					return (
						(n.lazyInit = this.lazyInit && this.lazyInit instanceof Pt ? this.lazyInit : this),
						(n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
						n
					);
				}
				applyUpdate(t) {
					const n = t.name.toLowerCase();
					switch (t.op) {
						case 'a':
						case 's':
							let r = t.value;
							if (('string' == typeof r && (r = [r]), 0 === r.length)) return;
							this.maybeSetNormalizedName(t.name, n);
							const o = ('a' === t.op ? this.headers.get(n) : void 0) || [];
							o.push(...r), this.headers.set(n, o);
							break;
						case 'd':
							const i = t.value;
							if (i) {
								let s = this.headers.get(n);
								if (!s) return;
								(s = s.filter((a) => -1 === i.indexOf(a))),
									0 === s.length ? (this.headers.delete(n), this.normalizedNames.delete(n)) : this.headers.set(n, s);
							} else this.headers.delete(n), this.normalizedNames.delete(n);
					}
				}
				forEach(t) {
					this.init(),
						Array.from(this.normalizedNames.keys()).forEach((n) => t(this.normalizedNames.get(n), this.headers.get(n)));
				}
			}
			class TS {
				encodeKey(t) {
					return Bm(t);
				}
				encodeValue(t) {
					return Bm(t);
				}
				decodeKey(t) {
					return decodeURIComponent(t);
				}
				decodeValue(t) {
					return decodeURIComponent(t);
				}
			}
			const FS = /%(\d[a-f0-9])/gi,
				xS = { 40: '@', '3A': ':', 24: '$', '2C': ',', '3B': ';', '2B': '+', '3D': '=', '3F': '?', '2F': '/' };
			function Bm(e) {
				return encodeURIComponent(e).replace(FS, (t, n) => {
					var r;
					return null !== (r = xS[n]) && void 0 !== r ? r : t;
				});
			}
			function Hm(e) {
				return `${e}`;
			}
			class on {
				constructor(t = {}) {
					if (((this.updates = null), (this.cloneFrom = null), (this.encoder = t.encoder || new TS()), t.fromString)) {
						if (t.fromObject) throw new Error('Cannot specify both fromString and fromObject.');
						this.map = (function NS(e, t) {
							const n = new Map();
							return (
								e.length > 0 &&
									e
										.replace(/^\?/, '')
										.split('&')
										.forEach((o) => {
											const i = o.indexOf('='),
												[s, a] = -1 == i ? [t.decodeKey(o), ''] : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
												u = n.get(s) || [];
											u.push(a), n.set(s, u);
										}),
								n
							);
						})(t.fromString, this.encoder);
					} else
						t.fromObject
							? ((this.map = new Map()),
							  Object.keys(t.fromObject).forEach((n) => {
									const r = t.fromObject[n];
									this.map.set(n, Array.isArray(r) ? r : [r]);
							  }))
							: (this.map = null);
				}
				has(t) {
					return this.init(), this.map.has(t);
				}
				get(t) {
					this.init();
					const n = this.map.get(t);
					return n ? n[0] : null;
				}
				getAll(t) {
					return this.init(), this.map.get(t) || null;
				}
				keys() {
					return this.init(), Array.from(this.map.keys());
				}
				append(t, n) {
					return this.clone({ param: t, value: n, op: 'a' });
				}
				appendAll(t) {
					const n = [];
					return (
						Object.keys(t).forEach((r) => {
							const o = t[r];
							Array.isArray(o)
								? o.forEach((i) => {
										n.push({ param: r, value: i, op: 'a' });
								  })
								: n.push({ param: r, value: o, op: 'a' });
						}),
						this.clone(n)
					);
				}
				set(t, n) {
					return this.clone({ param: t, value: n, op: 's' });
				}
				delete(t, n) {
					return this.clone({ param: t, value: n, op: 'd' });
				}
				toString() {
					return (
						this.init(),
						this.keys()
							.map((t) => {
								const n = this.encoder.encodeKey(t);
								return this.map
									.get(t)
									.map((r) => n + '=' + this.encoder.encodeValue(r))
									.join('&');
							})
							.filter((t) => '' !== t)
							.join('&')
					);
				}
				clone(t) {
					const n = new on({ encoder: this.encoder });
					return (n.cloneFrom = this.cloneFrom || this), (n.updates = (this.updates || []).concat(t)), n;
				}
				init() {
					null === this.map && (this.map = new Map()),
						null !== this.cloneFrom &&
							(this.cloneFrom.init(),
							this.cloneFrom.keys().forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
							this.updates.forEach((t) => {
								switch (t.op) {
									case 'a':
									case 's':
										const n = ('a' === t.op ? this.map.get(t.param) : void 0) || [];
										n.push(Hm(t.value)), this.map.set(t.param, n);
										break;
									case 'd':
										if (void 0 === t.value) {
											this.map.delete(t.param);
											break;
										}
										{
											let r = this.map.get(t.param) || [];
											const o = r.indexOf(Hm(t.value));
											-1 !== o && r.splice(o, 1), r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param);
										}
								}
							}),
							(this.cloneFrom = this.updates = null));
				}
			}
			class PS {
				constructor() {
					this.map = new Map();
				}
				set(t, n) {
					return this.map.set(t, n), this;
				}
				get(t) {
					return this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t);
				}
				delete(t) {
					return this.map.delete(t), this;
				}
				has(t) {
					return this.map.has(t);
				}
				keys() {
					return this.map.keys();
				}
			}
			function jm(e) {
				return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer;
			}
			function $m(e) {
				return 'undefined' != typeof Blob && e instanceof Blob;
			}
			function Um(e) {
				return 'undefined' != typeof FormData && e instanceof FormData;
			}
			class ho {
				constructor(t, n, r, o) {
					let i;
					if (
						((this.url = n),
						(this.body = null),
						(this.reportProgress = !1),
						(this.withCredentials = !1),
						(this.responseType = 'json'),
						(this.method = t.toUpperCase()),
						(function OS(e) {
							switch (e) {
								case 'DELETE':
								case 'GET':
								case 'HEAD':
								case 'OPTIONS':
								case 'JSONP':
									return !1;
								default:
									return !0;
							}
						})(this.method) || o
							? ((this.body = void 0 !== r ? r : null), (i = o))
							: (i = r),
						i &&
							((this.reportProgress = !!i.reportProgress),
							(this.withCredentials = !!i.withCredentials),
							i.responseType && (this.responseType = i.responseType),
							i.headers && (this.headers = i.headers),
							i.context && (this.context = i.context),
							i.params && (this.params = i.params)),
						this.headers || (this.headers = new Pt()),
						this.context || (this.context = new PS()),
						this.params)
					) {
						const s = this.params.toString();
						if (0 === s.length) this.urlWithParams = n;
						else {
							const a = n.indexOf('?');
							this.urlWithParams = n + (-1 === a ? '?' : a < n.length - 1 ? '&' : '') + s;
						}
					} else (this.params = new on()), (this.urlWithParams = n);
				}
				serializeBody() {
					return null === this.body
						? null
						: jm(this.body) ||
						  $m(this.body) ||
						  Um(this.body) ||
						  (function RS(e) {
								return 'undefined' != typeof URLSearchParams && e instanceof URLSearchParams;
						  })(this.body) ||
						  'string' == typeof this.body
						? this.body
						: this.body instanceof on
						? this.body.toString()
						: 'object' == typeof this.body || 'boolean' == typeof this.body || Array.isArray(this.body)
						? JSON.stringify(this.body)
						: this.body.toString();
				}
				detectContentTypeHeader() {
					return null === this.body || Um(this.body)
						? null
						: $m(this.body)
						? this.body.type || null
						: jm(this.body)
						? null
						: 'string' == typeof this.body
						? 'text/plain'
						: this.body instanceof on
						? 'application/x-www-form-urlencoded;charset=UTF-8'
						: 'object' == typeof this.body || 'number' == typeof this.body || 'boolean' == typeof this.body
						? 'application/json'
						: null;
				}
				clone(t = {}) {
					var n;
					const r = t.method || this.method,
						o = t.url || this.url,
						i = t.responseType || this.responseType,
						s = void 0 !== t.body ? t.body : this.body,
						a = void 0 !== t.withCredentials ? t.withCredentials : this.withCredentials,
						u = void 0 !== t.reportProgress ? t.reportProgress : this.reportProgress;
					let l = t.headers || this.headers,
						c = t.params || this.params;
					const d = null !== (n = t.context) && void 0 !== n ? n : this.context;
					return (
						void 0 !== t.setHeaders && (l = Object.keys(t.setHeaders).reduce((f, h) => f.set(h, t.setHeaders[h]), l)),
						t.setParams && (c = Object.keys(t.setParams).reduce((f, h) => f.set(h, t.setParams[h]), c)),
						new ho(r, o, s, { params: c, headers: l, context: d, reportProgress: u, responseType: i, withCredentials: a })
					);
				}
			}
			var he = (() => (
				((he = he || {})[(he.Sent = 0)] = 'Sent'),
				(he[(he.UploadProgress = 1)] = 'UploadProgress'),
				(he[(he.ResponseHeader = 2)] = 'ResponseHeader'),
				(he[(he.DownloadProgress = 3)] = 'DownloadProgress'),
				(he[(he.Response = 4)] = 'Response'),
				(he[(he.User = 5)] = 'User'),
				he
			))();
			class _l {
				constructor(t, n = 200, r = 'OK') {
					(this.headers = t.headers || new Pt()),
						(this.status = void 0 !== t.status ? t.status : n),
						(this.statusText = t.statusText || r),
						(this.url = t.url || null),
						(this.ok = this.status >= 200 && this.status < 300);
				}
			}
			class Dl extends _l {
				constructor(t = {}) {
					super(t), (this.type = he.ResponseHeader);
				}
				clone(t = {}) {
					return new Dl({
						headers: t.headers || this.headers,
						status: void 0 !== t.status ? t.status : this.status,
						statusText: t.statusText || this.statusText,
						url: t.url || this.url || void 0,
					});
				}
			}
			class ts extends _l {
				constructor(t = {}) {
					super(t), (this.type = he.Response), (this.body = void 0 !== t.body ? t.body : null);
				}
				clone(t = {}) {
					return new ts({
						body: void 0 !== t.body ? t.body : this.body,
						headers: t.headers || this.headers,
						status: void 0 !== t.status ? t.status : this.status,
						statusText: t.statusText || this.statusText,
						url: t.url || this.url || void 0,
					});
				}
			}
			class Gm extends _l {
				constructor(t) {
					super(t, 0, 'Unknown Error'),
						(this.name = 'HttpErrorResponse'),
						(this.ok = !1),
						(this.message =
							this.status >= 200 && this.status < 300
								? `Http failure during parsing for ${t.url || '(unknown url)'}`
								: `Http failure response for ${t.url || '(unknown url)'}: ${t.status} ${t.statusText}`),
						(this.error = t.error || null);
				}
			}
			function vl(e, t) {
				return {
					body: t,
					headers: e.headers,
					context: e.context,
					observe: e.observe,
					params: e.params,
					reportProgress: e.reportProgress,
					responseType: e.responseType,
					withCredentials: e.withCredentials,
				};
			}
			let zm = (() => {
				class e {
					constructor(n) {
						this.handler = n;
					}
					request(n, r, o = {}) {
						let i;
						if (n instanceof ho) i = n;
						else {
							let u, l;
							(u = o.headers instanceof Pt ? o.headers : new Pt(o.headers)),
								o.params && (l = o.params instanceof on ? o.params : new on({ fromObject: o.params })),
								(i = new ho(n, r, void 0 !== o.body ? o.body : null, {
									headers: u,
									context: o.context,
									params: l,
									reportProgress: o.reportProgress,
									responseType: o.responseType || 'json',
									withCredentials: o.withCredentials,
								}));
						}
						const s = (function IS(...e) {
							return Mo(e, Mc(e));
						})(i).pipe(
							(function AS(e, t) {
								return Y(t) ? bo(e, t, 1) : bo(e, 1);
							})((u) => this.handler.handle(u))
						);
						if (n instanceof ho || 'events' === o.observe) return s;
						const a = s.pipe(
							(function SS(e, t) {
								return dn((n, r) => {
									let o = 0;
									n.subscribe(fn(r, (i) => e.call(t, i, o++) && r.next(i)));
								});
							})((u) => u instanceof ts)
						);
						switch (o.observe || 'body') {
							case 'body':
								switch (i.responseType) {
									case 'arraybuffer':
										return a.pipe(
											hn((u) => {
												if (null !== u.body && !(u.body instanceof ArrayBuffer))
													throw new Error('Response is not an ArrayBuffer.');
												return u.body;
											})
										);
									case 'blob':
										return a.pipe(
											hn((u) => {
												if (null !== u.body && !(u.body instanceof Blob)) throw new Error('Response is not a Blob.');
												return u.body;
											})
										);
									case 'text':
										return a.pipe(
											hn((u) => {
												if (null !== u.body && 'string' != typeof u.body) throw new Error('Response is not a string.');
												return u.body;
											})
										);
									default:
										return a.pipe(hn((u) => u.body));
								}
							case 'response':
								return a;
							default:
								throw new Error(`Unreachable: unhandled observe type ${o.observe}}`);
						}
					}
					delete(n, r = {}) {
						return this.request('DELETE', n, r);
					}
					get(n, r = {}) {
						return this.request('GET', n, r);
					}
					head(n, r = {}) {
						return this.request('HEAD', n, r);
					}
					jsonp(n, r) {
						return this.request('JSONP', n, {
							params: new on().append(r, 'JSONP_CALLBACK'),
							observe: 'body',
							responseType: 'json',
						});
					}
					options(n, r = {}) {
						return this.request('OPTIONS', n, r);
					}
					patch(n, r, o = {}) {
						return this.request('PATCH', n, vl(o, r));
					}
					post(n, r, o = {}) {
						return this.request('POST', n, vl(o, r));
					}
					put(n, r, o = {}) {
						return this.request('PUT', n, vl(o, r));
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(km));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class qm {
				constructor(t, n) {
					(this.next = t), (this.interceptor = n);
				}
				handle(t) {
					return this.interceptor.intercept(t, this.next);
				}
			}
			const Wm = new L('HTTP_INTERCEPTORS');
			let VS = (() => {
				class e {
					intercept(n, r) {
						return r.handle(n);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const kS = /^\)\]\}',?\n/;
			let Qm = (() => {
				class e {
					constructor(n) {
						this.xhrFactory = n;
					}
					handle(n) {
						if ('JSONP' === n.method)
							throw new Error('Attempted to construct Jsonp request without HttpClientJsonpModule installed.');
						return new Ce((r) => {
							const o = this.xhrFactory.build();
							if (
								(o.open(n.method, n.urlWithParams),
								n.withCredentials && (o.withCredentials = !0),
								n.headers.forEach((h, p) => o.setRequestHeader(h, p.join(','))),
								n.headers.has('Accept') || o.setRequestHeader('Accept', 'application/json, text/plain, */*'),
								!n.headers.has('Content-Type'))
							) {
								const h = n.detectContentTypeHeader();
								null !== h && o.setRequestHeader('Content-Type', h);
							}
							if (n.responseType) {
								const h = n.responseType.toLowerCase();
								o.responseType = 'json' !== h ? h : 'text';
							}
							const i = n.serializeBody();
							let s = null;
							const a = () => {
									if (null !== s) return s;
									const h = o.statusText || 'OK',
										p = new Pt(o.getAllResponseHeaders()),
										m =
											(function LS(e) {
												return 'responseURL' in e && e.responseURL
													? e.responseURL
													: /^X-Request-URL:/m.test(e.getAllResponseHeaders())
													? e.getResponseHeader('X-Request-URL')
													: null;
											})(o) || n.url;
									return (s = new Dl({ headers: p, status: o.status, statusText: h, url: m })), s;
								},
								u = () => {
									let { headers: h, status: p, statusText: m, url: D } = a(),
										_ = null;
									204 !== p && (_ = void 0 === o.response ? o.responseText : o.response), 0 === p && (p = _ ? 200 : 0);
									let g = p >= 200 && p < 300;
									if ('json' === n.responseType && 'string' == typeof _) {
										const E = _;
										_ = _.replace(kS, '');
										try {
											_ = '' !== _ ? JSON.parse(_) : null;
										} catch (F) {
											(_ = E), g && ((g = !1), (_ = { error: F, text: _ }));
										}
									}
									g
										? (r.next(new ts({ body: _, headers: h, status: p, statusText: m, url: D || void 0 })), r.complete())
										: r.error(new Gm({ error: _, headers: h, status: p, statusText: m, url: D || void 0 }));
								},
								l = (h) => {
									const { url: p } = a(),
										m = new Gm({
											error: h,
											status: o.status || 0,
											statusText: o.statusText || 'Unknown Error',
											url: p || void 0,
										});
									r.error(m);
								};
							let c = !1;
							const d = (h) => {
									c || (r.next(a()), (c = !0));
									let p = { type: he.DownloadProgress, loaded: h.loaded };
									h.lengthComputable && (p.total = h.total),
										'text' === n.responseType && !!o.responseText && (p.partialText = o.responseText),
										r.next(p);
								},
								f = (h) => {
									let p = { type: he.UploadProgress, loaded: h.loaded };
									h.lengthComputable && (p.total = h.total), r.next(p);
								};
							return (
								o.addEventListener('load', u),
								o.addEventListener('error', l),
								o.addEventListener('timeout', l),
								o.addEventListener('abort', l),
								n.reportProgress &&
									(o.addEventListener('progress', d), null !== i && o.upload && o.upload.addEventListener('progress', f)),
								o.send(i),
								r.next({ type: he.Sent }),
								() => {
									o.removeEventListener('error', l),
										o.removeEventListener('abort', l),
										o.removeEventListener('load', u),
										o.removeEventListener('timeout', l),
										n.reportProgress &&
											(o.removeEventListener('progress', d),
											null !== i && o.upload && o.upload.removeEventListener('progress', f)),
										o.readyState !== o.DONE && o.abort();
								}
							);
						});
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(bm));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const Cl = new L('XSRF_COOKIE_NAME'),
				wl = new L('XSRF_HEADER_NAME');
			class Zm {}
			let BS = (() => {
					class e {
						constructor(n, r, o) {
							(this.doc = n),
								(this.platform = r),
								(this.cookieName = o),
								(this.lastCookieString = ''),
								(this.lastToken = null),
								(this.parseCount = 0);
						}
						getToken() {
							if ('server' === this.platform) return null;
							const n = this.doc.cookie || '';
							return (
								n !== this.lastCookieString &&
									(this.parseCount++, (this.lastToken = mm(n, this.cookieName)), (this.lastCookieString = n)),
								this.lastToken
							);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(mt), V(ki), V(Cl));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				El = (() => {
					class e {
						constructor(n, r) {
							(this.tokenService = n), (this.headerName = r);
						}
						intercept(n, r) {
							const o = n.url.toLowerCase();
							if ('GET' === n.method || 'HEAD' === n.method || o.startsWith('http://') || o.startsWith('https://'))
								return r.handle(n);
							const i = this.tokenService.getToken();
							return (
								null !== i && !n.headers.has(this.headerName) && (n = n.clone({ headers: n.headers.set(this.headerName, i) })),
								r.handle(n)
							);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(Zm), V(wl));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				HS = (() => {
					class e {
						constructor(n, r) {
							(this.backend = n), (this.injector = r), (this.chain = null);
						}
						handle(n) {
							if (null === this.chain) {
								const r = this.injector.get(Wm, []);
								this.chain = r.reduceRight((o, i) => new qm(o, i), this.backend);
							}
							return this.chain.handle(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(Lm), V(We));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				jS = (() => {
					class e {
						static disable() {
							return { ngModule: e, providers: [{ provide: El, useClass: VS }] };
						}
						static withOptions(n = {}) {
							return {
								ngModule: e,
								providers: [
									n.cookieName ? { provide: Cl, useValue: n.cookieName } : [],
									n.headerName ? { provide: wl, useValue: n.headerName } : [],
								],
							};
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = Ct({ type: e })),
						(e.ɵinj = ot({
							providers: [
								El,
								{ provide: Wm, useExisting: El, multi: !0 },
								{ provide: Zm, useClass: BS },
								{ provide: Cl, useValue: 'XSRF-TOKEN' },
								{ provide: wl, useValue: 'X-XSRF-TOKEN' },
							],
						})),
						e
					);
				})(),
				$S = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = Ct({ type: e })),
						(e.ɵinj = ot({
							providers: [zm, { provide: km, useClass: HS }, Qm, { provide: Lm, useExisting: Qm }],
							imports: [[jS.withOptions({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' })]],
						})),
						e
					);
				})();
			const { isArray: US } = Array,
				{ getPrototypeOf: GS, prototype: zS, keys: qS } = Object;
			const { isArray: ZS } = Array;
			function YS(e, t) {
				return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
			}
			function XS(...e) {
				const t = (function O_(e) {
						return Y(Cs(e)) ? e.pop() : void 0;
					})(e),
					{ args: n, keys: r } = (function WS(e) {
						if (1 === e.length) {
							const t = e[0];
							if (US(t)) return { args: t, keys: null };
							if (
								(function QS(e) {
									return e && 'object' == typeof e && GS(e) === zS;
								})(t)
							) {
								const n = qS(t);
								return { args: n.map((r) => t[r]), keys: n };
							}
						}
						return { args: e, keys: null };
					})(e),
					o = new Ce((i) => {
						const { length: s } = n;
						if (!s) return void i.complete();
						const a = new Array(s);
						let u = s,
							l = s;
						for (let c = 0; c < s; c++) {
							let d = !1;
							gn(n[c]).subscribe(
								fn(
									i,
									(f) => {
										d || ((d = !0), l--), (a[c] = f);
									},
									() => u--,
									void 0,
									() => {
										(!u || !d) && (l || i.next(r ? YS(r, a) : a), i.complete());
									}
								)
							);
						}
					});
				return t
					? o.pipe(
							(function KS(e) {
								return hn((t) =>
									(function JS(e, t) {
										return ZS(t) ? e(...t) : e(t);
									})(e, t)
								);
							})(t)
					  )
					: o;
			}
			let Jm = (() => {
					class e {
						constructor(n, r) {
							(this._renderer = n), (this._elementRef = r), (this.onChange = (o) => {}), (this.onTouched = () => {});
						}
						setProperty(n, r) {
							this._renderer.setProperty(this._elementRef.nativeElement, n, r);
						}
						registerOnTouched(n) {
							this.onTouched = n;
						}
						registerOnChange(n) {
							this.onChange = n;
						}
						setDisabledState(n) {
							this.setProperty('disabled', n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(bn), v(pt));
						}),
						(e.ɵdir = S({ type: e })),
						e
					);
				})(),
				An = (() => {
					class e extends Jm {}
					return (
						(e.ɵfac = (function () {
							let t;
							return function (r) {
								return (
									t ||
									(t = (function be(e) {
										return Qt(() => {
											const t = e.prototype.constructor,
												n = t[Vt] || ta(t),
												r = Object.prototype;
											let o = Object.getPrototypeOf(e.prototype).constructor;
											for (; o && o !== r; ) {
												const i = o[Vt] || ta(o);
												if (i && i !== n) return i;
												o = Object.getPrototypeOf(o);
											}
											return (i) => new i();
										});
									})(e))
								)(r || e);
							};
						})()),
						(e.ɵdir = S({ type: e, features: [G] })),
						e
					);
				})();
			const Ot = new L('NgValueAccessor'),
				tT = { provide: Ot, useExisting: Q(() => ns), multi: !0 },
				rT = new L('CompositionEventMode');
			let ns = (() => {
				class e extends Jm {
					constructor(n, r, o) {
						super(n, r),
							(this._compositionMode = o),
							(this._composing = !1),
							null == this._compositionMode &&
								(this._compositionMode = !(function nT() {
									const e = In() ? In().getUserAgent() : '';
									return /android (\d+)/.test(e.toLowerCase());
								})());
					}
					writeValue(n) {
						this.setProperty('value', null == n ? '' : n);
					}
					_handleInput(n) {
						(!this._compositionMode || (this._compositionMode && !this._composing)) && this.onChange(n);
					}
					_compositionStart() {
						this._composing = !0;
					}
					_compositionEnd(n) {
						(this._composing = !1), this._compositionMode && this.onChange(n);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(v(bn), v(pt), v(rT, 8));
					}),
					(e.ɵdir = S({
						type: e,
						selectors: [
							['input', 'formControlName', '', 3, 'type', 'checkbox'],
							['textarea', 'formControlName', ''],
							['input', 'formControl', '', 3, 'type', 'checkbox'],
							['textarea', 'formControl', ''],
							['input', 'ngModel', '', 3, 'type', 'checkbox'],
							['textarea', 'ngModel', ''],
							['', 'ngDefaultControl', ''],
						],
						hostBindings: function (n, r) {
							1 & n &&
								me('input', function (i) {
									return r._handleInput(i.target.value);
								})('blur', function () {
									return r.onTouched();
								})('compositionstart', function () {
									return r._compositionStart();
								})('compositionend', function (i) {
									return r._compositionEnd(i.target.value);
								});
						},
						features: [ee([tT]), G],
					})),
					e
				);
			})();
			const Ae = new L('NgValidators'),
				an = new L('NgAsyncValidators');
			function ay(e) {
				return null != e;
			}
			function uy(e) {
				const t = vi(e) ? Mo(e) : e;
				return Oh(t), t;
			}
			function ly(e) {
				let t = {};
				return (
					e.forEach((n) => {
						t = null != n ? Object.assign(Object.assign({}, t), n) : t;
					}),
					0 === Object.keys(t).length ? null : t
				);
			}
			function cy(e, t) {
				return t.map((n) => n(e));
			}
			function dy(e) {
				return e.map((t) =>
					(function iT(e) {
						return !e.validate;
					})(t)
						? t
						: (n) => t.validate(n)
				);
			}
			function bl(e) {
				return null != e
					? (function fy(e) {
							if (!e) return null;
							const t = e.filter(ay);
							return 0 == t.length
								? null
								: function (n) {
										return ly(cy(n, t));
								  };
					  })(dy(e))
					: null;
			}
			function Ml(e) {
				return null != e
					? (function hy(e) {
							if (!e) return null;
							const t = e.filter(ay);
							return 0 == t.length
								? null
								: function (n) {
										return XS(cy(n, t).map(uy)).pipe(hn(ly));
								  };
					  })(dy(e))
					: null;
			}
			function py(e, t) {
				return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
			}
			function Il(e) {
				return e ? (Array.isArray(e) ? e : [e]) : [];
			}
			function os(e, t) {
				return Array.isArray(e) ? e.includes(t) : e === t;
			}
			function yy(e, t) {
				const n = Il(t);
				return (
					Il(e).forEach((o) => {
						os(n, o) || n.push(o);
					}),
					n
				);
			}
			function _y(e, t) {
				return Il(t).filter((n) => !os(e, n));
			}
			class Dy {
				constructor() {
					(this._rawValidators = []), (this._rawAsyncValidators = []), (this._onDestroyCallbacks = []);
				}
				get value() {
					return this.control ? this.control.value : null;
				}
				get valid() {
					return this.control ? this.control.valid : null;
				}
				get invalid() {
					return this.control ? this.control.invalid : null;
				}
				get pending() {
					return this.control ? this.control.pending : null;
				}
				get disabled() {
					return this.control ? this.control.disabled : null;
				}
				get enabled() {
					return this.control ? this.control.enabled : null;
				}
				get errors() {
					return this.control ? this.control.errors : null;
				}
				get pristine() {
					return this.control ? this.control.pristine : null;
				}
				get dirty() {
					return this.control ? this.control.dirty : null;
				}
				get touched() {
					return this.control ? this.control.touched : null;
				}
				get status() {
					return this.control ? this.control.status : null;
				}
				get untouched() {
					return this.control ? this.control.untouched : null;
				}
				get statusChanges() {
					return this.control ? this.control.statusChanges : null;
				}
				get valueChanges() {
					return this.control ? this.control.valueChanges : null;
				}
				get path() {
					return null;
				}
				_setValidators(t) {
					(this._rawValidators = t || []), (this._composedValidatorFn = bl(this._rawValidators));
				}
				_setAsyncValidators(t) {
					(this._rawAsyncValidators = t || []), (this._composedAsyncValidatorFn = Ml(this._rawAsyncValidators));
				}
				get validator() {
					return this._composedValidatorFn || null;
				}
				get asyncValidator() {
					return this._composedAsyncValidatorFn || null;
				}
				_registerOnDestroy(t) {
					this._onDestroyCallbacks.push(t);
				}
				_invokeOnDestroyCallbacks() {
					this._onDestroyCallbacks.forEach((t) => t()), (this._onDestroyCallbacks = []);
				}
				reset(t) {
					this.control && this.control.reset(t);
				}
				hasError(t, n) {
					return !!this.control && this.control.hasError(t, n);
				}
				getError(t, n) {
					return this.control ? this.control.getError(t, n) : null;
				}
			}
			class un extends Dy {
				constructor() {
					super(...arguments), (this._parent = null), (this.name = null), (this.valueAccessor = null);
				}
			}
			class Oe extends Dy {
				get formDirective() {
					return null;
				}
				get path() {
					return null;
				}
			}
			class vy {
				constructor(t) {
					this._cd = t;
				}
				is(t) {
					var n, r, o;
					return 'submitted' === t
						? !!(null === (n = this._cd) || void 0 === n ? void 0 : n.submitted)
						: !!(null === (o = null === (r = this._cd) || void 0 === r ? void 0 : r.control) || void 0 === o ? void 0 : o[t]);
				}
			}
			let Cy = (() => {
					class e extends vy {
						constructor(n) {
							super(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(un, 2));
						}),
						(e.ɵdir = S({
							type: e,
							selectors: [
								['', 'formControlName', ''],
								['', 'ngModel', ''],
								['', 'formControl', ''],
							],
							hostVars: 14,
							hostBindings: function (n, r) {
								2 & n &&
									wi('ng-untouched', r.is('untouched'))('ng-touched', r.is('touched'))('ng-pristine', r.is('pristine'))(
										'ng-dirty',
										r.is('dirty')
									)('ng-valid', r.is('valid'))('ng-invalid', r.is('invalid'))('ng-pending', r.is('pending'));
							},
							features: [G],
						})),
						e
					);
				})(),
				wy = (() => {
					class e extends vy {
						constructor(n) {
							super(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(Oe, 10));
						}),
						(e.ɵdir = S({
							type: e,
							selectors: [
								['', 'formGroupName', ''],
								['', 'formArrayName', ''],
								['', 'ngModelGroup', ''],
								['', 'formGroup', ''],
								['form', 3, 'ngNoForm', ''],
								['', 'ngForm', ''],
							],
							hostVars: 16,
							hostBindings: function (n, r) {
								2 & n &&
									wi('ng-untouched', r.is('untouched'))('ng-touched', r.is('touched'))('ng-pristine', r.is('pristine'))(
										'ng-dirty',
										r.is('dirty')
									)('ng-valid', r.is('valid'))('ng-invalid', r.is('invalid'))('ng-pending', r.is('pending'))(
										'ng-submitted',
										r.is('submitted')
									);
							},
							features: [G],
						})),
						e
					);
				})();
			function po(e, t) {
				Tl(e, t),
					t.valueAccessor.writeValue(e.value),
					(function hT(e, t) {
						t.valueAccessor.registerOnChange((n) => {
							(e._pendingValue = n), (e._pendingChange = !0), (e._pendingDirty = !0), 'change' === e.updateOn && by(e, t);
						});
					})(e, t),
					(function gT(e, t) {
						const n = (r, o) => {
							t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
						};
						e.registerOnChange(n),
							t._registerOnDestroy(() => {
								e._unregisterOnChange(n);
							});
					})(e, t),
					(function pT(e, t) {
						t.valueAccessor.registerOnTouched(() => {
							(e._pendingTouched = !0),
								'blur' === e.updateOn && e._pendingChange && by(e, t),
								'submit' !== e.updateOn && e.markAsTouched();
						});
					})(e, t),
					(function fT(e, t) {
						if (t.valueAccessor.setDisabledState) {
							const n = (r) => {
								t.valueAccessor.setDisabledState(r);
							};
							e.registerOnDisabledChange(n),
								t._registerOnDestroy(() => {
									e._unregisterOnDisabledChange(n);
								});
						}
					})(e, t);
			}
			function us(e, t) {
				e.forEach((n) => {
					n.registerOnValidatorChange && n.registerOnValidatorChange(t);
				});
			}
			function Tl(e, t) {
				const n = (function gy(e) {
					return e._rawValidators;
				})(e);
				null !== t.validator ? e.setValidators(py(n, t.validator)) : 'function' == typeof n && e.setValidators([n]);
				const r = (function my(e) {
					return e._rawAsyncValidators;
				})(e);
				null !== t.asyncValidator
					? e.setAsyncValidators(py(r, t.asyncValidator))
					: 'function' == typeof r && e.setAsyncValidators([r]);
				const o = () => e.updateValueAndValidity();
				us(t._rawValidators, o), us(t._rawAsyncValidators, o);
			}
			function by(e, t) {
				e._pendingDirty && e.markAsDirty(),
					e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
					t.viewToModelUpdate(e._pendingValue),
					(e._pendingChange = !1);
			}
			function xl(e, t) {
				const n = e.indexOf(t);
				n > -1 && e.splice(n, 1);
			}
			const go = 'VALID',
				cs = 'INVALID',
				vr = 'PENDING',
				mo = 'DISABLED';
			function Ol(e) {
				return (ds(e) ? e.validators : e) || null;
			}
			function Sy(e) {
				return Array.isArray(e) ? bl(e) : e || null;
			}
			function Rl(e, t) {
				return (ds(t) ? t.asyncValidators : e) || null;
			}
			function Ty(e) {
				return Array.isArray(e) ? Ml(e) : e || null;
			}
			function ds(e) {
				return null != e && !Array.isArray(e) && 'object' == typeof e;
			}
			const Vl = (e) => e instanceof Ll;
			function Fy(e) {
				return ((e) => e instanceof Oy)(e) ? e.value : e.getRawValue();
			}
			function xy(e, t) {
				const n = Vl(e),
					r = e.controls;
				if (!(n ? Object.keys(r) : r).length) throw new B(1e3, '');
				if (!r[t]) throw new B(1001, '');
			}
			function Py(e, t) {
				Vl(e),
					e._forEachChild((r, o) => {
						if (void 0 === t[o]) throw new B(1002, '');
					});
			}
			class kl {
				constructor(t, n) {
					(this._pendingDirty = !1),
						(this._hasOwnPendingAsyncValidator = !1),
						(this._pendingTouched = !1),
						(this._onCollectionChange = () => {}),
						(this._parent = null),
						(this.pristine = !0),
						(this.touched = !1),
						(this._onDisabledChange = []),
						(this._rawValidators = t),
						(this._rawAsyncValidators = n),
						(this._composedValidatorFn = Sy(this._rawValidators)),
						(this._composedAsyncValidatorFn = Ty(this._rawAsyncValidators));
				}
				get validator() {
					return this._composedValidatorFn;
				}
				set validator(t) {
					this._rawValidators = this._composedValidatorFn = t;
				}
				get asyncValidator() {
					return this._composedAsyncValidatorFn;
				}
				set asyncValidator(t) {
					this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
				}
				get parent() {
					return this._parent;
				}
				get valid() {
					return this.status === go;
				}
				get invalid() {
					return this.status === cs;
				}
				get pending() {
					return this.status == vr;
				}
				get disabled() {
					return this.status === mo;
				}
				get enabled() {
					return this.status !== mo;
				}
				get dirty() {
					return !this.pristine;
				}
				get untouched() {
					return !this.touched;
				}
				get updateOn() {
					return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
				}
				setValidators(t) {
					(this._rawValidators = t), (this._composedValidatorFn = Sy(t));
				}
				setAsyncValidators(t) {
					(this._rawAsyncValidators = t), (this._composedAsyncValidatorFn = Ty(t));
				}
				addValidators(t) {
					this.setValidators(yy(t, this._rawValidators));
				}
				addAsyncValidators(t) {
					this.setAsyncValidators(yy(t, this._rawAsyncValidators));
				}
				removeValidators(t) {
					this.setValidators(_y(t, this._rawValidators));
				}
				removeAsyncValidators(t) {
					this.setAsyncValidators(_y(t, this._rawAsyncValidators));
				}
				hasValidator(t) {
					return os(this._rawValidators, t);
				}
				hasAsyncValidator(t) {
					return os(this._rawAsyncValidators, t);
				}
				clearValidators() {
					this.validator = null;
				}
				clearAsyncValidators() {
					this.asyncValidator = null;
				}
				markAsTouched(t = {}) {
					(this.touched = !0), this._parent && !t.onlySelf && this._parent.markAsTouched(t);
				}
				markAllAsTouched() {
					this.markAsTouched({ onlySelf: !0 }), this._forEachChild((t) => t.markAllAsTouched());
				}
				markAsUntouched(t = {}) {
					(this.touched = !1),
						(this._pendingTouched = !1),
						this._forEachChild((n) => {
							n.markAsUntouched({ onlySelf: !0 });
						}),
						this._parent && !t.onlySelf && this._parent._updateTouched(t);
				}
				markAsDirty(t = {}) {
					(this.pristine = !1), this._parent && !t.onlySelf && this._parent.markAsDirty(t);
				}
				markAsPristine(t = {}) {
					(this.pristine = !0),
						(this._pendingDirty = !1),
						this._forEachChild((n) => {
							n.markAsPristine({ onlySelf: !0 });
						}),
						this._parent && !t.onlySelf && this._parent._updatePristine(t);
				}
				markAsPending(t = {}) {
					(this.status = vr),
						!1 !== t.emitEvent && this.statusChanges.emit(this.status),
						this._parent && !t.onlySelf && this._parent.markAsPending(t);
				}
				disable(t = {}) {
					const n = this._parentMarkedDirty(t.onlySelf);
					(this.status = mo),
						(this.errors = null),
						this._forEachChild((r) => {
							r.disable(Object.assign(Object.assign({}, t), { onlySelf: !0 }));
						}),
						this._updateValue(),
						!1 !== t.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)),
						this._updateAncestors(Object.assign(Object.assign({}, t), { skipPristineCheck: n })),
						this._onDisabledChange.forEach((r) => r(!0));
				}
				enable(t = {}) {
					const n = this._parentMarkedDirty(t.onlySelf);
					(this.status = go),
						this._forEachChild((r) => {
							r.enable(Object.assign(Object.assign({}, t), { onlySelf: !0 }));
						}),
						this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
						this._updateAncestors(Object.assign(Object.assign({}, t), { skipPristineCheck: n })),
						this._onDisabledChange.forEach((r) => r(!1));
				}
				_updateAncestors(t) {
					this._parent &&
						!t.onlySelf &&
						(this._parent.updateValueAndValidity(t),
						t.skipPristineCheck || this._parent._updatePristine(),
						this._parent._updateTouched());
				}
				setParent(t) {
					this._parent = t;
				}
				updateValueAndValidity(t = {}) {
					this._setInitialStatus(),
						this._updateValue(),
						this.enabled &&
							(this._cancelExistingSubscription(),
							(this.errors = this._runValidator()),
							(this.status = this._calculateStatus()),
							(this.status === go || this.status === vr) && this._runAsyncValidator(t.emitEvent)),
						!1 !== t.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)),
						this._parent && !t.onlySelf && this._parent.updateValueAndValidity(t);
				}
				_updateTreeValidity(t = { emitEvent: !0 }) {
					this._forEachChild((n) => n._updateTreeValidity(t)),
						this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent });
				}
				_setInitialStatus() {
					this.status = this._allControlsDisabled() ? mo : go;
				}
				_runValidator() {
					return this.validator ? this.validator(this) : null;
				}
				_runAsyncValidator(t) {
					if (this.asyncValidator) {
						(this.status = vr), (this._hasOwnPendingAsyncValidator = !0);
						const n = uy(this.asyncValidator(this));
						this._asyncValidationSubscription = n.subscribe((r) => {
							(this._hasOwnPendingAsyncValidator = !1), this.setErrors(r, { emitEvent: t });
						});
					}
				}
				_cancelExistingSubscription() {
					this._asyncValidationSubscription &&
						(this._asyncValidationSubscription.unsubscribe(), (this._hasOwnPendingAsyncValidator = !1));
				}
				setErrors(t, n = {}) {
					(this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
				}
				get(t) {
					return (function DT(e, t, n) {
						if (null == t || (Array.isArray(t) || (t = t.split(n)), Array.isArray(t) && 0 === t.length)) return null;
						let r = e;
						return (
							t.forEach((o) => {
								r = Vl(r)
									? r.controls.hasOwnProperty(o)
										? r.controls[o]
										: null
									: (((e) => e instanceof CT)(r) && r.at(o)) || null;
							}),
							r
						);
					})(this, t, '.');
				}
				getError(t, n) {
					const r = n ? this.get(n) : this;
					return r && r.errors ? r.errors[t] : null;
				}
				hasError(t, n) {
					return !!this.getError(t, n);
				}
				get root() {
					let t = this;
					for (; t._parent; ) t = t._parent;
					return t;
				}
				_updateControlsErrors(t) {
					(this.status = this._calculateStatus()),
						t && this.statusChanges.emit(this.status),
						this._parent && this._parent._updateControlsErrors(t);
				}
				_initObservables() {
					(this.valueChanges = new _e()), (this.statusChanges = new _e());
				}
				_calculateStatus() {
					return this._allControlsDisabled()
						? mo
						: this.errors
						? cs
						: this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(vr)
						? vr
						: this._anyControlsHaveStatus(cs)
						? cs
						: go;
				}
				_anyControlsHaveStatus(t) {
					return this._anyControls((n) => n.status === t);
				}
				_anyControlsDirty() {
					return this._anyControls((t) => t.dirty);
				}
				_anyControlsTouched() {
					return this._anyControls((t) => t.touched);
				}
				_updatePristine(t = {}) {
					(this.pristine = !this._anyControlsDirty()), this._parent && !t.onlySelf && this._parent._updatePristine(t);
				}
				_updateTouched(t = {}) {
					(this.touched = this._anyControlsTouched()), this._parent && !t.onlySelf && this._parent._updateTouched(t);
				}
				_isBoxedValue(t) {
					return 'object' == typeof t && null !== t && 2 === Object.keys(t).length && 'value' in t && 'disabled' in t;
				}
				_registerOnCollectionChange(t) {
					this._onCollectionChange = t;
				}
				_setUpdateStrategy(t) {
					ds(t) && null != t.updateOn && (this._updateOn = t.updateOn);
				}
				_parentMarkedDirty(t) {
					return !t && !(!this._parent || !this._parent.dirty) && !this._parent._anyControlsDirty();
				}
			}
			class Oy extends kl {
				constructor(t = null, n, r) {
					super(Ol(n), Rl(r, n)),
						(this.defaultValue = null),
						(this._onChange = []),
						(this._pendingChange = !1),
						this._applyFormState(t),
						this._setUpdateStrategy(n),
						this._initObservables(),
						this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }),
						ds(n) && n.initialValueIsDefault && (this.defaultValue = this._isBoxedValue(t) ? t.value : t);
				}
				setValue(t, n = {}) {
					(this.value = this._pendingValue = t),
						this._onChange.length &&
							!1 !== n.emitModelToViewChange &&
							this._onChange.forEach((r) => r(this.value, !1 !== n.emitViewToModelChange)),
						this.updateValueAndValidity(n);
				}
				patchValue(t, n = {}) {
					this.setValue(t, n);
				}
				reset(t = this.defaultValue, n = {}) {
					this._applyFormState(t),
						this.markAsPristine(n),
						this.markAsUntouched(n),
						this.setValue(this.value, n),
						(this._pendingChange = !1);
				}
				_updateValue() {}
				_anyControls(t) {
					return !1;
				}
				_allControlsDisabled() {
					return this.disabled;
				}
				registerOnChange(t) {
					this._onChange.push(t);
				}
				_unregisterOnChange(t) {
					xl(this._onChange, t);
				}
				registerOnDisabledChange(t) {
					this._onDisabledChange.push(t);
				}
				_unregisterOnDisabledChange(t) {
					xl(this._onDisabledChange, t);
				}
				_forEachChild(t) {}
				_syncPendingControls() {
					return !(
						'submit' !== this.updateOn ||
						(this._pendingDirty && this.markAsDirty(), this._pendingTouched && this.markAsTouched(), !this._pendingChange) ||
						(this.setValue(this._pendingValue, { onlySelf: !0, emitModelToViewChange: !1 }), 0)
					);
				}
				_applyFormState(t) {
					this._isBoxedValue(t)
						? ((this.value = this._pendingValue = t.value),
						  t.disabled ? this.disable({ onlySelf: !0, emitEvent: !1 }) : this.enable({ onlySelf: !0, emitEvent: !1 }))
						: (this.value = this._pendingValue = t);
				}
			}
			class Ll extends kl {
				constructor(t, n, r) {
					super(Ol(n), Rl(r, n)),
						(this.controls = t),
						this._initObservables(),
						this._setUpdateStrategy(n),
						this._setUpControls(),
						this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator });
				}
				registerControl(t, n) {
					return this.controls[t]
						? this.controls[t]
						: ((this.controls[t] = n), n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange), n);
				}
				addControl(t, n, r = {}) {
					this.registerControl(t, n), this.updateValueAndValidity({ emitEvent: r.emitEvent }), this._onCollectionChange();
				}
				removeControl(t, n = {}) {
					this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}),
						delete this.controls[t],
						this.updateValueAndValidity({ emitEvent: n.emitEvent }),
						this._onCollectionChange();
				}
				setControl(t, n, r = {}) {
					this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}),
						delete this.controls[t],
						n && this.registerControl(t, n),
						this.updateValueAndValidity({ emitEvent: r.emitEvent }),
						this._onCollectionChange();
				}
				contains(t) {
					return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
				}
				setValue(t, n = {}) {
					Py(this, t),
						Object.keys(t).forEach((r) => {
							xy(this, r), this.controls[r].setValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
						}),
						this.updateValueAndValidity(n);
				}
				patchValue(t, n = {}) {
					null != t &&
						(Object.keys(t).forEach((r) => {
							this.controls[r] && this.controls[r].patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
						}),
						this.updateValueAndValidity(n));
				}
				reset(t = {}, n = {}) {
					this._forEachChild((r, o) => {
						r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
					}),
						this._updatePristine(n),
						this._updateTouched(n),
						this.updateValueAndValidity(n);
				}
				getRawValue() {
					return this._reduceChildren({}, (t, n, r) => ((t[r] = Fy(n)), t));
				}
				_syncPendingControls() {
					let t = this._reduceChildren(!1, (n, r) => !!r._syncPendingControls() || n);
					return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
				}
				_forEachChild(t) {
					Object.keys(this.controls).forEach((n) => {
						const r = this.controls[n];
						r && t(r, n);
					});
				}
				_setUpControls() {
					this._forEachChild((t) => {
						t.setParent(this), t._registerOnCollectionChange(this._onCollectionChange);
					});
				}
				_updateValue() {
					this.value = this._reduceValue();
				}
				_anyControls(t) {
					for (const n of Object.keys(this.controls)) {
						const r = this.controls[n];
						if (this.contains(n) && t(r)) return !0;
					}
					return !1;
				}
				_reduceValue() {
					return this._reduceChildren({}, (t, n, r) => ((n.enabled || this.disabled) && (t[r] = n.value), t));
				}
				_reduceChildren(t, n) {
					let r = t;
					return (
						this._forEachChild((o, i) => {
							r = n(r, o, i);
						}),
						r
					);
				}
				_allControlsDisabled() {
					for (const t of Object.keys(this.controls)) if (this.controls[t].enabled) return !1;
					return Object.keys(this.controls).length > 0 || this.disabled;
				}
			}
			class CT extends kl {
				constructor(t, n, r) {
					super(Ol(n), Rl(r, n)),
						(this.controls = t),
						this._initObservables(),
						this._setUpdateStrategy(n),
						this._setUpControls(),
						this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator });
				}
				at(t) {
					return this.controls[t];
				}
				push(t, n = {}) {
					this.controls.push(t),
						this._registerControl(t),
						this.updateValueAndValidity({ emitEvent: n.emitEvent }),
						this._onCollectionChange();
				}
				insert(t, n, r = {}) {
					this.controls.splice(t, 0, n), this._registerControl(n), this.updateValueAndValidity({ emitEvent: r.emitEvent });
				}
				removeAt(t, n = {}) {
					this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}),
						this.controls.splice(t, 1),
						this.updateValueAndValidity({ emitEvent: n.emitEvent });
				}
				setControl(t, n, r = {}) {
					this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}),
						this.controls.splice(t, 1),
						n && (this.controls.splice(t, 0, n), this._registerControl(n)),
						this.updateValueAndValidity({ emitEvent: r.emitEvent }),
						this._onCollectionChange();
				}
				get length() {
					return this.controls.length;
				}
				setValue(t, n = {}) {
					Py(this, t),
						t.forEach((r, o) => {
							xy(this, o), this.at(o).setValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
						}),
						this.updateValueAndValidity(n);
				}
				patchValue(t, n = {}) {
					null != t &&
						(t.forEach((r, o) => {
							this.at(o) && this.at(o).patchValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
						}),
						this.updateValueAndValidity(n));
				}
				reset(t = [], n = {}) {
					this._forEachChild((r, o) => {
						r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
					}),
						this._updatePristine(n),
						this._updateTouched(n),
						this.updateValueAndValidity(n);
				}
				getRawValue() {
					return this.controls.map((t) => Fy(t));
				}
				clear(t = {}) {
					this.controls.length < 1 ||
						(this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
						this.controls.splice(0),
						this.updateValueAndValidity({ emitEvent: t.emitEvent }));
				}
				_syncPendingControls() {
					let t = this.controls.reduce((n, r) => !!r._syncPendingControls() || n, !1);
					return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
				}
				_forEachChild(t) {
					this.controls.forEach((n, r) => {
						t(n, r);
					});
				}
				_updateValue() {
					this.value = this.controls.filter((t) => t.enabled || this.disabled).map((t) => t.value);
				}
				_anyControls(t) {
					return this.controls.some((n) => n.enabled && t(n));
				}
				_setUpControls() {
					this._forEachChild((t) => this._registerControl(t));
				}
				_allControlsDisabled() {
					for (const t of this.controls) if (t.enabled) return !1;
					return this.controls.length > 0 || this.disabled;
				}
				_registerControl(t) {
					t.setParent(this), t._registerOnCollectionChange(this._onCollectionChange);
				}
			}
			const wT = { provide: Oe, useExisting: Q(() => fs) },
				yo = (() => Promise.resolve(null))();
			let fs = (() => {
				class e extends Oe {
					constructor(n, r) {
						super(),
							(this.submitted = !1),
							(this._directives = new Set()),
							(this.ngSubmit = new _e()),
							(this.form = new Ll({}, bl(n), Ml(r)));
					}
					ngAfterViewInit() {
						this._setUpdateStrategy();
					}
					get formDirective() {
						return this;
					}
					get control() {
						return this.form;
					}
					get path() {
						return [];
					}
					get controls() {
						return this.form.controls;
					}
					addControl(n) {
						yo.then(() => {
							const r = this._findContainer(n.path);
							(n.control = r.registerControl(n.name, n.control)),
								po(n.control, n),
								n.control.updateValueAndValidity({ emitEvent: !1 }),
								this._directives.add(n);
						});
					}
					getControl(n) {
						return this.form.get(n.path);
					}
					removeControl(n) {
						yo.then(() => {
							const r = this._findContainer(n.path);
							r && r.removeControl(n.name), this._directives.delete(n);
						});
					}
					addFormGroup(n) {
						yo.then(() => {
							const r = this._findContainer(n.path),
								o = new Ll({});
							(function My(e, t) {
								Tl(e, t);
							})(o, n),
								r.registerControl(n.name, o),
								o.updateValueAndValidity({ emitEvent: !1 });
						});
					}
					removeFormGroup(n) {
						yo.then(() => {
							const r = this._findContainer(n.path);
							r && r.removeControl(n.name);
						});
					}
					getFormGroup(n) {
						return this.form.get(n.path);
					}
					updateModel(n, r) {
						yo.then(() => {
							this.form.get(n.path).setValue(r);
						});
					}
					setValue(n) {
						this.control.setValue(n);
					}
					onSubmit(n) {
						return (
							(this.submitted = !0),
							(function Ay(e, t) {
								e._syncPendingControls(),
									t.forEach((n) => {
										const r = n.control;
										'submit' === r.updateOn &&
											r._pendingChange &&
											(n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
									});
							})(this.form, this._directives),
							this.ngSubmit.emit(n),
							!1
						);
					}
					onReset() {
						this.resetForm();
					}
					resetForm(n) {
						this.form.reset(n), (this.submitted = !1);
					}
					_setUpdateStrategy() {
						this.options && null != this.options.updateOn && (this.form._updateOn = this.options.updateOn);
					}
					_findContainer(n) {
						return n.pop(), n.length ? this.form.get(n) : this.form;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(v(Ae, 10), v(an, 10));
					}),
					(e.ɵdir = S({
						type: e,
						selectors: [['form', 3, 'ngNoForm', '', 3, 'formGroup', ''], ['ng-form'], ['', 'ngForm', '']],
						hostBindings: function (n, r) {
							1 & n &&
								me('submit', function (i) {
									return r.onSubmit(i);
								})('reset', function () {
									return r.onReset();
								});
						},
						inputs: { options: ['ngFormOptions', 'options'] },
						outputs: { ngSubmit: 'ngSubmit' },
						exportAs: ['ngForm'],
						features: [ee([wT]), G],
					})),
					e
				);
			})();
			const bT = { provide: un, useExisting: Q(() => Bl) },
				ky = (() => Promise.resolve(null))();
			let Bl = (() => {
					class e extends un {
						constructor(n, r, o, i, s) {
							super(),
								(this._changeDetectorRef = s),
								(this.control = new Oy()),
								(this._registered = !1),
								(this.update = new _e()),
								(this._parent = n),
								this._setValidators(r),
								this._setAsyncValidators(o),
								(this.valueAccessor = (function Fl(e, t) {
									if (!t) return null;
									let n, r, o;
									return (
										Array.isArray(t),
										t.forEach((i) => {
											i.constructor === ns
												? (n = i)
												: (function _T(e) {
														return Object.getPrototypeOf(e.constructor) === An;
												  })(i)
												? (r = i)
												: (o = i);
										}),
										o || r || n || null
									);
								})(0, i));
						}
						ngOnChanges(n) {
							if ((this._checkForErrors(), !this._registered || 'name' in n)) {
								if (this._registered && (this._checkName(), this.formDirective)) {
									const r = n.name.previousValue;
									this.formDirective.removeControl({ name: r, path: this._getPath(r) });
								}
								this._setUpControl();
							}
							'isDisabled' in n && this._updateDisabled(n),
								(function Nl(e, t) {
									if (!e.hasOwnProperty('model')) return !1;
									const n = e.model;
									return !!n.isFirstChange() || !Object.is(t, n.currentValue);
								})(n, this.viewModel) && (this._updateValue(this.model), (this.viewModel = this.model));
						}
						ngOnDestroy() {
							this.formDirective && this.formDirective.removeControl(this);
						}
						get path() {
							return this._getPath(this.name);
						}
						get formDirective() {
							return this._parent ? this._parent.formDirective : null;
						}
						viewToModelUpdate(n) {
							(this.viewModel = n), this.update.emit(n);
						}
						_setUpControl() {
							this._setUpdateStrategy(),
								this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this),
								(this._registered = !0);
						}
						_setUpdateStrategy() {
							this.options && null != this.options.updateOn && (this.control._updateOn = this.options.updateOn);
						}
						_isStandalone() {
							return !this._parent || !(!this.options || !this.options.standalone);
						}
						_setUpStandalone() {
							po(this.control, this), this.control.updateValueAndValidity({ emitEvent: !1 });
						}
						_checkForErrors() {
							this._isStandalone() || this._checkParentType(), this._checkName();
						}
						_checkParentType() {}
						_checkName() {
							this.options && this.options.name && (this.name = this.options.name), this._isStandalone();
						}
						_updateValue(n) {
							ky.then(() => {
								var r;
								this.control.setValue(n, { emitViewToModelChange: !1 }),
									null === (r = this._changeDetectorRef) || void 0 === r || r.markForCheck();
							});
						}
						_updateDisabled(n) {
							const r = n.isDisabled.currentValue,
								o = '' === r || (r && 'false' !== r);
							ky.then(() => {
								var i;
								o && !this.control.disabled ? this.control.disable() : !o && this.control.disabled && this.control.enable(),
									null === (i = this._changeDetectorRef) || void 0 === i || i.markForCheck();
							});
						}
						_getPath(n) {
							return this._parent
								? (function ss(e, t) {
										return [...t.path, e];
								  })(n, this._parent)
								: [n];
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(Oe, 9), v(Ae, 10), v(an, 10), v(Ot, 10), v(Kg, 8));
						}),
						(e.ɵdir = S({
							type: e,
							selectors: [['', 'ngModel', '', 3, 'formControlName', '', 3, 'formControl', '']],
							inputs: {
								name: 'name',
								isDisabled: ['disabled', 'isDisabled'],
								model: ['ngModel', 'model'],
								options: ['ngModelOptions', 'options'],
							},
							outputs: { update: 'ngModelChange' },
							exportAs: ['ngModel'],
							features: [ee([bT]), G, Lt],
						})),
						e
					);
				})(),
				Ly = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵdir = S({
							type: e,
							selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']],
							hostAttrs: ['novalidate', ''],
						})),
						e
					);
				})(),
				Hy = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = Ct({ type: e })),
						(e.ɵinj = ot({})),
						e
					);
				})(),
				ZT = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = Ct({ type: e })),
						(e.ɵinj = ot({ imports: [[Hy]] })),
						e
					);
				})(),
				JT = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = Ct({ type: e })),
						(e.ɵinj = ot({ imports: [ZT] })),
						e
					);
				})();
			const ql = { headers: new Pt({ 'Content-Type': 'application/json' }) };
			let Wl = (() => {
				class e {
					constructor(n) {
						(this.http = n), (this.apiUrl = 'https://le-monde-flux-rss.herokuapp.com/api/v1/news');
					}
					getNewsPerPage(n) {
						return this.http.post(this.apiUrl, { page: n }, ql);
					}
					getNews() {
						return this.http.post(this.apiUrl, { getAll: !0 }, ql);
					}
					updateItem(n) {
						const r = `${this.apiUrl}/${n._id}`;
						return console.log(n), this.http.put(r, { title: n.title, description: n.description }, ql);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(zm));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac, providedIn: 'root' })),
					e
				);
			})();
			function KT(e, t) {
				if (1 & e) {
					const n = hu();
					te(0, 'button', 4),
						me('click', function () {
							const i = Us(n).$implicit;
							return Ci().onClick(i);
						}),
						Qe(1),
						ne();
				}
				if (2 & e) {
					const n = t.$implicit;
					ke(1), hr(' ', n, ' ');
				}
			}
			let o_ = (() => {
					class e {
						constructor(n) {
							(this.newsService = n), (this.numPage = new _e()), (this.onGetAll = new _e());
						}
						ngOnInit() {}
						onClick(n) {
							console.log(n), this.numPage.emit(n);
						}
						onClickGetAll() {
							this.onGetAll.emit();
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(Wl));
						}),
						(e.ɵcmp = kt({
							type: e,
							selectors: [['app-pagination']],
							inputs: { page: 'page' },
							outputs: { numPage: 'numPage', onGetAll: 'onGetAll' },
							decls: 8,
							vars: 1,
							consts: [
								[1, 'pagination-container'],
								[1, 'pagination'],
								['class', 'pagination-item', 3, 'click', 4, 'ngFor', 'ngForOf'],
								[1, 'getAll', 3, 'click'],
								[1, 'pagination-item', 3, 'click'],
							],
							template: function (n, r) {
								1 & n &&
									(te(0, 'div', 0)(1, 'div', 1)(2, 'h3'),
									Qe(3, 'Pagination'),
									ne(),
									_i(4),
									mi(5, KT, 2, 1, 'button', 2),
									Di(),
									te(6, 'button', 3),
									me('click', function () {
										return r.onClickGetAll();
									}),
									Qe(7, 'Voir Tout'),
									ne()()()),
									2 & n && (ke(5), Tt('ngForOf', r.page));
							},
							directives: [sl],
							styles: [
								'.pagination-container[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;height:100vh;width:10vw;background-color:#cbcbf1;padding:1rem}.pagination[_ngcontent-%COMP%]{display:flex;align-items:center;flex-direction:column;gap:1rem}h3[_ngcontent-%COMP%]{color:#fff;font-weight:400;margin-bottom:1rem}button[_ngcontent-%COMP%]{border:none;cursor:pointer}.pagination-item[_ngcontent-%COMP%]{background-color:#fff;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:1rem}.getAll[_ngcontent-%COMP%]{margin-top:1rem;padding:.5rem}',
							],
						})),
						e
					);
				})(),
				YT = (() => {
					class e {
						constructor() {
							this.title = 'Le Monde Flux Rss';
						}
						ngOnInit() {}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵcmp = kt({
							type: e,
							selectors: [['app-header']],
							decls: 3,
							vars: 1,
							template: function (n, r) {
								1 & n && (te(0, 'header')(1, 'h1'), Qe(2), ne()()), 2 & n && (ke(2), bi(r.title));
							},
							styles: ['h1[_ngcontent-%COMP%]{text-align:center;margin-bottom:5rem}'],
						})),
						e
					);
				})(),
				XT = (() => {
					class e {
						constructor() {
							this.onSubmitItem = new _e();
						}
						ngOnInit() {}
						onSubmit(n) {
							this.title && this.description
								? ((this.item.title = this.title),
								  (this.item.description = this.description),
								  this.onSubmitItem.emit(n),
								  (this.title = ' '),
								  (this.description = ' '))
								: alert('Please enter a title');
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵcmp = kt({
							type: e,
							selectors: [['app-edit-news']],
							inputs: { item: 'item' },
							outputs: { onSubmitItem: 'onSubmitItem' },
							decls: 10,
							vars: 2,
							consts: [
								[3, 'ngSubmit'],
								[1, 'form-control'],
								['for', 'title'],
								['type', 'text', 'name', 'title', 'id', 'title', 'placeholder', 'title', 3, 'ngModel', 'ngModelChange'],
								['for', 'description'],
								['name', 'description', 'id', '', 'rows', '5', 3, 'ngModel', 'ngModelChange'],
								['type', 'submit', 'value', 'Save', 1, 'submit'],
							],
							template: function (n, r) {
								1 & n &&
									(te(0, 'form', 0),
									me('ngSubmit', function () {
										return r.onSubmit(r.item);
									}),
									te(1, 'div', 1)(2, 'label', 2),
									Qe(3, 'Title'),
									ne(),
									te(4, 'input', 3),
									me('ngModelChange', function (i) {
										return (r.title = i);
									}),
									ne()(),
									te(5, 'div', 1)(6, 'label', 4),
									Qe(7, 'Description'),
									ne(),
									te(8, 'textarea', 5),
									me('ngModelChange', function (i) {
										return (r.description = i);
									}),
									ne()(),
									dr(9, 'input', 6),
									ne()),
									2 & n && (ke(4), Tt('ngModel', r.title), ke(4), Tt('ngModel', r.description));
							},
							directives: [Ly, wy, fs, ns, Cy, Bl],
							styles: [
								'form[_ngcontent-%COMP%]{margin-top:1rem}.form-control[_ngcontent-%COMP%]{margin:1rem 0}.form-control[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;margin:.5rem}.form-control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .form-control[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], .submit[_ngcontent-%COMP%]{display:block;width:90%;margin:0 auto;padding:.375rem .75rem;font-size:16px;border-radius:5px;border-color:#333}.submit[_ngcontent-%COMP%]{background-color:#000;color:#fff;padding:.75rem 1.25rem;font-size:1.2rem;margin-top:.5rem;margin-bottom:.5rem;cursor:pointer}',
							],
						})),
						e
					);
				})();
			function eN(e, t) {
				if (1 & e) {
					const n = hu();
					te(0, 'app-edit-news', 6),
						me('onSubmitItem', function () {
							Us(n);
							const o = Ci();
							return o.onEdit(o.item);
						}),
						ne();
				}
				2 & e && Tt('item', Ci().item);
			}
			let tN = (() => {
				class e {
					constructor(n) {
						(this.newsService = n), (this.showForm = !1);
					}
					ngOnInit() {}
					onClick() {
						this.showForm = !this.showForm;
					}
					onEdit(n) {
						(this.showForm = !1), this.newsService.updateItem(n).subscribe();
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(v(Wl));
					}),
					(e.ɵcmp = kt({
						type: e,
						selectors: [['app-news-item']],
						inputs: { item: 'item' },
						decls: 16,
						vars: 7,
						consts: [
							[1, 'item'],
							[3, 'src', 'alt'],
							[1, 'info'],
							['target', '_blank', 3, 'href'],
							[1, 'edit', 3, 'click'],
							['class', 'form', 3, 'item', 'onSubmitItem', 4, 'ngIf'],
							[1, 'form', 3, 'item', 'onSubmitItem'],
						],
						template: function (n, r) {
							1 & n &&
								(te(0, 'div', 0),
								dr(1, 'img', 1),
								te(2, 'div', 2)(3, 'h3')(4, 'a', 3),
								Qe(5),
								ne(),
								te(6, 'span'),
								Qe(7, '\u2192 '),
								ne()(),
								te(8, 'p'),
								Qe(9),
								ne(),
								te(10, 'footer')(11, 'p'),
								Qe(12),
								ne(),
								te(13, 'button', 4),
								me('click', function () {
									return r.onClick();
								}),
								Qe(14, 'edit'),
								ne()()(),
								mi(15, eN, 1, 1, 'app-edit-news', 5),
								ne()),
								2 & n &&
									(ke(1),
									Jr('src', r.item.image, oi),
									Jr('alt', r.item.title),
									ke(3),
									Jr('href', r.item.link, oi),
									ke(1),
									hr('', r.item.title, ' '),
									ke(4),
									hr(' ', r.item.description, ' '),
									ke(3),
									bi(r.item.published),
									ke(3),
									Tt('ngIf', r.showForm));
						},
						directives: [_m, XT],
						styles: [
							'.item[_ngcontent-%COMP%]{width:600px;display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:480px;border:1px solid blue;border-radius:5px}.item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%;width:100%;object-fit:cover;border-top-left-radius:5px;border-bottom-left-radius:5px}.item[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]{padding:1rem;color:#333;display:flex;flex-direction:column;justify-content:space-between}.info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:1rem;cursor:pointer}p[_ngcontent-%COMP%]{margin-bottom:.75rem}.info[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none}.info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{margin-left:.5rem;font-size:1.8rem}footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-style:italic;font-size:14px;margin-bottom:1.5rem}.edit[_ngcontent-%COMP%]{display:block;width:100%;border:none;padding:.375rem .75rem;border-radius:5px;font-size:1rem;text-transform:capitalize;color:#fff;background-color:green;cursor:pointer}.form[_ngcontent-%COMP%]{grid-column:1/-1}',
						],
					})),
					e
				);
			})();
			function nN(e, t) {
				1 & e && dr(0, 'app-news-item', 3), 2 & e && Tt('item', t.$implicit);
			}
			let rN = (() => {
					class e {
						constructor(n) {
							(this.newsService = n), (this.page = []), (this.news = []);
						}
						ngOnInit() {
							this.newsService.getNewsPerPage(1).subscribe((n) => {
								let r = Math.ceil(n.pagination.count / n.pagination.limit);
								for (let o = 1; o < r; o++) this.page.push(o);
								this.news = n.data;
							});
						}
						onGetNewsPerPage(n) {
							this.newsService.getNewsPerPage(n).subscribe((r) => {
								this.news = r.data;
							});
						}
						getAll() {
							this.newsService.getNews().subscribe((n) => {
								this.news = n.data;
							});
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(Wl));
						}),
						(e.ɵcmp = kt({
							type: e,
							selectors: [['app-news-list']],
							decls: 3,
							vars: 2,
							consts: [
								[1, 'list'],
								[3, 'item', 4, 'ngFor', 'ngForOf'],
								[3, 'page', 'numPage', 'onGetAll'],
								[3, 'item'],
							],
							template: function (n, r) {
								1 & n &&
									(te(0, 'div', 0),
									mi(1, nN, 1, 1, 'app-news-item', 1),
									ne(),
									te(2, 'app-pagination', 2),
									me('numPage', function (i) {
										return r.onGetNewsPerPage(i);
									})('onGetAll', function () {
										return r.getAll();
									}),
									ne()),
									2 & n && (ke(1), Tt('ngForOf', r.news), ke(1), Tt('page', r.page));
							},
							directives: [sl, tN, o_],
							styles: [
								'.list[_ngcontent-%COMP%]{display:grid;justify-content:center;align-content:center;grid-template-columns:repeat(auto-fit,600px);grid-gap:3rem;gap:3rem}',
							],
						})),
						e
					);
				})(),
				oN = (() => {
					class e {
						constructor() {}
						ngOnInit() {}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵcmp = kt({
							type: e,
							selectors: [['app-footer']],
							decls: 2,
							vars: 0,
							template: function (n, r) {
								1 & n && (te(0, 'p'), Qe(1, 'footer works!'), ne());
							},
							styles: [''],
						})),
						e
					);
				})(),
				iN = (() => {
					class e {
						constructor() {
							this.title = 'fluxRss-front';
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵcmp = kt({
							type: e,
							selectors: [['app-root']],
							decls: 5,
							vars: 0,
							consts: [[1, 'container']],
							template: function (n, r) {
								1 & n && (te(0, 'div', 0), dr(1, 'app-pagination')(2, 'app-header')(3, 'app-news-list')(4, 'app-footer'), ne());
							},
							directives: [o_, YT, rN, oN],
							styles: [''],
						})),
						e
					);
				})(),
				sN = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = Ct({ type: e, bootstrap: [iN] })),
						(e.ɵinj = ot({ providers: [], imports: [[gS, $S, JT]] })),
						e
					);
				})();
			(function iI() {
				Qg = !1;
			})(),
				hS()
					.bootstrapModule(sN)
					.catch((e) => console.error(e));
		},
	},
	(Y) => {
		Y((Y.s = 919));
	},
]);
