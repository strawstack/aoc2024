import math 

def valid(a, prog):
    if len(prog) == 0:
        return a
    
    pv = a
    nv = a * 8
    r = prog[len(prog) - 1]
    
    for i in range(nv, nv + 8):
        av = i
        b = av % 8
        b = b ^ 3
        c = av // (2 ** b)
        b = b ^ 5
        av = av // 8
        b = b ^ c
        if av == pv and (b % 8) == r:
            temp = prog.pop()
            res = valid(i, prog)
            if res != False: 
                return res
            prog.append(temp)

    return False

def sol():
    packs = open("input.txt").read().strip().split("\n\n") 
    prog = list(map(lambda n: int(n), packs[1].split(" ")[1].split(",")))
    
    # Example
    # b[1] = a[1] % 8
    # b[2] = b[1] ^ 3
    # c[0] = a[1] / 2 ** b[2]
    # b[7] = b[2] ^ 5
    # a[0] = a[1] / 2 ** 3
    # b[7] = b[7] ^ c[0]
    # out[7] <- b[7] % 8

    ans = valid(0, prog[:])
    return ans

print(sol())