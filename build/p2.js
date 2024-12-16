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
function hash(value) {
  return JSON.stringify(value);
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
var dir = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  UP_RIGHT: { x: 1, y: -1 },
  DOWN_RIGHT: { x: 1, y: 1 },
  DOWN_LEFT: { x: -1, y: 1 },
  UP_LEFT: { x: -1, y: -1 }
};

// day/16/p2.js
function rot(d) {
  const lookup = {
    UP: "RIGHT",
    RIGHT: "DOWN",
    DOWN: "LEFT",
    LEFT: "UP"
  };
  return lookup[d];
}
function follow(pos, parent, tiles) {
  let cur = pos;
  while (true) {
    const hc3 = hash3(cur.pos, cur.face);
    tiles[hash(cur.pos)] = true;
    cur = parent[hc3];
    if (!cur)
      break;
  }
}
function dij({ end, walls, visited, dist, heap: heap2, parent, tiles, best }) {
  while (heap2.length > 0) {
    const { key, pos, face } = heap2.pop();
    if (pos.eq(end)) {
      if (best === null)
        best = dist[key];
      if (dist[key] === best) {
        debugger;
        follow({ pos, face }, parent, tiles);
      }
      continue;
    }
    const edges = [
      {
        face,
        cost: 1
      },
      {
        face: rot(face),
        cost: 1000 + 1
      },
      {
        face: rot(rot(rot(face))),
        cost: 1000 + 1
      }
    ];
    for (const { face: face2, cost } of edges) {
      const t1 = pos.add(dir[face2]);
      const h3 = hash3(t1, face2);
      if (not(hash(t1) in walls)) {
        const isNew = not(h3 in dist);
        if (isNew || dist[key] + cost < dist[h3]) {
          dist[h3] = dist[key] + cost;
          parent[h3] = { pos, face: face2 };
          if (isNew) {
            heap2.push({
              key: h3,
              pos: t1,
              face: face2
            });
          }
        }
      }
    }
    heap2.sort((a, b) => dist[b.key] - dist[a.key]);
  }
  return;
}
function hash3({ x, y }, face) {
  return `${x}:${y}:${face}`;
}
function print(walls, tiles, grid) {
  const height = grid.length;
  const width = grid[0].length;
  for (let y = 0;y < height; y++) {
    const row = [];
    for (let x = 0;x < width; x++) {
      const h = hash({ x, y });
      if (h in walls) {
        row.push("#");
      } else if (h in tiles) {
        row.push("O");
      } else {
        row.push(".");
      }
    }
    console.log(row.join(""));
  }
  console.log("");
}
function sol(data) {
  const { start, end, walls } = (() => {
    const grid = data.trim().split("\n").map((line) => line.split(""));
    const start2 = { x: null, y: null };
    const end2 = { x: null, y: null };
    const walls2 = {};
    grid.forEach((_, y) => {
      grid[y].forEach((c, x) => {
        if (c === "S") {
          start2.x = x;
          start2.y = y;
        } else if (c === "E") {
          end2.x = x;
          end2.y = y;
        } else if (c === "#") {
          walls2[hash({ x, y })] = { x, y };
        }
      });
    });
    return { start: start2, end: end2, walls: walls2 };
  })();
  const dist = {};
  const face = "RIGHT";
  const h3 = hash3(start, face);
  dist[h3] = 0;
  const myheap = [{
    key: h3,
    pos: start,
    face
  }];
  const parent = {
    [h3]: null
  };
  const tiles = {};
  dij({
    end,
    walls,
    visited: {},
    dist,
    heap: myheap,
    parent,
    tiles,
    best: null
  });
  print(walls, tiles, data.trim().split("\n"));
  return `Ans: ${tiles.keys().length}`;
}
prototypes();
var test_45 = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;
var test_64 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;
console.log(sol(test_45));
console.log(sol(test_64));
