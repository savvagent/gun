// Generic javascript utilities.
var Type = {};
//Type.fns = Type.fn = {is: function(fn){ return (!!fn && fn instanceof Function) }}
Type.fn = {is: function(fn){ return (!!fn && 'function' == typeof fn) }};
Type.bi = {is: function(b){ return (b instanceof Boolean || typeof b == 'boolean') }};
Type.num = {is: function(n){ return !list_is(n) && ((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n) }};
Type.text = {is: function(t){ return (typeof t == 'string') }};
Type.text.ify = function(t){
	if(Type.text.is(t)){ return t }
	if(typeof JSON !== "undefined"){ return JSON.stringify(t) }
	return (t && t.toString)? t.toString() : t;
};
Type.text.random = function(l, c){
	var s = '';
	l = l || 24; // you are not going to make a 0 length random number, so no need to check type
	c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
	while(l > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); l--; }
	return s;
};
Type.text.match = function(t, o){ var tmp, u;
	if('string' !== typeof t){ return false }
	if('string' == typeof o){ o = {'=': o}; }
	o = o || {};
	tmp = (o['='] || o['*'] || o['>'] || o['<']);
	if(t === tmp){ return true }
	if(u !== o['=']){ return false }
	tmp = (o['*'] || o['>'] || o['<']);
	if(t.slice(0, (tmp||'').length) === tmp){ return true }
	if(u !== o['*']){ return false }
	if(u !== o['>'] && u !== o['<']){
		return (t >= o['>'] && t <= o['<'])? true : false;
	}
	if(u !== o['>'] && t >= o['>']){ return true }
	if(u !== o['<'] && t <= o['<']){ return true }
	return false;
};
Type.text.hash = function(s, c){ // via SO
	if(typeof s !== 'string'){ return }
	    c = c || 0;
	    if(!s.length){ return c }
	    for(var i=0,l=s.length,n; i<l; ++i){
	      n = s.charCodeAt(i);
	      c = ((c<<5)-c)+n;
	      c |= 0;
	    }
	    return c;
	  };
Type.list = {is: function(l){ return (l instanceof Array) }};
Type.list.slit = Array.prototype.slice;
Type.list.sort = function(k){ // creates a new sort function based off some key
	return function(A,B){
		if(!A || !B){ return 0 } A = A[k]; B = B[k];
		if(A < B){ return -1 }else if(A > B){ return 1 }
		else { return 0 }
	}
};
Type.list.map = function(l, c, _){ return obj_map(l, c, _) };
Type.list.index = 1; // change this to 0 if you want non-logical, non-mathematical, non-matrix, non-convenient array notation
Type.obj = {is: function(o){ return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false }};
Type.obj.put = function(o, k, v){ return (o||{})[k] = v, o };
Type.obj.has = function(o, k){ return o && Object.prototype.hasOwnProperty.call(o, k) };
Type.obj.del = function(o, k){
	if(!o){ return }
	o[k] = null;
	delete o[k];
	return o;
};
Type.obj.as = function(o, k, v, u){ return o[k] = o[k] || (u === v? {} : v) };
Type.obj.ify = function(o){
	if(obj_is(o)){ return o }
	try{o = JSON.parse(o);
	}catch(e){o={};}	return o;
}
;(function(){ var u;
	function map(v,k){
		if(obj_has(this,k) && u !== this[k]){ return }
		this[k] = v;
	}
	Type.obj.to = function(from, to){
		to = to || {};
		obj_map(from, map, to);
		return to;
	};
}());
Type.obj.copy = function(o){ // because http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
	return !o? o : JSON.parse(JSON.stringify(o)); // is shockingly faster than anything else, and our data has to be a subset of JSON anyways!
}
;(function(){
	function empty(v,i){ var n = this.n, u;
		if(n && (i === n || (obj_is(n) && obj_has(n, i)))){ return }
		if(u !== i){ return true }
	}
	Type.obj.empty = function(o, n){
		if(!o){ return true }
		return obj_map(o,empty,{n:n})? false : true;
	};
}());
(function(){
	function t(k,v){
		if(2 === arguments.length){
			t.r = t.r || {};
			t.r[k] = v;
			return;
		} t.r = t.r || [];
		t.r.push(k);
	}	var keys = Object.keys, map;
	Object.keys = Object.keys || function(o){ return map(o, function(v,k,t){t(k);}) };
	Type.obj.map = map = function(l, c, _){
		var u, i = 0, x, r, ll, lle, f = 'function' == typeof c;
		t.r = u;
		if(keys && obj_is(l)){
			ll = keys(l); lle = true;
		}
		_ = _ || {};
		if(list_is(l) || ll){
			x = (ll || l).length;
			for(;i < x; i++){
				var ii = (i + Type.list.index);
				if(f){
					r = lle? c.call(_, l[ll[i]], ll[i], t) : c.call(_, l[i], ii, t);
					if(r !== u){ return r }
				} else {
					//if(Type.test.is(c,l[i])){ return ii } // should implement deep equality testing!
					if(c === l[lle? ll[i] : i]){ return ll? ll[i] : ii } // use this for now
				}
			}
		} else {
			for(i in l){
				if(f){
					if(obj_has(l,i)){
						r = _? c.call(_, l[i], i, t) : c(l[i], i, t);
						if(r !== u){ return r }
					}
				} else {
					//if(a.test.is(c,l[i])){ return i } // should implement deep equality testing!
					if(c === l[i]){ return i } // use this for now
				}
			}
		}
		return f? t.r : Type.list.index? 0 : -1;
	};
}());
Type.time = {};
Type.time.is = function(t){ return t? t instanceof Date : (+new Date().getTime()) };

Type.fn.is;
var list_is = Type.list.is;
var obj = Type.obj, obj_is = obj.is, obj_has = obj.has, obj_map = obj.map;
var type = Type;

/* Based on the Hypothetical Amnesia Machine thought experiment */
function HAM(machineState, incomingState, currentState, incomingValue, currentValue){
	if(machineState < incomingState){
		return {defer: true}; // the incoming value is outside the boundary of the machine's state, it must be reprocessed in another state.
	}
	if(incomingState < currentState){
		return {historical: true}; // the incoming value is within the boundary of the machine's state, but not within the range.

	}
	if(currentState < incomingState){
		return {converge: true, incoming: true}; // the incoming value is within both the boundary and the range of the machine's state.

	}
	if(incomingState === currentState){
		incomingValue = Lexical(incomingValue) || "";
		currentValue = Lexical(currentValue) || "";
		if(incomingValue === currentValue){ // Note: while these are practically the same, the deltas could be technically different
			return {state: true};
		}
		/*
			The following is a naive implementation, but will always work.
			Never change it unless you have specific needs that absolutely require it.
			If changed, your data will diverge unless you guarantee every peer's algorithm has also been changed to be the same.
			As a result, it is highly discouraged to modify despite the fact that it is naive,
			because convergence (data integrity) is generally more important.
			Any difference in this algorithm must be given a new and different name.
		*/
		if(incomingValue < currentValue){ // Lexical only works on simple value types!
			return {converge: true, current: true};
		}
		if(currentValue < incomingValue){ // Lexical only works on simple value types!
			return {converge: true, incoming: true};
		}
	}
	return {err: "Invalid CRDT Data: "+ incomingValue +" to "+ currentValue +" at "+ incomingState +" to "+ currentState +"!"};
}
if(typeof JSON === 'undefined'){
	throw new Error(
		'JSON is not included in this browser. Please load it first: ' +
		'ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js'
	);
}
var Lexical = JSON.stringify;
var HAM_1 = HAM;

