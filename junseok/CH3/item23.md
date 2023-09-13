# 3장 타입스크립트의 타입 추론

## ITEM23. 객체 한번에 정의하기(all at once)

- 속성을 제각각 추가하지 말고 **한꺼번에 객체로 만들어야 합니다.** 안전한 타입으로 속성을 추가하려면 객체 전개 `({...a, ...b})`를 사용하면 됩니다. 

- 객체에 조건부로 속성을 추가하는 방법을 익히도록 합니다.

#### 선택적 필드 방식으로 표현하기
```ts
declare let hasMiddle: boolean;
const firstLast = {first: 'Harry', last: 'Truman'};
function addOptional<T extends object, U extends object>(
  a: T, b: U | null
): T & Partial<U> {
  return {...a, ...b};
}

const president = addOptional(firstLast, hasMiddle ? {middle: 'S'} : null);
president.middle  // OK, type is string | undefined

```