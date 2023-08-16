###📌 ITEM-7.타입이 값들의 집합이라고 생각하기

- `interface`에서 `'&'`연산자는 집합에 적용됩니다.

```typeScript
interface Person {
    name: string;
}

interface Lifespan {
    age: number;
    city: string;
}

type Info = Person & Lifespan

const a:Info = {
    name: 'daeun',
    age: 19,
    city: 'seoul',
}
```

위와 같이 `Info` type은 `Person`과 `Lifespan`의 교집합 즉, 공집합인 `never`일 것 같지만 그게 아닌, 합집합을 의미하게 됩니다. `name`, `age`, `city`를 모두 포함한 객체여야 타입체크가 통과됩니다.

<br>
하지만 두 인터페이스의 유니온에서는 그렇지 않습니다.

- `interface`의 유니온

```typescript
interface Person {
  name: string;
}

interface Lifespan {
  age: number;
  city: string;
}

// K의 type이 never입니다.
type K = keyof (Person | Lifespan);
```

위의 코드에서 `Person`과 `Lifespan`의 유니온 타입에 속하는 값은 교집합을 의미합니다. 따라서 아무 값도 없으므로 type은 `never`가 됩니다.

```typescript
interface Person {
  name: string;
  age: number;
}

interface Lifespan {
  age: number;
  city: string;
}

type K = keyof (Person | Lifespan);

const a: K = "age";
```

하지만 위와 같이 `Person`에 `age`프로퍼티를 추가 하게 된다면, a는 `age`가 되어야합니다.

<br>
따라서 조금 더 명확히 적어보자면
```typescript
keyof (A&B) = (keyof A) | (keyof B)
keyof (A|B) = (keyof A) & (keyof B)
```
<br>

- 배열과 튜플의 관계

```typescript
const list = [1, 2];
const tuple: [number, number] = list;
```

위와 같이 설정하게 되면 `number[]`은 `[number, number]`의 부분 집합이 아니기 때문에 할당할 수 없습니다. (하지만 반대로 할당하면 동작합니다.)
<br>

- 타입스크립트 용어와 집합용어
  - never : ø (공집합)
  - 리터럴타입 : 원소가 1개인 집합
  - 값이 T에 할당 가능 : `값 ∈ T`
  - T1이 T2에 할당 가능 : `T1 ⊂ T2`
  - T1이 T2를 상속 : `T1 ⊂ T2 (T1이 T2의 부분집합)`
  - T1 | T2 (T1과 T2의 유니온) : `T1과 T2의 합집합`
  - T1 & T2 (T1과 T2의 인터섹션): `T1과 T2의 교집합`

<br>
### 요약
- 타입 연산은 집합 범위에 적용됩니다. A와 B의 인터섹션은 A의 범위와 B의 범위의 인터섹션입니다.
- 객체 타입에서는 `A & B`은 A와 B의 속성을 모두 가짐을 이야기합니다.
- `A는 B를 상속`, `A는 B에 할당 가능`, `A는 B의 서브타입`은 `A는 B의 부분집합`과 같은 의미입니다.
