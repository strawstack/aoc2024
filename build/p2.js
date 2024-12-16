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

// day/15/p2.js
function sol(data) {
  data = data.trim().split("\n\n");
  const { boxes, walls, player } = (() => {
    const grid = data[0].split("\n").map((line) => line.split(""));
    const boxes2 = {};
    const walls2 = {};
    const player2 = { x: null, y: null };
    grid.forEach((_, y) => {
      grid[y].forEach((c, x) => {
        if (c === "#") {
          walls2[hash({ x: 2 * x, y })] = true;
          walls2[hash({ x: 2 * x + 1, y })] = true;
        } else if (c === "O") {
          boxes2[hash({ x: 2 * x, y })] = { x: 2 * x + 1, y };
          boxes2[hash({ x: 2 * x + 1, y })] = { x: 2 * x, y };
        } else if (c === "@") {
          player2.x = 2 * x;
          player2.y = y;
        }
      });
    });
    return { boxes: boxes2, walls: walls2, player: player2 };
  })();
  const dirs = data[1].split("\n").join("").split("").map((s) => {
    const lookup = {
      "^": "UP",
      ">": "RIGHT",
      v: "DOWN",
      "<": "LEFT"
    };
    return dir[lookup[s]];
  });
  return solve({ boxes, walls, player, dirs });
}
function findOpenSpace(pos, push_dir, { boxes, walls }, seen, collect) {
  const h = hash(pos);
  if (h in seen)
    return true;
  if (h in walls)
    return false;
  if (h in boxes) {
    const b1 = pos;
    const b1h = hash(b1);
    collect[b1h] = b1;
    seen[b1h] = true;
    const r1 = findOpenSpace(b1.add(push_dir), push_dir, { boxes, walls }, seen, collect);
    const b2 = boxes[h];
    const b2h = hash(b2);
    collect[b2h] = b2;
    seen[b2h] = true;
    const r2 = findOpenSpace(b2.add(push_dir), push_dir, { boxes, walls }, seen, collect);
    if (!r1)
      return false;
    if (!r2)
      return false;
    return true;
  } else {
    return true;
  }
}
function openSpace(start, push_dir, { boxes, walls }) {
  const seen = {};
  const collect = {};
  const res = findOpenSpace(start, push_dir, { boxes, walls }, seen, collect);
  let lst = null;
  if (push_dir.x === 0) {
    if (push_dir.y === -1) {
      lst = collect.values().sort((a, b) => a.y - b.y);
    } else {
      lst = collect.values().sort((a, b) => b.y - a.y);
    }
  } else {
    if (push_dir.x === -1) {
      lst = collect.values().sort((a, b) => a.x - b.x);
    } else {
      lst = collect.values().sort((a, b) => b.x - a.x);
    }
  }
  return res ? lst : false;
}
function solve({ boxes, walls, player, dirs }) {
  for (const dir2 of dirs) {
    const t = player.add(dir2);
    const h = hash(t);
    if (h in walls)
      continue;
    if (h in boxes) {
      const push_dir = t.sub(player);
      const boxList = openSpace(t, push_dir, { boxes, walls });
      if (boxList) {
        player = t;
        for (let box of boxList) {
          const p = hash(box);
          delete boxes[p];
          const n = hash(box.add(push_dir));
          const value = box.add(push_dir);
          boxes[n] = value;
        }
      }
    } else {
      player = t;
    }
  }
  const seen = {};
  return boxes.values().reduce((a, { x, y }) => {
    const h = hash({ x, y });
    const o = boxes[hash({ x, y })];
    const oh = hash(o);
    if (h in seen || oh in seen)
      return a;
    seen[h] = true;
    seen[hash(o)] = true;
    const value = Math.min(100 * y + x, 100 * o.y + o.x);
    return a + value;
  }, 0);
}
prototypes();
var test2 = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`;
console.log(sol(test2));