var Val = {};
Val.is = function(v){ // Valid values are a subset of JSON: null, binary, number (!Infinity), text, or a soul relation. Arrays need special algorithms to handle concurrency, so they are not supported directly. Use an extension that supports them if needed but research their problems first.
	if(v === u){ return false }
	if(v === null){ return true } // "deletes", nulling out keys.
	if(v === Infinity){ return false } // we want this to be, but JSON does not support it, sad face.
	if(text_is(v) // by "text" we mean strings.
	|| bi_is(v) // by "binary" we mean boolean.
	|| num_is(v)){ // by "number" we mean integers or decimals.
		return true; // simple values are valid.
	}
	return Val.link.is(v) || false; // is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
};
Val.link = Val.rel = {_: '#'};
(function(){
	Val.link.is = function(v){ // this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
		if(v && v[rel_] && !v._ && obj_is$1(v)){ // must be an object.
			var o = {};
			obj_map$1(v, map, o);
			if(o.id){ // a valid id was found.
				return o.id; // yay! Return it.
			}
		}
		return false; // the value was not a valid soul relation.
	};
	function map(s, k){ var o = this; // map over the object...
		if(o.id){ return o.id = false } // if ID is already defined AND we're still looping through the object, it is considered invalid.
		if(k == rel_ && text_is(s)){ // the key should be '#' and have a text value.
			o.id = s; // we found the soul!
		} else {
			return o.id = false; // if there exists anything else on the object that isn't the soul, then it is considered invalid.
		}
	}
}());
Val.link.ify = function(t){ return obj_put({}, rel_, t) }; // convert a soul into a relation and return it.
type.obj.has._ = '.';
var rel_ = Val.link._, u;
var bi_is = type.bi.is;
var num_is = type.num.is;
var text_is = type.text.is;
var obj$1 = type.obj, obj_is$1 = obj$1.is, obj_put = obj$1.put, obj_map$1 = obj$1.map;
var val = Val;

var Node = {_: '_'};
Node.soul = function(n, o){ return (n && n._ && n._[o || soul_]) }; // convenience function to check to see if there is a soul on a node and return it.
Node.soul.ify = function(n, o){ // put a soul on an object.
	o = (typeof o === 'string')? {soul: o} : o || {};
	n = n || {}; // make sure it exists.
	n._ = n._ || {}; // make sure meta exists.
	n._[soul_] = o.soul || n._[soul_] || text_random(); // put the soul on it.
	return n;
};
Node.soul._ = val.link._;
(function(){
	Node.is = function(n, cb, as){ var s; // checks to see if an object is a valid node.
		if(!obj_is$2(n)){ return false } // must be an object.
		if(s = Node.soul(n)){ // must have a soul on it.
			return !obj_map$2(n, map, {as:as,cb:cb,s:s,n:n});
		}
		return false; // nope! This was not a valid node.
	};
	function map(v, k){ // we invert this because the way we check for this is via a negation.
		if(k === Node._){ return } // skip over the metadata.
		if(!val.is(v)){ return true } // it is true that this is an invalid node.
		if(this.cb){ this.cb.call(this.as, v, k, this.n, this.s); } // optionally callback each key/value.
	}
}());
(function(){
	Node.ify = function(obj, o, as){ // returns a node from a shallow object.
		if(!o){ o = {}; }
		else if(typeof o === 'string'){ o = {soul: o}; }
		else if('function' == typeof o){ o = {map: o}; }
		if(o.map){ o.node = o.map.call(as, obj, u$1, o.node || {}); }
		if(o.node = Node.soul.ify(o.node || {}, o)){
			obj_map$2(obj, map, {o:o,as:as});
		}
		return o.node; // This will only be a valid node if the object wasn't already deep!
	};
	function map(v, k){ var o = this.o, tmp, u; // iterate over each key/value.
		if(o.map){
			tmp = o.map.call(this.as, v, ''+k, o.node);
			if(u === tmp){
				obj_del(o.node, k);
			} else
			if(o.node){ o.node[k] = tmp; }
			return;
		}
		if(val.is(v)){
			o.node[k] = v;
		}
	}
}());
var obj$2 = type.obj, obj_is$2 = obj$2.is, obj_del = obj$2.del, obj_map$2 = obj$2.map;
var text = type.text, text_random = text.random;
var soul_ = Node.soul._;
var u$1;
var node = Node;

function State(){
	var t;
	/*if(perf){
		t = start + perf.now(); // Danger: Accuracy decays significantly over time, even if precise.
	} else {*/
		t = +new Date;
	//}
	if(last < t){
		return N = 0, last = t + State.drift;
	}
	return last = t + ((N += 1) / D) + State.drift;
}
type.time.is; var last = -Infinity, N = 0, D = 1000; // WARNING! In the future, on machines that are D times faster than 2016AD machines, you will want to increase D by another several orders of magnitude so the processing speed never out paces the decimal resolution (increasing an integer effects the state accuracy).
var perf = (typeof performance !== 'undefined')? (performance.timing && performance) : false; (perf && perf.timing && perf.timing.navigationStart) || (perf = false);
var S_ = State._ = '>';
State.drift = 0;
State.is = function(n, k, o){ // convenience function to get the state on a key on a node and return it.
	var tmp = (k && n && n[N_] && n[N_][S_]) || o;
	if(!tmp){ return }
	return num_is$1(tmp = tmp[k])? tmp : -Infinity;
};
State.lex = function(){ return State().toString(36).replace('.','') };
State.ify = function(n, k, s, v, soul){ // put a key's state on a node.
	if(!n || !n[N_]){ // reject if it is not node-like.
		if(!soul){ // unless they passed a soul
			return;
		}
		n = node.soul.ify(n, soul); // then make it so!
	}
	var tmp = obj_as(n[N_], S_); // grab the states data.
	if(u$2 !== k && k !== N_){
		if(num_is$1(s)){
			tmp[k] = s; // add the valid state.
		}
		if(u$2 !== v){ // Note: Not its job to check for valid values!
			n[k] = v;
		}
	}
	return n;
};
State.to = function(from, k, to){
	var val = (from||{})[k];
	if(obj_is$3(val)){
		val = obj_copy(val);
	}
	return State.ify(to, k, State.is(from, k), val, node.soul(from));
}
;(function(){
	State.map = function(cb, s, as){ var u; // for use with Node.ify
		var o = obj_is$3(o = cb || s)? o : null;
		cb = fn_is(cb = cb || s)? cb : null;
		if(o && !cb){
			s = num_is$1(s)? s : State();
			o[N_] = o[N_] || {};
			obj_map$3(o, map, {o:o,s:s});
			return o;
		}
		as = as || obj_is$3(s)? s : u;
		s = num_is$1(s)? s : State();
		return function(v, k, o, opt){
			if(!cb){
				map.call({o: o, s: s}, v,k);
				return v;
			}
			cb.call(as || this || {}, v, k, o, opt);
			if(obj_has$1(o,k) && u === o[k]){ return }
			map.call({o: o, s: s}, v,k);
		}
	};
	function map(v,k){
		if(N_ === k){ return }
		State.ify(this.o, k, this.s) ;
	}
}());
var obj$3 = type.obj, obj_as = obj$3.as, obj_has$1 = obj$3.has, obj_is$3 = obj$3.is, obj_map$3 = obj$3.map, obj_copy = obj$3.copy;
var num = type.num, num_is$1 = num.is;
var fn = type.fn, fn_is = fn.is;
var N_ = node._, u$2;
var state = State;

