export const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5)
}

/*
RULES / TERMINOLOGY:
- <T> = generic type. Function works with any array type.
- [...array] = copy array, so original data is not changed.
- sort + Math.random = simple shuffle for school project.
*/