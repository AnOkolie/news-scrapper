export function line(char = "-", len = 50) {
  console.log(char.repeat(len));
}

export function header(title) {
  line("=");
  console.log(`📊 ${title}`);
  line("=");
}

export function section(title) {
  console.log("\n");
  line("-");
  console.log(title);
  line("-");
}

export function bar(count, max, size = 20) {
  const ratio = max === 0 ? 0 : count / max;
  const filled = Math.round(ratio * size);
  return "█".repeat(filled) + " ".repeat(size - filled);
}

export function getColumnWidth(values, minWidth = 12, padding = 3) {
  const longest = Math.max(...values.map((v) => String(v).length));
  return Math.max(minWidth, longest + padding);
}