var Graph = {};
(function(){
	Graph.is = function(g, cb, fn, as){ // checks to see if an object is a valid graph.
		if(!g || !obj_is$4(g) || obj_empty(g)){ return false } // must be an object.
		return !obj_map$4(g, map, {cb:cb,fn:fn,as:as}); // makes sure it wasn't an empty object.
	};
	function map(n, s){ // we invert this because the way'? we check for this is via a negation.
		if(!n || s !== node.soul(n) || !node.is(n, this.fn, this.as)){ return true } // it is true that this is an invalid graph.
		if(!this.cb){ return }
		nf.n = n; nf.as = this.as; // sequential race conditions aren't races.
		this.cb.call(nf.as, n, s, nf);
	}
	function nf(fn){ // optional callback for each node.
		if(fn){ node.is(nf.n, fn, nf.as); } // where we then have an optional callback for each key/value.
	}
}());
(function(){
	Graph.ify = function(obj, env, as){
		var at = {path: [], obj: obj};
		if(!env){
			env = {};
		} else
		if(typeof env === 'string'){
			env = {soul: env};
		} else
		if('function' == typeof env){
			env.map = env;
		}
		if(typeof as === 'string'){
			env.soul = env.soul || as;
			as = u$3;
		}
		if(env.soul){
			at.link = val.link.ify(env.soul);
		}
		env.shell = (as||{}).shell;
		env.graph = env.graph || {};
		env.seen = env.seen || [];
		env.as = env.as || as;
		node$1(env, at);
		env.root = at.node;
		return env.graph;
	};
	function node$1(env, at){ var tmp;
		if(tmp = seen(env, at)){ return tmp }
		at.env = env;
		at.soul = soul;
		if(node.ify(at.obj, map, at)){
			at.link = at.link || val.link.ify(node.soul(at.node));
			if(at.obj !== env.shell){
				env.graph[val.link.is(at.link)] = at.node;
			}
		}
		return at;
	}
	function map(v,k,n){
		var at = this, env = at.env, is, tmp;
		if(node._ === k && obj_has$2(v,val.link._)){
			return n._; // TODO: Bug?
		}
		if(!(is = valid(v,k,n, at,env))){ return }
		if(!k){
			at.node = at.node || n || {};
			if(obj_has$2(v, node._) && node.soul(v)){ // ? for safety ?
				at.node._ = obj_copy$1(v._);
			}
			at.node = node.soul.ify(at.node, val.link.is(at.link));
			at.link = at.link || val.link.ify(node.soul(at.node));
		}
		if(tmp = env.map){
			tmp.call(env.as || {}, v,k,n, at);
			if(obj_has$2(n,k)){
				v = n[k];
				if(u$3 === v){
					obj_del$1(n, k);
					return;
				}
				if(!(is = valid(v,k,n, at,env))){ return }
			}
		}
		if(!k){ return at.node }
		if(true === is){
			return v;
		}
		tmp = node$1(env, {obj: v, path: at.path.concat(k)});
		if(!tmp.node){ return }
		return tmp.link; //{'#': Node.soul(tmp.node)};
	}
	function soul(id){ var at = this;
		var prev = val.link.is(at.link), graph = at.env.graph;
		at.link = at.link || val.link.ify(id);
		at.link[val.link._] = id;
		if(at.node && at.node[node._]){
			at.node[node._][val.link._] = id;
		}
		if(obj_has$2(graph, prev)){
			graph[id] = graph[prev];
			obj_del$1(graph, prev);
		}
	}
	function valid(v,k,n, at,env){ var tmp;
		if(val.is(v)){ return true }
		if(obj_is$4(v)){ return 1 }
		if(tmp = env.invalid){
			v = tmp.call(env.as || {}, v,k,n);
			return valid(v,k,n, at,env);
		}
		env.err = "Invalid value at '" + at.path.concat(k).join('.') + "'!";
		if(type.list.is(v)){ env.err += " Use `.set(item)` instead of an Array."; }
	}
	function seen(env, at){
		var arr = env.seen, i = arr.length, has;
		while(i--){ has = arr[i];
			if(at.obj === has.obj){ return has }
		}
		arr.push(at);
	}
}());
Graph.node = function(node$1){
	var soul = node.soul(node$1);
	if(!soul){ return }
	return obj_put$1({}, soul, node$1);
}
;(function(){
	Graph.to = function(graph, root, opt){
		if(!graph){ return }
		var obj = {};
		opt = opt || {seen: {}};
		obj_map$4(graph[root], map, {obj:obj, graph: graph, opt: opt});
		return obj;
	};
	function map(v,k){ var tmp, obj;
		if(node._ === k){
			if(obj_empty(v, val.link._)){
				return;
			}
			this.obj[k] = obj_copy$1(v);
			return;
		}
		if(!(tmp = val.link.is(v))){
			this.obj[k] = v;
			return;
		}
		if(obj = this.opt.seen[tmp]){
			this.obj[k] = obj;
			return;
		}
		this.obj[k] = this.opt.seen[tmp] = Graph.to(this.graph, tmp, this.opt);
	}
}());
type.fn.is;
var obj$4 = type.obj, obj_is$4 = obj$4.is, obj_del$1 = obj$4.del, obj_has$2 = obj$4.has, obj_empty = obj$4.empty, obj_put$1 = obj$4.put, obj_map$4 = obj$4.map, obj_copy$1 = obj$4.copy;
var u$3;
var graph = Graph;

// On event emitter generic javascript utility.
var onto = function onto(tag, arg, as){
	if(!tag){ return {to: onto} }
	var u, tag = (this.tag || (this.tag = {}))[tag] ||
	(this.tag[tag] = {tag: tag, to: onto._ = {
		next: function(arg){ var tmp;
			if((tmp = this.to)){
				tmp.next(arg);
		}}
	}});
	if('function' == typeof arg){
		var be = {
			off: onto.off ||
			(onto.off = function(){
				if(this.next === onto._.next){ return !0 }
				if(this === this.the.last){
					this.the.last = this.back;
				}
				this.to.back = this.back;
				this.next = onto._.next;
				this.back.to = this.to;
				if(this.the.last === this.the){
					delete this.on.tag[this.the.tag];
				}
			}),
			to: onto._,
			next: arg,
			the: tag,
			on: this,
			as: as,
		};
		(be.back = tag.last || tag).to = be;
		return tag.last = be;
	}
	if((tag = tag.to) && u !== arg){ tag.next(arg); }
	return tag;
};

// request / response module, for asking and acking messages.
 // depends upon onto!
var ask = function ask(cb, as){
	if(!this.on){ return }
	if(!('function' == typeof cb)){
		if(!cb || !as){ return }
		var id = cb['#'] || cb, tmp = (this.tag||'')[id];
		if(!tmp){ return }
		tmp = this.on(id, as);
		clearTimeout(tmp.err);
		return true;
	}
	var id = (as && as['#']) || Math.random().toString(36).slice(2);
	if(!cb){ return id }
	var to = this.on(id, cb, as);
	to.err = to.err || setTimeout(function(){
		to.next({err: "Error: No ACK yet.", lack: true});
		to.off();
	}, (this.opt||{}).lack || 9000);
	return id;
};

function Dup(opt){
	var dup = {s:{}}, s = dup.s;
	opt = opt || {max: 1000, age: /*1000 * 9};//*/ 1000 * 9 * 3};
	dup.check = function(id){
		if(!s[id]){ return false }
		return dt(id);
	};
	var dt = dup.track = function(id){
		var it = s[id] || (s[id] = {});
		it.was = +new Date;
		if(!dup.to){ dup.to = setTimeout(dup.drop, opt.age + 9); }
		return it;
	};
	dup.drop = function(age){
		var now = +new Date;
		type.obj.map(s, function(it, id){
			if(it && (age || opt.age) > (now - it.was)){ return }
			delete s[id];
		});
		dup.to = null;
		console.STAT && (age = +new Date - now) > 9 && console.STAT(now, age, 'dup drop');
	};
	return dup;
}
var dup = Dup;

var to = (typeof setImmediate !== "undefined")? setImmediate : setTimeout, puff = function(cb){
	if(Q.length){ Q.push(cb); return } Q = [cb];
	to(function go(S){ S = S || +new Date;
		var i = 0, cb; while(i < 9 && (cb = Q[i++])){ cb(); }
		console.STAT && console.STAT(S, +new Date - S, 'puff');
		if(cb && !(+new Date - S)){ return go(S) }
		if(!(Q = Q.slice(i)).length){ return }
		to(go, 0);
	}, 0);
}, Q = [];
var puff_1 = setTimeout.puff = puff;

function Gun(o){
	if(o instanceof Gun){ return (this._ = {$: this}).$ }
	if(!(this instanceof Gun)){ return new Gun(o) }
	return Gun.create(this._ = {$: this, opt: o});
}

Gun.is = function($){ return ($ instanceof Gun) || ($ && $._ && ($ === $._.$)) || false };

Gun.version = 0.2020;

Gun.chain = Gun.prototype;
Gun.chain.toJSON = function(){};


