import math
import re

def solve(info):
    big = 10000000000000
    [ax, ay, bx, by, px, py] = info
    
    px += big
    py += big

    am = ay / ax
    bm = by / bx
    ab = py - (am * px)
    xi = ab / (bm - am)
    yi = bm * xi

    bt = round(xi / bx)
    at = round((px - xi) / ax)

    if ((bt * bx + at * ax) == px) and ((bt * by + at * ay) == py):
        return 3 * at + bt
    return 0

def sol():
    packs = open("input.txt").read().strip().split("\n\n")

    total = 0
    for pack in packs:
        res = list(map(
            lambda x: float(x),
            re.findall("\d+", pack.replace("\n", ""))
        ))
        total += solve(res)
    
    return total

print(sol())