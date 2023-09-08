# 타입과 인터페이스의 차이점 알기

타입스크립트에서 명명된 타입을 정의하는 방법은 두 가지가 있음

- type
- interface

### type

```tsx
type TState = {
  name: string;
  capital: string;
};
```

### interface

```tsx
interface IState {
  name: string;
  capital: string;
}
```

> 인터페이스 대신 클래스를 사용할 수도 있지만 클래스는 값으로도 쓰일 수 있어 주의해야함.

### type과 interface의 비슷한 점

- 추가 속성과 함께 할당하면 동일한 오류가 발생

```tsx
const wyoming: TState = {
  name: 'Wyoming',
  capital: 'Cheyenne',
  population: 500_000,
  // ~~~~~~~~~~~~ ... 형식은 'TState' 형식에 할당할 수 없습니다.
  //              개체 리터럴은 알려진 속성만 지정할 수 있으며
  //              'TState' 형식에 'population'이(가) 없습니다.
};
```

- 인덱스 시그니처

```tsx
type TDict = { [key: string]: string };
interface IDict {
  [key: string]: string;
}
```

- 함수 타입

```tsx
type TFn = (x: number) => string;
interface iFN {
  (x: number): string;
}
```

> 단순한 함수라면 타입 별칭이 더 나은 석태임.

- 제네릭 가능

```tsx
type TPair<T> = {
  first: T;
  second: T;
};
interface IPair<T> {
  first: T;
  second: T;
}
```

- 인터페이스는 타입을 확장, 타입은 인터페이스를 확장

```tsx
interface IStateWithPop extends TState {
  population: number;
}
type TStateWithPop = IState & { population: number };
```

> 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지 못함, 복잡한 타입을 확장하고 싶다면 타입과 `&`를 사용해야 함.

- 클래스를 구현할 때 타입과 인터페이스 둘 다 사용 가능

```tsx
class StateT implements TState {
  name: string = '';
  capital: string = '';
}

class StateI implements IState {
  name: string = '';
  capital: string = '';
}
```

### type과 interface의 차이점

- 유니온 타입은 있지만 유니온 인터페이스는 없다.

```tsx
type AorB = A | B;
```

- 튜플과 배열 타입은 `type` 키워드를 이용해 더 간결하게 표현할 수 있다.

```tsx
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];

// 인터페이스로도 튜플과 비슷하게 구현 가능함.
interface Tuple {
  0: number;
  1: number;
  length: 2;
}
const t: Tuple = [10, 20]; // 정상
```

> 인터페이스로 튜플과 비슷하게 구현할 수 있지만 `concat`과 같은 메서드를 사용할 수 없음. 그러므로 튜플은 `type`을 사용해 구현하는 것이 더 좋음.

- 인터페이스는 타입 병합이 가능하다.

이름이 동일한 인터페이스를 병합할 경우 마지막으로 선언된 인터페이스가 가장 높은 우선순위를 가진다.

```tsx
interface Cloner {
  clone(animal: Animal): Animal;
}
interface Cloner {
  clone(animal: Sheep): Sheep;
}
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}

// --- 병합 후 인터페이스 Cloner는 아래와 같은 구조를 가진다.
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

### 결론

- 인터페이스보다 타입 별칭을 더 많이 사용한다.
- 프로퍼티가 추가되는 것을 원하지 않는다면 타입 별칭을 사용한다.
- 복잡한 타입이라면 고민할 것도 없이 타입 별칭을 사용한다.
- 스타일, API 등 확립되지 않은 프로젝트라면, 향후 보강의 가능성을 염두에 두고 인터페이스를 사용하는 것이 좋다.