type.obj.to(type, Gun);
Gun.HAM = HAM_1;
Gun.val = val;
Gun.node = node;
Gun.state = state;
Gun.graph = graph;
Gun.on = onto;
Gun.ask = ask;
Gun.dup = dup;
Gun.puff = puff_1;
(function(){
	Gun.create = function(at){
		at.root = at.root || at;
		at.graph = at.graph || {};
		at.on = at.on || Gun.on;
		at.ask = at.ask || Gun.ask;
		at.dup = at.dup || Gun.dup();
		var gun = at.$.opt(at.opt);
		if(!at.once){
			at.on('in', universe, at);
			at.on('out', universe, at);
			at.on('put', map, at);
			Gun.on('create', at);
			at.on('create', at);
		}
		at.once = 1;
		return gun;
	};
	function universe(msg){
		if(!msg){ return }
		if(msg.out === universe){ this.to.next(msg); return }
		var eve = this, as = eve.as, at = as.at || as, gun = at.$, dup = at.dup, tmp, DBG = msg.DBG;
		(tmp = msg['#']) || (tmp = msg['#'] = text_rand(9));
		if(dup.check(tmp)){ return } dup.track(tmp);
		tmp = msg._; msg._ = ('function' == typeof tmp)? tmp : function(){};
		(msg.$ && (msg.$ === (msg.$._||'').$)) || (msg.$ = gun);
		if(!at.ask(msg['@'], msg)){ // is this machine listening for an ack?
			DBG && (DBG.u = +new Date);
			if(msg.get){ Gun.on._get(msg, gun); }
			if(msg.put){ put(msg); return }
		}
		DBG && (DBG.uc = +new Date);
		eve.to.next(msg);
		DBG && (DBG.ua = +new Date);
		msg.out = universe; at.on('out', msg);
		DBG && (DBG.ue = +new Date);
	}
	function put(msg){
		if(!msg){ return }
		var ctx = msg._||'', root = ctx.root = ((msg.$||'')._||'').root;
		var put = msg.put, id = msg['#'], err, tmp;
		var DBG = ctx.DBG = msg.DBG;
		if(put['#'] && put['.']){ root.on('put', msg); return }
		/*root.on(id, function(m){
			console.log('ack:', m);
		});*/
		ctx.out = msg;
		ctx.lot = {s: 0, more: 1};
		var S = +new Date;
		DBG && (DBG.p = S);
		for(var soul in put){ // Gun.obj.native() makes this safe.
			var node = put[soul], states;
			if(!node){ err = ERR+cut(soul)+"no node."; break }
			if(!(tmp = node._)){ err = ERR+cut(soul)+"no meta."; break }
			if(soul !== tmp[_soul]){ err = ERR+cut(soul)+"soul not same."; break }
			if(!(states = tmp[state_])){ err = ERR+cut(soul)+"no state."; break }
			for(var key in node){ // double loop uncool, but have to support old format.
				if(node_ === key){ continue }
				var val = node[key], state = states[key];
				if(u$4 === state){ err = ERR+cut(key)+"on"+cut(soul)+"no state."; break }
				if(!val_is(val)){ err = ERR+cut(key)+"on"+cut(soul)+"bad "+(typeof val)+cut(val); break }
				ham(val, key, soul, state, msg);
			}
			if(err){ break }
		}
		DBG && (DBG.pe = +new Date);
		if(console.STAT){ console.STAT(S, +new Date - S, 'mix');console.STAT(S, ctx.lot.s, 'mix #'); }
		if(ctx.err = err){ root.on('in', {'@': id, err: Gun.log(err)}); return }
		if(!(--ctx.lot.more)){ fire(ctx); } // if synchronous.
		if(!ctx.stun && !msg['@']){ root.on('in', {'@': id, ok: -1}); } // in case no diff sent to storage, etc., still ack.
	} Gun.on.put = put;
	function ham(val, key, soul, state, msg){
		var ctx = msg._||'', root = ctx.root, graph = root.graph, lot;
		var vertex = graph[soul] || empty, was = state_is(vertex, key, 1), known = vertex[key];
		var machine = State(), is = HAM(machine, state, was, val, known);
		if(!is.incoming){
			if(is.defer){
				var to = state - machine;
				setTimeout(function(){
					ham(val, key, soul, state, msg);
				}, to > MD? MD : to); // setTimeout Max Defer 32bit :(
				if(!ctx.to){ root.on('in', {'@': msg['#'], err: to}); } ctx.to = 1;
				return to;
			}
			return;
		}
		(lot = ctx.lot||'').s++; lot.more++;
		(ctx.stun || (ctx.stun = {}))[soul+key] = 1;
		var DBG = ctx.DBG; DBG && (DBG.ph = DBG.ph || +new Date);
		root.on('put', {'#': msg['#'], '@': msg['@'], put: {'#': soul, '.': key, ':': val, '>': state}, _: ctx});
	}
	function map(msg){
		var DBG; if(DBG = (msg._||'').DBG){ DBG.pa = +new Date; DBG.pm = DBG.pm || +new Date;}
      	var eve = this, root = eve.as, graph = root.graph, ctx = msg._, put = msg.put, soul = put['#'], key = put['.'], val = put[':'], state = put['>']; msg['#']; var tmp;
		graph[soul] = state_ify(graph[soul], key, state, val, soul); // TODO: Only put in graph if subscribed? Relays vs Browsers?
		chain(ctx, soul, key, (u$4 !== (tmp = put['=']))? tmp : val, state); // TODO: This should NOT be how the API works, this should be done at an extension layer, but hacky solution to migrate with old code for now.
		if((tmp = ctx.out) && (tmp = tmp.put)){
			tmp[soul] = state_ify(tmp[soul], key, state, val, soul); // TODO: Hacky, fix & come back later, for actual pushing messages.
		}
		if(!(--ctx.lot.more)){ fire(ctx); } // TODO: 'forget' feature in SEA tied to this, bad approach, but hacked in for now. Any changes here must update there.
		eve.to.next(msg);
	}
	function chain(ctx, soul, key,val, state){
		var root = ctx.root, put, tmp;
		(root.opt||'').super && root.$.get(soul); // I think we need super for now, but since we are rewriting, should consider getting rid of it.
		if(!root || !(tmp = root.next) || !(tmp = tmp[soul]) || !tmp.$){ return }
		(put = ctx.put || (ctx.put = {}))[soul] = state_ify(put[soul], key, state, val, soul);
		tmp.put = state_ify(tmp.put, key, state, val, soul);
	}
	function fire(ctx){
		if(ctx.err){ return }
		var stop = {};
		var root = ctx.root, next = root.next||'', put = ctx.put, tmp;
		var S = +new Date;
		//Gun.graph.is(put, function(node, soul){
		for(var soul in put){ var node = put[soul]; // Gun.obj.native() makes this safe.
			if(!(tmp = next[soul]) || !tmp.$){ continue }
			root.stop = stop; // temporary fix till a better solution?
			tmp.on('in', {$: tmp.$, get: soul, put: node});
			root.stop = null; // temporary fix till a better solution?
		}
		console.STAT && console.STAT(S, +new Date - S, 'fire');
		ctx.DBG && (ctx.DBG.f = +new Date);
		if(!(tmp = ctx.out)){ return }
		tmp.out = universe;
		root.on('out', tmp);
	}
	var ERR = "Error: Invalid graph!";
	var cut = function(s){ return " '"+(''+s).slice(0,9)+"...' " };
	var HAM = Gun.HAM, MD = 2147483647, State = Gun.state;
}());
(function(){
	Gun.on._put = function(msg, gun){
		var at = gun._, ctx = {$: gun, graph: at.graph, put: {}, map: {}, souls: {}, machine: Gun.state(), ack: msg['@'], cat: at, stop: {}};
		if(!Gun.obj.map(msg.put, perf, ctx)){ return } // HNPERF: performance test, not core code, do not port.
		if(!Gun.graph.is(msg.put, null, verify, ctx)){ ctx.err = "Error: Invalid graph!"; }
		if(ctx.err){ return at.on('in', {'@': msg['#'], err: Gun.log(ctx.err) }) }
		obj_map$5(ctx.put, merge, ctx);
		if(!ctx.async){ obj_map$5(ctx.map, map, ctx); }
		if(u$4 !== ctx.defer){
			var to = ctx.defer - ctx.machine;
			setTimeout(function(){
				Gun.on._put(msg, gun);
			}, to > MD? MD : to ); // setTimeout Max Defer 32bit :(
		}
		if(!ctx.diff){ return }
		at.on('put', obj_to(msg, {put: ctx.diff}));
	};
	function verify(val, key, node, soul){ var ctx = this;
		var state = Gun.state.is(node, key);
		if(!state){ return ctx.err = "Error: No state on '"+key+"' in node '"+soul+"'!" }
		var vertex = ctx.graph[soul] || empty, was = Gun.state.is(vertex, key, true), known = vertex[key];
		var HAM = Gun.HAM(ctx.machine, state, was, val, known);
		if(!HAM.incoming){
			if(HAM.defer){ // pick the lowest
				ctx.defer = (state < (ctx.defer || Infinity))? state : ctx.defer;
			}
			return;
		}
		ctx.put[soul] = Gun.state.to(node, key, ctx.put[soul]);
		(ctx.diff || (ctx.diff = {}))[soul] = Gun.state.to(node, key, ctx.diff[soul]);
		ctx.souls[soul] = true;
	}
	function merge(node, soul){
		var ctx = this, cat = ctx.$._, at = (cat.next || empty)[soul];
		if(!at){
			if(!(cat.opt||empty).super){
				ctx.souls[soul] = false;
				return;
			}
			at = (ctx.$.get(soul)._);
		}
		var msg = ctx.map[soul] = {
			put: node,
			get: soul,
			$: at.$
		}, as = {ctx: ctx, msg: msg};
		ctx.async = !!cat.tag.node;
		if(ctx.ack){ msg['@'] = ctx.ack; }
		obj_map$5(node, each, as);
		if(!ctx.async){ return }
		if(!ctx.and){
			// If it is async, we only need to setup one listener per context (ctx)
			cat.on('node', function(m){
				this.to.next(m); // make sure to call other context's listeners.
				if(m !== ctx.map[m.get]){ return } // filter out events not from this context!
				ctx.souls[m.get] = false; // set our many-async flag
				obj_map$5(m.put, patch, m); // merge into view
				if(obj_map$5(ctx.souls, function(v){ if(v){ return v } })){ return } // if flag still outstanding, keep waiting.
				if(ctx.c){ return } ctx.c = 1; // failsafe for only being called once per context.
				this.off();
				obj_map$5(ctx.map, map, ctx); // all done, trigger chains.
			});
		}
		ctx.and = true;
		cat.on('node', msg); // each node on the current context's graph needs to be emitted though.
	}
	function each(val, key){
		var ctx = this.ctx, graph = ctx.graph, msg = this.msg, soul = msg.get, node = msg.put, at = (msg.$._);
		graph[soul] = Gun.state.to(node, key, graph[soul]);
		if(ctx.async){ return }
		at.put = Gun.state.to(node, key, at.put);
	}
	function patch(val, key){
		var msg = this, node = msg.put, at = (msg.$._);
		at.put = Gun.state.to(node, key, at.put);
	}
	function map(msg, soul){
		if(!msg.$){ return }
		this.cat.stop = this.stop; // temporary fix till a better solution?
		(msg.$._).on('in', msg);
		this.cat.stop = null; // temporary fix till a better solution?
	}
	function perf(node, soul){ if(node !== this.graph[soul]){ return true } } // HNPERF: do not port!

	Gun.on._get = function(msg, gun){
		var root = gun._, get = msg.get, soul = get[_soul], node = root.graph[soul], has = get[_has];
		var next = root.next || (root.next = {}), at = next[soul];
		// queue concurrent GETs?
		var ctx = msg._||'', DBG = ctx.DBG = msg.DBG;
		DBG && (DBG.g = +new Date);
		if(!node){ return root.on('get', msg) }
		if(has){
			if('string' != typeof has || !obj_has$3(node, has)){ return root.on('get', msg) }
			node = Gun.state.to(node, has);
			// If we have a key in-memory, do we really need to fetch?
			// Maybe... in case the in-memory key we have is a local write
			// we still need to trigger a pull/merge from peers.
		} else {
			node = Gun.window? Gun.obj.copy(node) : node; // HNPERF: If !browser bump Performance? Is this too dangerous to reference root graph? Copy / shallow copy too expensive for big nodes. Gun.obj.to(node); // 1 layer deep copy // Gun.obj.copy(node); // too slow on big nodes
		}
		node = Gun.graph.node(node);
		(at||empty).ack;
		var faith = function(){}; faith.ram = faith.faith = true; // HNPERF: We're testing performance improvement by skipping going through security again, but this should be audited.
		DBG && (DBG.ga = +new Date);
		root.on('in', {
			'@': msg['#'],
			put: node,
			ram: 1,
			$: gun,
			_: faith
		});
		DBG && (DBG.gm = +new Date);
		//if(0 < tmp){ return }
		root.on('get', msg);
		DBG && (DBG.gd = +new Date);
	};
}());
(function(){
	Gun.chain.opt = function(opt){
		opt = opt || {};
		var gun = this, at = gun._, tmp = opt.peers || opt;
		if(!obj_is$5(opt)){ opt = {}; }
		if(!obj_is$5(at.opt)){ at.opt = opt; }
		if(text_is$1(tmp)){ tmp = [tmp]; }
		if(list_is$1(tmp)){
			tmp = obj_map$5(tmp, function(url, i, map){
				i = {}; i.id = i.url = url; map(url, i);
			});
			if(!obj_is$5(at.opt.peers)){ at.opt.peers = {};}
			at.opt.peers = obj_to(tmp, at.opt.peers);
		}
		at.opt.peers = at.opt.peers || {};
		obj_map$5(opt, function each(v,k){
			if(!obj_has$3(this, k) || text$1.is(v) || obj$5.empty(v)){ this[k] = v ; return }
			if(v && v.constructor !== Object && !list_is$1(v)){ return }
			obj_map$5(v, each, this[k]);
		}, at.opt);
		Gun.on('opt', at);
		//at.opt.uuid = at.opt.uuid || function(){ return state_lex() + text_rand(12) }
		Gun.obj.native();
		return gun;
	};
}());
Gun.obj.native = function(){ var p = Object.prototype; for(var i in p){ console.log("Native Object.prototype polluted, reverting", i); delete p[i]; } };

