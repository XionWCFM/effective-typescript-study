# 한꺼번에 객체 생성하기

객체를 선언할 떄 한꺼번에 만드는게 가장 좋다.

```ts
interface Point {
  x: number;
  y: number;
}

const pt: Point = {
  x: 3,
  y: 4,
};
```

작은 객체들을 조합해서 큰 객체를 만들어야 하는 경우에도 여러 단계를 거치는 것은 좋지 않은 생각이다.

```ts
const pt = { x: 3, y: 4 };
const id = { name: 'Pythgoras' };
const namedPoint = {};
Object.assign(namedPoint, pt, id);
namedPoint.name;
// ~~~~~ '{}' 형식에 'name' 속성이 없습니다.
```

다음과 같이 '객체 전개 연산자' `...`를 사용하면 큰 객체를 한꺼번에 만들어 낼 수 있다.

```ts
const namedPoint = { ...pt, ...id };
namedPoint.name; // 정상, 타입이 string
```

타입에 안전한 조건부 속성을 추가하려면 속성을 추가하지 않는 `null` 또는 `{}`으로 객체 전개를 사용하면 된다.

```ts
declare let hasMiddle: boolean;
const firstLast = { first: 'Harry', last: 'Truman' };
const president = { ...firstLast, ...(hasMiddle ? { middle: 'S' } : {}) };
```

편집기에서 `president` 심벌에 마우스를 올려보면 타입이 선택적 속성을 가진 것으로 추론되는 것을 확인할 수 있다.

```ts
const president: {
  middle?: string;
  first: string;
  last: string;
};
```

전개 연산자로 한꺼번에 여러 속성을 추가할 수도 있다.

```ts
declare let hasDates: boolean;
const nameTitle = { name: 'Khufu', title: 'Pharaoh'};
const pharaoh = {
    ...nameTitle,
    ...(hasDates ? { start: -2589, end: -2566} : {});
}
```

편집기에서 `pharaoh` 심벌에 마우스를 올려 보면, 이제는 타입이 유니온으로 추론된다.

```ts
const pharaoh:
  | {
      start: number;
      end: number;
      name: string;
      title: string;
    }
  | {
      name: string;
      title: string;
    };
```

`start`와 `end`가 선택적 필드가 되기를 원했다면 이런 결과가 당황스럽다. 이 타입에서는 `start`를 읽을 수가 없다. 다음과 같이 헬퍼 함수를 사용하면 유니온보다 선택적 필드를 다루기 더 쉽다.

```ts
function addOptional<T extends object, U extends object>(
  a: T,
  b: U | null
): T & Partial<U> {
  return { ...a, ...b };
}

const pharaoh = addOptional(
  nameTitle,
  hasDates ? { start: -2589, end: -2566 } : null
);
pharaoh.start; // 정상, 타입이 number | undefined;
```
