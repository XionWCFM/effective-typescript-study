## Item 13 - 타입과 인터페이스의 차이점 알기

```ts
// type
type TState = {
  name: string;
  capital: string;
}

// interface
interface IState {
  name: string;
  capital: string;
}
```

### 비슷한 점

- 상태에는 차이가 없고 동일한 오류를 뱉습니다.
- 인덱스 시그니처를 사용할 수 있습니다.
- 함수 타입도 정의 가능합니다.
- 제네릭이 가능합니다.
- 인터페이스는 타입을 확장할 수 있고 타입은 인터페이스를 확장할 수 있습니다.
  ```ts
  interface IStateWithPop extends TState {
    population: number;
  }
  type TStateWithpop = IState & {population: number;};
  ```

### 다른 점

- 인터페이스는 타입을 확장할 수 있지만, 유니온은 할 수 없습니다.
- 튜플과 배열 타입은 type 키워드로 간결하게 표현할 수 있지만, 인터페이스로는 유사하게 작성할 수 밖에 없고, 튜플의 메서드를 사용할 수 없습니다.
  ```ts
  type Pair = [number, number];
  type StringList = string[];
  type NameNums = [string, ...number[]];

  interface Tuple {
    0: number;
    1: number;
    length: 2;
  }
  ```
- 인터페이스는 보강(argument)이 가능합니다.
  ```ts
  interface IState {
    name: string;
    capital: string;
  }
  interface IState {
    population: number;
  }
  const wyoming: IState = {
    name: 'Wyoming', 
    capital: 'Cheyenne', 
    population: 500_000
  }
  ```
  이것을 선언 병합이라고 합니다.

### 타입과 인터페이스 어느 것을 선택해서 사용해야할까?

- 복잡한 타입이라면 타입 별칭을 사용하는 것이 좋습니다.
- 간단한 객체 타입이라면, 일관성있게 인터페이스를 사용하고 있었다면 인터페이스, 타입을 사용하고 있었다면 타입을 사용합니다.
- 보강의 가능성을 따져봐서 보강이 필요한 것은 인터페이스, 아니라면 타입을 사용합니다.