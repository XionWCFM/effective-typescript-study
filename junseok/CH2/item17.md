# 2장 타입스크립트의 타입 시스템

## ITEM17. 변경 관련된 오류 방지를 위해 readonly 사용하기 (readonly)
readonly의 특징은 다음과 같습니다. 
- 배열의 요소를 읽을 수 있지만, 쓸수는 없습니다.
- length를 읽을 수 있지만, 바꿀 수는 없습니다.
- 배열을 변경하는 pop을 비롯한 다른 메거드를 호출할 수 없습니다. 

- 기본적으로 readonly의 동작 방식은 `얕은 복사` 입니다. 따라서 라이브러리를 사용하는게 편합니다. ts-essentials에 있는 DeppReadonly 등이 있습니다.
```ts
interface Outer {
  inner: {
    x: number;
  }
}
const o: Readonly<Outer> = { inner: { x: 0 }};
o.inner = { x: 1 };
// ~~~~ Cannot assign to 'inner' because it is a read-only property
o.inner.x = 1;  // OK
type T = Readonly<Outer>;
// Type T = {
//   readonly inner: {
//     x: number;
//   };
// }
```

