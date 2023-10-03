# 아이템 22. 타입 좁히기

타입을 좁히는 방법은 여러가지가 있다.

- 분기문으로 타입을 체크한다.
- `instanceof`를 사용한다.
- `Array.isArray` 같은 내장 함수를 사용한다.
- 명시적 태그 === 태그된 유니온(tagged union) === 구별된 유니온(discriminated union) 패턴을 사용한다.
- 커스텀 함수를 도입한다. (사용자 정의 타입 가드)

## 사용자 정의 타입 가드 사용하기

사용자 정의 타입 가드를 이용하면 배열, 객체의 타입을 좁히는 데 유용하다.
아래 예제는 배열에서 어떤 탐색을 수행할 때 undefined가 될 수 있는 타입을 걸러내는 과정을 보여준다.

```ts
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
const members = ['Janet', 'Michael'].map((who) =>
  jackson5.find((n) => n === who)
); // type members = (string | undefined)[];
```

위 코드에서 undefined를 걸러내기 위해 filter 함수를 사용하면, 원하는 대로 undefined가 걸러지지 않는다.

```ts
const members = ['Janet', 'Michael']
  .map((who) => jackson5.find((n) => n === who))
  .filter((who) => who !== undefined); // type members = (string | undefined)[];
```

이때 사용자 정의 타입 가드를 사용하면 타입을 좁힐 수 있다.

```ts
function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

const members = ['Janet', 'Michael']
  .map((who) => jackson5.find((n) => n === who))
  .filter(isDefined); // type members = string[];
```