var list_is$1 = Gun.list.is;
var text$1 = Gun.text, text_is$1 = text$1.is, text_rand = text$1.random;
var obj$5 = Gun.obj; obj$5.empty; var obj_is$5 = obj$5.is, obj_has$3 = obj$5.has, obj_to = obj$5.to, obj_map$5 = obj$5.map; obj$5.copy;
Gun.state.lex; var state_ify = Gun.state.ify, state_is = Gun.state.is, _soul = Gun.val.link._, _has = '.', node_ = Gun.node._, val_is = Gun.val.is; Gun.val.link.is; var state_ = Gun.state._;
var empty = {}, u$4;
var C;

Gun.log = function(){ return (!Gun.log.off && C.log.apply(C, arguments)), [].slice.call(arguments).join(' ') };
Gun.log.once = function(w,s,o){ return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s) };

if(typeof window !== "undefined"){ (window.GUN = window.Gun = Gun).window = window; }
try{ if(typeof MODULE !== "undefined"){ MODULE.exports = Gun; } }catch(e){}
var root = Gun;

(Gun.window||'').console = (Gun.window||'').console || {log: function(){}};
(C = console).only = function(i, s){ return (C.only.i && i === C.only.i && C.only.i++) && (C.log.apply(C, arguments) || s) };
Gun.log.once("welcome", "Hello wonderful person! :) Thanks for using GUN, please ask for help on http://chat.gun.eco if anything takes you longer than 5min to figure out!");

// WARNING: GUN is very simple, but the JavaScript chaining API around GUN
// is complicated and was extremely hard to build. If you port GUN to another
// language, consider implementing an easier API to build.

root.chain.chain = function(sub){
	var gun = this, at = gun._, chain = new (sub || gun).constructor(gun), cat = chain._, root$1;
	cat.root = root$1 = at.root;
	cat.id = ++root$1.once;
	cat.back = gun._;
	cat.on = root.on;
	cat.on('in', input, cat); // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
	cat.on('out', output, cat); // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
	return chain;
};

