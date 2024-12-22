import math

def pop(q):
    q.pop(0)

def hash(lst):
    return f"{lst[0]}:{lst[1]}:{lst[2]}:{lst[3]}"

def calculate(num, times, lookup):
    q = []
    t = num
    prev = None
    local_look = {}

    for i in range(times):
        a = (t ^ (t * 64)) % 16777216
        b = (a ^ (a // 32)) % 16777216
        c = (b ^ (b * 2048)) % 16777216
        
        prev = t % 10
        t = c
        last = t % 10

        if (len(q) == 4):
            pop(q)
            q.append(last - prev)

        else:
            q.append(last - prev)
        
        if len(q) == 4:
            h = hash(q)
            if h not in local_look:
                if h not in lookup: lookup[h] = 0
                lookup[h] += last
                local_look[h] = True

    return None

def sol():
    data = open("input.txt").read()
    nums = map(lambda x: int(x), data.strip().split("\n"))
    
    lookup = {}
    
    times = 2000
    for num in nums:
        calculate(num, times, lookup)

    best = 0
    key = None
    for k in lookup:
        if lookup[k] > best:
            best = lookup[k]
            key = k
    
    return best

print(sol())