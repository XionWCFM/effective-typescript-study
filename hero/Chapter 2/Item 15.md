## Item 15 - 동적 데이터에 인덱스 시그니처 사용하기

### 인덱스 시그니처?

```ts
type Rocket = {[property: string]: string};
const rocket: Rocket = {
  name: 'Falcon 9',
  variant: 'v1.0',
  thrust: '4,940 kN',
};
```
여기서 `[property: string]: string`가 인덱스 시그니처 입니다.

- 단점
  - 잘못된 키를 포함해 모든 키를 허용합니다.
  - 특정 키가 필요하지 않습니다. ( {} 같은 것도 허용 )
  - 키마다 다른 타입을 가질 수 없습니다.
  - 자동 완성 기능이 동작하지 않습니다.

따라서 인덱스 시그니처는 부정확할 수 있기 때문에 동적 데이터를 표현할 때 사용해야 합니다.

예를 들어, CSV 파일처럼 헤더 행에 열 이름이 있고, 데이터 행을 열 이름과 갓으로 매핑하는 객체로 나타내고 싶은 경우가 있습니다.
```ts
function parseCSV(input: string): {[columnName: string]: string}[] {
  const lines = input.split('\n');
  const [header, ...rows] = lines;
  return rows.map(rowStr => {
    const row: {[columnName: string]: string} = {};
    rowStr.split(',').forEach((cell, i) => {
      row[header[i]] = cell;
    });
    return row;
  });
}
```

<br>

### 인덱스 시그니처로 모델링하지 말아야 할 경우

```ts
interface Row1 { [column: string]: number }  // 너무 넓음
interface Row2 { a: number; b?: number; c?: number; d?: number }  // 최선
type Row3 =
    | { a: number; }
    | { a: number; b: number; }
    | { a: number; b: number; c: number;  }
    | { a: number; b: number; c: number; d: number }; // 정확한데 귀찮음
```

1. `Record`를 사용해서 대체하기

  `Record`는 키 타입에 유연성을 제공하는 제너릭 타입
  ```ts
  type Vec3D = Record<'x' | 'y' | 'z', number>;
  // Type Vec3D = {
  //   x: number;
  //   y: number;
  //   z: number;
  // }
  ```

2. 매핑된 타입 사용하기

  매핑된 타입은 키마다 별도의 타입을 사용하게 해줍니다.
  ```ts
  type Vec3D = {[k in 'x' | 'y' | 'z']: number};
  // 위와 아래는 같음
  type ABC = {[k in 'a' | 'b' | 'c']: k extends 'b' ? string : number};
  // Type ABC = {
  //   a: number;
  //   b: string;
  //   c: number;
  // }
  ```

<br>

### 요약

- 런타임 때까지 객체의 속성을 알 수 없을 때만 인덱스 시그니처 사용하기
- 안전한 접근을 위해서 인덱스 시그니처의 값 타입에 undefined를 추가하는 것을 고려하기
- 가능하다면 인터페이스, Record, 매핑된 타입 같은 인덱스 시그니처보다 정확한 타입 사용하기