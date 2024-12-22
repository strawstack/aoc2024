import math

def calculate(num, times):
    t = num
    for i in range(times):
        a = (t ^ (t * 64)) % 16777216
        b = (a ^ (a // 32)) % 16777216
        c = (b ^ (b * 2048)) % 16777216
        t = c
    return t

def sol():
    data = open("input.txt").read()
    nums = map(lambda x: int(x), data.strip().split("\n"))
    times = 2000
    total = 0
    for num in nums:
        ans = calculate(num, times)
        total += ans
    return total

print(sol())