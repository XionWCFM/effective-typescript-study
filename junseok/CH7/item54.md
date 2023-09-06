# CH7. 코드를 작성하고 실행하기 

## ITEM 54. 객체를 순회하는 노하우 

```ts
const obj = {
  one: 'uno',
  two: 'dos',
  three: 'tres',
};
for (const k in obj) {
  const v = obj[k];
         // ~~~~~~ Element implicitly has an 'any' type
         //        because type ... has no index signature
}
```
위와 같은 오류가 발생하는 이유는 k의 타입은 `string`인 반면, obj 객체에는 'one', 'two', 'three' 세 개의 키만 존재하기 때문입니다. 따라서 다음과 같은 제한이 필요합니다. 

```ts
const obj = {
  one: 'uno',
  two: 'dos',
  three: 'tres',
};
let k: keyof typeof obj
for ( k in obj) {
  const v = obj[k];
}
```

- 이러한 타입 문제 없이, 단지 객체의 키와 값을 순회하고 싶다면 `Object.entries`를 사용하면 됩니다. 일반적으로 이러한 방식은 키와 값의 타입을 다루기 까다롭습니다.

```ts
interface ABC {
  a: string;
  b: string;
  c: number;
}
function foo(abc: ABC) {
  for (const [k, v] of Object.entries(abc)) {
    k  // Type is string
    v  // Type is any
  }
}
```
