'use strict';
(self.webpackChunkfluxRss_front = self.webpackChunkfluxRss_front || []).push([
	[179],
	{
		919: () => {
			function ee(e) {
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
			function vr(e, t) {
				if (e) {
					const n = e.indexOf(t);
					0 <= n && e.splice(n, 1);
				}
			}
			class vt {
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
						if (ee(r))
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
									oc(i);
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
						if (this.closed) oc(t);
						else {
							if (t instanceof vt) {
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
					n === t ? (this._parentage = null) : Array.isArray(n) && vr(n, t);
				}
				remove(t) {
					const { _finalizers: n } = this;
					n && vr(n, t), t instanceof vt && t._removeParent(this);
				}
			}
			vt.EMPTY = (() => {
				const e = new vt();
				return (e.closed = !0), e;
			})();
			const nc = vt.EMPTY;
			function rc(e) {
				return e instanceof vt || (e && 'closed' in e && ee(e.remove) && ee(e.add) && ee(e.unsubscribe));
			}
			function oc(e) {
				ee(e) ? e() : e.unsubscribe();
			}
			const cn = {
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
			function ic(e) {
				vo.setTimeout(() => {
					const { onUnhandledError: t } = cn;
					if (!t) throw e;
					t(e);
				});
			}
			function sc() {}
			const u_ = ds('C', void 0, void 0);
			function ds(e, t, n) {
				return { kind: e, value: t, error: n };
			}
			let dn = null;
			function Co(e) {
				if (cn.useDeprecatedSynchronousErrorHandling) {
					const t = !dn;
					if ((t && (dn = { errorThrown: !1, error: null }), e(), t)) {
						const { errorThrown: n, error: r } = dn;
						if (((dn = null), n)) throw r;
					}
				} else e();
			}
			class fs extends vt {
				constructor(t) {
					super(), (this.isStopped = !1), t ? ((this.destination = t), rc(t) && t.add(this)) : (this.destination = g_);
				}
				static create(t, n, r) {
					return new wo(t, n, r);
				}
				next(t) {
					this.isStopped
						? ps(
								(function c_(e) {
									return ds('N', e, void 0);
								})(t),
								this
						  )
						: this._next(t);
				}
				error(t) {
					this.isStopped
						? ps(
								(function l_(e) {
									return ds('E', void 0, e);
								})(t),
								this
						  )
						: ((this.isStopped = !0), this._error(t));
				}
				complete() {
					this.isStopped ? ps(u_, this) : ((this.isStopped = !0), this._complete());
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
			const f_ = Function.prototype.bind;
			function hs(e, t) {
				return f_.call(e, t);
			}
			class h_ {
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
			class wo extends fs {
				constructor(t, n, r) {
					let o;
					if ((super(), ee(t) || !t))
						o = { next: null != t ? t : void 0, error: null != n ? n : void 0, complete: null != r ? r : void 0 };
					else {
						let i;
						this && cn.useDeprecatedNextContext
							? ((i = Object.create(t)),
							  (i.unsubscribe = () => this.unsubscribe()),
							  (o = {
									next: t.next && hs(t.next, i),
									error: t.error && hs(t.error, i),
									complete: t.complete && hs(t.complete, i),
							  }))
							: (o = t);
					}
					this.destination = new h_(o);
				}
			}
			function Eo(e) {
				cn.useDeprecatedSynchronousErrorHandling
					? (function d_(e) {
							cn.useDeprecatedSynchronousErrorHandling && dn && ((dn.errorThrown = !0), (dn.error = e));
					  })(e)
					: ic(e);
			}
			function ps(e, t) {
				const { onStoppedNotification: n } = cn;
				n && vo.setTimeout(() => n(e, t));
			}
			const g_ = {
					closed: !0,
					next: sc,
					error: function p_(e) {
						throw e;
					},
					complete: sc,
				},
				gs = ('function' == typeof Symbol && Symbol.observable) || '@@observable';
			function ac(e) {
				return e;
			}
			let we = (() => {
				class e {
					constructor(n) {
						n && (this._subscribe = n);
					}
					lift(n) {
						const r = new e();
						return (r.source = this), (r.operator = n), r;
					}
					subscribe(n, r, o) {
						const i = (function y_(e) {
							return (
								(e && e instanceof fs) ||
								((function m_(e) {
									return e && ee(e.next) && ee(e.error) && ee(e.complete);
								})(e) &&
									rc(e))
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
						return new (r = lc(r))((o, i) => {
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
					[gs]() {
						return this;
					}
					pipe(...n) {
						return (function uc(e) {
							return 0 === e.length
								? ac
								: 1 === e.length
								? e[0]
								: function (n) {
										return e.reduce((r, o) => o(r), n);
								  };
						})(n)(this);
					}
					toPromise(n) {
						return new (n = lc(n))((r, o) => {
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
			function lc(e) {
				var t;
				return null !== (t = null != e ? e : cn.Promise) && void 0 !== t ? t : Promise;
			}
			const __ = _o(
				(e) =>
					function () {
						e(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed');
					}
			);
			let ms = (() => {
				class e extends we {
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
						const r = new cc(this, this);
						return (r.operator = n), r;
					}
					_throwIfClosed() {
						if (this.closed) throw new __();
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
							? nc
							: ((this.currentObservers = null),
							  i.push(n),
							  new vt(() => {
									(this.currentObservers = null), vr(i, n);
							  }));
					}
					_checkFinalizedStatuses(n) {
						const { hasError: r, thrownError: o, isStopped: i } = this;
						r ? n.error(o) : i && n.complete();
					}
					asObservable() {
						const n = new we();
						return (n.source = this), n;
					}
				}
				return (e.create = (t, n) => new cc(t, n)), e;
			})();
			class cc extends ms {
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
					return null !== (r = null === (n = this.source) || void 0 === n ? void 0 : n.subscribe(t)) && void 0 !== r ? r : nc;
				}
			}
			function fn(e) {
				return (t) => {
					if (
						(function D_(e) {
							return ee(null == e ? void 0 : e.lift);
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
			function hn(e, t, n, r, o) {
				return new v_(e, t, n, r, o);
			}
			class v_ extends fs {
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
			function pn(e, t) {
				return fn((n, r) => {
					let o = 0;
					n.subscribe(
						hn(r, (i) => {
							r.next(e.call(t, i, o++));
						})
					);
				});
			}
			function gn(e) {
				return this instanceof gn ? ((this.v = e), this) : new gn(e);
			}
			function E_(e, t, n) {
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
							f.value instanceof gn ? Promise.resolve(f.value.v).then(l, c) : d(i[0][2], f);
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
			function b_(e) {
				if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
				var n,
					t = e[Symbol.asyncIterator];
				return t
					? t.call(e)
					: ((e = (function hc(e) {
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
			const pc = (e) => e && 'number' == typeof e.length && 'function' != typeof e;
			function gc(e) {
				return ee(null == e ? void 0 : e.then);
			}
			function mc(e) {
				return ee(e[gs]);
			}
			function yc(e) {
				return Symbol.asyncIterator && ee(null == e ? void 0 : e[Symbol.asyncIterator]);
			}
			function _c(e) {
				return new TypeError(
					`You provided ${
						null !== e && 'object' == typeof e ? 'an invalid object' : `'${e}'`
					} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
				);
			}
			const Dc = (function I_() {
				return 'function' == typeof Symbol && Symbol.iterator ? Symbol.iterator : '@@iterator';
			})();
			function vc(e) {
				return ee(null == e ? void 0 : e[Dc]);
			}
			function Cc(e) {
				return E_(this, arguments, function* () {
					const n = e.getReader();
					try {
						for (;;) {
							const { value: r, done: o } = yield gn(n.read());
							if (o) return yield gn(void 0);
							yield yield gn(r);
						}
					} finally {
						n.releaseLock();
					}
				});
			}
			function wc(e) {
				return ee(null == e ? void 0 : e.getReader);
			}
			function mn(e) {
				if (e instanceof we) return e;
				if (null != e) {
					if (mc(e))
						return (function A_(e) {
							return new we((t) => {
								const n = e[gs]();
								if (ee(n.subscribe)) return n.subscribe(t);
								throw new TypeError('Provided object does not correctly implement Symbol.observable');
							});
						})(e);
					if (pc(e))
						return (function S_(e) {
							return new we((t) => {
								for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
								t.complete();
							});
						})(e);
					if (gc(e))
						return (function T_(e) {
							return new we((t) => {
								e.then(
									(n) => {
										t.closed || (t.next(n), t.complete());
									},
									(n) => t.error(n)
								).then(null, ic);
							});
						})(e);
					if (yc(e)) return Ec(e);
					if (vc(e))
						return (function N_(e) {
							return new we((t) => {
								for (const n of e) if ((t.next(n), t.closed)) return;
								t.complete();
							});
						})(e);
					if (wc(e))
						return (function F_(e) {
							return Ec(Cc(e));
						})(e);
				}
				throw _c(e);
			}
			function Ec(e) {
				return new we((t) => {
					(function x_(e, t) {
						var n, r, o, i;
						return (function C_(e, t, n, r) {
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
								for (n = b_(e); !(r = yield n.next()).done; ) if ((t.next(r.value), t.closed)) return;
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
			function Wt(e, t, n, r = 0, o = !1) {
				const i = t.schedule(function () {
					n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
				}, r);
				if ((e.add(i), !o)) return i;
			}
			function bo(e, t, n = 1 / 0) {
				return ee(t)
					? bo((r, o) => pn((i, s) => t(r, i, o, s))(mn(e(r, o))), n)
					: ('number' == typeof t && (n = t),
					  fn((r, o) =>
							(function P_(e, t, n, r, o, i, s, a) {
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
										mn(n(m, c++)).subscribe(
											hn(
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
																s ? Wt(t, s, () => p(_)) : p(_);
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
										hn(t, h, () => {
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
			const _s = new we((e) => e.complete());
			function Ds(e) {
				return e[e.length - 1];
			}
			function bc(e) {
				return (function V_(e) {
					return e && ee(e.schedule);
				})(Ds(e))
					? e.pop()
					: void 0;
			}
			function Mc(e, t = 0) {
				return fn((n, r) => {
					n.subscribe(
						hn(
							r,
							(o) => Wt(r, e, () => r.next(o), t),
							() => Wt(r, e, () => r.complete(), t),
							(o) => Wt(r, e, () => r.error(o), t)
						)
					);
				});
			}
			function Ic(e, t = 0) {
				return fn((n, r) => {
					r.add(e.schedule(() => n.subscribe(r), t));
				});
			}
			function Ac(e, t) {
				if (!e) throw new Error('Iterable cannot be null');
				return new we((n) => {
					Wt(n, t, () => {
						const r = e[Symbol.asyncIterator]();
						Wt(
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
					? (function G_(e, t) {
							if (null != e) {
								if (mc(e))
									return (function B_(e, t) {
										return mn(e).pipe(Ic(t), Mc(t));
									})(e, t);
								if (pc(e))
									return (function j_(e, t) {
										return new we((n) => {
											let r = 0;
											return t.schedule(function () {
												r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
											});
										});
									})(e, t);
								if (gc(e))
									return (function H_(e, t) {
										return mn(e).pipe(Ic(t), Mc(t));
									})(e, t);
								if (yc(e)) return Ac(e, t);
								if (vc(e))
									return (function $_(e, t) {
										return new we((n) => {
											let r;
											return (
												Wt(n, t, () => {
													(r = e[Dc]()),
														Wt(
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
												() => ee(null == r ? void 0 : r.return) && r.return()
											);
										});
									})(e, t);
								if (wc(e))
									return (function U_(e, t) {
										return Ac(Cc(e), t);
									})(e, t);
							}
							throw _c(e);
					  })(e, t)
					: mn(e);
			}
			function vs(e, t, ...n) {
				return !0 === t
					? (e(), null)
					: !1 === t
					? null
					: t(...n)
							.pipe(
								(function q_(e) {
									return e <= 0
										? () => _s
										: fn((t, n) => {
												let r = 0;
												t.subscribe(
													hn(n, (o) => {
														++r <= e && (n.next(o), e <= r && n.complete());
													})
												);
										  });
								})(1)
							)
							.subscribe(() => e());
			}
			function Q(e) {
				for (let t in e) if (e[t] === Q) return t;
				throw Error('Could not find renamed property on target object.');
			}
			function Cs(e, t) {
				for (const n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
			}
			function G(e) {
				if ('string' == typeof e) return e;
				if (Array.isArray(e)) return '[' + e.map(G).join(', ') + ']';
				if (null == e) return '' + e;
				if (e.overriddenName) return `${e.overriddenName}`;
				if (e.name) return `${e.name}`;
				const t = e.toString();
				if (null == t) return '' + t;
				const n = t.indexOf('\n');
				return -1 === n ? t : t.substring(0, n);
			}
			function ws(e, t) {
				return null == e || '' === e ? (null === t ? '' : t) : null == t || '' === t ? e : e + ' ' + t;
			}
			const Q_ = Q({ __forward_ref__: Q });
			function J(e) {
				return (
					(e.__forward_ref__ = J),
					(e.toString = function () {
						return G(this());
					}),
					e
				);
			}
			function x(e) {
				return Sc(e) ? e() : e;
			}
			function Sc(e) {
				return 'function' == typeof e && e.hasOwnProperty(Q_) && e.__forward_ref__ === J;
			}
			class B extends Error {
				constructor(t, n) {
					super(
						(function Es(e, t) {
							return `NG0${Math.abs(e)}${t ? ': ' + t : ''}`;
						})(t, n)
					),
						(this.code = t);
				}
			}
			function A(e) {
				return 'string' == typeof e ? e : null == e ? '' : String(e);
			}
			function Te(e) {
				return 'function' == typeof e
					? e.name || e.toString()
					: 'object' == typeof e && null != e && 'function' == typeof e.type
					? e.type.name || e.type.toString()
					: A(e);
			}
			function Io(e, t) {
				const n = t ? ` in ${t}` : '';
				throw new B(-201, `No provider for ${Te(e)} found${n}`);
			}
			function $e(e, t) {
				null == e &&
					(function X(e, t, n, r) {
						throw new Error(`ASSERTION ERROR: ${e}` + (null == r ? '' : ` [Expected=> ${n} ${r} ${t} <=Actual]`));
					})(t, e, null, '!=');
			}
			function $(e) {
				return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
			}
			function ot(e) {
				return { providers: e.providers || [], imports: e.imports || [] };
			}
			function bs(e) {
				return Tc(e, Ao) || Tc(e, Fc);
			}
			function Tc(e, t) {
				return e.hasOwnProperty(t) ? e[t] : null;
			}
			function Nc(e) {
				return e && (e.hasOwnProperty(Ms) || e.hasOwnProperty(tD)) ? e[Ms] : null;
			}
			const Ao = Q({ ɵprov: Q }),
				Ms = Q({ ɵinj: Q }),
				Fc = Q({ ngInjectableDef: Q }),
				tD = Q({ ngInjectorDef: Q });
			var N = (() => (
				((N = N || {})[(N.Default = 0)] = 'Default'),
				(N[(N.Host = 1)] = 'Host'),
				(N[(N.Self = 2)] = 'Self'),
				(N[(N.SkipSelf = 4)] = 'SkipSelf'),
				(N[(N.Optional = 8)] = 'Optional'),
				N
			))();
			let Is;
			function Qt(e) {
				const t = Is;
				return (Is = e), t;
			}
			function xc(e, t, n) {
				const r = bs(e);
				return r && 'root' == r.providedIn
					? void 0 === r.value
						? (r.value = r.factory())
						: r.value
					: n & N.Optional
					? null
					: void 0 !== t
					? t
					: void Io(G(e), 'Injector');
			}
			function Zt(e) {
				return { toString: e }.toString();
			}
			var it = (() => (((it = it || {})[(it.OnPush = 0)] = 'OnPush'), (it[(it.Default = 1)] = 'Default'), it))(),
				Ct = (() => {
					return (
						((e = Ct || (Ct = {}))[(e.Emulated = 0)] = 'Emulated'),
						(e[(e.None = 2)] = 'None'),
						(e[(e.ShadowDom = 3)] = 'ShadowDom'),
						Ct
					);
					var e;
				})();
			const rD = 'undefined' != typeof globalThis && globalThis,
				oD = 'undefined' != typeof window && window,
				iD = 'undefined' != typeof self && 'undefined' != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && self,
				W = rD || ('undefined' != typeof global && global) || oD || iD,
				Fn = {},
				Z = [],
				So = Q({ ɵcmp: Q }),
				As = Q({ ɵdir: Q }),
				Ss = Q({ ɵpipe: Q }),
				Pc = Q({ ɵmod: Q }),
				Vt = Q({ ɵfac: Q }),
				Cr = Q({ __NG_ELEMENT_ID__: Q });
			let sD = 0;
			function kt(e) {
				return Zt(() => {
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
							selectors: e.selectors || Z,
							viewQuery: e.viewQuery || null,
							features: e.features || null,
							data: e.data || {},
							encapsulation: e.encapsulation || Ct.Emulated,
							id: 'c',
							styles: e.styles || Z,
							_: null,
							setInput: null,
							schemas: e.schemas || null,
							tView: null,
						},
						o = e.directives,
						i = e.features,
						s = e.pipes;
					return (
						(r.id += sD++),
						(r.inputs = kc(e.inputs, n)),
						(r.outputs = kc(e.outputs)),
						i && i.forEach((a) => a(r)),
						(r.directiveDefs = o ? () => ('function' == typeof o ? o() : o).map(Oc) : null),
						(r.pipeDefs = s ? () => ('function' == typeof s ? s() : s).map(Rc) : null),
						r
					);
				});
			}
			function Oc(e) {
				return (
					Ee(e) ||
					(function Jt(e) {
						return e[As] || null;
					})(e)
				);
			}
			function Rc(e) {
				return (function yn(e) {
					return e[Ss] || null;
				})(e);
			}
			const Vc = {};
			function wt(e) {
				return Zt(() => {
					const t = {
						type: e.type,
						bootstrap: e.bootstrap || Z,
						declarations: e.declarations || Z,
						imports: e.imports || Z,
						exports: e.exports || Z,
						transitiveCompileScopes: null,
						schemas: e.schemas || null,
						id: e.id || null,
					};
					return null != e.id && (Vc[e.id] = e.type), t;
				});
			}
			function kc(e, t) {
				if (null == e) return Fn;
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
			function Ee(e) {
				return e[So] || null;
			}
			function Je(e, t) {
				const n = e[Pc] || null;
				if (!n && !0 === t) throw new Error(`Type ${G(e)} does not have '\u0275mod' property.`);
				return n;
			}
			const P = 11,
				K = 20;
			function Et(e) {
				return Array.isArray(e) && 'object' == typeof e[1];
			}
			function at(e) {
				return Array.isArray(e) && !0 === e[1];
			}
			function Fs(e) {
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
			function fD(e) {
				return 0 != (512 & e[2]);
			}
			function Cn(e, t) {
				return e.hasOwnProperty(Vt) ? e[Vt] : null;
			}
			class gD {
				constructor(t, n, r) {
					(this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
				}
				isFirstChange() {
					return this.firstChange;
				}
			}
			function Lt() {
				return Bc;
			}
			function Bc(e) {
				return e.type.prototype.ngOnChanges && (e.setInput = yD), mD;
			}
			function mD() {
				const e = jc(this),
					t = null == e ? void 0 : e.current;
				if (t) {
					const n = e.previous;
					if (n === Fn) e.previous = t;
					else for (let r in t) n[r] = t[r];
					(e.current = null), this.ngOnChanges(t);
				}
			}
			function yD(e, t, n, r) {
				const o =
						jc(e) ||
						(function _D(e, t) {
							return (e[Hc] = t);
						})(e, { previous: Fn, current: null }),
					i = o.current || (o.current = {}),
					s = o.previous,
					a = this.declaredInputs[n],
					u = s[a];
				(i[a] = new gD(u && u.currentValue, t, s === Fn)), (e[r] = t);
			}
			Lt.ngInherit = !0;
			const Hc = '__ngSimpleChanges__';
			function jc(e) {
				return e[Hc] || null;
			}
			let Vs;
			function oe(e) {
				return !!e.listen;
			}
			const $c = {
				createRenderer: (e, t) =>
					(function ks() {
						return void 0 !== Vs ? Vs : 'undefined' != typeof document ? document : void 0;
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
			function Ls(e, t) {
				return e.data[t];
			}
			function Ge(e, t) {
				const n = t[e];
				return Et(n) ? n : n[0];
			}
			function Bs(e) {
				return 128 == (128 & e[2]);
			}
			function Kt(e, t) {
				return null == t ? null : e[t];
			}
			function Gc(e) {
				e[18] = 0;
			}
			function Hs(e, t) {
				e[5] += t;
				let n = e,
					r = e[3];
				for (; null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5])); ) (r[5] += t), (n = r), (r = r[3]);
			}
			const I = { lFrame: Xc(null), bindingsEnabled: !0, isInCheckNoChangesMode: !1 };
			function zc() {
				return I.bindingsEnabled;
			}
			function y() {
				return I.lFrame.lView;
			}
			function H() {
				return I.lFrame.tView;
			}
			function ge() {
				let e = Wc();
				for (; null !== e && 64 === e.type; ) e = e.parent;
				return e;
			}
			function Wc() {
				return I.lFrame.currentTNode;
			}
			function bt(e, t) {
				const n = I.lFrame;
				(n.currentTNode = e), (n.isParent = t);
			}
			function js() {
				return I.lFrame.isParent;
			}
			function $s() {
				I.lFrame.isParent = !1;
			}
			function Ro() {
				return I.isInCheckNoChangesMode;
			}
			function Vo(e) {
				I.isInCheckNoChangesMode = e;
			}
			function kn() {
				return I.lFrame.bindingIndex++;
			}
			function Ht(e) {
				const t = I.lFrame,
					n = t.bindingIndex;
				return (t.bindingIndex = t.bindingIndex + e), n;
			}
			function RD(e, t) {
				const n = I.lFrame;
				(n.bindingIndex = n.bindingRootIndex = e), Us(t);
			}
			function Us(e) {
				I.lFrame.currentDirectiveIndex = e;
			}
			function zs(e) {
				I.lFrame.currentQueryIndex = e;
			}
			function kD(e) {
				const t = e[1];
				return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
			}
			function Kc(e, t, n) {
				if (n & N.SkipSelf) {
					let o = t,
						i = e;
					for (; !((o = o.parent), null !== o || n & N.Host || ((o = kD(i)), null === o || ((i = i[15]), 10 & o.type))); );
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
			function Fe() {
				return I.lFrame.selectedIndex;
			}
			function Yt(e) {
				I.lFrame.selectedIndex = e;
			}
			function ie() {
				const e = I.lFrame;
				return Ls(e.tView, e.selectedIndex);
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
			function qs(e, t) {
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
						t[u] < 0 && (e[18] += 65536), (a < i || -1 == i) && (qD(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)), u++;
			}
			function qD(e, t, n, r) {
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
			class Ir {
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
						Qs(s) ? r && e.setProperty(t, s, a) : r ? e.setAttribute(t, s, a) : t.setAttribute(s, a), o++;
					}
				}
				return o;
			}
			function rd(e) {
				return 3 === e || 4 === e || 6 === e;
			}
			function Qs(e) {
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
			function Ln(e) {
				return 32767 & e;
			}
			function Bn(e, t) {
				let n = (function KD(e) {
						return e >> 16;
					})(e),
					r = t;
				for (; n > 0; ) (r = r[15]), n--;
				return r;
			}
			let Zs = !0;
			function Go(e) {
				const t = Zs;
				return (Zs = e), t;
			}
			let YD = 0;
			function Sr(e, t) {
				const n = Ks(e, t);
				if (-1 !== n) return n;
				const r = t[1];
				r.firstCreatePass && ((e.injectorIndex = t.length), Js(r.data, e), Js(t, null), Js(r.blueprint, null));
				const o = zo(e, t),
					i = e.injectorIndex;
				if (id(o)) {
					const s = Ln(o),
						a = Bn(o, t),
						u = a[1].data;
					for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
				}
				return (t[i + 8] = o), i;
			}
			function Js(e, t) {
				e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
			}
			function Ks(e, t) {
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
				!(function XD(e, t, n) {
					let r;
					'string' == typeof n ? (r = n.charCodeAt(0) || 0) : n.hasOwnProperty(Cr) && (r = n[Cr]),
						null == r && (r = n[Cr] = YD++);
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
						i = Qt(void 0);
					try {
						return o ? o.get(t, r, n & N.Optional) : xc(t, r, n & N.Optional);
					} finally {
						Qt(i);
					}
				}
				return ud(r, t, n);
			}
			function cd(e, t, n, r = N.Default, o) {
				if (null !== e) {
					const i = (function rv(e) {
						if ('string' == typeof e) return e.charCodeAt(0) || 0;
						const t = e.hasOwnProperty(Cr) ? e[Cr] : void 0;
						return 'number' == typeof t ? (t >= 0 ? 255 & t : tv) : t;
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
							a = Ks(e, t),
							u = -1,
							l = r & N.Host ? t[16][6] : null;
						for (
							(-1 === a || r & N.SkipSelf) &&
							((u = -1 === a ? zo(e, t) : t[a + 8]),
							-1 !== u && hd(r, !1) ? ((s = t[1]), (a = Ln(u)), (t = Bn(u, t))) : (a = -1));
							-1 !== a;

						) {
							const c = t[1];
							if (fd(i, a, c.data)) {
								const d = nv(a, t, n, s, r, l);
								if (d !== dd) return d;
							}
							(u = t[a + 8]),
								-1 !== u && hd(r, t[1].data[a + 8] === l) && fd(i, a, t) ? ((s = c), (a = Ln(u)), (t = Bn(u, t))) : (a = -1);
						}
					}
				}
				return ld(t, n, r, o);
			}
			const dd = {};
			function tv() {
				return new Hn(ge(), y());
			}
			function nv(e, t, n, r, o, i) {
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
					})(a, s, n, null == r ? xo(a) && Zs : r != s && 0 != (3 & a.type), o & N.Host && i === a);
				return null !== c ? Tr(t, s, c, a) : dd;
			}
			function Tr(e, t, n, r) {
				let o = e[n];
				const i = t.data;
				if (
					(function WD(e) {
						return e instanceof Ir;
					})(o)
				) {
					const s = o;
					s.resolving &&
						(function Z_(e, t) {
							const n = t ? `. Dependency path: ${t.join(' > ')} > ${e}` : '';
							throw new B(-200, `Circular dependency in DI detected for ${e}${n}`);
						})(Te(i[n]));
					const a = Go(s.canSeeViewProviders);
					s.resolving = !0;
					const u = s.injectImpl ? Qt(s.injectImpl) : null;
					Kc(e, r, N.Default);
					try {
						(o = e[n] = s.factory(void 0, i, e, r)),
							t.firstCreatePass &&
								n >= r.directiveStart &&
								(function zD(e, t, n) {
									const { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
									if (r) {
										const s = Bc(t);
										(n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
											(n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, s);
									}
									o && (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
										i &&
											((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
											(n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, i));
								})(n, i[n], t);
					} finally {
						null !== u && Qt(u), Go(a), (s.resolving = !1), td();
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
			class Hn {
				constructor(t, n) {
					(this._tNode = t), (this._lView = n);
				}
				get(t, n, r) {
					return cd(this._tNode, this._lView, t, r, n);
				}
			}
			function Ys(e) {
				return Sc(e)
					? () => {
							const t = Ys(x(e));
							return t && t();
					  }
					: Cn(e);
			}
			const $n = '__parameters__';
			function Gn(e, t, n) {
				return Zt(() => {
					const r = (function ea(e) {
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
							const d = u.hasOwnProperty($n) ? u[$n] : Object.defineProperty(u, $n, { value: [] })[$n];
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
			function Mt(e, t) {
				e.forEach((n) => (Array.isArray(n) ? Mt(n, t) : t(n)));
			}
			function gd(e, t, n) {
				t >= e.length ? e.push(n) : e.splice(t, 0, n);
			}
			function Qo(e, t) {
				return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
			}
			function ze(e, t, n) {
				let r = zn(e, t);
				return (
					r >= 0
						? (e[1 | r] = n)
						: ((r = ~r),
						  (function av(e, t, n, r) {
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
			function na(e, t) {
				const n = zn(e, t);
				if (n >= 0) return e[1 | n];
			}
			function zn(e, t) {
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
			const Pr = {},
				oa = '__NG_DI_FLAG__',
				Jo = 'ngTempTokenPath',
				pv = /\n/gm,
				vd = '__source',
				mv = Q({ provide: String, useValue: Q });
			let Or;
			function Cd(e) {
				const t = Or;
				return (Or = e), t;
			}
			function yv(e, t = N.Default) {
				if (void 0 === Or) throw new B(203, '');
				return null === Or ? xc(e, void 0, t) : Or.get(e, t & N.Optional ? null : void 0, t);
			}
			function V(e, t = N.Default) {
				return (
					(function nD() {
						return Is;
					})() || yv
				)(x(e), t);
			}
			const _v = V;
			function ia(e) {
				const t = [];
				for (let n = 0; n < e.length; n++) {
					const r = x(e[n]);
					if (Array.isArray(r)) {
						if (0 === r.length) throw new B(900, '');
						let o,
							i = N.Default;
						for (let s = 0; s < r.length; s++) {
							const a = r[s],
								u = Dv(a);
							'number' == typeof u ? (-1 === u ? (o = a.token) : (i |= u)) : (o = a);
						}
						t.push(V(o, i));
					} else t.push(V(r));
				}
				return t;
			}
			function Rr(e, t) {
				return (e[oa] = t), (e.prototype[oa] = t), e;
			}
			function Dv(e) {
				return e[oa];
			}
			const Ko = Rr(Gn('Optional'), 8),
				Yo = Rr(Gn('SkipSelf'), 4);
			class Nd {
				constructor(t) {
					this.changingThisBreaksApplicationSecurity = t;
				}
				toString() {
					return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
				}
			}
			function en(e) {
				return e instanceof Nd ? e.changingThisBreaksApplicationSecurity : e;
			}
			const jv = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi,
				$v =
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
				const t = (function Br() {
					const e = y();
					return e && e[12];
				})();
				return t
					? t.sanitize(ce.URL, e) || ''
					: (function kr(e, t) {
							const n = (function kv(e) {
								return (e instanceof Nd && e.getTypeName()) || null;
							})(e);
							if (null != n && n !== t) {
								if ('ResourceURL' === n && 'URL' === t) return !0;
								throw new Error(`Required a safe ${t}, got a ${n} (see https://g.co/ng/security#xss)`);
							}
							return n === t;
					  })(e, 'URL')
					? en(e)
					: (function ni(e) {
							return (e = String(e)).match(jv) || e.match($v) ? e : 'unsafe:' + e;
					  })(A(e));
			}
			const Hd = '__ngContext__';
			function Ie(e, t) {
				e[Hd] = t;
			}
			function ga(e) {
				const t = (function Hr(e) {
					return e[Hd] || null;
				})(e);
				return t ? (Array.isArray(t) ? t : t.lView) : null;
			}
			function ya(e) {
				return e.ngOriginalError;
			}
			function dC(e, ...t) {
				e.error(...t);
			}
			class jr {
				constructor() {
					this._console = console;
				}
				handleError(t) {
					const n = this._findOriginalError(t),
						r = (function cC(e) {
							return (e && e.ngErrorLogger) || dC;
						})(t);
					r(this._console, 'ERROR', t), n && r(this._console, 'ORIGINAL ERROR', n);
				}
				_findOriginalError(t) {
					let n = t && ya(t);
					for (; n && ya(n); ) n = ya(n);
					return n || null;
				}
			}
			const CC = (() => (('undefined' != typeof requestAnimationFrame && requestAnimationFrame) || setTimeout).bind(W))();
			function At(e) {
				return e instanceof Function ? e() : e;
			}
			var qe = (() => (((qe = qe || {})[(qe.Important = 1)] = 'Important'), (qe[(qe.DashCase = 2)] = 'DashCase'), qe))();
			function Da(e, t) {
				return undefined(e, t);
			}
			function $r(e) {
				const t = e[3];
				return at(t) ? t[3] : t;
			}
			function va(e) {
				return Zd(e[13]);
			}
			function Ca(e) {
				return Zd(e[4]);
			}
			function Zd(e) {
				for (; null !== e && !at(e); ) e = e[4];
				return e;
			}
			function Zn(e, t, n, r, o) {
				if (null != r) {
					let i,
						s = !1;
					at(r) ? (i = r) : Et(r) && ((s = !0), (r = r[0]));
					const a = le(r);
					0 === e && null !== n
						? null == o
							? tf(t, n, a)
							: wn(t, n, a, o || null, !0)
						: 1 === e && null !== n
						? wn(t, n, a, o || null, !0)
						: 2 === e
						? (function lf(e, t, n) {
								const r = ii(e, t);
								r &&
									(function RC(e, t, n, r) {
										oe(e) ? e.removeChild(t, n, r) : t.removeChild(n);
									})(e, r, t, n);
						  })(t, a, s)
						: 3 === e && t.destroyNode(a),
						null != i &&
							(function LC(e, t, n, r, o) {
								const i = n[7];
								i !== le(n) && Zn(t, e, r, i, o);
								for (let a = 10; a < n.length; a++) {
									const u = n[a];
									Ur(u[1], u, e, t, r, i);
								}
							})(t, e, i, n, o);
				}
			}
			function Ea(e, t, n) {
				if (oe(e)) return e.createElement(t, n);
				{
					const r =
						null !== n
							? (function wD(e) {
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
				1024 & t[2] && ((t[2] &= -1025), Hs(o, -1)), n.splice(r, 1);
			}
			function ba(e, t) {
				if (e.length <= 10) return;
				const n = 10 + t,
					r = e[n];
				if (r) {
					const o = r[17];
					null !== o && o !== e && Kd(o, r), t > 0 && (e[n - 1][4] = r[4]);
					const i = Qo(e, 10 + t);
					!(function AC(e, t) {
						Ur(e, t, t[P], 2, null, null), (t[0] = null), (t[6] = null);
					})(r[1], r);
					const s = i[19];
					null !== s && s.detachView(i[1]), (r[3] = null), (r[4] = null), (r[2] &= -129);
				}
				return r;
			}
			function Yd(e, t) {
				if (!(256 & t[2])) {
					const n = t[P];
					oe(n) && n.destroyNode && Ur(e, t, n, 3, null, null),
						(function NC(e) {
							let t = e[13];
							if (!t) return Ma(e[1], e);
							for (; t; ) {
								let n = null;
								if (Et(t)) n = t[13];
								else {
									const r = t[10];
									r && (n = r);
								}
								if (!n) {
									for (; t && !t[4] && t !== e; ) Et(t) && Ma(t[1], t), (t = t[3]);
									null === t && (t = e), Et(t) && Ma(t[1], t), (n = t && t[4]);
								}
								t = n;
							}
						})(t);
				}
			}
			function Ma(e, t) {
				if (!(256 & t[2])) {
					(t[2] &= -129),
						(t[2] |= 256),
						(function OC(e, t) {
							let n;
							if (null != e && null != (n = e.destroyHooks))
								for (let r = 0; r < n.length; r += 2) {
									const o = t[n[r]];
									if (!(o instanceof Ir)) {
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
						(function PC(e, t) {
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
						if (o === Ct.None || o === Ct.Emulated) return null;
					}
					return Xe(r, n);
				})(e, t.parent, n);
			}
			function wn(e, t, n, r, o) {
				oe(e) ? e.insertBefore(t, n, r, o) : t.insertBefore(n, r, o);
			}
			function tf(e, t, n) {
				oe(e) ? e.appendChild(t, n) : t.appendChild(n);
			}
			function nf(e, t, n, r, o) {
				null !== r ? wn(e, t, n, r, o) : tf(e, t, n);
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
					if (4 & n) return Aa(-1, e[t.index]);
					if (8 & n) {
						const r = t.child;
						if (null !== r) return ai(e, r);
						{
							const o = e[t.index];
							return at(o) ? Aa(-1, o) : le(o);
						}
					}
					if (32 & n) return Da(t, e)() || le(e[t.index]);
					{
						const r = uf(e, t);
						return null !== r ? (Array.isArray(r) ? r[0] : ai($r(e[16]), r)) : ai(e, t.next);
					}
				}
				return null;
			}
			function uf(e, t) {
				return null !== t ? e[16][6].projection[t.projection] : null;
			}
			function Aa(e, t) {
				const n = 10 + e + 1;
				if (n < t.length) {
					const r = t[n],
						o = r[1].firstChild;
					if (null !== o) return ai(r, o);
				}
				return t[7];
			}
			function Sa(e, t, n, r, o, i, s) {
				for (; null != n; ) {
					const a = r[n.index],
						u = n.type;
					if ((s && 0 === t && (a && Ie(le(a), r), (n.flags |= 4)), 64 != (64 & n.flags)))
						if (8 & u) Sa(e, t, n.child, r, o, i, !1), Zn(t, e, o, a, i);
						else if (32 & u) {
							const l = Da(n, r);
							let c;
							for (; (c = l()); ) Zn(t, e, o, c, i);
							Zn(t, e, o, a, i);
						} else 16 & u ? cf(e, t, r, n, o, i) : Zn(t, e, o, a, i);
					n = s ? n.projectionNext : n.next;
				}
			}
			function Ur(e, t, n, r, o, i) {
				Sa(n, r, e.firstChild, t, o, i, !1);
			}
			function cf(e, t, n, r, o, i) {
				const s = n[16],
					u = s[6].projection[r.projection];
				if (Array.isArray(u)) for (let l = 0; l < u.length; l++) Zn(t, e, o, u[l], i);
				else Sa(e, t, u, s[3], o, i, !0);
			}
			function df(e, t, n) {
				oe(e) ? e.setAttribute(t, 'style', n) : (t.style.cssText = n);
			}
			function Ta(e, t, n) {
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
			function HC(e, t, n) {
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
			function jC(e, t, n) {
				return t === (4 !== e.type || n ? e.value : hf);
			}
			function $C(e, t, n) {
				let r = 4;
				const o = e.attrs || [],
					i = (function zC(e) {
						for (let t = 0; t < e.length; t++) if (rd(e[t])) return t;
						return e.length;
					})(o);
				let s = !1;
				for (let a = 0; a < t.length; a++) {
					const u = t[a];
					if ('number' != typeof u) {
						if (!s)
							if (4 & r) {
								if (((r = 2 | (1 & r)), ('' !== u && !jC(e, u, n)) || ('' === u && 1 === t.length))) {
									if (lt(r)) return !1;
									s = !0;
								}
							} else {
								const l = 8 & r ? u : t[++a];
								if (8 & r && null !== e.attrs) {
									if (!HC(e.attrs, l, n)) {
										if (lt(r)) return !1;
										s = !0;
									}
									continue;
								}
								const d = UC(8 & r ? 'class' : u, o, pf(e), n);
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
			function UC(e, t, n, r) {
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
				return (function qC(e, t) {
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
				for (let r = 0; r < t.length; r++) if ($C(e, t[r], n)) return !0;
				return !1;
			}
			function mf(e, t) {
				return e ? ':not(' + t.trim() + ')' : t;
			}
			function QC(e) {
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
			function Pe(e) {
				yf(H(), y(), Fe() + e, Ro());
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
				Yt(n);
			}
			function ui(e, t) {
				return (e << 17) | (t << 2);
			}
			function ct(e) {
				return (e >> 17) & 32767;
			}
			function Na(e) {
				return 2 | e;
			}
			function jt(e) {
				return (131068 & e) >> 2;
			}
			function Fa(e, t) {
				return (-131069 & e) | (t << 2);
			}
			function xa(e) {
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
							zs(o), s.contentQueries(2, t[i], i);
						}
					}
			}
			function Gr(e, t, n, r, o, i, s, a, u, l) {
				const c = t.blueprint.slice();
				return (
					(c[0] = o),
					(c[2] = 140 | r),
					Gc(c),
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
			function Jn(e, t, n, r, o) {
				let i = e.data[t];
				if (null === i)
					(i = (function ja(e, t, n, r, o) {
						const i = Wc(),
							s = js(),
							u = (e.data[t] = (function fw(e, t, n, r, o, i) {
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
						(function OD() {
							return I.lFrame.inI18n;
						})() && (i.flags |= 64);
				else if (64 & i.type) {
					(i.type = n), (i.value = r), (i.attrs = o);
					const s = (function Mr() {
						const e = I.lFrame,
							t = e.currentTNode;
						return e.isParent ? t : t.parent;
					})();
					i.injectorIndex = null === s ? -1 : s.injectorIndex;
				}
				return bt(i, !0), i;
			}
			function Kn(e, t, n, r) {
				if (0 === n) return -1;
				const o = t.length;
				for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
				return o;
			}
			function zr(e, t, n) {
				ko(t);
				try {
					const r = e.viewQuery;
					null !== r && Ja(1, r, n);
					const o = e.template;
					null !== o && Tf(e, t, o, 1, n),
						e.firstCreatePass && (e.firstCreatePass = !1),
						e.staticContentQueries && Sf(e, t),
						e.staticViewQueries && Ja(2, e.viewQuery, n);
					const i = e.components;
					null !== i &&
						(function lw(e, t) {
							for (let n = 0; n < t.length; n++) Nw(e, t[n]);
						})(t, i);
				} catch (r) {
					throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
				} finally {
					(t[2] &= -5), Lo();
				}
			}
			function Yn(e, t, n, r) {
				const o = t[2];
				if (256 == (256 & o)) return;
				ko(t);
				const i = Ro();
				try {
					Gc(t),
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
							null !== l && jo(t, l, 0, null), qs(t, 0);
						}
					if (
						((function Sw(e) {
							for (let t = va(e); null !== t; t = Ca(t)) {
								if (!t[2]) continue;
								const n = t[9];
								for (let r = 0; r < n.length; r++) {
									const o = n[r],
										i = o[3];
									0 == (1024 & o[2]) && Hs(i, 1), (o[2] |= 1024);
								}
							}
						})(t),
						(function Aw(e) {
							for (let t = va(e); null !== t; t = Ca(t))
								for (let n = 10; n < t.length; n++) {
									const r = t[n],
										o = r[1];
									Bs(r) && Yn(o, r, o.template, r[8]);
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
							null !== l && jo(t, l, 1), qs(t, 1);
						}
					!(function aw(e, t) {
						const n = e.hostBindingOpCodes;
						if (null !== n)
							try {
								for (let r = 0; r < n.length; r++) {
									const o = n[r];
									if (o < 0) Yt(~o);
									else {
										const i = o,
											s = n[++r],
											a = n[++r];
										RD(s, i), a(2, t[i]);
									}
								}
							} finally {
								Yt(-1);
							}
					})(e, t);
					const a = e.components;
					null !== a &&
						(function uw(e, t) {
							for (let n = 0; n < t.length; n++) Tw(e, t[n]);
						})(t, a);
					const u = e.viewQuery;
					if ((null !== u && Ja(2, u, r), !i))
						if (s) {
							const l = e.viewCheckHooks;
							null !== l && Ho(t, l);
						} else {
							const l = e.viewHooks;
							null !== l && jo(t, l, 2), qs(t, 2);
						}
					!0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
						i || (t[2] &= -73),
						1024 & t[2] && ((t[2] &= -1025), Hs(t[3], -1));
				} finally {
					Lo();
				}
			}
			function cw(e, t, n, r) {
				const o = t[10],
					i = !Ro(),
					s = (function Uc(e) {
						return 4 == (4 & e[2]);
					})(t);
				try {
					i && !s && o.begin && o.begin(), s && zr(e, t, r), Yn(e, t, n, r);
				} finally {
					i && !s && o.end && o.end();
				}
			}
			function Tf(e, t, n, r, o) {
				const i = Fe(),
					s = 2 & r;
				try {
					Yt(-1), s && t.length > K && yf(e, t, K, Ro()), n(r, o);
				} finally {
					Yt(i);
				}
			}
			function Nf(e, t, n) {
				if (Fs(t)) {
					const o = t.directiveEnd;
					for (let i = t.directiveStart; i < o; i++) {
						const s = e.data[i];
						s.contentQueries && s.contentQueries(1, n[i], i);
					}
				}
			}
			function $a(e, t, n) {
				!zc() ||
					((function Dw(e, t, n, r) {
						const o = n.directiveStart,
							i = n.directiveEnd;
						e.firstCreatePass || Sr(n, t), Ie(r, t);
						const s = n.initialInputs;
						for (let a = o; a < i; a++) {
							const u = e.data[a],
								l = ut(u);
							l && bw(t, n, u);
							const c = Tr(t, e, a, n);
							Ie(c, t), null !== s && Mw(0, a - o, c, u, 0, s), l && (Ge(n.index, t)[8] = c);
						}
					})(e, t, n, Xe(n, t)),
					128 == (128 & n.flags) &&
						(function vw(e, t, n) {
							const r = n.directiveStart,
								o = n.directiveEnd,
								s = n.index,
								a = (function VD() {
									return I.lFrame.currentDirectiveIndex;
								})();
							try {
								Yt(s);
								for (let u = r; u < o; u++) {
									const l = e.data[u],
										c = t[u];
									Us(u), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && Lf(l, c);
								}
							} finally {
								Yt(-1), Us(a);
							}
						})(e, t, n));
			}
			function Ua(e, t, n = Xe) {
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
				const c = K + r,
					d = c + o,
					f = (function dw(e, t) {
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
			function We(e, t, n, r, o, i, s, a) {
				const u = Xe(t, n);
				let c,
					l = t.inputs;
				!a && null != l && (c = l[r])
					? (Qf(e, n, c, r, o),
					  xo(t) &&
							(function gw(e, t) {
								const n = Ge(t, e);
								16 & n[2] || (n[2] |= 64);
							})(n, t.index))
					: 3 & t.type &&
					  ((r = (function pw(e) {
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
					  oe(i) ? i.setProperty(u, r, o) : Qs(r) || (u.setProperty ? u.setProperty(r, o) : (u[r] = o)));
			}
			function Ga(e, t, n, r) {
				let o = !1;
				if (zc()) {
					const i = (function Cw(e, t, n) {
							const r = e.directiveRegistry;
							let o = null;
							if (r)
								for (let i = 0; i < r.length; i++) {
									const s = r[i];
									gf(n, s.selectors, !1) &&
										(o || (o = []), qo(Sr(n, t), e, s.type), ut(s) ? (Bf(e, n), o.unshift(s)) : o.push(s));
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
							l = Kn(e, t, i.length, null);
						for (let c = 0; c < i.length; c++) {
							const d = i[c];
							(n.mergedAttrs = Uo(n.mergedAttrs, d.hostAttrs)),
								jf(e, n, t, l, d),
								Ew(l, d, s),
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
						!(function hw(e, t) {
							const r = t.directiveEnd,
								o = e.data,
								i = t.attrs,
								s = [];
							let a = null,
								u = null;
							for (let l = t.directiveStart; l < r; l++) {
								const c = o[l],
									d = c.inputs,
									f = null === i || pf(t) ? null : Iw(d, i);
								s.push(f), (a = Rf(d, l, a)), (u = Rf(c.outputs, l, u));
							}
							null !== a && (a.hasOwnProperty('class') && (t.flags |= 16), a.hasOwnProperty('style') && (t.flags |= 32)),
								(t.initialInputs = s),
								(t.inputs = a),
								(t.outputs = u);
						})(e, n);
					}
					s &&
						(function ww(e, t, n) {
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
					(function _w(e) {
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
			function Ew(e, t, n) {
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
				const i = o.factory || (o.factory = Cn(o.type)),
					s = new Ir(i, ut(o), null);
				(e.blueprint[r] = s), (n[r] = s), kf(e, t, 0, r, Kn(e, n, o.hostVars, T), o);
			}
			function bw(e, t, n) {
				const r = Xe(t, e),
					o = Ff(n),
					i = e[10],
					s = fi(e, Gr(e, o, null, n.onPush ? 64 : 16, r, t, i, i.createRenderer(r, n), null, null));
				e[t.index] = s;
			}
			function Mw(e, t, n, r, o, i) {
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
			function Iw(e, t) {
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
			function Tw(e, t) {
				const n = Ge(t, e);
				if (Bs(n)) {
					const r = n[1];
					80 & n[2] ? Yn(r, n, r.template, n[8]) : n[5] > 0 && qa(n);
				}
			}
			function qa(e) {
				for (let r = va(e); null !== r; r = Ca(r))
					for (let o = 10; o < r.length; o++) {
						const i = r[o];
						if (1024 & i[2]) {
							const s = i[1];
							Yn(s, i, s.template, i[8]);
						} else i[5] > 0 && qa(i);
					}
				const n = e[1].components;
				if (null !== n)
					for (let r = 0; r < n.length; r++) {
						const o = Ge(n[r], e);
						Bs(o) && o[5] > 0 && qa(o);
					}
			}
			function Nw(e, t) {
				const n = Ge(t, e),
					r = n[1];
				(function Fw(e, t) {
					for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
				})(r, n),
					zr(r, n, n[8]);
			}
			function fi(e, t) {
				return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
			}
			function Wa(e) {
				for (; e; ) {
					e[2] |= 64;
					const t = $r(e);
					if (fD(e) && !t) return e;
					e = t;
				}
				return null;
			}
			function Za(e, t, n) {
				const r = t[10];
				r.begin && r.begin();
				try {
					Yn(e, t, e.template, n);
				} catch (o) {
					throw (Wf(t, o), o);
				} finally {
					r.end && r.end();
				}
			}
			function Uf(e) {
				!(function Qa(e) {
					for (let t = 0; t < e.components.length; t++) {
						const n = e.components[t],
							r = ga(n),
							o = r[1];
						cw(o, r, o.template, n);
					}
				})(e[8]);
			}
			function Ja(e, t, n) {
				zs(0), t(e, n);
			}
			const Rw = (() => Promise.resolve(null))();
			function Gf(e) {
				return e[7] || (e[7] = []);
			}
			function zf(e) {
				return e.cleanup || (e.cleanup = []);
			}
			function Wf(e, t) {
				const n = e[9],
					r = n ? n.get(jr, null) : null;
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
						'number' == typeof a ? (i = a) : 1 == i ? (o = ws(o, a)) : 2 == i && (r = ws(r, a + ': ' + t[++s] + ';'));
					}
				n ? (e.styles = r) : (e.stylesWithoutHost = r), n ? (e.classes = o) : (e.classesWithoutHost = o);
			}
			const Ka = new L('INJECTOR', -1);
			class Zf {
				get(t, n = Pr) {
					if (n === Pr) {
						const r = new Error(`NullInjectorError: No provider for ${G(t)}!`);
						throw ((r.name = 'NullInjectorError'), r);
					}
					return n;
				}
			}
			const Ya = new L('Set Injector scope.'),
				qr = {},
				Lw = {};
			let Xa;
			function Jf() {
				return void 0 === Xa && (Xa = new Zf()), Xa;
			}
			function Kf(e, t = null, n = null, r) {
				const o = Yf(e, t, n, r);
				return o._resolveInjectorDefTypes(), o;
			}
			function Yf(e, t = null, n = null, r) {
				return new Bw(e, n, t || Jf(), r);
			}
			class Bw {
				constructor(t, n, r, o = null) {
					(this.parent = r),
						(this.records = new Map()),
						(this.injectorDefTypes = new Set()),
						(this.onDestroy = new Set()),
						(this._destroyed = !1);
					const i = [];
					n && Mt(n, (a) => this.processProvider(a, t, n)),
						Mt([t], (a) => this.processInjectorType(a, [], i)),
						this.records.set(Ka, Xn(void 0, this));
					const s = this.records.get(Ya);
					(this.scope = null != s ? s.value : null), (this.source = o || ('object' == typeof t ? null : G(t)));
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
				get(t, n = Pr, r = N.Default) {
					this.assertNotDestroyed();
					const o = Cd(this),
						i = Qt(void 0);
					try {
						if (!(r & N.SkipSelf)) {
							let a = this.records.get(t);
							if (void 0 === a) {
								const u =
									(function Ww(e) {
										return 'function' == typeof e || ('object' == typeof e && e instanceof L);
									})(t) && bs(t);
								(a = u && this.injectableDefInScope(u) ? Xn(eu(t), qr) : null), this.records.set(t, a);
							}
							if (null != a) return this.hydrate(t, a);
						}
						return (r & N.Self ? Jf() : this.parent).get(t, (n = r & N.Optional && n === Pr ? null : n));
					} catch (s) {
						if ('NullInjectorError' === s.name) {
							if (((s[Jo] = s[Jo] || []).unshift(G(t)), o)) throw s;
							return (function vv(e, t, n, r) {
								const o = e[Jo];
								throw (
									(t[vd] && o.unshift(t[vd]),
									(e.message = (function Cv(e, t, n, r = null) {
										e = e && '\n' === e.charAt(0) && '\u0275' == e.charAt(1) ? e.substr(2) : e;
										let o = G(t);
										if (Array.isArray(t)) o = t.map(G).join(' -> ');
										else if ('object' == typeof t) {
											let i = [];
											for (let s in t)
												if (t.hasOwnProperty(s)) {
													let a = t[s];
													i.push(s + ':' + ('string' == typeof a ? JSON.stringify(a) : G(a)));
												}
											o = `{${i.join(', ')}}`;
										}
										return `${n}${r ? '(' + r + ')' : ''}[${o}]: ${e.replace(pv, '\n  ')}`;
									})('\n' + e.message, o, n, r)),
									(e.ngTokenPath = o),
									(e[Jo] = null),
									e)
								);
							})(s, t, 'R3InjectorError', this.source);
						}
						throw s;
					} finally {
						Qt(i), Cd(o);
					}
				}
				_resolveInjectorDefTypes() {
					this.injectorDefTypes.forEach((t) => this.get(t));
				}
				toString() {
					const t = [];
					return this.records.forEach((r, o) => t.push(G(o))), `R3Injector[${t.join(', ')}]`;
				}
				assertNotDestroyed() {
					if (this._destroyed) throw new B(205, !1);
				}
				processInjectorType(t, n, r) {
					if (!(t = x(t))) return !1;
					let o = Nc(t);
					const i = (null == o && t.ngModule) || void 0,
						s = void 0 === i ? t : i,
						a = -1 !== r.indexOf(s);
					if ((void 0 !== i && (o = Nc(i)), null == o)) return !1;
					if (null != o.imports && !a) {
						let c;
						r.push(s);
						try {
							Mt(o.imports, (d) => {
								this.processInjectorType(d, n, r) && (void 0 === c && (c = []), c.push(d));
							});
						} finally {
						}
						if (void 0 !== c)
							for (let d = 0; d < c.length; d++) {
								const { ngModule: f, providers: h } = c[d];
								Mt(h, (p) => this.processProvider(p, f, h || Z));
							}
					}
					this.injectorDefTypes.add(s);
					const u = Cn(s) || (() => new s());
					this.records.set(s, Xn(u, qr));
					const l = o.providers;
					if (null != l && !a) {
						const c = t;
						Mt(l, (d) => this.processProvider(d, c, l));
					}
					return void 0 !== i && void 0 !== t.providers;
				}
				processProvider(t, n, r) {
					let o = er((t = x(t))) ? t : x(t && t.provide);
					const i = (function jw(e, t, n) {
						return eh(e) ? Xn(void 0, e.useValue) : Xn(Xf(e), qr);
					})(t);
					if (er(t) || !0 !== t.multi) this.records.get(o);
					else {
						let s = this.records.get(o);
						s || ((s = Xn(void 0, qr, !0)), (s.factory = () => ia(s.multi)), this.records.set(o, s)), (o = t), s.multi.push(t);
					}
					this.records.set(o, i);
				}
				hydrate(t, n) {
					return (
						n.value === qr && ((n.value = Lw), (n.value = n.factory())),
						'object' == typeof n.value &&
							n.value &&
							(function qw(e) {
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
			function eu(e) {
				const t = bs(e),
					n = null !== t ? t.factory : Cn(e);
				if (null !== n) return n;
				if (e instanceof L) throw new B(204, !1);
				if (e instanceof Function)
					return (function Hw(e) {
						const t = e.length;
						if (t > 0)
							throw (
								((function xr(e, t) {
									const n = [];
									for (let r = 0; r < e; r++) n.push(t);
									return n;
								})(t, '?'),
								new B(204, !1))
							);
						const n = (function X_(e) {
							const t = e && (e[Ao] || e[Fc]);
							if (t) {
								const n = (function eD(e) {
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
				if (er(e)) {
					const o = x(e);
					return Cn(o) || eu(o);
				}
				if (eh(e)) r = () => x(e.useValue);
				else if (
					(function Uw(e) {
						return !(!e || !e.useFactory);
					})(e)
				)
					r = () => e.useFactory(...ia(e.deps || []));
				else if (
					(function $w(e) {
						return !(!e || !e.useExisting);
					})(e)
				)
					r = () => V(x(e.useExisting));
				else {
					const o = x(e && (e.useClass || e.provide));
					if (
						!(function zw(e) {
							return !!e.deps;
						})(e)
					)
						return Cn(o) || eu(o);
					r = () => new o(...ia(e.deps));
				}
				return r;
			}
			function Xn(e, t, n = !1) {
				return { factory: e, value: t, multi: n ? [] : void 0 };
			}
			function eh(e) {
				return null !== e && 'object' == typeof e && mv in e;
			}
			function er(e) {
				return 'function' == typeof e;
			}
			let Qe = (() => {
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
					(e.THROW_IF_NOT_FOUND = Pr),
					(e.NULL = new Zf()),
					(e.ɵprov = $({ token: e, providedIn: 'any', factory: () => V(Ka) })),
					(e.__NG_ELEMENT_ID__ = -1),
					e
				);
			})();
			function tE(e, t) {
				Bo(ga(e)[1], ge());
			}
			function z(e) {
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
							(s.inputs = ru(e.inputs)), (s.declaredInputs = ru(e.declaredInputs)), (s.outputs = ru(e.outputs));
							const a = o.hostBindings;
							a && iE(e, a);
							const u = o.viewQuery,
								l = o.contentQueries;
							if (
								(u && rE(e, u),
								l && oE(e, l),
								Cs(e.inputs, o.inputs),
								Cs(e.declaredInputs, o.declaredInputs),
								Cs(e.outputs, o.outputs),
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
								a && a.ngInherit && a(e), a === z && (n = !1);
							}
					}
					t = Object.getPrototypeOf(t);
				}
				!(function nE(e) {
					let t = 0,
						n = null;
					for (let r = e.length - 1; r >= 0; r--) {
						const o = e[r];
						(o.hostVars = t += o.hostVars), (o.hostAttrs = Uo(o.hostAttrs, (n = Uo(n, o.hostAttrs))));
					}
				})(r);
			}
			function ru(e) {
				return e === Fn ? {} : e === Z ? [] : e;
			}
			function rE(e, t) {
				const n = e.viewQuery;
				e.viewQuery = n
					? (r, o) => {
							t(r, o), n(r, o);
					  }
					: t;
			}
			function oE(e, t) {
				const n = e.contentQueries;
				e.contentQueries = n
					? (r, o, i) => {
							t(r, o, i), n(r, o, i);
					  }
					: t;
			}
			function iE(e, t) {
				const n = e.hostBindings;
				e.hostBindings = n
					? (r, o) => {
							t(r, o), n(r, o);
					  }
					: t;
			}
			let pi = null;
			function tr() {
				if (!pi) {
					const e = W.Symbol;
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
			function Wr(e) {
				return !!ou(e) && (Array.isArray(e) || (!(e instanceof Map) && tr() in e));
			}
			function ou(e) {
				return null !== e && ('function' == typeof e || 'object' == typeof e);
			}
			function Ae(e, t, n) {
				return !Object.is(e[t], n) && ((e[t] = n), !0);
			}
			function rr(e, t, n, r) {
				return Ae(e, kn(), n) ? t + A(n) + r : T;
			}
			function or(e, t, n, r, o, i) {
				const a = (function En(e, t, n, r) {
					const o = Ae(e, t, n);
					return Ae(e, t + 1, r) || o;
				})(
					e,
					(function Bt() {
						return I.lFrame.bindingIndex;
					})(),
					n,
					o
				);
				return Ht(2), a ? t + A(n) + r + A(o) + i : T;
			}
			function iu(e, t, n, r, o, i, s, a) {
				const u = y(),
					l = H(),
					c = e + K,
					d = l.firstCreatePass
						? (function fE(e, t, n, r, o, i, s, a, u) {
								const l = t.consts,
									c = Jn(t, e, 4, s || null, Kt(l, a));
								Ga(t, n, c, Kt(l, u)), Bo(t, c);
								const d = (c.tViews = di(2, c, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, l));
								return null !== t.queries && (t.queries.template(t, c), (d.queries = t.queries.embeddedTView(c))), c;
						  })(c, l, u, t, n, r, o, i, s)
						: l.data[c];
				bt(d, !1);
				const f = u[P].createComment('');
				si(l, u, f, d), Ie(f, u), fi(u, (u[c] = $f(f, u, f, d))), Po(d) && $a(l, u, d), null != s && Ua(u, d, a);
			}
			function v(e, t = N.Default) {
				const n = y();
				return null === n ? V(e, t) : cd(ge(), n, x(e), t);
			}
			function ft(e, t, n) {
				const r = y();
				return Ae(r, kn(), t) && We(H(), ie(), r, e, t, r[P], n, !1), ft;
			}
			function cu(e, t, n, r, o) {
				const s = o ? 'class' : 'style';
				Qf(e, n, t.inputs[s], s, r);
			}
			function U(e, t, n, r) {
				const o = y(),
					i = H(),
					s = K + e,
					a = o[P],
					u = (o[s] = Ea(
						a,
						t,
						(function GD() {
							return I.lFrame.currentNamespace;
						})()
					)),
					l = i.firstCreatePass
						? (function RE(e, t, n, r, o, i, s) {
								const a = t.consts,
									l = Jn(t, e, 2, o, Kt(a, i));
								return (
									Ga(t, n, l, Kt(a, s)),
									null !== l.attrs && hi(l, l.attrs, !1),
									null !== l.mergedAttrs && hi(l, l.mergedAttrs, !0),
									null !== t.queries && t.queries.elementStart(t, l),
									l
								);
						  })(s, i, o, 0, t, n, r)
						: i.data[s];
				bt(l, !0);
				const c = l.mergedAttrs;
				null !== c && $o(a, u, c);
				const d = l.classes;
				null !== d && Ta(a, u, d);
				const f = l.styles;
				return (
					null !== f && df(a, u, f),
					64 != (64 & l.flags) && si(i, o, u, l),
					0 ===
						(function SD() {
							return I.lFrame.elementDepthCount;
						})() && Ie(u, o),
					(function TD() {
						I.lFrame.elementDepthCount++;
					})(),
					Po(l) && ($a(i, o, l), Nf(i, l, o)),
					null !== r && Ua(o, l),
					U
				);
			}
			function q() {
				let e = ge();
				js() ? $s() : ((e = e.parent), bt(e, !1));
				const t = e;
				!(function ND() {
					I.lFrame.elementDepthCount--;
				})();
				const n = H();
				return (
					n.firstCreatePass && (Bo(n, e), Fs(e) && n.queries.elementEnd(e)),
					null != t.classesWithoutHost &&
						(function ZD(e) {
							return 0 != (16 & e.flags);
						})(t) &&
						cu(n, t, y(), t.classesWithoutHost, !0),
					null != t.stylesWithoutHost &&
						(function JD(e) {
							return 0 != (32 & e.flags);
						})(t) &&
						cu(n, t, y(), t.stylesWithoutHost, !1),
					q
				);
			}
			function Gt(e, t, n, r) {
				return U(e, t, n, r), q(), Gt;
			}
			function yi(e, t, n) {
				const r = y(),
					o = H(),
					i = e + K,
					s = o.firstCreatePass
						? (function VE(e, t, n, r, o) {
								const i = t.consts,
									s = Kt(i, r),
									a = Jn(t, e, 8, 'ng-container', s);
								return null !== s && hi(a, s, !0), Ga(t, n, a, Kt(i, o)), null !== t.queries && t.queries.elementStart(t, a), a;
						  })(i, o, r, t, n)
						: o.data[i];
				bt(s, !0);
				const a = (r[i] = r[P].createComment(''));
				return si(o, r, a, s), Ie(a, r), Po(s) && ($a(o, r, s), Nf(o, s, r)), null != n && Ua(r, s), yi;
			}
			function _i() {
				let e = ge();
				const t = H();
				return js() ? $s() : ((e = e.parent), bt(e, !1)), t.firstCreatePass && (Bo(t, e), Fs(e) && t.queries.elementEnd(e)), _i;
			}
			function Di(e) {
				return !!e && 'function' == typeof e.then;
			}
			const Rh = function Oh(e) {
				return !!e && 'function' == typeof e.subscribe;
			};
			function de(e, t, n, r) {
				const o = y(),
					i = H(),
					s = ge();
				return (
					(function kh(e, t, n, r, o, i, s, a) {
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
										(F = (function kE(e, t, n, r) {
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
									i = du(r, t, d, i, !1);
									const j = n.listen(_, o, i);
									f.push(i, j), c && c.push(o, E, g, g + 1);
								}
							} else (i = du(r, t, d, i, !0)), _.addEventListener(o, i, s), f.push(i), c && c.push(o, E, g, s);
						} else i = du(r, t, d, i, !1);
						const p = r.outputs;
						let m;
						if (h && null !== p && (m = p[o])) {
							const D = m.length;
							if (D)
								for (let _ = 0; _ < D; _ += 2) {
									const Ze = t[m[_]][m[_ + 1]].subscribe(i),
										Nn = f.length;
									f.push(i, Ze), c && c.push(o, r.index, Nn, -(Nn + 1));
								}
						}
					})(i, o, o[P], s, e, t, !!n, r),
					de
				);
			}
			function Lh(e, t, n, r) {
				try {
					return !1 !== n(r);
				} catch (o) {
					return Wf(e, o), !1;
				}
			}
			function du(e, t, n, r, o) {
				return function i(s) {
					if (s === Function) return r;
					const a = 2 & e.flags ? Ge(e.index, t) : t;
					0 == (32 & t[2]) && Wa(a);
					let u = Lh(t, 0, r, s),
						l = i.__ngNextListenerFn__;
					for (; l; ) (u = Lh(t, 0, l, s) && u), (l = l.__ngNextListenerFn__);
					return o && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
				};
			}
			function fu(e = 1) {
				return (function LD(e) {
					return (I.lFrame.contextLView = (function BD(e, t) {
						for (; e > 0; ) (t = t[15]), e--;
						return t;
					})(e, I.lFrame.contextLView))[8];
				})(e);
			}
			function Zr(e, t, n) {
				return hu(e, '', t, '', n), Zr;
			}
			function hu(e, t, n, r, o) {
				const i = y(),
					s = rr(i, t, n, r);
				return s !== T && We(H(), ie(), i, e, s, i[P], o, !1), hu;
			}
			function Wh(e, t, n, r, o) {
				const i = e[n + 1],
					s = null === t;
				let a = r ? ct(i) : jt(i),
					u = !1;
				for (; 0 !== a && (!1 === u || s); ) {
					const c = e[a + 1];
					UE(e[a], t) && ((u = !0), (e[a + 1] = r ? xa(c) : Na(c))), (a = r ? ct(c) : jt(c));
				}
				u && (e[n + 1] = r ? Na(i) : xa(i));
			}
			function UE(e, t) {
				return (
					null === e ||
					null == t ||
					(Array.isArray(e) ? e[1] : e) === t ||
					(!(!Array.isArray(e) || 'string' != typeof t) && zn(e, t) >= 0)
				);
			}
			function vi(e, t) {
				return (
					(function ht(e, t, n, r) {
						const o = y(),
							i = H(),
							s = Ht(2);
						i.firstUpdatePass &&
							(function np(e, t, n, r) {
								const o = e.data;
								if (null === o[n + 1]) {
									const i = o[Fe()],
										s = (function tp(e, t) {
											return t >= e.expandoStartIndex;
										})(e, n);
									(function sp(e, t) {
										return 0 != (e.flags & (t ? 16 : 32));
									})(i, r) &&
										null === t &&
										!s &&
										(t = !1),
										(t = (function YE(e, t, n, r) {
											const o = (function Gs(e) {
												const t = I.lFrame.currentDirectiveIndex;
												return -1 === t ? null : e[t];
											})(e);
											let i = r ? t.residualClasses : t.residualStyles;
											if (null === o)
												0 === (r ? t.classBindings : t.styleBindings) &&
													((n = Jr((n = pu(null, e, t, n, r)), t.attrs, r)), (i = null));
											else {
												const s = t.directiveStylingLast;
												if (-1 === s || e[s] !== o)
													if (((n = pu(o, e, t, n, r)), null === i)) {
														let u = (function XE(e, t, n) {
															const r = n ? t.classBindings : t.styleBindings;
															if (0 !== jt(r)) return e[ct(r)];
														})(e, t, r);
														void 0 !== u &&
															Array.isArray(u) &&
															((u = pu(null, e, t, u[1], r)),
															(u = Jr(u, t.attrs, r)),
															(function eb(e, t, n, r) {
																e[ct(n ? t.classBindings : t.styleBindings)] = r;
															})(e, t, r, u));
													} else
														i = (function tb(e, t, n) {
															let r;
															const o = t.directiveEnd;
															for (let i = 1 + t.directiveStylingLast; i < o; i++) r = Jr(r, e[i].hostAttrs, n);
															return Jr(r, t.attrs, n);
														})(e, t, r);
											}
											return void 0 !== i && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n;
										})(o, i, t, r)),
										(function jE(e, t, n, r, o, i) {
											let s = i ? t.classBindings : t.styleBindings,
												a = ct(s),
												u = jt(s);
											e[r] = n;
											let c,
												l = !1;
											if (Array.isArray(n)) {
												const d = n;
												(c = d[1]), (null === c || zn(d, c) > 0) && (l = !0);
											} else c = n;
											if (o)
												if (0 !== u) {
													const f = ct(e[a + 1]);
													(e[r + 1] = ui(f, a)),
														0 !== f && (e[f + 1] = Fa(e[f + 1], r)),
														(e[a + 1] = (function KC(e, t) {
															return (131071 & e) | (t << 17);
														})(e[a + 1], r));
												} else (e[r + 1] = ui(a, 0)), 0 !== a && (e[a + 1] = Fa(e[a + 1], r)), (a = r);
											else (e[r + 1] = ui(u, 0)), 0 === a ? (a = r) : (e[u + 1] = Fa(e[u + 1], r)), (u = r);
											l && (e[r + 1] = Na(e[r + 1])),
												Wh(e, c, r, !0),
												Wh(e, c, r, !1),
												(function $E(e, t, n, r, o) {
													const i = o ? e.residualClasses : e.residualStyles;
													null != i && 'string' == typeof t && zn(i, t) >= 0 && (n[r + 1] = xa(n[r + 1]));
												})(t, c, e, r, i),
												(s = ui(a, u)),
												i ? (t.classBindings = s) : (t.styleBindings = s);
										})(o, i, t, n, s, r);
								}
							})(i, e, s, r),
							t !== T &&
								Ae(o, s, t) &&
								(function op(e, t, n, r, o, i, s, a) {
									if (!(3 & t.type)) return;
									const u = e.data,
										l = u[a + 1];
									Ci(
										(function vf(e) {
											return 1 == (1 & e);
										})(l)
											? ip(u, t, n, o, jt(l), s)
											: void 0
									) ||
										(Ci(i) ||
											((function Df(e) {
												return 2 == (2 & e);
											})(l) &&
												(i = ip(u, null, n, o, a, s))),
										(function BC(e, t, n, r, o) {
											const i = oe(e);
											if (t) o ? (i ? e.addClass(n, r) : n.classList.add(r)) : i ? e.removeClass(n, r) : n.classList.remove(r);
											else {
												let s = -1 === r.indexOf('-') ? void 0 : qe.DashCase;
												if (null == o) i ? e.removeStyle(n, r, s) : n.style.removeProperty(r);
												else {
													const a = 'string' == typeof o && o.endsWith('!important');
													a && ((o = o.slice(0, -10)), (s |= qe.Important)),
														i ? e.setStyle(n, r, o, s) : n.style.setProperty(r, o, a ? 'important' : '');
												}
											}
										})(r, s, Oo(Fe(), n), o, i));
								})(
									i,
									i.data[Fe()],
									o,
									o[P],
									e,
									(o[s + 1] = (function ob(e, t) {
										return null == e || ('string' == typeof t ? (e += t) : 'object' == typeof e && (e = G(en(e)))), e;
									})(t, n)),
									r,
									s
								);
					})(e, t, null, !0),
					vi
				);
			}
			function pu(e, t, n, r, o) {
				let i = null;
				const s = n.directiveEnd;
				let a = n.directiveStylingLast;
				for (-1 === a ? (a = n.directiveStart) : a++; a < s && ((i = t[a]), (r = Jr(r, i.hostAttrs, o)), i !== e); ) a++;
				return null !== e && (n.directiveStylingLast = a), r;
			}
			function Jr(e, t, n) {
				const r = n ? 1 : 2;
				let o = -1;
				if (null !== t)
					for (let i = 0; i < t.length; i++) {
						const s = t[i];
						'number' == typeof s
							? (o = s)
							: o === r && (Array.isArray(e) || (e = void 0 === e ? [] : ['', e]), ze(e, s, !!n || t[++i]));
					}
				return void 0 === e ? null : e;
			}
			function ip(e, t, n, r, o, i) {
				const s = null === t;
				let a;
				for (; o > 0; ) {
					const u = e[o],
						l = Array.isArray(u),
						c = l ? u[1] : u,
						d = null === c;
					let f = n[o + 1];
					f === T && (f = d ? Z : void 0);
					let h = d ? na(f, r) : c === r ? f : void 0;
					if ((l && !Ci(h) && (h = na(u, r)), Ci(h) && ((a = h), s))) return a;
					const p = e[o + 1];
					o = s ? ct(p) : jt(p);
				}
				if (null !== t) {
					let u = i ? t.residualClasses : t.residualStyles;
					null != u && (a = na(u, r));
				}
				return a;
			}
			function Ci(e) {
				return void 0 !== e;
			}
			function Ce(e, t = '') {
				const n = y(),
					r = H(),
					o = e + K,
					i = r.firstCreatePass ? Jn(r, o, 1, t, null) : r.data[o],
					s = (n[o] = (function wa(e, t) {
						return oe(e) ? e.createText(t) : e.createTextNode(t);
					})(n[P], t));
				si(r, n, s, i), bt(i, !1);
			}
			function wi(e) {
				return Kr('', e, ''), wi;
			}
			function Kr(e, t, n) {
				const r = y(),
					o = rr(r, e, t, n);
				return o !== T && $t(r, Fe(), o), Kr;
			}
			function gu(e, t, n, r, o) {
				const i = y(),
					s = or(i, e, t, n, r, o);
				return s !== T && $t(i, Fe(), s), gu;
			}
			const Ei = 'en-US';
			let Ap = Ei;
			function _u(e, t, n, r, o) {
				if (((e = x(e)), Array.isArray(e))) for (let i = 0; i < e.length; i++) _u(e[i], t, n, r, o);
				else {
					const i = H(),
						s = y();
					let a = er(e) ? e : x(e.provide),
						u = Xf(e);
					const l = ge(),
						c = 1048575 & l.providerIndexes,
						d = l.directiveStart,
						f = l.providerIndexes >> 20;
					if (er(e) || !e.multi) {
						const h = new Ir(u, o, v),
							p = vu(a, t, o ? c : c + f, d);
						-1 === p
							? (qo(Sr(l, s), i, a),
							  Du(i, e, t.length),
							  t.push(a),
							  l.directiveStart++,
							  l.directiveEnd++,
							  o && (l.providerIndexes += 1048576),
							  n.push(h),
							  s.push(h))
							: ((n[p] = h), (s[p] = h));
					} else {
						const h = vu(a, t, c + f, d),
							p = vu(a, t, c, c + f),
							m = h >= 0 && n[h],
							D = p >= 0 && n[p];
						if ((o && !D) || (!o && !m)) {
							qo(Sr(l, s), i, a);
							const _ = (function EM(e, t, n, r, o) {
								const i = new Ir(e, n, v);
								return (i.multi = []), (i.index = t), (i.componentProviders = 0), Kp(i, o, r && !n), i;
							})(o ? wM : CM, n.length, o, r, u);
							!o && D && (n[p].providerFactory = _),
								Du(i, e, t.length, 0),
								t.push(a),
								l.directiveStart++,
								l.directiveEnd++,
								o && (l.providerIndexes += 1048576),
								n.push(_),
								s.push(_);
						} else Du(i, e, h > -1 ? h : p, Kp(n[o ? p : h], u, !o && r));
						!o && r && D && n[p].componentProviders++;
					}
				}
			}
			function Du(e, t, n, r) {
				const o = er(t),
					i = (function Gw(e) {
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
			function vu(e, t, n, r) {
				for (let o = n; o < r; o++) if (t[o] === e) return o;
				return -1;
			}
			function CM(e, t, n, r) {
				return Cu(this.multi, []);
			}
			function wM(e, t, n, r) {
				const o = this.multi;
				let i;
				if (this.providerFactory) {
					const s = this.providerFactory.componentProviders,
						a = Tr(n, n[1], this.providerFactory.index, r);
					(i = a.slice(0, s)), Cu(o, i);
					for (let u = s; u < a.length; u++) i.push(a[u]);
				} else (i = []), Cu(o, i);
				return i;
			}
			function Cu(e, t) {
				for (let n = 0; n < e.length; n++) t.push((0, e[n])());
				return t;
			}
			function ne(e, t = []) {
				return (n) => {
					n.providersResolver = (r, o) =>
						(function vM(e, t, n) {
							const r = H();
							if (r.firstCreatePass) {
								const o = ut(e);
								_u(n, r.data, r.blueprint, o, !0), _u(t, r.data, r.blueprint, o, !1);
							}
						})(r, o ? o(e) : e, t);
				};
			}
			class Yp {}
			class IM {
				resolveComponentFactory(t) {
					throw (function MM(e) {
						const t = Error(`No component factory found for ${G(e)}. Did you add it to @NgModule.entryComponents?`);
						return (t.ngComponent = e), t;
					})(t);
				}
			}
			let Si = (() => {
				class e {}
				return (e.NULL = new IM()), e;
			})();
			function AM() {
				return gr(ge(), y());
			}
			function gr(e, t) {
				return new gt(Xe(e, t));
			}
			let gt = (() => {
				class e {
					constructor(n) {
						this.nativeElement = n;
					}
				}
				return (e.__NG_ELEMENT_ID__ = AM), e;
			})();
			class eg {}
			let Mn = (() => {
					class e {}
					return (
						(e.__NG_ELEMENT_ID__ = () =>
							(function NM() {
								const e = y(),
									n = Ge(ge().index, e);
								return (function TM(e) {
									return e[P];
								})(Et(n) ? n : e);
							})()),
						e
					);
				})(),
				FM = (() => {
					class e {}
					return (e.ɵprov = $({ token: e, providedIn: 'root', factory: () => null })), e;
				})();
			class Ti {
				constructor(t) {
					(this.full = t),
						(this.major = t.split('.')[0]),
						(this.minor = t.split('.')[1]),
						(this.patch = t.split('.').slice(2).join('.'));
				}
			}
			const xM = new Ti('13.2.7'),
				wu = {};
			function Ni(e, t, n, r, o = !1) {
				for (; null !== n; ) {
					const i = t[n.index];
					if ((null !== i && r.push(le(i)), at(i)))
						for (let a = 10; a < i.length; a++) {
							const u = i[a],
								l = u[1].firstChild;
							null !== l && Ni(u[1], u, l, r);
						}
					const s = n.type;
					if (8 & s) Ni(e, t, n.child, r);
					else if (32 & s) {
						const a = Da(n, t);
						let u;
						for (; (u = a()); ) r.push(u);
					} else if (16 & s) {
						const a = uf(t, n);
						if (Array.isArray(a)) r.push(...a);
						else {
							const u = $r(t[16]);
							Ni(u[1], u, a, r, !0);
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
					return Ni(n, t, n.firstChild, []);
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
							r > -1 && (ba(t, r), Qo(n, r));
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
					Wa(this._cdRefInjectingView || this._lView);
				}
				detach() {
					this._lView[2] &= -129;
				}
				reattach() {
					this._lView[2] |= 128;
				}
				detectChanges() {
					Za(this._lView[1], this._lView, this.context);
				}
				checkNoChanges() {
					!(function Pw(e, t, n) {
						Vo(!0);
						try {
							Za(e, t, n);
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
						(function TC(e, t) {
							Ur(e, t, t[P], 2, null, null);
						})(this._lView[1], this._lView);
				}
				attachToAppRef(t) {
					if (this._attachedToViewContainer) throw new B(902, '');
					this._appRef = t;
				}
			}
			class PM extends no {
				constructor(t) {
					super(t), (this._view = t);
				}
				detectChanges() {
					Uf(this._view);
				}
				checkNoChanges() {
					!(function Ow(e) {
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
			class tg extends Si {
				constructor(t) {
					super(), (this.ngModule = t);
				}
				resolveComponentFactory(t) {
					const n = Ee(t);
					return new Eu(n, this.ngModule);
				}
			}
			function ng(e) {
				const t = [];
				for (let n in e) e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
				return t;
			}
			class Eu extends Yp {
				constructor(t, n) {
					super(),
						(this.componentDef = t),
						(this.ngModule = n),
						(this.componentType = t.type),
						(this.selector = (function ZC(e) {
							return e.map(QC).join(',');
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
							? (function RM(e, t) {
									return {
										get: (n, r, o) => {
											const i = e.get(n, wu, o);
											return i !== wu || r === wu ? i : t.get(n, r, o);
										},
									};
							  })(t, o.injector)
							: t,
						s = i.get(eg, $c),
						a = i.get(FM, null),
						u = s.createRenderer(null, this.componentDef),
						l = this.componentDef.selectors[0][0] || 'div',
						c = r
							? (function Pf(e, t, n) {
									if (oe(e)) return e.selectRootElement(t, n === Ct.ShadowDom);
									let r = 'string' == typeof t ? e.querySelector(t) : t;
									return (r.textContent = ''), r;
							  })(u, r, this.componentDef.encapsulation)
							: Ea(
									s.createRenderer(null, this.componentDef),
									l,
									(function OM(e) {
										const t = e.toLowerCase();
										return 'svg' === t ? 'svg' : 'math' === t ? 'math' : null;
									})(l)
							  ),
						d = this.componentDef.onPush ? 576 : 528,
						f = (function dh(e, t) {
							return { components: [], scheduler: e || CC, clean: Rw, playerHandler: t || null, flags: 0 };
						})(),
						h = di(0, null, null, 1, 0, null, null, null, null, null),
						p = Gr(null, h, f, d, null, null, s, u, a, i);
					let m, D;
					ko(p);
					try {
						const _ = (function lh(e, t, n, r, o, i) {
							const s = n[1];
							n[20] = e;
							const u = Jn(s, 20, 2, '#host', null),
								l = (u.mergedAttrs = t.hostAttrs);
							null !== l &&
								(hi(u, l, !0),
								null !== e && ($o(o, e, l), null !== u.classes && Ta(o, e, u.classes), null !== u.styles && df(o, e, u.styles)));
							const c = r.createRenderer(e, t),
								d = Gr(n, Ff(t), null, t.onPush ? 64 : 16, n[20], u, r, c, i || null, null);
							return s.firstCreatePass && (qo(Sr(u, n), s, t.type), Bf(s, u), Hf(u, n.length, 1)), fi(n, d), (n[20] = d);
						})(c, this.componentDef, p, s, u);
						if (c)
							if (r) $o(u, c, ['ng-version', xM.full]);
							else {
								const { attrs: g, classes: E } = (function JC(e) {
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
								g && $o(u, c, g), E && E.length > 0 && Ta(u, c, E.join(' '));
							}
						if (((D = Ls(h, K)), void 0 !== n)) {
							const g = (D.projection = []);
							for (let E = 0; E < this.ngContentSelectors.length; E++) {
								const F = n[E];
								g.push(null != F ? Array.from(F) : null);
							}
						}
						(m = (function ch(e, t, n, r, o) {
							const i = n[1],
								s = (function yw(e, t, n) {
									const r = ge();
									e.firstCreatePass && (n.providersResolver && n.providersResolver(n), jf(e, r, t, Kn(e, t, 1, null), n));
									const o = Tr(t, e, r.directiveStart, r);
									Ie(o, t);
									const i = Xe(r, t);
									return i && Ie(i, t), o;
								})(i, n, t);
							if ((r.components.push(s), (e[8] = s), o && o.forEach((u) => u(s, t)), t.contentQueries)) {
								const u = ge();
								t.contentQueries(1, s, u.directiveStart);
							}
							const a = ge();
							return (
								!i.firstCreatePass ||
									(null === t.hostBindings && null === t.hostAttrs) ||
									(Yt(a.index), kf(n[1], a, 0, a.directiveStart, a.directiveEnd, t), Lf(t, s)),
								s
							);
						})(_, this.componentDef, p, f, [tE])),
							zr(h, p, null);
					} finally {
						Lo();
					}
					return new kM(this.componentType, m, gr(D, p), p, D);
				}
			}
			class kM extends class bM {} {
				constructor(t, n, r, o, i) {
					super(),
						(this.location = r),
						(this._rootLView = o),
						(this._tNode = i),
						(this.instance = n),
						(this.hostView = this.changeDetectorRef = new PM(o)),
						(this.componentType = t);
				}
				get injector() {
					return new Hn(this._tNode, this._rootLView);
				}
				destroy() {
					this.hostView.destroy();
				}
				onDestroy(t) {
					this.hostView.onDestroy(t);
				}
			}
			class mr {}
			const yr = new Map();
			class ig extends mr {
				constructor(t, n) {
					super(),
						(this._parent = n),
						(this._bootstrapComponents = []),
						(this.injector = this),
						(this.destroyCbs = []),
						(this.componentFactoryResolver = new tg(this));
					const r = Je(t);
					(this._bootstrapComponents = At(r.bootstrap)),
						(this._r3Injector = Yf(
							t,
							n,
							[
								{ provide: mr, useValue: this },
								{ provide: Si, useValue: this.componentFactoryResolver },
							],
							G(t)
						)),
						this._r3Injector._resolveInjectorDefTypes(),
						(this.instance = this.get(t));
				}
				get(t, n = Qe.THROW_IF_NOT_FOUND, r = N.Default) {
					return t === Qe || t === mr || t === Ka ? this : this._r3Injector.get(t, n, r);
				}
				destroy() {
					const t = this._r3Injector;
					!t.destroyed && t.destroy(), this.destroyCbs.forEach((n) => n()), (this.destroyCbs = null);
				}
				onDestroy(t) {
					this.destroyCbs.push(t);
				}
			}
			class bu extends class BM {} {
				constructor(t) {
					super(),
						(this.moduleType = t),
						null !== Je(t) &&
							(function HM(e) {
								const t = new Set();
								!(function n(r) {
									const o = Je(r, !0),
										i = o.id;
									null !== i &&
										((function rg(e, t, n) {
											if (t && t !== n) throw new Error(`Duplicate module registered for ${e} - ${G(t)} vs ${G(t.name)}`);
										})(i, yr.get(i), r),
										yr.set(i, r));
									const s = At(o.imports);
									for (const a of s) t.has(a) || (t.add(a), n(a));
								})(e);
							})(t);
				}
				create(t) {
					return new ig(this.moduleType, t);
				}
			}
			function Mu(e, t, n, r) {
				return (function sg(e, t, n, r, o, i) {
					const s = t + n;
					return Ae(e, s, o)
						? (function Tt(e, t, n) {
								return (e[t] = n);
						  })(e, s + 1, i ? r.call(i, o) : r(o))
						: (function ro(e, t) {
								const n = e[t];
								return n === T ? void 0 : n;
						  })(e, s + 1);
				})(
					y(),
					(function Ne() {
						const e = I.lFrame;
						let t = e.bindingRootIndex;
						return -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
					})(),
					e,
					t,
					n,
					r
				);
			}
			function Iu(e) {
				return (t) => {
					setTimeout(e, void 0, t);
				};
			}
			const _e = class r0 extends ms {
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
					return t instanceof vt && t.add(c), c;
				}
			};
			Symbol;
			let zt = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = u0), e;
			})();
			const s0 = zt,
				a0 = class extends s0 {
					constructor(t, n, r) {
						super(), (this._declarationLView = t), (this._declarationTContainer = n), (this.elementRef = r);
					}
					createEmbeddedView(t) {
						const n = this._declarationTContainer.tViews,
							r = Gr(this._declarationLView, n, t, 16, null, n.declTNode, null, null, null, null);
						r[17] = this._declarationLView[this._declarationTContainer.index];
						const i = this._declarationLView[19];
						return null !== i && (r[19] = i.createEmbeddedView(n)), zr(n, r, t), new no(r);
					}
				};
			function u0() {
				return (function Fi(e, t) {
					return 4 & e.type ? new a0(t, e, gr(e, t)) : null;
				})(ge(), y());
			}
			let xt = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = l0), e;
			})();
			function l0() {
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
							wn(
								i,
								ii(i, s),
								o,
								(function VC(e, t) {
									return oe(e) ? e.nextSibling(t) : t.nextSibling;
								})(i, s),
								!1
							);
						}
						(t[e.index] = n = $f(r, t, o, e)), fi(t, n);
					}
					return new dg(n, e, t);
				})(ge(), y());
			}
			const c0 = xt,
				dg = class extends c0 {
					constructor(t, n, r) {
						super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r);
					}
					get element() {
						return gr(this._hostTNode, this._hostLView);
					}
					get injector() {
						return new Hn(this._hostTNode, this._hostLView);
					}
					get parentInjector() {
						const t = zo(this._hostTNode, this._hostLView);
						if (id(t)) {
							const n = Bn(t, this._hostLView),
								r = Ln(t);
							return new Hn(n[1].data[r + 8], n);
						}
						return new Hn(null, this._hostLView);
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
							!(function Fr(e) {
								return 'function' == typeof e;
							})(t);
						let a;
						if (s) a = n;
						else {
							const d = n || {};
							(a = d.index), (r = d.injector), (o = d.projectableNodes), (i = d.ngModuleRef);
						}
						const u = s ? t : new Eu(Ee(t)),
							l = r || this.parentInjector;
						if (!i && null == u.ngModule) {
							const f = (s ? l : this.parentInjector).get(mr, null);
							f && (i = f);
						}
						const c = u.create(l, o, void 0, i);
						return this.insert(c.hostView, a), c;
					}
					insert(t, n) {
						const r = t._lView,
							o = r[1];
						if (
							(function AD(e) {
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
						!(function FC(e, t, n, r) {
							const o = 10 + r,
								i = n.length;
							r > 0 && (n[o - 1][4] = t), r < i - 10 ? ((t[4] = n[o]), gd(n, 10 + r, t)) : (n.push(t), (t[4] = null)), (t[3] = n);
							const s = t[17];
							null !== s &&
								n !== s &&
								(function xC(e, t) {
									const n = e[9];
									t[16] !== t[3][3][16] && (e[2] = !0), null === n ? (e[9] = [t]) : n.push(t);
								})(s, t);
							const a = t[19];
							null !== a && a.insertView(e), (t[2] |= 128);
						})(o, r, s, i);
						const a = Aa(i, s),
							u = r[P],
							l = ii(u, s[7]);
						return (
							null !== l &&
								(function SC(e, t, n, r, o, i) {
									(r[0] = o), (r[6] = t), Ur(e, r, n, 1, o, i);
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
							r = ba(this._lContainer, n);
						r && (Qo(Su(this._lContainer), n), Yd(r[1], r));
					}
					detach(t) {
						const n = this._adjustIndex(t, -1),
							r = ba(this._lContainer, n);
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
			function Oi(...e) {}
			const Rg = new L('Application Initializer');
			let Bu = (() => {
				class e {
					constructor(n) {
						(this.appInits = n),
							(this.resolve = Oi),
							(this.reject = Oi),
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
								if (Di(i)) n.push(i);
								else if (Rh(i)) {
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
				Ri = new L('Platform ID'),
				H0 = new L('appBootstrapListener');
			let j0 = (() => {
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
			const rn = new L('LocaleId', {
					providedIn: 'root',
					factory: () =>
						_v(rn, N.Optional | N.SkipSelf) ||
						(function $0() {
							return ('undefined' != typeof $localize && $localize.locale) || Ei;
						})(),
				}),
				q0 = (() => Promise.resolve(0))();
			function ju(e) {
				'undefined' == typeof Zone
					? q0.then(() => {
							e && e.apply(null, null);
					  })
					: Zone.current.scheduleMicroTask('scheduleMicrotask', e);
			}
			class Be {
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
						(o.nativeRequestAnimationFrame = (function W0() {
							let e = W.requestAnimationFrame,
								t = W.cancelAnimationFrame;
							if ('undefined' != typeof Zone && e && t) {
								const n = e[Zone.__symbol__('OriginalDelegate')];
								n && (e = n);
								const r = t[Zone.__symbol__('OriginalDelegate')];
								r && (t = r);
							}
							return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: t };
						})().nativeRequestAnimationFrame),
						(function J0(e) {
							const t = () => {
								!(function Z0(e) {
									e.isCheckStableRunning ||
										-1 !== e.lastRequestAnimationFrameId ||
										((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(W, () => {
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
					if (!Be.isInAngularZone()) throw new Error('Expected to be in Angular Zone, but it is not!');
				}
				static assertNotInAngularZone() {
					if (Be.isInAngularZone()) throw new Error('Expected to not be in Angular Zone, but it is!');
				}
				run(t, n, r) {
					return this._inner.run(t, n, r);
				}
				runTask(t, n, r, o) {
					const i = this._inner,
						s = i.scheduleEventTask('NgZoneEvent: ' + o, t, Q0, Oi, Oi);
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
			const Q0 = {};
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
			class K0 {
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
											Be.assertNotInAngularZone(),
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
							return new (n || e)(V(Be));
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
			class Y0 {
				addToWindow(t) {}
				findTestabilityInTree(t, n, r) {
					return null;
				}
			}
			let mt,
				zu = new Y0();
			const jg = new L('AllowMultipleToken');
			function $g(e, t, n = []) {
				const r = `Platform: ${t}`,
					o = new L(r);
				return (i = []) => {
					let s = Ug();
					if (!s || s.injector.get(jg, !1))
						if (e) e(n.concat(i).concat({ provide: o, useValue: !0 }));
						else {
							const a = n.concat(i).concat({ provide: o, useValue: !0 }, { provide: Ya, useValue: 'platform' });
							!(function nI(e) {
								if (mt && !mt.destroyed && !mt.injector.get(jg, !1)) throw new B(400, '');
								mt = e.get(Gg);
								const t = e.get(kg, null);
								t && t.forEach((n) => n());
							})(Qe.create({ providers: a, name: r }));
						}
					return (function rI(e) {
						const t = Ug();
						if (!t) throw new B(401, '');
						return t;
					})();
				};
			}
			function Ug() {
				return mt && !mt.destroyed ? mt : null;
			}
			let Gg = (() => {
				class e {
					constructor(n) {
						(this._injector = n), (this._modules = []), (this._destroyListeners = []), (this._destroyed = !1);
					}
					bootstrapModuleFactory(n, r) {
						const a = (function oI(e, t) {
								let n;
								return (
									(n =
										'noop' === e
											? new K0()
											: ('zone.js' === e ? void 0 : e) ||
											  new Be({
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
							u = [{ provide: Be, useValue: a }];
						return a.run(() => {
							const l = Qe.create({ providers: u, parent: this.injector, name: n.moduleType.name }),
								c = n.create(l),
								d = c.injector.get(jr, null);
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
								(function iI(e, t, n) {
									try {
										const r = n();
										return Di(r)
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
												(function Tb(e) {
													$e(e, 'Expected localeId to be defined'),
														'string' == typeof e && (Ap = e.toLowerCase().replace(/_/g, '-'));
												})(c.injector.get(rn, Ei) || Ei),
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
						return (function eI(e, t, n) {
							const r = new bu(n);
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
						return new (n || e)(V(Qe));
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
						const a = new we((l) => {
								(this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks),
									this._zone.runOutsideAngular(() => {
										l.next(this._stable), l.complete();
									});
							}),
							u = new we((l) => {
								let c;
								this._zone.runOutsideAngular(() => {
									c = this._zone.onStable.subscribe(() => {
										Be.assertNotInAngularZone(),
											ju(() => {
												!this._stable &&
													!this._zone.hasPendingMacrotasks &&
													!this._zone.hasPendingMicrotasks &&
													((this._stable = !0), l.next(!0));
											});
									});
								});
								const d = this._zone.onUnstable.subscribe(() => {
									Be.assertInAngularZone(),
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
						this.isStable = (function z_(...e) {
							const t = bc(e),
								n = (function L_(e, t) {
									return 'number' == typeof Ds(e) ? e.pop() : t;
								})(e, 1 / 0),
								r = e;
							return r.length
								? 1 === r.length
									? mn(r[0])
									: (function O_(e = 1 / 0) {
											return bo(ac, e);
									  })(n)(Mo(r, t))
								: _s;
						})(
							a,
							u.pipe(
								(function W_(e = {}) {
									const {
										connector: t = () => new ms(),
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
										return fn((m, D) => {
											l++, !d && !c && f();
											const _ = (u = null != u ? u : t());
											D.add(() => {
												l--, 0 === l && !d && !c && (a = vs(p, o));
											}),
												_.subscribe(D),
												s ||
													((s = new wo({
														next: (g) => _.next(g),
														error: (g) => {
															(d = !0), f(), (a = vs(h, n, g)), _.error(g);
														},
														complete: () => {
															(c = !0), f(), (a = vs(h, r)), _.complete();
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
						const i = (function tI(e) {
								return e.isBoundToModule;
							})(o)
								? void 0
								: this._injector.get(mr),
							a = o.create(Qe.NULL, [], r || o.selector, i),
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
								.get(H0, [])
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
						return new (n || e)(V(Be), V(Qe), V(jr), V(Si), V(Bu));
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
					return (e.__NG_ELEMENT_ID__ = uI), e;
				})();
			function uI(e) {
				return (function lI(e, t, n) {
					if (xo(e) && !n) {
						const r = Ge(e.index, t);
						return new no(r, r);
					}
					return 47 & e.type ? new no(t[16], t) : null;
				})(ge(), y(), 16 == (16 & e));
			}
			class em {
				constructor() {}
				supports(t) {
					return Wr(t);
				}
				create(t) {
					return new gI(t);
				}
			}
			const pI = (e, t) => t;
			class gI {
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
						(this._trackByFn = t || pI);
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
					if ((null == t && (t = []), !Wr(t))) throw new B(900, '');
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
							(function dE(e, t) {
								if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
								else {
									const n = e[tr()]();
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
							: (t = this._addAfter(new mI(n, r), i, o)),
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
			class mI {
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
			class yI {
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
					r || ((r = new yI()), this.map.set(n, r)), r.add(t);
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
			class rm {
				constructor() {}
				supports(t) {
					return t instanceof Map || ou(t);
				}
				create() {
					return new _I();
				}
			}
			class _I {
				constructor() {
					(this._records = new Map()),
						(this._mapHead = null),
						(this._appendAfter = null),
						(this._previousMapHead = null),
						(this._changesHead = null),
						(this._changesTail = null),
						(this._additionsHead = null),
						(this._additionsTail = null),
						(this._removalsHead = null),
						(this._removalsTail = null);
				}
				get isDirty() {
					return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead;
				}
				forEachItem(t) {
					let n;
					for (n = this._mapHead; null !== n; n = n._next) t(n);
				}
				forEachPreviousItem(t) {
					let n;
					for (n = this._previousMapHead; null !== n; n = n._nextPrevious) t(n);
				}
				forEachChangedItem(t) {
					let n;
					for (n = this._changesHead; null !== n; n = n._nextChanged) t(n);
				}
				forEachAddedItem(t) {
					let n;
					for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
				}
				forEachRemovedItem(t) {
					let n;
					for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
				}
				diff(t) {
					if (t) {
						if (!(t instanceof Map || ou(t))) throw new B(900, '');
					} else t = new Map();
					return this.check(t) ? this : null;
				}
				onDestroy() {}
				check(t) {
					this._reset();
					let n = this._mapHead;
					if (
						((this._appendAfter = null),
						this._forEach(t, (r, o) => {
							if (n && n.key === o) this._maybeAddToChanges(n, r), (this._appendAfter = n), (n = n._next);
							else {
								const i = this._getOrCreateRecordForKey(o, r);
								n = this._insertBeforeOrAppend(n, i);
							}
						}),
						n)
					) {
						n._prev && (n._prev._next = null), (this._removalsHead = n);
						for (let r = n; null !== r; r = r._nextRemoved)
							r === this._mapHead && (this._mapHead = null),
								this._records.delete(r.key),
								(r._nextRemoved = r._next),
								(r.previousValue = r.currentValue),
								(r.currentValue = null),
								(r._prev = null),
								(r._next = null);
					}
					return (
						this._changesTail && (this._changesTail._nextChanged = null),
						this._additionsTail && (this._additionsTail._nextAdded = null),
						this.isDirty
					);
				}
				_insertBeforeOrAppend(t, n) {
					if (t) {
						const r = t._prev;
						return (
							(n._next = t),
							(n._prev = r),
							(t._prev = n),
							r && (r._next = n),
							t === this._mapHead && (this._mapHead = n),
							(this._appendAfter = t),
							t
						);
					}
					return (
						this._appendAfter ? ((this._appendAfter._next = n), (n._prev = this._appendAfter)) : (this._mapHead = n),
						(this._appendAfter = n),
						null
					);
				}
				_getOrCreateRecordForKey(t, n) {
					if (this._records.has(t)) {
						const o = this._records.get(t);
						this._maybeAddToChanges(o, n);
						const i = o._prev,
							s = o._next;
						return i && (i._next = s), s && (s._prev = i), (o._next = null), (o._prev = null), o;
					}
					const r = new DI(t);
					return this._records.set(t, r), (r.currentValue = n), this._addToAdditions(r), r;
				}
				_reset() {
					if (this.isDirty) {
						let t;
						for (this._previousMapHead = this._mapHead, t = this._previousMapHead; null !== t; t = t._next)
							t._nextPrevious = t._next;
						for (t = this._changesHead; null !== t; t = t._nextChanged) t.previousValue = t.currentValue;
						for (t = this._additionsHead; null != t; t = t._nextAdded) t.previousValue = t.currentValue;
						(this._changesHead = this._changesTail = null),
							(this._additionsHead = this._additionsTail = null),
							(this._removalsHead = null);
					}
				}
				_maybeAddToChanges(t, n) {
					Object.is(n, t.currentValue) || ((t.previousValue = t.currentValue), (t.currentValue = n), this._addToChanges(t));
				}
				_addToAdditions(t) {
					null === this._additionsHead
						? (this._additionsHead = this._additionsTail = t)
						: ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
				}
				_addToChanges(t) {
					null === this._changesHead
						? (this._changesHead = this._changesTail = t)
						: ((this._changesTail._nextChanged = t), (this._changesTail = t));
				}
				_forEach(t, n) {
					t instanceof Map ? t.forEach(n) : Object.keys(t).forEach((r) => n(t[r], r));
				}
			}
			class DI {
				constructor(t) {
					(this.key = t),
						(this.previousValue = null),
						(this.currentValue = null),
						(this._nextPrevious = null),
						(this._next = null),
						(this._prev = null),
						(this._nextAdded = null),
						(this._nextRemoved = null),
						(this._nextChanged = null);
				}
			}
			function om() {
				return new Li([new em()]);
			}
			let Li = (() => {
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
			function im() {
				return new ao([new rm()]);
			}
			let ao = (() => {
				class e {
					constructor(n) {
						this.factories = n;
					}
					static create(n, r) {
						if (r) {
							const o = r.factories.slice();
							n = n.concat(o);
						}
						return new e(n);
					}
					static extend(n) {
						return { provide: e, useFactory: (r) => e.create(n, r || im()), deps: [[e, new Yo(), new Ko()]] };
					}
					find(n) {
						const r = this.factories.find((i) => i.supports(n));
						if (r) return r;
						throw new B(901, '');
					}
				}
				return (e.ɵprov = $({ token: e, providedIn: 'root', factory: im })), e;
			})();
			const wI = $g(null, 'core', [
				{ provide: Ri, useValue: 'unknown' },
				{ provide: Gg, deps: [Qe] },
				{ provide: Hg, deps: [] },
				{ provide: j0, deps: [] },
			]);
			let EI = (() => {
					class e {
						constructor(n) {}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(qg));
						}),
						(e.ɵmod = wt({ type: e })),
						(e.ɵinj = ot({})),
						e
					);
				})(),
				Bi = null;
			function An() {
				return Bi;
			}
			const yt = new L('DocumentToken');
			function mm(e, t) {
				t = encodeURIComponent(t);
				for (const n of e.split(';')) {
					const r = n.indexOf('='),
						[o, i] = -1 == r ? [n, ''] : [n.slice(0, r), n.slice(r + 1)];
					if (o.trim() === t) return decodeURIComponent(i);
				}
				return null;
			}
			class pA {
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
			let ym = (() => {
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
								r.createEmbeddedView(this._template, new pA(o.item, this._ngForOf, -1, -1), null === s ? void 0 : s);
							else if (null == s) r.remove(null === i ? void 0 : i);
							else if (null !== i) {
								const a = r.get(i);
								r.move(a, s), _m(a, o);
							}
						});
						for (let o = 0, i = r.length; o < i; o++) {
							const a = r.get(o).context;
							(a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
						}
						n.forEachIdentityChange((o) => {
							_m(r.get(o.currentIndex), o);
						});
					}
					static ngTemplateContextGuard(n, r) {
						return !0;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(v(xt), v(zt), v(Li));
					}),
					(e.ɵdir = S({
						type: e,
						selectors: [['', 'ngFor', '', 'ngForOf', '']],
						inputs: { ngForOf: 'ngForOf', ngForTrackBy: 'ngForTrackBy', ngForTemplate: 'ngForTemplate' },
					})),
					e
				);
			})();
			function _m(e, t) {
				e.context.$implicit = t.item;
			}
			let Dm = (() => {
				class e {
					constructor(n, r) {
						(this._viewContainer = n),
							(this._context = new gA()),
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
						vm('ngIfThen', n), (this._thenTemplateRef = n), (this._thenViewRef = null), this._updateView();
					}
					set ngIfElse(n) {
						vm('ngIfElse', n), (this._elseTemplateRef = n), (this._elseViewRef = null), this._updateView();
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
						return new (n || e)(v(xt), v(zt));
					}),
					(e.ɵdir = S({
						type: e,
						selectors: [['', 'ngIf', '']],
						inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
					})),
					e
				);
			})();
			class gA {
				constructor() {
					(this.$implicit = null), (this.ngIf = null);
				}
			}
			function vm(e, t) {
				if (t && !t.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${G(t)}'.`);
			}
			let wm = (() => {
					class e {
						constructor(n, r, o) {
							(this._ngEl = n), (this._differs = r), (this._renderer = o), (this._ngStyle = null), (this._differ = null);
						}
						set ngStyle(n) {
							(this._ngStyle = n), !this._differ && n && (this._differ = this._differs.find(n).create());
						}
						ngDoCheck() {
							if (this._differ) {
								const n = this._differ.diff(this._ngStyle);
								n && this._applyChanges(n);
							}
						}
						_setStyle(n, r) {
							const [o, i] = n.split('.');
							null != (r = null != r && i ? `${r}${i}` : r)
								? this._renderer.setStyle(this._ngEl.nativeElement, o, r)
								: this._renderer.removeStyle(this._ngEl.nativeElement, o);
						}
						_applyChanges(n) {
							n.forEachRemovedItem((r) => this._setStyle(r.key, null)),
								n.forEachAddedItem((r) => this._setStyle(r.key, r.currentValue)),
								n.forEachChangedItem((r) => this._setStyle(r.key, r.currentValue));
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(gt), v(ao), v(Mn));
						}),
						(e.ɵdir = S({ type: e, selectors: [['', 'ngStyle', '']], inputs: { ngStyle: 'ngStyle' } })),
						e
					);
				})(),
				jA = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = wt({ type: e })),
						(e.ɵinj = ot({})),
						e
					);
				})();
			class Im {}
			class cl extends class qA extends class II {} {
				constructor() {
					super(...arguments), (this.supportsDOMEvents = !0);
				}
			} {
				static makeCurrent() {
					!(function MI(e) {
						Bi || (Bi = e);
					})(new cl());
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
					const n = (function WA() {
						return (co = co || document.querySelector('base')), co ? co.getAttribute('href') : null;
					})();
					return null == n
						? null
						: (function QA(e) {
								(Zi = Zi || document.createElement('a')), Zi.setAttribute('href', e);
								const t = Zi.pathname;
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
			let Zi,
				co = null;
			const Am = new L('TRANSITION_ID'),
				JA = [
					{
						provide: Rg,
						useFactory: function ZA(e, t, n) {
							return () => {
								n.get(Bu).donePromise.then(() => {
									const r = An(),
										o = t.querySelectorAll(`style[ng-transition="${e}"]`);
									for (let i = 0; i < o.length; i++) r.remove(o[i]);
								});
							};
						},
						deps: [Am, yt, Qe],
						multi: !0,
					},
				];
			class dl {
				static init() {
					!(function X0(e) {
						zu = e;
					})(new dl());
				}
				addToWindow(t) {
					(W.getAngularTestability = (r, o = !0) => {
						const i = t.findTestabilityInTree(r, o);
						if (null == i) throw new Error('Could not find testability for element.');
						return i;
					}),
						(W.getAllAngularTestabilities = () => t.getAllTestabilities()),
						(W.getAllAngularRootElements = () => t.getAllRootElements()),
						W.frameworkStabilizers || (W.frameworkStabilizers = []),
						W.frameworkStabilizers.push((r) => {
							const o = W.getAllAngularTestabilities();
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
						? An().isShadowRoot(n)
							? this.findTestabilityInTree(t, n.host, !0)
							: this.findTestabilityInTree(t, n.parentElement, !0)
						: null;
				}
			}
			let KA = (() => {
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
			const Ji = new L('EventManagerPlugins');
			let Ki = (() => {
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
						return new (n || e)(V(Ji), V(Be));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class Sm {
				constructor(t) {
					this._doc = t;
				}
				addGlobalEventListener(t, n, r) {
					const o = An().getGlobalEventTarget(this._doc, t);
					if (!o) throw new Error(`Unsupported event target ${o} for event ${n}`);
					return this.addEventListener(o, n, r);
				}
			}
			let Tm = (() => {
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
					class e extends Tm {
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
							r && r.forEach(Nm), this._hostNodes.delete(n);
						}
						onStylesAdded(n) {
							this._hostNodes.forEach((r, o) => {
								this._addStylesToHost(n, o, r);
							});
						}
						ngOnDestroy() {
							this._hostNodes.forEach((n) => n.forEach(Nm));
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(yt));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})();
			function Nm(e) {
				An().remove(e);
			}
			const fl = {
					svg: 'http://www.w3.org/2000/svg',
					xhtml: 'http://www.w3.org/1999/xhtml',
					xlink: 'http://www.w3.org/1999/xlink',
					xml: 'http://www.w3.org/XML/1998/namespace',
					xmlns: 'http://www.w3.org/2000/xmlns/',
					math: 'http://www.w3.org/1998/MathML/',
				},
				hl = /%COMP%/g;
			function Yi(e, t, n) {
				for (let r = 0; r < t.length; r++) {
					let o = t[r];
					Array.isArray(o) ? Yi(e, o, n) : ((o = o.replace(hl, e)), n.push(o));
				}
				return n;
			}
			function Pm(e) {
				return (t) => {
					if ('__ngUnwrap__' === t) return e;
					!1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
				};
			}
			let pl = (() => {
				class e {
					constructor(n, r, o) {
						(this.eventManager = n),
							(this.sharedStylesHost = r),
							(this.appId = o),
							(this.rendererByCompId = new Map()),
							(this.defaultRenderer = new gl(n));
					}
					createRenderer(n, r) {
						if (!n || !r) return this.defaultRenderer;
						switch (r.encapsulation) {
							case Ct.Emulated: {
								let o = this.rendererByCompId.get(r.id);
								return (
									o ||
										((o = new rS(this.eventManager, this.sharedStylesHost, r, this.appId)), this.rendererByCompId.set(r.id, o)),
									o.applyToHost(n),
									o
								);
							}
							case 1:
							case Ct.ShadowDom:
								return new oS(this.eventManager, this.sharedStylesHost, n, r);
							default:
								if (!this.rendererByCompId.has(r.id)) {
									const o = Yi(r.id, r.styles, []);
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
						return new (n || e)(V(Ki), V(fo), V(so));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class gl {
				constructor(t) {
					(this.eventManager = t), (this.data = Object.create(null)), (this.destroyNode = null);
				}
				destroy() {}
				createElement(t, n) {
					return n ? document.createElementNS(fl[n] || n, t) : document.createElement(t);
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
						const i = fl[o];
						i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
					} else t.setAttribute(n, r);
				}
				removeAttribute(t, n, r) {
					if (r) {
						const o = fl[r];
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
					o & (qe.DashCase | qe.Important) ? t.style.setProperty(n, r, o & qe.Important ? 'important' : '') : (t.style[n] = r);
				}
				removeStyle(t, n, r) {
					r & qe.DashCase ? t.style.removeProperty(n) : (t.style[n] = '');
				}
				setProperty(t, n, r) {
					t[n] = r;
				}
				setValue(t, n) {
					t.nodeValue = n;
				}
				listen(t, n, r) {
					return 'string' == typeof t
						? this.eventManager.addGlobalEventListener(t, n, Pm(r))
						: this.eventManager.addEventListener(t, n, Pm(r));
				}
			}
			class rS extends gl {
				constructor(t, n, r, o) {
					super(t), (this.component = r);
					const i = Yi(o + '-' + r.id, r.styles, []);
					n.addStyles(i),
						(this.contentAttr = (function eS(e) {
							return '_ngcontent-%COMP%'.replace(hl, e);
						})(o + '-' + r.id)),
						(this.hostAttr = (function tS(e) {
							return '_nghost-%COMP%'.replace(hl, e);
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
			class oS extends gl {
				constructor(t, n, r, o) {
					super(t),
						(this.sharedStylesHost = n),
						(this.hostEl = r),
						(this.shadowRoot = r.attachShadow({ mode: 'open' })),
						this.sharedStylesHost.addHost(this.shadowRoot);
					const i = Yi(o.id, o.styles, []);
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
			let iS = (() => {
				class e extends Sm {
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
						return new (n || e)(V(yt));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const Rm = ['alt', 'control', 'meta', 'shift'],
				aS = {
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
				Vm = {
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
				uS = { alt: (e) => e.altKey, control: (e) => e.ctrlKey, meta: (e) => e.metaKey, shift: (e) => e.shiftKey };
			let lS = (() => {
				class e extends Sm {
					constructor(n) {
						super(n);
					}
					supports(n) {
						return null != e.parseEventName(n);
					}
					addEventListener(n, r, o) {
						const i = e.parseEventName(r),
							s = e.eventCallback(i.fullKey, o, this.manager.getZone());
						return this.manager.getZone().runOutsideAngular(() => An().onAndCancel(n, i.domEventName, s));
					}
					static parseEventName(n) {
						const r = n.toLowerCase().split('.'),
							o = r.shift();
						if (0 === r.length || ('keydown' !== o && 'keyup' !== o)) return null;
						const i = e._normalizeKey(r.pop());
						let s = '';
						if (
							(Rm.forEach((u) => {
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
							o = (function cS(e) {
								let t = e.key;
								if (null == t) {
									if (((t = e.keyIdentifier), null == t)) return 'Unidentified';
									t.startsWith('U+') &&
										((t = String.fromCharCode(parseInt(t.substring(2), 16))),
										3 === e.location && Vm.hasOwnProperty(t) && (t = Vm[t]));
								}
								return aS[t] || t;
							})(n);
						return (
							(o = o.toLowerCase()),
							' ' === o ? (o = 'space') : '.' === o && (o = 'dot'),
							Rm.forEach((i) => {
								i != o && uS[i](n) && (r += i + '.');
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
						return new (n || e)(V(yt));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const pS = $g(wI, 'browser', [
					{ provide: Ri, useValue: 'browser' },
					{
						provide: kg,
						useValue: function dS() {
							cl.makeCurrent(), dl.init();
						},
						multi: !0,
					},
					{
						provide: yt,
						useFactory: function hS() {
							return (
								(function ED(e) {
									Vs = e;
								})(document),
								document
							);
						},
						deps: [],
					},
				]),
				gS = [
					{ provide: Ya, useValue: 'root' },
					{
						provide: jr,
						useFactory: function fS() {
							return new jr();
						},
						deps: [],
					},
					{ provide: Ji, useClass: iS, multi: !0, deps: [yt, Be, Ri] },
					{ provide: Ji, useClass: lS, multi: !0, deps: [yt] },
					{ provide: pl, useClass: pl, deps: [Ki, fo, so] },
					{ provide: eg, useExisting: pl },
					{ provide: Tm, useExisting: fo },
					{ provide: fo, useClass: fo, deps: [yt] },
					{ provide: Gu, useClass: Gu, deps: [Be] },
					{ provide: Ki, useClass: Ki, deps: [Ji, Be] },
					{ provide: Im, useClass: KA, deps: [] },
				];
			let mS = (() => {
				class e {
					constructor(n) {
						if (n)
							throw new Error(
								'BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.'
							);
					}
					static withServerTransition(n) {
						return { ngModule: e, providers: [{ provide: so, useValue: n.appId }, { provide: Am, useExisting: so }, JA] };
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(e, 12));
					}),
					(e.ɵmod = wt({ type: e })),
					(e.ɵinj = ot({ providers: gS, imports: [jA, EI] })),
					e
				);
			})();
			'undefined' != typeof window && window;
			class Bm {}
			class Hm {}
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
			class NS {
				encodeKey(t) {
					return jm(t);
				}
				encodeValue(t) {
					return jm(t);
				}
				decodeKey(t) {
					return decodeURIComponent(t);
				}
				decodeValue(t) {
					return decodeURIComponent(t);
				}
			}
			const xS = /%(\d[a-f0-9])/gi,
				PS = { 40: '@', '3A': ':', 24: '$', '2C': ',', '3B': ';', '2B': '+', '3D': '=', '3F': '?', '2F': '/' };
			function jm(e) {
				return encodeURIComponent(e).replace(xS, (t, n) => {
					var r;
					return null !== (r = PS[n]) && void 0 !== r ? r : t;
				});
			}
			function $m(e) {
				return `${e}`;
			}
			class sn {
				constructor(t = {}) {
					if (((this.updates = null), (this.cloneFrom = null), (this.encoder = t.encoder || new NS()), t.fromString)) {
						if (t.fromObject) throw new Error('Cannot specify both fromString and fromObject.');
						this.map = (function FS(e, t) {
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
					const n = new sn({ encoder: this.encoder });
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
										n.push($m(t.value)), this.map.set(t.param, n);
										break;
									case 'd':
										if (void 0 === t.value) {
											this.map.delete(t.param);
											break;
										}
										{
											let r = this.map.get(t.param) || [];
											const o = r.indexOf($m(t.value));
											-1 !== o && r.splice(o, 1), r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param);
										}
								}
							}),
							(this.cloneFrom = this.updates = null));
				}
			}
			class OS {
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
			function Um(e) {
				return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer;
			}
			function Gm(e) {
				return 'undefined' != typeof Blob && e instanceof Blob;
			}
			function zm(e) {
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
						(function RS(e) {
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
						this.context || (this.context = new OS()),
						this.params)
					) {
						const s = this.params.toString();
						if (0 === s.length) this.urlWithParams = n;
						else {
							const a = n.indexOf('?');
							this.urlWithParams = n + (-1 === a ? '?' : a < n.length - 1 ? '&' : '') + s;
						}
					} else (this.params = new sn()), (this.urlWithParams = n);
				}
				serializeBody() {
					return null === this.body
						? null
						: Um(this.body) ||
						  Gm(this.body) ||
						  zm(this.body) ||
						  (function VS(e) {
								return 'undefined' != typeof URLSearchParams && e instanceof URLSearchParams;
						  })(this.body) ||
						  'string' == typeof this.body
						? this.body
						: this.body instanceof sn
						? this.body.toString()
						: 'object' == typeof this.body || 'boolean' == typeof this.body || Array.isArray(this.body)
						? JSON.stringify(this.body)
						: this.body.toString();
				}
				detectContentTypeHeader() {
					return null === this.body || zm(this.body)
						? null
						: Gm(this.body)
						? this.body.type || null
						: Um(this.body)
						? null
						: 'string' == typeof this.body
						? 'text/plain'
						: this.body instanceof sn
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
			var pe = (() => (
				((pe = pe || {})[(pe.Sent = 0)] = 'Sent'),
				(pe[(pe.UploadProgress = 1)] = 'UploadProgress'),
				(pe[(pe.ResponseHeader = 2)] = 'ResponseHeader'),
				(pe[(pe.DownloadProgress = 3)] = 'DownloadProgress'),
				(pe[(pe.Response = 4)] = 'Response'),
				(pe[(pe.User = 5)] = 'User'),
				pe
			))();
			class yl {
				constructor(t, n = 200, r = 'OK') {
					(this.headers = t.headers || new Pt()),
						(this.status = void 0 !== t.status ? t.status : n),
						(this.statusText = t.statusText || r),
						(this.url = t.url || null),
						(this.ok = this.status >= 200 && this.status < 300);
				}
			}
			class _l extends yl {
				constructor(t = {}) {
					super(t), (this.type = pe.ResponseHeader);
				}
				clone(t = {}) {
					return new _l({
						headers: t.headers || this.headers,
						status: void 0 !== t.status ? t.status : this.status,
						statusText: t.statusText || this.statusText,
						url: t.url || this.url || void 0,
					});
				}
			}
			class Xi extends yl {
				constructor(t = {}) {
					super(t), (this.type = pe.Response), (this.body = void 0 !== t.body ? t.body : null);
				}
				clone(t = {}) {
					return new Xi({
						body: void 0 !== t.body ? t.body : this.body,
						headers: t.headers || this.headers,
						status: void 0 !== t.status ? t.status : this.status,
						statusText: t.statusText || this.statusText,
						url: t.url || this.url || void 0,
					});
				}
			}
			class qm extends yl {
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
			function Dl(e, t) {
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
			let Wm = (() => {
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
								o.params && (l = o.params instanceof sn ? o.params : new sn({ fromObject: o.params })),
								(i = new ho(n, r, void 0 !== o.body ? o.body : null, {
									headers: u,
									context: o.context,
									params: l,
									reportProgress: o.reportProgress,
									responseType: o.responseType || 'json',
									withCredentials: o.withCredentials,
								}));
						}
						const s = (function AS(...e) {
							return Mo(e, bc(e));
						})(i).pipe(
							(function SS(e, t) {
								return ee(t) ? bo(e, t, 1) : bo(e, 1);
							})((u) => this.handler.handle(u))
						);
						if (n instanceof ho || 'events' === o.observe) return s;
						const a = s.pipe(
							(function TS(e, t) {
								return fn((n, r) => {
									let o = 0;
									n.subscribe(hn(r, (i) => e.call(t, i, o++) && r.next(i)));
								});
							})((u) => u instanceof Xi)
						);
						switch (o.observe || 'body') {
							case 'body':
								switch (i.responseType) {
									case 'arraybuffer':
										return a.pipe(
											pn((u) => {
												if (null !== u.body && !(u.body instanceof ArrayBuffer))
													throw new Error('Response is not an ArrayBuffer.');
												return u.body;
											})
										);
									case 'blob':
										return a.pipe(
											pn((u) => {
												if (null !== u.body && !(u.body instanceof Blob)) throw new Error('Response is not a Blob.');
												return u.body;
											})
										);
									case 'text':
										return a.pipe(
											pn((u) => {
												if (null !== u.body && 'string' != typeof u.body) throw new Error('Response is not a string.');
												return u.body;
											})
										);
									default:
										return a.pipe(pn((u) => u.body));
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
							params: new sn().append(r, 'JSONP_CALLBACK'),
							observe: 'body',
							responseType: 'json',
						});
					}
					options(n, r = {}) {
						return this.request('OPTIONS', n, r);
					}
					patch(n, r, o = {}) {
						return this.request('PATCH', n, Dl(o, r));
					}
					post(n, r, o = {}) {
						return this.request('POST', n, Dl(o, r));
					}
					put(n, r, o = {}) {
						return this.request('PUT', n, Dl(o, r));
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(Bm));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class Qm {
				constructor(t, n) {
					(this.next = t), (this.interceptor = n);
				}
				handle(t) {
					return this.interceptor.intercept(t, this.next);
				}
			}
			const Zm = new L('HTTP_INTERCEPTORS');
			let kS = (() => {
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
			const LS = /^\)\]\}',?\n/;
			let Jm = (() => {
				class e {
					constructor(n) {
						this.xhrFactory = n;
					}
					handle(n) {
						if ('JSONP' === n.method)
							throw new Error('Attempted to construct Jsonp request without HttpClientJsonpModule installed.');
						return new we((r) => {
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
											(function BS(e) {
												return 'responseURL' in e && e.responseURL
													? e.responseURL
													: /^X-Request-URL:/m.test(e.getAllResponseHeaders())
													? e.getResponseHeader('X-Request-URL')
													: null;
											})(o) || n.url;
									return (s = new _l({ headers: p, status: o.status, statusText: h, url: m })), s;
								},
								u = () => {
									let { headers: h, status: p, statusText: m, url: D } = a(),
										_ = null;
									204 !== p && (_ = void 0 === o.response ? o.responseText : o.response), 0 === p && (p = _ ? 200 : 0);
									let g = p >= 200 && p < 300;
									if ('json' === n.responseType && 'string' == typeof _) {
										const E = _;
										_ = _.replace(LS, '');
										try {
											_ = '' !== _ ? JSON.parse(_) : null;
										} catch (F) {
											(_ = E), g && ((g = !1), (_ = { error: F, text: _ }));
										}
									}
									g
										? (r.next(new Xi({ body: _, headers: h, status: p, statusText: m, url: D || void 0 })), r.complete())
										: r.error(new qm({ error: _, headers: h, status: p, statusText: m, url: D || void 0 }));
								},
								l = (h) => {
									const { url: p } = a(),
										m = new qm({
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
									let p = { type: pe.DownloadProgress, loaded: h.loaded };
									h.lengthComputable && (p.total = h.total),
										'text' === n.responseType && !!o.responseText && (p.partialText = o.responseText),
										r.next(p);
								},
								f = (h) => {
									let p = { type: pe.UploadProgress, loaded: h.loaded };
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
								r.next({ type: pe.Sent }),
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
						return new (n || e)(V(Im));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const vl = new L('XSRF_COOKIE_NAME'),
				Cl = new L('XSRF_HEADER_NAME');
			class Km {}
			let HS = (() => {
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
							return new (n || e)(V(yt), V(Ri), V(vl));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				wl = (() => {
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
							return new (n || e)(V(Km), V(Cl));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				jS = (() => {
					class e {
						constructor(n, r) {
							(this.backend = n), (this.injector = r), (this.chain = null);
						}
						handle(n) {
							if (null === this.chain) {
								const r = this.injector.get(Zm, []);
								this.chain = r.reduceRight((o, i) => new Qm(o, i), this.backend);
							}
							return this.chain.handle(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(V(Hm), V(Qe));
						}),
						(e.ɵprov = $({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				$S = (() => {
					class e {
						static disable() {
							return { ngModule: e, providers: [{ provide: wl, useClass: kS }] };
						}
						static withOptions(n = {}) {
							return {
								ngModule: e,
								providers: [
									n.cookieName ? { provide: vl, useValue: n.cookieName } : [],
									n.headerName ? { provide: Cl, useValue: n.headerName } : [],
								],
							};
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = wt({ type: e })),
						(e.ɵinj = ot({
							providers: [
								wl,
								{ provide: Zm, useExisting: wl, multi: !0 },
								{ provide: Km, useClass: HS },
								{ provide: vl, useValue: 'XSRF-TOKEN' },
								{ provide: Cl, useValue: 'X-XSRF-TOKEN' },
							],
						})),
						e
					);
				})(),
				US = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = wt({ type: e })),
						(e.ɵinj = ot({
							providers: [Wm, { provide: Bm, useClass: jS }, Jm, { provide: Hm, useExisting: Jm }],
							imports: [[$S.withOptions({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' })]],
						})),
						e
					);
				})();
			const { isArray: GS } = Array,
				{ getPrototypeOf: zS, prototype: qS, keys: WS } = Object;
			const { isArray: JS } = Array;
			function XS(e, t) {
				return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
			}
			function eT(...e) {
				const t = (function k_(e) {
						return ee(Ds(e)) ? e.pop() : void 0;
					})(e),
					{ args: n, keys: r } = (function QS(e) {
						if (1 === e.length) {
							const t = e[0];
							if (GS(t)) return { args: t, keys: null };
							if (
								(function ZS(e) {
									return e && 'object' == typeof e && zS(e) === qS;
								})(t)
							) {
								const n = WS(t);
								return { args: n.map((r) => t[r]), keys: n };
							}
						}
						return { args: e, keys: null };
					})(e),
					o = new we((i) => {
						const { length: s } = n;
						if (!s) return void i.complete();
						const a = new Array(s);
						let u = s,
							l = s;
						for (let c = 0; c < s; c++) {
							let d = !1;
							mn(n[c]).subscribe(
								hn(
									i,
									(f) => {
										d || ((d = !0), l--), (a[c] = f);
									},
									() => u--,
									void 0,
									() => {
										(!u || !d) && (l || i.next(r ? XS(r, a) : a), i.complete());
									}
								)
							);
						}
					});
				return t
					? o.pipe(
							(function YS(e) {
								return pn((t) =>
									(function KS(e, t) {
										return JS(t) ? e(...t) : e(t);
									})(e, t)
								);
							})(t)
					  )
					: o;
			}
			let Ym = (() => {
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
							return new (n || e)(v(Mn), v(gt));
						}),
						(e.ɵdir = S({ type: e })),
						e
					);
				})(),
				Sn = (() => {
					class e extends Ym {}
					return (
						(e.ɵfac = (function () {
							let t;
							return function (r) {
								return (
									t ||
									(t = (function Me(e) {
										return Zt(() => {
											const t = e.prototype.constructor,
												n = t[Vt] || Ys(t),
												r = Object.prototype;
											let o = Object.getPrototypeOf(e.prototype).constructor;
											for (; o && o !== r; ) {
												const i = o[Vt] || Ys(o);
												if (i && i !== n) return i;
												o = Object.getPrototypeOf(o);
											}
											return (i) => new i();
										});
									})(e))
								)(r || e);
							};
						})()),
						(e.ɵdir = S({ type: e, features: [z] })),
						e
					);
				})();
			const Ot = new L('NgValueAccessor'),
				nT = { provide: Ot, useExisting: J(() => es), multi: !0 },
				oT = new L('CompositionEventMode');
			let es = (() => {
				class e extends Ym {
					constructor(n, r, o) {
						super(n, r),
							(this._compositionMode = o),
							(this._composing = !1),
							null == this._compositionMode &&
								(this._compositionMode = !(function rT() {
									const e = An() ? An().getUserAgent() : '';
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
						return new (n || e)(v(Mn), v(gt), v(oT, 8));
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
								de('input', function (i) {
									return r._handleInput(i.target.value);
								})('blur', function () {
									return r.onTouched();
								})('compositionstart', function () {
									return r._compositionStart();
								})('compositionend', function (i) {
									return r._compositionEnd(i.target.value);
								});
						},
						features: [ne([nT]), z],
					})),
					e
				);
			})();
			const Se = new L('NgValidators'),
				un = new L('NgAsyncValidators');
			function ly(e) {
				return null != e;
			}
			function cy(e) {
				const t = Di(e) ? Mo(e) : e;
				return Rh(t), t;
			}
			function dy(e) {
				let t = {};
				return (
					e.forEach((n) => {
						t = null != n ? Object.assign(Object.assign({}, t), n) : t;
					}),
					0 === Object.keys(t).length ? null : t
				);
			}
			function fy(e, t) {
				return t.map((n) => n(e));
			}
			function hy(e) {
				return e.map((t) =>
					(function sT(e) {
						return !e.validate;
					})(t)
						? t
						: (n) => t.validate(n)
				);
			}
			function El(e) {
				return null != e
					? (function py(e) {
							if (!e) return null;
							const t = e.filter(ly);
							return 0 == t.length
								? null
								: function (n) {
										return dy(fy(n, t));
								  };
					  })(hy(e))
					: null;
			}
			function bl(e) {
				return null != e
					? (function gy(e) {
							if (!e) return null;
							const t = e.filter(ly);
							return 0 == t.length
								? null
								: function (n) {
										return eT(fy(n, t).map(cy)).pipe(pn(dy));
								  };
					  })(hy(e))
					: null;
			}
			function my(e, t) {
				return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
			}
			function Ml(e) {
				return e ? (Array.isArray(e) ? e : [e]) : [];
			}
			function ns(e, t) {
				return Array.isArray(e) ? e.includes(t) : e === t;
			}
			function Dy(e, t) {
				const n = Ml(t);
				return (
					Ml(e).forEach((o) => {
						ns(n, o) || n.push(o);
					}),
					n
				);
			}
			function vy(e, t) {
				return Ml(t).filter((n) => !ns(e, n));
			}
			class Cy {
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
					(this._rawValidators = t || []), (this._composedValidatorFn = El(this._rawValidators));
				}
				_setAsyncValidators(t) {
					(this._rawAsyncValidators = t || []), (this._composedAsyncValidatorFn = bl(this._rawAsyncValidators));
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
			class ln extends Cy {
				constructor() {
					super(...arguments), (this._parent = null), (this.name = null), (this.valueAccessor = null);
				}
			}
			class Ve extends Cy {
				get formDirective() {
					return null;
				}
				get path() {
					return null;
				}
			}
			class wy {
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
			let Ey = (() => {
					class e extends wy {
						constructor(n) {
							super(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(ln, 2));
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
									vi('ng-untouched', r.is('untouched'))('ng-touched', r.is('touched'))('ng-pristine', r.is('pristine'))(
										'ng-dirty',
										r.is('dirty')
									)('ng-valid', r.is('valid'))('ng-invalid', r.is('invalid'))('ng-pending', r.is('pending'));
							},
							features: [z],
						})),
						e
					);
				})(),
				by = (() => {
					class e extends wy {
						constructor(n) {
							super(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(Ve, 10));
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
									vi('ng-untouched', r.is('untouched'))('ng-touched', r.is('touched'))('ng-pristine', r.is('pristine'))(
										'ng-dirty',
										r.is('dirty')
									)('ng-valid', r.is('valid'))('ng-invalid', r.is('invalid'))('ng-pending', r.is('pending'))(
										'ng-submitted',
										r.is('submitted')
									);
							},
							features: [z],
						})),
						e
					);
				})();
			function po(e, t) {
				Sl(e, t),
					t.valueAccessor.writeValue(e.value),
					(function pT(e, t) {
						t.valueAccessor.registerOnChange((n) => {
							(e._pendingValue = n), (e._pendingChange = !0), (e._pendingDirty = !0), 'change' === e.updateOn && Iy(e, t);
						});
					})(e, t),
					(function mT(e, t) {
						const n = (r, o) => {
							t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
						};
						e.registerOnChange(n),
							t._registerOnDestroy(() => {
								e._unregisterOnChange(n);
							});
					})(e, t),
					(function gT(e, t) {
						t.valueAccessor.registerOnTouched(() => {
							(e._pendingTouched = !0),
								'blur' === e.updateOn && e._pendingChange && Iy(e, t),
								'submit' !== e.updateOn && e.markAsTouched();
						});
					})(e, t),
					(function hT(e, t) {
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
			function ss(e, t) {
				e.forEach((n) => {
					n.registerOnValidatorChange && n.registerOnValidatorChange(t);
				});
			}
			function Sl(e, t) {
				const n = (function yy(e) {
					return e._rawValidators;
				})(e);
				null !== t.validator ? e.setValidators(my(n, t.validator)) : 'function' == typeof n && e.setValidators([n]);
				const r = (function _y(e) {
					return e._rawAsyncValidators;
				})(e);
				null !== t.asyncValidator
					? e.setAsyncValidators(my(r, t.asyncValidator))
					: 'function' == typeof r && e.setAsyncValidators([r]);
				const o = () => e.updateValueAndValidity();
				ss(t._rawValidators, o), ss(t._rawAsyncValidators, o);
			}
			function Iy(e, t) {
				e._pendingDirty && e.markAsDirty(),
					e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
					t.viewToModelUpdate(e._pendingValue),
					(e._pendingChange = !1);
			}
			function Fl(e, t) {
				const n = e.indexOf(t);
				n > -1 && e.splice(n, 1);
			}
			const go = 'VALID',
				us = 'INVALID',
				Dr = 'PENDING',
				mo = 'DISABLED';
			function Pl(e) {
				return (ls(e) ? e.validators : e) || null;
			}
			function Ny(e) {
				return Array.isArray(e) ? El(e) : e || null;
			}
			function Ol(e, t) {
				return (ls(t) ? t.asyncValidators : e) || null;
			}
			function Fy(e) {
				return Array.isArray(e) ? bl(e) : e || null;
			}
			function ls(e) {
				return null != e && !Array.isArray(e) && 'object' == typeof e;
			}
			const Rl = (e) => e instanceof kl;
			function Py(e) {
				return ((e) => e instanceof Vy)(e) ? e.value : e.getRawValue();
			}
			function Oy(e, t) {
				const n = Rl(e),
					r = e.controls;
				if (!(n ? Object.keys(r) : r).length) throw new B(1e3, '');
				if (!r[t]) throw new B(1001, '');
			}
			function Ry(e, t) {
				Rl(e),
					e._forEachChild((r, o) => {
						if (void 0 === t[o]) throw new B(1002, '');
					});
			}
			class Vl {
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
						(this._composedValidatorFn = Ny(this._rawValidators)),
						(this._composedAsyncValidatorFn = Fy(this._rawAsyncValidators));
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
					return this.status === us;
				}
				get pending() {
					return this.status == Dr;
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
					(this._rawValidators = t), (this._composedValidatorFn = Ny(t));
				}
				setAsyncValidators(t) {
					(this._rawAsyncValidators = t), (this._composedAsyncValidatorFn = Fy(t));
				}
				addValidators(t) {
					this.setValidators(Dy(t, this._rawValidators));
				}
				addAsyncValidators(t) {
					this.setAsyncValidators(Dy(t, this._rawAsyncValidators));
				}
				removeValidators(t) {
					this.setValidators(vy(t, this._rawValidators));
				}
				removeAsyncValidators(t) {
					this.setAsyncValidators(vy(t, this._rawAsyncValidators));
				}
				hasValidator(t) {
					return ns(this._rawValidators, t);
				}
				hasAsyncValidator(t) {
					return ns(this._rawAsyncValidators, t);
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
					(this.status = Dr),
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
							(this.status === go || this.status === Dr) && this._runAsyncValidator(t.emitEvent)),
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
						(this.status = Dr), (this._hasOwnPendingAsyncValidator = !0);
						const n = cy(this.asyncValidator(this));
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
					return (function vT(e, t, n) {
						if (null == t || (Array.isArray(t) || (t = t.split(n)), Array.isArray(t) && 0 === t.length)) return null;
						let r = e;
						return (
							t.forEach((o) => {
								r = Rl(r)
									? r.controls.hasOwnProperty(o)
										? r.controls[o]
										: null
									: (((e) => e instanceof wT)(r) && r.at(o)) || null;
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
						? us
						: this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Dr)
						? Dr
						: this._anyControlsHaveStatus(us)
						? us
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
					ls(t) && null != t.updateOn && (this._updateOn = t.updateOn);
				}
				_parentMarkedDirty(t) {
					return !t && !(!this._parent || !this._parent.dirty) && !this._parent._anyControlsDirty();
				}
			}
			class Vy extends Vl {
				constructor(t = null, n, r) {
					super(Pl(n), Ol(r, n)),
						(this.defaultValue = null),
						(this._onChange = []),
						(this._pendingChange = !1),
						this._applyFormState(t),
						this._setUpdateStrategy(n),
						this._initObservables(),
						this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }),
						ls(n) && n.initialValueIsDefault && (this.defaultValue = this._isBoxedValue(t) ? t.value : t);
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
					Fl(this._onChange, t);
				}
				registerOnDisabledChange(t) {
					this._onDisabledChange.push(t);
				}
				_unregisterOnDisabledChange(t) {
					Fl(this._onDisabledChange, t);
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
			class kl extends Vl {
				constructor(t, n, r) {
					super(Pl(n), Ol(r, n)),
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
					Ry(this, t),
						Object.keys(t).forEach((r) => {
							Oy(this, r), this.controls[r].setValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
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
					return this._reduceChildren({}, (t, n, r) => ((t[r] = Py(n)), t));
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
			class wT extends Vl {
				constructor(t, n, r) {
					super(Pl(n), Ol(r, n)),
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
					Ry(this, t),
						t.forEach((r, o) => {
							Oy(this, o), this.at(o).setValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
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
					return this.controls.map((t) => Py(t));
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
			const ET = { provide: Ve, useExisting: J(() => cs) },
				yo = (() => Promise.resolve(null))();
			let cs = (() => {
				class e extends Ve {
					constructor(n, r) {
						super(),
							(this.submitted = !1),
							(this._directives = new Set()),
							(this.ngSubmit = new _e()),
							(this.form = new kl({}, El(n), bl(r)));
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
								o = new kl({});
							(function Ay(e, t) {
								Sl(e, t);
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
							(function Ty(e, t) {
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
						return new (n || e)(v(Se, 10), v(un, 10));
					}),
					(e.ɵdir = S({
						type: e,
						selectors: [['form', 3, 'ngNoForm', '', 3, 'formGroup', ''], ['ng-form'], ['', 'ngForm', '']],
						hostBindings: function (n, r) {
							1 & n &&
								de('submit', function (i) {
									return r.onSubmit(i);
								})('reset', function () {
									return r.onReset();
								});
						},
						inputs: { options: ['ngFormOptions', 'options'] },
						outputs: { ngSubmit: 'ngSubmit' },
						exportAs: ['ngForm'],
						features: [ne([ET]), z],
					})),
					e
				);
			})();
			const MT = { provide: ln, useExisting: J(() => Ll) },
				By = (() => Promise.resolve(null))();
			let Ll = (() => {
					class e extends ln {
						constructor(n, r, o, i, s) {
							super(),
								(this._changeDetectorRef = s),
								(this.control = new Vy()),
								(this._registered = !1),
								(this.update = new _e()),
								(this._parent = n),
								this._setValidators(r),
								this._setAsyncValidators(o),
								(this.valueAccessor = (function Nl(e, t) {
									if (!t) return null;
									let n, r, o;
									return (
										Array.isArray(t),
										t.forEach((i) => {
											i.constructor === es
												? (n = i)
												: (function DT(e) {
														return Object.getPrototypeOf(e.constructor) === Sn;
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
								(function Tl(e, t) {
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
							By.then(() => {
								var r;
								this.control.setValue(n, { emitViewToModelChange: !1 }),
									null === (r = this._changeDetectorRef) || void 0 === r || r.markForCheck();
							});
						}
						_updateDisabled(n) {
							const r = n.isDisabled.currentValue,
								o = '' === r || (r && 'false' !== r);
							By.then(() => {
								var i;
								o && !this.control.disabled ? this.control.disable() : !o && this.control.disabled && this.control.enable(),
									null === (i = this._changeDetectorRef) || void 0 === i || i.markForCheck();
							});
						}
						_getPath(n) {
							return this._parent
								? (function os(e, t) {
										return [...t.path, e];
								  })(n, this._parent)
								: [n];
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(Ve, 9), v(Se, 10), v(un, 10), v(Ot, 10), v(Kg, 8));
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
							features: [ne([MT]), z, Lt],
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
						(e.ɵdir = S({
							type: e,
							selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']],
							hostAttrs: ['novalidate', ''],
						})),
						e
					);
				})(),
				$y = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = wt({ type: e })),
						(e.ɵinj = ot({})),
						e
					);
				})(),
				JT = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = wt({ type: e })),
						(e.ɵinj = ot({ imports: [[$y]] })),
						e
					);
				})(),
				KT = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = wt({ type: e })),
						(e.ɵinj = ot({ imports: [JT] })),
						e
					);
				})();
			const zl = { headers: new Pt({ 'Content-Type': 'application/json' }) };
			let ql = (() => {
				class e {
					constructor(n) {
						(this.http = n), (this.apiUrl = 'https://le-monde-flux-rss.herokuapp.com/api/v1/news');
					}
					getNewsPerPage(n) {
						return this.http.post(this.apiUrl, { page: n }, zl);
					}
					getNews() {
						return this.http.post(this.apiUrl, { getAll: !0 }, zl);
					}
					updateItem(n) {
						const r = `${this.apiUrl}/${n._id}`;
						return console.log(n), this.http.put(r, { title: n.title, description: n.description }, zl);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(V(Wm));
					}),
					(e.ɵprov = $({ token: e, factory: e.ɵfac, providedIn: 'root' })),
					e
				);
			})();
			const s_ = function (e) {
				return { display: e };
			};
			let a_ = (() => {
					class e {
						constructor(n) {
							(this.newsService = n), (this.numPage = new _e()), (this.displayNum = 1), (this.onGetAll = new _e());
						}
						ngOnInit() {}
						onClickAfter(n) {
							console.log(n), (n -= 1) <= 1 && (n = this.page), (this.displayNum = n), this.numPage.emit(n);
						}
						onClickNext(n) {
							console.log(n), ++n > this.page && (n = 1), (this.displayNum = n), this.numPage.emit(n);
						}
						onClickGetAll() {
							this.onGetAll.emit();
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(v(ql));
						}),
						(e.ɵcmp = kt({
							type: e,
							selectors: [['app-pagination']],
							inputs: { page: 'page' },
							outputs: { numPage: 'numPage', onGetAll: 'onGetAll' },
							decls: 15,
							vars: 8,
							consts: [
								[1, 'pagination-container'],
								[1, 'pagination'],
								[1, 'after', 3, 'ngStyle', 'click'],
								[1, 'currentPage'],
								[1, 'next', 3, 'ngStyle', 'click'],
								[1, 'getAll', 3, 'click'],
							],
							template: function (n, r) {
								1 & n &&
									(U(0, 'div', 0)(1, 'div', 1)(2, 'h3'),
									Ce(3, 'Pagination'),
									q(),
									yi(4),
									U(5, 'button', 2),
									de('click', function () {
										return r.onClickAfter(r.displayNum);
									}),
									Ce(6, ' \u2190 Precedent '),
									q(),
									U(7, 'button', 3),
									Ce(8),
									q(),
									U(9, 'button', 4),
									de('click', function () {
										return r.onClickNext(r.displayNum);
									}),
									Ce(10, ' Suivant '),
									U(11, 'span'),
									Ce(12, '\u2192'),
									q()(),
									_i(),
									U(13, 'button', 5),
									de('click', function () {
										return r.onClickGetAll();
									}),
									Ce(14, 'Voir Tout'),
									q()()()),
									2 & n &&
										(Pe(5),
										ft('ngStyle', Mu(4, s_, 1 === r.displayNum ? 'none' : 'inline-block')),
										Pe(3),
										gu('', r.displayNum, ' / ', r.page, ''),
										Pe(1),
										ft('ngStyle', Mu(6, s_, r.displayNum === r.page ? 'none' : 'inline-block')));
							},
							directives: [wm],
							styles: [
								'.pagination-container[_ngcontent-%COMP%]{margin:1rem;display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:150px;background-color:#1c7ed6;padding:1rem}.pagination[_ngcontent-%COMP%]{display:flex;align-items:center;flex-direction:column;gap:2rem}h3[_ngcontent-%COMP%]{color:#fff;margin-bottom:1rem}button[_ngcontent-%COMP%]{border:none;cursor:pointer}.after[_ngcontent-%COMP%], .next[_ngcontent-%COMP%], .getAll[_ngcontent-%COMP%]{width:120px;color:#343a40;font-size:1rem;display:flex;align-items:center;justify-content:center;padding:.375rem .75rem;border:none;border-radius:5px;background-color:#fff;transition:all .3s ease-in-out}.after[_ngcontent-%COMP%]:hover, .next[_ngcontent-%COMP%]:hover, .getAll[_ngcontent-%COMP%]:hover{transform:scale(1.02)}.currentPage[_ngcontent-%COMP%]{color:#343a40;font-size:1.2rem;width:75px;height:75px;border-radius:50%;background-color:#fff}.getAll[_ngcontent-%COMP%]{margin-top:2rem;padding:.5rem}',
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
							decls: 7,
							vars: 1,
							consts: [
								['id', 'top'],
								[1, 'underline'],
								['href', '#top'],
							],
							template: function (n, r) {
								1 & n &&
									(U(0, 'header'),
									Gt(1, 'div', 0),
									U(2, 'h1'),
									Ce(3),
									q(),
									Gt(4, 'div', 1),
									q(),
									U(5, 'a', 2),
									Ce(6, '\u2191'),
									q()),
									2 & n && (Pe(3), wi(r.title));
							},
							styles: [
								'h1[_ngcontent-%COMP%]{text-align:center}.underline[_ngcontent-%COMP%]{margin:.5rem auto;width:6rem;height:.25rem;background-color:#1c7ed6}header[_ngcontent-%COMP%]{margin-bottom:5rem}a[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;background-color:#1c7ed6;width:50px;height:50px;color:#fff;position:fixed;bottom:2rem;right:2rem;border-radius:50%;border:none;font-size:2rem;cursor:pointer;text-decoration:none}',
							],
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
							this.title
								? this.description
									? ((this.item.title = this.title),
									  (this.item.description = this.description),
									  this.onSubmitItem.emit(n),
									  (this.title = ' '),
									  (this.description = ' '))
									: alert("Entrer une description s'il vous plait")
								: alert("Entrer un titre s'il vous plait ");
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
								['type', 'text', 'name', 'title', 'id', 'title', 'placeholder', 'titre', 3, 'ngModel', 'ngModelChange'],
								['for', 'description'],
								['name', 'description', 'id', '', 'rows', '5', 'placeholder', 'description', 3, 'ngModel', 'ngModelChange'],
								['type', 'submit', 'value', 'Save', 1, 'submit'],
							],
							template: function (n, r) {
								1 & n &&
									(U(0, 'form', 0),
									de('ngSubmit', function () {
										return r.onSubmit(r.item);
									}),
									U(1, 'div', 1)(2, 'label', 2),
									Ce(3, 'Title'),
									q(),
									U(4, 'input', 3),
									de('ngModelChange', function (i) {
										return (r.title = i);
									}),
									q()(),
									U(5, 'div', 1)(6, 'label', 4),
									Ce(7, 'Description'),
									q(),
									U(8, 'textarea', 5),
									de('ngModelChange', function (i) {
										return (r.description = i);
									}),
									q()(),
									Gt(9, 'input', 6),
									q()),
									2 & n && (Pe(4), ft('ngModel', r.title), Pe(4), ft('ngModel', r.description));
							},
							directives: [Hy, by, cs, es, Ey, Ll],
							styles: [
								'form[_ngcontent-%COMP%]{margin-top:1rem}.form-control[_ngcontent-%COMP%]{margin:1rem 0}.form-control[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;margin:.5rem}.form-control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .form-control[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], .submit[_ngcontent-%COMP%]{display:block;width:90%;margin:0 auto;padding:.375rem .75rem;font-size:16px;border-radius:5px;border-color:#333}.submit[_ngcontent-%COMP%]{background-color:#000;color:#fff;padding:.75rem 1.25rem;font-size:1.2rem;margin-top:.5rem;margin-bottom:.5rem;cursor:pointer}',
							],
						})),
						e
					);
				})();
			function eN(e, t) {
				if (1 & e) {
					const n = (function Ph() {
						return y();
					})();
					U(0, 'app-edit-news', 9),
						de('onSubmitItem', function () {
							!(function qc(e) {
								return (I.lFrame.contextLView = e), e[8];
							})(n);
							const o = fu();
							return o.onEdit(o.item);
						}),
						q();
				}
				2 & e && ft('item', fu().item);
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
						return new (n || e)(v(ql));
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
							[1, 'description'],
							[1, 'date'],
							[1, 'edit'],
							[1, 'btn-edit', 3, 'click'],
							['class', 'form', 3, 'item', 'onSubmitItem', 4, 'ngIf'],
							[1, 'form', 3, 'item', 'onSubmitItem'],
						],
						template: function (n, r) {
							1 & n &&
								(U(0, 'div', 0),
								Gt(1, 'img', 1),
								U(2, 'div', 2)(3, 'h3')(4, 'a', 3),
								Ce(5),
								q(),
								U(6, 'span'),
								Ce(7, '\u2192 '),
								q()(),
								U(8, 'p', 4),
								Ce(9),
								q(),
								U(10, 'p', 5),
								Ce(11),
								q()(),
								U(12, 'div', 6)(13, 'button', 7),
								de('click', function () {
									return r.onClick();
								}),
								Ce(14, 'edit'),
								q(),
								iu(15, eN, 1, 1, 'app-edit-news', 8),
								q()()),
								2 & n &&
									(Pe(1),
									Zr('src', r.item.image, oi),
									Zr('alt', r.item.title),
									Pe(3),
									Zr('href', r.item.link, oi),
									Pe(1),
									Kr('', r.item.title, ' '),
									Pe(4),
									Kr(' ', r.item.description, ' '),
									Pe(2),
									wi(r.item.published),
									Pe(4),
									ft('ngIf', r.showForm));
						},
						directives: [Dm, XT],
						styles: [
							'@import"https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";.item[_ngcontent-%COMP%]{min-height:620px;display:grid;grid-template-rows:auto auto auto;grid-row-gap:1rem;row-gap:1rem;box-shadow:#959da533 0 8px 24px;border-radius:5px;transition:all .3s ease-in-out}.item[_ngcontent-%COMP%]:hover{transform:scale(1.02)}.item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;object-fit:cover;border-top-left-radius:5px;border-top-right-radius:5px}.info[_ngcontent-%COMP%]{color:#343a40;padding:1rem}.info[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;font-weight:600;transition:all .3s ease-in-out}.info[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration:underline}.info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:1rem;line-height:1.4}.info[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]{margin-bottom:1rem;line-height:1.6}.info[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%]{font-size:12px;font-style:italic}.btn-edit[_ngcontent-%COMP%]{padding:.375rem .75rem;border:none;background-color:#1c7ed6;color:#fff;font-size:1rem;text-transform:capitalize;border-radius:5px;margin-left:.5rem;margin-bottom:.5rem;cursor:pointer}',
						],
					})),
					e
				);
			})();
			function nN(e, t) {
				1 & e && Gt(0, 'app-news-item', 3), 2 & e && ft('item', t.$implicit);
			}
			let rN = (() => {
					class e {
						constructor(n) {
							(this.newsService = n), (this.news = []);
						}
						ngOnInit() {
							this.newsService.getNewsPerPage(1).subscribe((n) => {
								(this.page = Math.ceil(n.pagination.count / n.pagination.limit)), (this.news = n.data);
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
							return new (n || e)(v(ql));
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
									(U(0, 'div', 0),
									iu(1, nN, 1, 1, 'app-news-item', 1),
									q(),
									U(2, 'app-pagination', 2),
									de('numPage', function (i) {
										return r.onGetNewsPerPage(i);
									})('onGetAll', function () {
										return r.getAll();
									}),
									q()),
									2 & n && (Pe(1), ft('ngForOf', r.news), Pe(1), ft('page', r.page));
							},
							directives: [ym, tN, a_],
							styles: [
								'.list[_ngcontent-%COMP%]{display:grid;justify-content:center;align-content:center;grid-template-columns:repeat(auto-fit,400px);grid-gap:2rem;gap:2rem}',
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
							decls: 5,
							vars: 0,
							template: function (n, r) {
								1 & n &&
									(U(0, 'div')(1, 'h4'),
									Ce(2, ' MINI PROJET FLUX RSS : PROGRAMME SOFTWARE ENGINEERING EDACY - DIGITAL AFRICA '),
									q(),
									U(3, 'span'),
									Ce(4, 'loiceuloge@gmail.com'),
									q()());
							},
							styles: [
								'div[_ngcontent-%COMP%]{background-color:#ced4da;margin-top:3rem;display:flex;justify-content:center;align-items:center;padding:2rem}span[_ngcontent-%COMP%]{font-style:italic;margin-left:1rem;font-size:14px}',
							],
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
							decls: 7,
							vars: 0,
							consts: [[1, 'container']],
							template: function (n, r) {
								1 & n &&
									(U(0, 'div', 0)(1, 'div'),
									Gt(2, 'app-pagination'),
									q(),
									U(3, 'main'),
									Gt(4, 'app-header')(5, 'app-news-list')(6, 'app-footer'),
									q()());
							},
							directives: [a_, YT, rN, oN],
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
						(e.ɵmod = wt({ type: e, bootstrap: [iN] })),
						(e.ɵinj = ot({ providers: [], imports: [[mS, US, KT]] })),
						e
					);
				})();
			(function aI() {
				Qg = !1;
			})(),
				pS()
					.bootstrapModule(sN)
					.catch((e) => console.error(e));
		},
	},
	(ee) => {
		ee((ee.s = 919));
	},
]);
