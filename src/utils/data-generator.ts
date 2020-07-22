export default function dataGen (amount = 100000) {
  const data = []
  for (let i = 0; i < amount; i++) {
    data.push({
      id: Math.random().toString(36).substr(2),
      index: i,
      value: i + 1,
    })
  }
  return data
}
