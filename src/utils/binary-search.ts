// 二分查找修改，找到最接近且大于等于 target 的索引

export default function binarySearch (list: number[], target: number): number {
  const length = list.length
  if (!length) return -1
  let result = -1
  let start = 0
  let end = length - 1
  while (start <= end) {
    if (start === end) return list[start] >= target ? start : -1
    const mid = (start + end) >> 1
    const midValue = list[mid]
    if (midValue === target) return mid
    if (target < midValue) {
      if (result === -1 || list[result] > midValue) {
        result = mid
      }
      end--
    } else {
      start = mid + 1
    }
  }
  return result
}
