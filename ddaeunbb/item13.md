###📌 ITEM-13. 타입과 인터페이스의 차이점 알기
아래와 같이 타입과 인터페이스를 사용한 구문은 같아보입니다.

```typescript
type Daeun = {
  name: string;
  age: number;
};

interface Daeun {
  name: string;
  age: number;
}
```

하지만 타입과 인터페이스와의 명확한 차이를 알아야합니다!

### 타입과 인터페이스의 공통점

- 속성 추가에 대해서 에러를 띄운다.

```typescript
type Daeun = {
  name: string;
  age: number;
};

interface Daeun1 {
  name: string;
  age: number;
}

const person: Daeun = {
  name: "person1",
  age: 12,
  city: "seoul", // 에러발생
};

const person2: Daeun1 = {
  name: "person2",
  age: 13,
  city: "seoul", // 에러발생
};
```

- 인덱스 시그니처 모두 사용할 수 있다.

```typescript
type TDict = { [key: string]: string };
interface IDict {
  [key: string]: string;
}
```

- 함수 타입 모두 설정할 수 있다.

```typescript
type TDict = (x: number) => number;
interface IDict {
  (x: number): number;
}
```

- 모두 제네릭 사용이 가능하다

```typescript
type TDict<T> = {
  first: T;
  second: T;
};

interface IDict<T> {
  first: T;
  second: T;
}
```

- 서로 확장이 가능하다

```typescript
interface IStateWithPop extends TState {
  population: number;
}

type TStateWithPop = IState & { population: number };
```

### 타입과 인터페이스의 차이점

- 인터페이스는 타입을 확장할 수는 있지만 유니온은 할 수 없다.

```typescript
type Input = {
  /* ... */
};
type Output = {
  /* ... */
};
type NamedVariable = (Input | Output) & { name: string };
```

유니온 타입에 name 속성을 붙여 타입을 확장하는 것이 필요할 수도 있지만, 인터페이스로는 표현할 수 없다.

- 튜플구현

```typescript
type Pair = [number, number];

interface Tuple {
  0: number;
  1: number;
  length: 2;
}

const A: Tuple = [1, 2]; // 타입체크통과
```

위와 같이 `A`는 만들어질 수는 있지만 `concat`과 같은 배열 메서드는 활용할 수 없습니다.
배열은 일종의 객체이기때문에 만들어지기는 하는 것입니다.

- 인터페이스는 선언 병합이 가능하다. 하지만 타입은 불가능하다.

```typescript
interface IState {
name: string;
}
interface IState {
capital: string;
}
const ex: IState = {
name: 'yongwoo';
capital: 'seoul'
}; // 정상
```
