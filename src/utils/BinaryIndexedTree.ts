// eslint-disabled

// <= n 的最大的 2^x
function power2le (n: number) {
  let sum = 1
  let tmp = 2
  while (tmp <= n) {
    sum = tmp
    tmp = sum << 1
  }
  return sum
}
class BinaryIndexedTree {
  tree!: any[]
  bitMask!: number
  constructor(nums: number[]) {
    this.__init(nums)
  }
  // 初始化树状数组，
  // O(n)
  __init (nums: number[]) {
    this.tree = Array(nums.length + 1).fill(0)
    for (let i = 0; i < nums.length; i++) {
      this.tree[i + 1] = nums[i]
    }
    for (let i = 1; i < this.tree.length; i++) {
      let j = i + (i & -i)
      if (j < this.tree.length) {
        this.tree[j] += this.tree[i]
      }
    }
    this.bitMask = power2le(nums.length - 1)
  }
  // 更改第 i 项的, 1<=i<this.tree.length
  // O(logn)
  update (i: number, val: any) {
    while (i < this.tree.length) {
      this.tree[i] += val;
      i = i + (i & -i);
    }
  }
  // 计算前 n 项的和 , 1<=n<this.tree.length
  // O(logn)
  prefixSum (n = this.tree.length - 1) {
    let sum = 0
    while (n > 0) {
      sum += this.tree[n]
      n -= n & -n
    }
    return sum
  }
  // 计算 i ~ j 项的和，
  // 也可用来获取某个位置的实际值，不过建议使用 getValue 方法，效率更高
  // 2*O(log n)
  rangeSum (i: number, j: number | undefined) {
    return this.prefixSum(j) - this.prefixSum(i - 1)
  }
  // 获取第 i 项的实际值， 1<=i<this.tree.length
  getValue (i: number) {
    let sum = this.tree[i]
    if (i > 0) {
      let z = i - (i & -i)
      i--
      while (i !== z) {
        sum -= this.tree[i]
        i -= (i & -i)
      }
    }
    return sum
  }
  // 找到一个n，其前n项和为 target
  // 要求数组非负，否则只能前n项迭代计算
  // 由于存在 0 的情况，满足条件的 n 有多个，返回其中任意一个
  // O(logn)
  find (target: number) {
    let idx = 0
    let len = this.tree.length
    let bitMask = this.bitMask
    while (bitMask != 0 && (idx < len)) {
      let tIdx = idx + bitMask
      if (target === this.tree[tIdx]) {
        return tIdx
      } else if (target > this.tree[tIdx]) {
        idx = tIdx
        target -= this.tree[tIdx]
      }
      bitMask >>= 1
    }
    if (target !== 0) {
      return -1
    } else {
      return idx
    }
  }
  // 找到最大的一个n，其前n项和为 target
  // 要求数组非负，否则只能前n项迭代计算
  // O(logn)
  findG (target: number) {
    let idx = 0
    let len = this.tree.length
    let bitMask = this.bitMask
    while (bitMask != 0 && (idx < len)) {
      let tIdx = idx + bitMask
      if (target >= this.tree[tIdx]) {
        idx = tIdx
        target -= this.tree[tIdx]
      }
      bitMask >>= 1
    }
    if (target !== 0) {
      return -1
    } else {
      return idx
    }
  }
  // 找到最小的一个n，其前n项和大于等于 target
  // O(logn)
  findGe (target: number) {
    let idx = 0
    let len = this.tree.length
    let bitMask = this.bitMask
    while (bitMask != 0 && (idx < len)) {
      let tIdx = idx + bitMask
      if (target === this.tree[tIdx]) {
        return tIdx
      } else if (target > this.tree[tIdx]) {
        idx = tIdx
        target -= this.tree[tIdx]
      }
      bitMask >>= 1
    }
    return target === 0 ? idx : (
      idx + 1 < this.tree.length ? idx + 1 : -1
    )
  }
}
export default BinaryIndexedTree