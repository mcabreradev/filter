export interface BenchmarkItem {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
  city: string;
  tags: string[];
  score: number;
}

export function genDataset(size: number, seed = 42): BenchmarkItem[] {
  let s = seed;
  const rand = (): number => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const cities = ['Berlin', 'Paris', 'London', 'Madrid', 'Rome', 'Lisbon'];
  const names = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
  const tags = ['a', 'b', 'c', 'd', 'e'];
  const out: BenchmarkItem[] = [];
  for (let i = 0; i < size; i++) {
    out.push({
      id: i,
      name: names[i % names.length],
      email: `user${i}@example.com`,
      age: 18 + Math.floor(rand() * 60),
      active: rand() > 0.4,
      city: cities[i % cities.length],
      tags: [tags[i % tags.length], tags[(i + 2) % tags.length]],
      score: Math.floor(rand() * 1000),
    });
  }
  return out;
}