function output(msg){
	var put, get, at = this.as, back = at.back, root$1 = at.root, tmp;
	if(!msg.$){ msg.$ = at.$; }
	this.to.next(msg);
	if(get = msg.get){
		/*if(u !== at.put){
			at.on('in', at);
			return;
		}*/
		if(at.lex){ msg.get = obj_to$1(at.lex, msg.get); }
		if(get['#'] || at.soul){
			get['#'] = get['#'] || at.soul;
			msg['#'] || (msg['#'] = text_rand$1(9));
			back = (root$1.$.get(get['#'])._);
			if(!(get = get['.'])){
				tmp = back.ack;
				if(!tmp){ back.ack = -1; }
				if(obj_has$4(back, 'put')){
					back.on('in', back);
				}
				if(tmp && u$5 !== back.put){ return } //if(tmp){ return }
				msg.$ = back.$;
			} else
			if(obj_has$4(back.put, get)){ // TODO: support #LEX !
				put = (back.$.get(get)._);
				if(!(tmp = put.ack)){ put.ack = -1; }
				back.on('in', {
					$: back.$,
					put: root.state.to(back.put, get),
					get: back.get
				});
				if(tmp){ return }
			} else
			if('string' != typeof get){
				var put = {}, meta = (back.put||{})._;
				root.obj.map(back.put, function(v,k){
					if(!root.text.match(k, get)){ return }
					put[k] = v;
				});
				if(!root.obj.empty(put)){
					put._ = meta;
					back.on('in', {$: back.$, put: put, get: back.get});
				}
				if(tmp = at.lex){
					tmp = (tmp._) || (tmp._ = function(){});
					if(back.ack < tmp.ask){ tmp.ask = back.ack; }
					if(tmp.ask){ return }
					tmp.ask = 1;
				}
			}
			root$1.ask(ack, msg);
			return root$1.on('in', msg);
		}
		if(root$1.now){ root$1.now[at.id] = root$1.now[at.id] || true; at.pass = {}; }
		if(get['.']){
			if(at.get){
				msg = {get: {'.': at.get}, $: at.$};
				//if(back.ask || (back.ask = {})[at.get]){ return }
				(back.ask || (back.ask = {}));
				back.ask[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
				return back.on('out', msg);
			}
			msg = {get: {}, $: at.$};
			return back.on('out', msg);
		}
		at.ack = at.ack || -1;
		if(at.get){
			msg.$ = at.$;
			get['.'] = at.get;
			(back.ask || (back.ask = {}))[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
			return back.on('out', msg);
		}
	}
	return back.on('out', msg);
}

function input(msg){
	var eve = this, cat = eve.as, root$1 = cat.root, gun = msg.$, at = (gun||empty$1)._ || empty$1, change = msg.put, rel, tmp;
	if(cat.get && msg.get !== cat.get){
		msg = obj_to$1(msg, {get: cat.get});
	}
	if(cat.has && at !== cat){
		msg = obj_to$1(msg, {$: cat.$});
		if(at.ack){
			cat.ack = at.ack;
			//cat.ack = cat.ack || at.ack;
		}
	}
	if(u$5 === change){
		tmp = at.put;
		eve.to.next(msg);
		if(cat.soul){ return } // TODO: BUG, I believee the fresh input refactor caught an edge case that a `gun.get('soul').get('key')` that points to a soul that doesn't exist will not trigger val/get etc.
		if(u$5 === tmp && u$5 !== at.put){ return }
		echo(cat, msg);
		if(cat.has){
			not(cat, msg);
		}
		obj_del$2(at.echo, cat.id);
		obj_del$2(cat.map, at.id);
		return;
	}
	if(cat.soul){
		eve.to.next(msg);
		echo(cat, msg);
		if(cat.next){ obj_map$6(change, map, {msg: msg, cat: cat}); }
		return;
	}
	if(!(rel = root.val.link.is(change))){
		if(root.val.is(change)){
			if(cat.has || cat.soul){
				not(cat, msg);
			} else
			if(at.has || at.soul){
				(at.echo || (at.echo = {}))[cat.id] = at.echo[at.id] || cat;
				(cat.map || (cat.map = {}))[at.id] = cat.map[at.id] || {at: at};
				//if(u === at.put){ return } // Not necessary but improves performance. If we have it but at does not, that means we got things out of order and at will get it. Once at gets it, it will tell us again.
			}
			eve.to.next(msg);
			echo(cat, msg);
			return;
		}
		if(cat.has && at !== cat && obj_has$4(at, 'put')){
			cat.put = at.put;
		}		if((rel = root.node.soul(change)) && at.has){
			at.put = (cat.root.$.get(rel)._).put;
		}
		tmp = (root$1.stop || {})[at.id];
		//if(tmp && tmp[cat.id]){ } else {
			eve.to.next(msg);
		//}
		relate(cat, msg, at, rel);
		echo(cat, msg);
		if(cat.next){ obj_map$6(change, map, {msg: msg, cat: cat}); }
		return;
	}
	root$1.stop;
	tmp = root$1.stop || {};
	tmp = tmp[at.id] || (tmp[at.id] = {});
	//if(tmp[cat.id]){ return }
	tmp.is = tmp.is || at.put;
	tmp[cat.id] = at.put || true;
	//if(root.stop){
		eve.to.next(msg);
	//}
	relate(cat, msg, at, rel);
	echo(cat, msg);
}

function relate(at, msg, from, rel){
	if(!rel || node_$1 === at.get){ return }
	var tmp = (at.root.$.get(rel)._);
	if(at.has){
		from = tmp;
	} else
	if(from.has){
		relate(from, msg, from, rel);
	}
	if(from === at){ return }
	if(!from.$){ from = {}; }
	(from.echo || (from.echo = {}))[at.id] = from.echo[at.id] || at;
	if(at.has && !(at.map||empty$1)[from.id]){ // if we haven't seen this before.
		not(at, msg);
	}
	tmp = from.id? ((at.map || (at.map = {}))[from.id] = at.map[from.id] || {at: from}) : {};
	if(rel === tmp.link){
		if(!(tmp.pass || at.pass)){
			return;
		}
	}
	if(at.pass){
		root.obj.map(at.map, function(tmp){ tmp.pass = true; });
		obj_del$2(at, 'pass');
	}
	if(tmp.pass){ obj_del$2(tmp, 'pass'); }
	if(at.has){ at.link = rel; }
	ask$1(at, tmp.link = rel);
}
function echo(at, msg, ev){
	if(!at.echo){ return } // || node_ === at.get ?
	//if(at.has){ msg = obj_to(msg, {event: ev}) }
	obj_map$6(at.echo, reverb, msg);
}
function reverb(to){
	if(!to || !to.on){ return }
	to.on('in', this);
}
function map(data, key){ // Map over only the changes on every update.
	var cat = this.cat, next = cat.next || empty$1, via = this.msg, chain, at, tmp;
	if(node_$1 === key && !next[key]){ return }
	if(!(at = next[key])){
		return;
	}
	//if(data && data[_soul] && (tmp = Gun.val.link.is(data)) && (tmp = (cat.root.$.get(tmp)._)) && obj_has(tmp, 'put')){
	//	data = tmp.put;
	//}
	if(at.has){
		//if(!(data && data[_soul] && Gun.val.link.is(data) === Gun.node.soul(at.put))){
		if(u$5 === at.put || !root.val.link.is(data)){
			at.put = data;
		}
		chain = at.$;
	} else
	if(tmp = via.$){
		tmp = (chain = via.$.get(key))._;
		if(u$5 === tmp.put || !root.val.link.is(data)){
			tmp.put = data;
		}
	}
	at.on('in', {
		put: data,
		get: key,
		$: chain,
		via: via
	});
}
function not(at, msg){
	if(!(at.has || at.soul)){ return }
	var tmp = at.map; at.root;
	at.map = null;
	if(at.has){
		if(at.dub && at.root.stop){ at.dub = null; }
		at.link = null;
	}
	//if(!root.now || !root.now[at.id]){
	if(!at.pass){
		if((!msg['@']) && null === tmp){ return }
		//obj_del(at, 'pass');
	}
	if(u$5 === tmp && root.val.link.is(at.put)){ return } // This prevents the very first call of a thing from triggering a "clean up" call. // TODO: link.is(at.put) || !val.is(at.put) ?
	obj_map$6(tmp, function(proxy){
		if(!(proxy = proxy.at)){ return }
		obj_del$2(proxy.echo, at.id);
	});
	tmp = at.put;
	obj_map$6(at.next, function(neat, key){
		if(u$5 === tmp && u$5 !== at.put){ return true }
		neat.put = u$5;
		if(neat.ack){
			neat.ack = -1; // Shouldn't this be reset to 0? If we do that, SEA test `set user ref should be found` fails, odd.
		}
		neat.on('in', {
			get: key,
			$: neat.$,
			put: u$5
		});
	});
}
function ask$1(at, soul){
	var tmp = (at.root.$.get(soul)._), lex = at.lex;
	if(at.ack || lex){
		(lex = lex||{})['#'] = soul;
		tmp.on('out', {get: lex});
		if(!at.ask){ return } // TODO: PERFORMANCE? More elegant way?
	}
	tmp = at.ask; root.obj.del(at, 'ask');
	obj_map$6(tmp || at.next, function(neat, key){
		var lex = neat.lex || {}; lex['#'] = soul; lex['.'] = lex['.'] || key;
		neat.on('out', {get: lex});
	});
	root.obj.del(at, 'ask'); // TODO: PERFORMANCE? More elegant way?
}
function ack(msg, ev){
	var as = this.as, get = as.get||'', at = as.$._, tmp = (msg.put||'')[get['#']];
	if(at.ack){ at.ack = (at.ack + 1) || 1; }
	if(!msg.put || ('string' == typeof get['.'] && !obj_has$4(tmp, at.get))){
		if(at.put !== u$5){ return }
		at.on('in', {
			get: at.get,
			put: at.put = u$5,
			$: at.$,
			'@': msg['@']
		});
		return;
	}
	if(node_$1 == get['.']){ // is this a security concern?
		at.on('in', {get: at.get, put: root.val.link.ify(get['#']), $: at.$, '@': msg['@']});
		return;
	}
	root.on.put(msg);
}
var empty$1 = {}, u$5;
var obj$6 = root.obj, obj_has$4 = obj$6.has; obj$6.put; var obj_del$2 = obj$6.del, obj_to$1 = obj$6.to, obj_map$6 = obj$6.map;
var text_rand$1 = root.text.random;
root.val.link._; var node_$1 = root.node._;

root.chain.back = function(n, opt){ var tmp;
	n = n || 1;
	if(-1 === n || Infinity === n){
		return this._.root.$;
	} else
	if(1 === n){
		return (this._.back || this._).$;
	}
	var gun = this, at = gun._;
	if(typeof n === 'string'){
		n = n.split('.');
	}
	if(n instanceof Array){
		var i = 0, l = n.length, tmp = at;
		for(i; i < l; i++){
			tmp = (tmp||empty$2)[n[i]];
		}
		if(u$6 !== tmp){
			return opt? gun : tmp;
		} else
		if((tmp = at.back)){
			return tmp.$.back(n, opt);
		}
		return;
	}
	if('function' == typeof n){
		var yes, tmp = {back: at};
		while((tmp = tmp.back)
		&& u$6 === (yes = n(tmp, opt))){}
		return yes;
	}
	if(root.num.is(n)){
		return (at.back || at).$.back(n - 1);
	}
	return this;
};
var empty$2 = {}, u$6;

root.chain.put = function(data, cb, as){
	var gun = this, at = (gun._), root$1 = at.root.$; root$1._; var tmp;
	as = as || {};
	as.data = data;
	as.via = as.$ = as.via || as.$ || gun;
	if(typeof cb === 'string'){
		as.soul = cb;
	} else {
		as.ack = as.ack || cb;
	}
	if(at.soul){
		as.soul = at.soul;
	}
	if(as.soul || root$1 === gun){
		if(!obj_is$6(as.data)){
			(as.ack||noop).call(as, as.out = {err: root.log("Data saved to the root level of the graph must be a node (an object), not a", (typeof as.data), 'of "' + as.data + '"!')});
			if(as.res){ as.res(); }
			return gun;
		}
		as.soul = as.soul || (as.not = root.node.soul(as.data) || (as.via.back('opt.uuid') || root.text.random)());
		as.via._.stun = {};
		if(!as.soul){ // polyfill async uuid for SEA
			as.via.back('opt.uuid')(function(err, soul){ // TODO: improve perf without anonymous callback
				if(err){ return root.log(err) } // TODO: Handle error!
				(as.ref||as.$).put(as.data, as.soul = soul, as);
			});
			return gun;
		}
		as.$ = root$1.get(as.soul);
		as.ref = as.$;
		ify(as);
		return gun;
	}
	as.via._.stun = {};
	if(root.is(data)){
		data.get(function(soul, o, msg){
			if(!soul){
				delete as.via._.stun;
				return root.log("The reference you are saving is a", typeof msg.put, '"'+ msg.put +'", not a node (object)!');
			}
			gun.put(root.val.link.ify(soul), cb, as);
		}, true);
		return gun;
	}
	if(at.has && (tmp = root.val.link.is(data))){ at.dub = tmp; }
	as.ref = as.ref || (root$1._ === (tmp = at.back))? gun : tmp.$;
	if(as.ref._.soul && root.val.is(as.data) && at.get){
		as.data = obj_put$2({}, at.get, as.data);
		as.ref.put(as.data, as.soul, as);
		return gun;
	}
	as.ref.get(any, true, {as: as});
	if(!as.out){
		// TODO: Perf idea! Make a global lock, that blocks everything while it is on, but if it is on the lock it does the expensive lookup to see if it is a dependent write or not and if not then it proceeds full speed. Meh? For write heavy async apps that would be terrible.
		as.res = as.res || stun; // Gun.on.stun(as.ref); // TODO: BUG! Deal with locking?
		as.$._.stun = as.ref._.stun;
	}
	return gun;
};
/*Gun.chain.put = function(data, cb, as){ // don't rewrite! :(
	var gun = this, at = gun._;
	as = as || {};
	as.soul || (as.soul = at.soul || ('string' == typeof cb && cb));
	if(!as.soul){ return get(data, cb, as) }

	return gun;
}*/

function ify(as){
	as.batch = batch;
	var opt = as.opt||{}, env = as.env = root.state.map(map$1, opt.state);
	env.soul = as.soul;
	as.graph = root.graph.ify(as.data, env, as);
	if(env.err){
		(as.ack||noop).call(as, as.out = {err: root.log(env.err)});
		if(as.res){ as.res(); }
		return;
	}
	as.batch();
}

function stun(cb){
	if(cb){ cb(); }
	return;
}

function batch(){ var as = this;
	if(!as.graph || !obj_empty$1(as.stun)){ return }
	as.res = as.res || function(cb){ if(cb){ cb(); } };
	as.res(function(){
		delete as.via._.stun;
		var cat = (as.$.back(-1)._), ask = cat.ask(function(ack){
			cat.root.on('ack', ack);
			if(ack.err){ root.log(ack); }
			if(++acks > (as.acks || 0)){ this.off(); } // Adjustable ACKs! Only 1 by default.
			if(!as.ack){ return }
			as.ack(ack, this);
			//--C;
		}, as.opt), acks = 0;
		//C++;
		// NOW is a hack to get synchronous replies to correctly call.
		// and STOP is a hack to get async behavior to correctly call.
		// neither of these are ideal, need to be fixed without hacks,
		// but for now, this works for current tests. :/
		var tmp = cat.root.now; obj$7.del(cat.root, 'now');
		var mum = cat.root.mum; cat.root.mum = {};
		(as.ref._).on('out', {
			$: as.ref, put: as.out = as.env.graph, opt: as.opt, '#': ask
		});
		cat.root.mum = mum? obj$7.to(mum, cat.root.mum) : mum;
		cat.root.now = tmp;
		as.via._.on('res', {}); delete as.via._.tag.res; // emitting causes mem leak?
	}, as);
	if(as.res){ as.res(); }
}
function map$1(v,k,n, at){ var as = this;
	var is = root.is(v);
	if(k || !at.path.length){ return }
	(as.res||iife)(function(){
		var path = at.path, ref = as.ref; as.opt;
		var i = 0, l = path.length;
		for(i; i < l; i++){
			ref = ref.get(path[i]);
		}
		if(is){ ref = v; }
		//if(as.not){ (ref._).dub = Gun.text.random() } // This might optimize stuff? Maybe not needed anymore. Make sure it doesn't introduce bugs.
		var id = (ref._).dub;
		if(id || (id = root.node.soul(at.obj))){
			ref.back(-1).get(id);
			at.soul(id);
			return;
		}
		(as.stun = as.stun || {})[path] = 1;
		ref.get(soul, true, {as: {at: at, as: as, p:path, ref: ref}});
	}, {as: as, at: at});
	//if(is){ return {} }
}
function soul(id, as, msg, eve){
	var as = as.as, path = as.p, ref = as.ref, cat = as.at; as = as.as;
	var sat = ref.back(function(at){ return sat = at.soul || at.link || at.dub });
	var pat = [sat || as.soul].concat(ref._.has || ref._.get || path);
	var at = ((msg || {}).$ || {})._ || {};
	id = at.dub = at.dub || id || root.node.soul(cat.obj) || root.node.soul(msg.put || at.put) || root.val.link.is(msg.put || at.put) || pat.join('/'); /* || (function(){
		return (as.soul+'.')+Gun.text.hash(path.join(G)).toString(32);
	})(); // TODO: BUG!? Do we really want the soul of the object given to us? Could that be dangerous? What about copy operations? */
	if(eve){ eve.stun = true; }
	if(!id){ // polyfill async uuid for SEA
		as.via.back('opt.uuid')(function(err, id){ // TODO: improve perf without anonymous callback
			if(err){ return root.log(err) } // TODO: Handle error.
			solve(at, at.dub = at.dub || id, cat, as);
		});
		return;
	}
	solve(at, at.dub = id, cat, as);
}

function solve(at, id, cat, as){
	at.$.back(-1).get(id);
	cat.soul(id);
	delete as.stun[cat.path];
	as.batch();
}

function any(soul, as, msg, eve){
	as = as.as;
	if(!msg.$ || !msg.$._){ return } // TODO: Handle
	if(msg.err){ // TODO: Handle
		root.log("Please report this as an issue! Put.any.err");
		return;
	}
	var at = (msg.$._), data = at.put, opt = as.opt||{}, tmp;
	if((tmp = as.ref) && tmp._.now){ return }
	if(eve){ eve.stun = true; }
	if(as.ref !== as.$){
		tmp = (as.$._).get || at.get;
		if(!tmp){ // TODO: Handle
			delete as.via._.stun;
			root.log("Please report this as an issue! Put.no.get"); // TODO: BUG!??
			return;
		}
		as.data = obj_put$2({}, tmp, as.data);
		tmp = null;
	}
	if(u$7 === data){
		if(!at.get){ delete as.via._.stun; return } // TODO: Handle
		if(!soul){
			tmp = at.$.back(function(at){
				if(at.link || at.soul){ return at.link || at.soul }
				as.data = obj_put$2({}, at.get, as.data);
			});
			as.not = true; // maybe consider this?
		}
		tmp = tmp || at.soul || at.link || at.dub;// || at.get;
		at = tmp? (at.root.$.get(tmp)._) : at;
		as.soul = tmp;
		data = as.data;
	}
	if(!as.not && !(as.soul = as.soul || soul)){
		if(as.path && obj_is$6(as.data)){
			as.soul = (opt.uuid || as.via.back('opt.uuid') || root.text.random)();
		} else {
			//as.data = obj_put({}, as.$._.get, as.data);
			if(node_$2 == at.get){
				as.soul = (at.put||empty$3)['#'] || at.dub;
			}
			as.soul = as.soul || at.soul || at.link || (opt.uuid || as.via.back('opt.uuid') || root.text.random)();
		}
		if(!as.soul){ // polyfill async uuid for SEA
			as.via.back('opt.uuid')(function(err, soul){ // TODO: improve perf without anonymous callback
				if(err){ delete as.via._.stun; return root.log(err) } // Handle error.
				as.ref.put(as.data, as.soul = soul, as);
			});
			return;
		}
	}
	as.ref.put(as.data, as.soul, as);
}
var obj$7 = root.obj, obj_is$6 = obj$7.is, obj_put$2 = obj$7.put; obj$7.map; var obj_empty$1 = obj$7.empty;
var u$7, empty$3 = {}, noop = function(){}, iife = function(fn,as){fn.call(as||empty$3);};
var node_$2 = root.node._;

root.chain.get = function(key, cb, as){
	var gun, tmp;
	if(typeof key === 'string'){
		var back = this, cat = back._;
		var next = cat.next || empty$4;
		if(!(gun = next[key])){
			gun = cache(key, back);
		}
		gun = gun.$;
	} else
	if('function' == typeof key){
		if(true === cb){ return soul$1(this, key, cb, as), this }
		gun = this;
		var at = gun._, root$1 = at.root, tmp = root$1.now, ev;
		as = cb || {};
		as.at = at;
		as.use = key;
		as.out = as.out || {};
		as.out.get = as.out.get || {};
		(ev = at.on('in', use, as)).rid = rid;
		(root$1.now = {$:1})[as.now = at.id] = ev;
		var mum = root$1.mum; root$1.mum = {};
		at.on('out', as.out);
		root$1.mum = mum;
		root$1.now = tmp;
		return gun;
	} else
	if(num_is$2(key)){
		return this.get(''+key, cb, as);
	} else
	if(tmp = rel.is(key)){
		return this.get(tmp, cb, as);
	} else
	if(obj$8.is(key)){
		gun = this;
		if(tmp = ((tmp = key['#'])||empty$4)['='] || tmp){ gun = gun.get(tmp); }
		gun._.lex = key;
		return gun;
	} else {
		(as = this.chain())._.err = {err: root.log('Invalid get request!', key)}; // CLEAN UP
		if(cb){ cb.call(as, as._.err); }
		return as;
	}
	if(tmp = this._.stun){ // TODO: Refactor?
		gun._.stun = gun._.stun || tmp;
	}
	if(cb && 'function' == typeof cb){
		gun.get(cb, as);
	}
	return gun;
};
function cache(key, back){
	var cat = back._, next = cat.next, gun = back.chain(), at = gun._;
	if(!next){ next = cat.next = {}; }
	next[at.get = key] = at;
	if(back === cat.root.$){
		at.soul = key;
	} else
	if(cat.soul || cat.has){
		at.has = key;
		//if(obj_has(cat.put, key)){
			//at.put = cat.put[key];
		//}
	}
	return at;
}
function soul$1(gun, cb, opt, as){
	var cat = gun._, acks = 0, tmp;
	if(tmp = cat.soul || cat.link || cat.dub){ return cb(tmp, as, cat) }
	if(cat.jam){ return cat.jam.push([cb, as]) }
	cat.jam = [[cb,as]];
	gun.get(function go(msg, eve){
		if(u$8 === msg.put && (tmp = Object.keys(cat.root.opt.peers).length) && ++acks <= tmp){
			return;
		}
		eve.rid(msg);
		var at = ((at = msg.$) && at._) || {}, i = 0, as;
		tmp = cat.jam; delete cat.jam; // tmp = cat.jam.splice(0, 100);
		//if(tmp.length){ process.nextTick(function(){ go(msg, eve) }) }
		while(as = tmp[i++]){ //Gun.obj.map(tmp, function(as, cb){
			var cb = as[0]; as = as[1];
			cb && cb(at.link || at.soul || rel.is(msg.put) || node_soul(msg.put) || at.dub, as, msg, eve);
		} //);
	}, {out: {get: {'.':true}}});
	return gun;
}
function use(msg){
	var eve = this, as = eve.as, cat = as.at, root$1 = cat.root, gun = msg.$, at = (gun||{})._ || {}, data = msg.put || at.put, tmp;
	if((tmp = root$1.now) && eve !== tmp[as.now]){ return eve.to.next(msg) }
	//if(at.async && msg.root){ return }
	//if(at.async === 1 && cat.async !== true){ return }
	//if(root.stop && root.stop[at.id]){ return } root.stop && (root.stop[at.id] = true);
	//if(!at.async && !cat.async && at.put && msg.put === at.put){ return }
	//else if(!cat.async && msg.put !== at.put && root.stop && root.stop[at.id]){ return } root.stop && (root.stop[at.id] = true);


	//root.stop && (root.stop.id = root.stop.id || Gun.text.random(2));
	//if((tmp = root.stop) && (tmp = tmp[at.id] || (tmp[at.id] = {})) && tmp[cat.id]){ return } tmp && (tmp[cat.id] = true);
	if(eve.seen && at.id && eve.seen[at.id]){ return eve.to.next(msg) }
	//if((tmp = root.stop)){ if(tmp[at.id]){ return } tmp[at.id] = msg.root; } // temporary fix till a better solution?
	if((tmp = data) && tmp[rel._] && (tmp = rel.is(tmp))){
		tmp = ((msg.$$ = at.root.$.get(tmp))._);
		if(u$8 !== tmp.put){
			msg = obj_to$2(msg, {put: data = tmp.put});
		}
	}
	if((tmp = root$1.mum) && at.id){ // TODO: can we delete mum entirely now?
		var id = at.id + (eve.id || (eve.id = root.text.random(9)));
		if(tmp[id]){ return }
		if(u$8 !== data && !rel.is(data)){ tmp[id] = true; }
	}
	as.use(msg, eve);
	if(eve.stun){
		eve.stun = null;
		return;
	}
	eve.to.next(msg);
}
function rid(at){
	var cat = this.on;
	if(!at || cat.soul || cat.has){ return this.off() }
	if(!(at = (at = (at = at.$ || at)._ || at).id)){ return }
	cat.map; var seen;
	//if(!map || !(tmp = map[at]) || !(tmp = tmp.at)){ return }
	if((seen = this.seen || (this.seen = {}))[at]){ return true }
	seen[at] = true;
	return;
}
var obj$8 = root.obj; obj$8.map; obj$8.has; var obj_to$2 = root.obj.to;
var num_is$2 = root.num.is;
var rel = root.val.link, node_soul = root.node.soul; root.node._;
var empty$4 = {}, u$8;

var src = root;

export default src;
