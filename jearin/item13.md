### 타입과 인터페이스 차이점 알기

**타입과 인터페이스의 유사한점**

```typescript
type TState = {
  name: string;
  capital: string;
};

interface IState {
  name: string;
  capital: string;
}
```

- 대부분의 경우에는 타입과 인터페이스 모두 사용해도 된다.
- 추가 속성과 함께 할당한다면 동일한 오류가 발생한다.

  ```typescript
  const wyoming: TState = {
    name: 'Wyoming',
    capital: 'Cheyenne',
    population: 500_000,
    // Type '{ name: string; capital: string; population: number; }' is not assignable to type 'TState'
  };
  ```

- 인덱스 시그니처는 인터페이스와 타입 모두 사용할 수 있다.

  ```typescript
  type TDict = { [key: string]: string };
  interface IDict {
    [key: string]: string;
  }
  ```

- 함수 타입도 인터페이스와 타입 모두 사용가능하다.

  ```typescript
  type TFn = (x: number) => string;
  interface IFn {
    (x: number): string;
  }
  ```

- 타입별칭과 인터페이스는 모두 제너릭이 가능하다.

  ```typescript
  type TPair<T> = {
    first: T;
    second: T;
  };

  interface IPair<T> {
    first: T;
    second: T;
  }
  ```

{% hint="info"%}

### 인덱스 시그니처 (Index Signature)

`{ [Key: T]: U }` 형식으로 객체가 여러 Key를 가질 수 있으며, Key와 매핑되는 Value를 가지는 경우 사용한다.

### Usage

```typescript
type userType = {
  [key: string]: string;
};

let user: userType = {
  홍길동: '사람',
  둘리: '공룡',
};

// Key의 타입은 string이며 Value의 타입은 string, number, boolean인 경우
type userType = {
  [key: string]: string | number | boolean;
};

let user: userType = {
  name: '홍길동',
  age: 20,
  man: true,
};
```

{% endhint %}

**타입과 인터페이스의 차이점**

- 유니온 타입은 있지만 유니온 인터페이스라는 개념은 없다.

  - 인터페이스는 타입을 확장할 수 있지만, 유니온은 할 수 없다.
  - 유니온 타입을 확장하려면

    1. 하나의 변수명으로 매핑하는 인터페이스를 만들어야 한다.

       ```typescript
       type Input = {
         /*...*/
       };
       type Output = {
         /*...*/
       };
       interface VariableMap {
         [name: string]: Input | Output;
       }
       ```

    2. 유니온 타입에 name 속성을 붙인 타입을 만들어야 한다.

       ```typescript
       type NamedVariable = (Input | Output) & { name: string };
       ```

- type 키워드를 통해 튜플과 배열 타입을 간결하게 표현할 수 있다.

  ```typescript
  type Pair = [number, number];
  type StriingList = string[];
  type NamedNums = [string, ...number[]];
  ```

- 인터페이스는 보강이 가능하다. (타입에는 없는 기능)

  ```typescript
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
    population: 500_000,
  }; // ok
  ```

  - 속성을 확장하는 것을 **_선언 병합_**이라고 한다.
  - 주로 타입 선언 파일에서 사용된다.

_<mark style="color:red;">**타입과 인터페이스 중 어느 것을 사용해야할까?**</mark>_

- 타입이 복잡하다면 타입별칭을 사용하자.
- 일관된 스타일을 사용하자.(타입을 사용하고 있다면 일관되게 타입을 사용할 것.)
- 스타일이 확립되지 않은 프로젝트라면, 보강의 가능성이 있을 지 생각하자.

---
