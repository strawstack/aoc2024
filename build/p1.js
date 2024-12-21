// day/21/input.txt
var input_default = "459A\n671A\n846A\n285A\n083A\n";

// helper.js
function prototypes() {
  const arr = {
    dropLast: function() {
      this.pop();
      return this;
    },
    unzip: function() {
      const left = [];
      const right = [];
      this.forEach((v) => {
        left.push(v[0]);
        right.push(v[1]);
      });
      return [left, right];
    },
    zip: function() {
      const res = [];
      const left = this[0];
      const right = this[1];
      for (let i = 0;i < Math.max(left.length, right.length); i++) {
        const l = i < left.length ? left[i] : null;
        const r = i < right.length ? right[i] : null;
        res.push([l, r]);
      }
      return res;
    }
  };
  const obj = {
    add: function(vec) {
      return {
        x: this.x + vec.x,
        y: this.y + vec.y
      };
    },
    sub: function(vec) {
      return {
        x: this.x - vec.x,
        y: this.y - vec.y
      };
    },
    eq: function(vec) {
      return this.x === vec.x && this.y === vec.y;
    },
    flip: function() {
      return this.mul(-1);
    },
    mul: function(s) {
      return {
        x: s * this.x,
        y: s * this.y
      };
    },
    keys: function() {
      return Object.keys(this).filter((k) => this.hasOwnProperty(k));
    },
    values: function() {
      return Object.values(this);
    },
    mag: function() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    },
    modv: function(vec) {
      const x = this.x % vec.x;
      const y = this.y % vec.y;
      return {
        x: x < 0 ? x + vec.x : x,
        y: y < 0 ? y + vec.y : y
      };
    }
  };
  for (let k in arr) {
    Object.defineProperty(Array.prototype, k, {
      value: arr[k],
      enumerable: false
    });
  }
  for (let k in obj) {
    Object.defineProperty(Object.prototype, k, {
      value: obj[k],
      enumerable: false
    });
  }
}
function not(value) {
  return !value;
}
function copy(value) {
  return JSON.parse(JSON.stringify(value));
}
function hash(value) {
  return JSON.stringify(value);
}
function inBounds(grid, { x, y }) {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}
var adj4 = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 }
];
var adj8 = [
  ...adj4,
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 }
];

// day/21/p1.js
function queue() {
  const s1 = [];
  const s2 = [];
  let len = 0;
  function push(v) {
    len += 1;
    s2.push(v);
  }
  function pop() {
    len -= 1;
    if (s1.length === 0) {
      while (s2.length > 0) {
        s1.push(s2.pop());
      }
    }
    return s1.pop();
  }
  function size() {
    return len;
  }
  return {
    push,
    pop,
    size
  };
}
function bfs(p, map, visited, grid) {
  const q = queue();
  q.push({
    pos: p,
    path: []
  });
  while (q.size() > 0) {
    const { pos, path } = q.pop();
    const hn = hash(pos);
    visited[hn] = true;
    for (const a of adj4) {
      const t = pos.add(a);
      const ht = hash(t);
      if (not(inBounds(grid, t)))
        continue;
      if (grid[t.y][t.x] === " ")
        continue;
      if (ht in visited)
        continue;
      const cpath = copy(path);
      cpath.push(a);
      map[grid[t.y][t.x]] = cpath;
      q.push({
        pos: t,
        path: cpath
      });
    }
  }
  return map;
}
function wireGrid(grid) {
  const wires = {};
  for (let y = 0;y < grid.length; y++) {
    for (let x = 0;x < grid[y].length; x++) {
      const c = grid[y][x];
      if (c === " ")
        continue;
      const map = {};
      const visited = {};
      wires[c] = bfs({ x, y }, map, visited, grid);
    }
  }
  return wires;
}
function convert(seq) {
  const lookup = {
    [hash({ x: 0, y: -1 })]: "U",
    [hash({ x: 1, y: 0 })]: "R",
    [hash({ x: 0, y: 1 })]: "D",
    [hash({ x: -1, y: 0 })]: "L"
  };
  return seq.map((p) => lookup[hash(p)]);
}
function enter(seq, pad) {
  const res = [];
  for (let i = 0;i < seq.length; i++) {
    const from = i === 0 ? "A" : seq[i - 1];
    const to = seq[i];
    const path = convert(pad[from][to]);
    for (let step of path)
      res.push(step);
  }
  return res;
}
function sol(data) {
  const codes = data.trim().split("\n");
  debugger;
  const pad0 = wireGrid([
    "789",
    "456",
    "123",
    " 0A"
  ]);
  const pad1 = wireGrid([
    " UA",
    "LDR"
  ]);
  const pad2 = wireGrid([
    " UA",
    "LDR"
  ]);
  const pad3 = wireGrid([
    " UA",
    "LDR"
  ]);
  const res = {};
  for (let code of codes) {
    let seq = code.split("");
    for (let pad of [pad0, pad1, pad2, pad3]) {
      seq = enter(seq, pad);
    }
    res[code] = {
      value: parseInt(code.slice(0, code.length - 1), 10),
      seq
    };
  }
  return res.values().reduce((a, { value, seq }) => {
    return a + value * seq.length;
  }, 0);
}
prototypes();
console.log(sol(input_default));
