let id = 0;
export default function newId(label: string) {
  return label + ++id;
}
