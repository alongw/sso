export const sleep = async (t: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, t))
}
