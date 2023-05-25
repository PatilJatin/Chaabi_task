import faker from "faker";

export const generate = (count = 10) => {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(faker.random.word());
  }
  return words.join(" ");
};
