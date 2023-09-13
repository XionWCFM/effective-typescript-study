# 아이템11. 잉여 속성 체크의 한계 인지하기

## 잉여 속성 체크

```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}

const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  etc: 'etc', // ts Error: Type '{ numDoors: number; ceilingHeightFt: number; etc: string; }' is not assignable to type 'Room'. Object literal may only specify known properties, and 'etc' does not exist in type 'Room'.
};
```

- 할당 가능 검사와 별도의 과정에서 수행된다.
- 타입 시스템의 구조적 본질을 해치지 않으면서 객체 리터럴에 알 수 없는 속성을 허용하지 않는다.
- 할당문에 객체 리터럴이 올 경우 잉여 속성 체크가 동작하지만, 그 밖의 임시변수 등이 올 경우 동작하지 않는다.

  ```ts
  const obj = {
    numDoors: 1,
    ceilingHeightFt: 10,
    etc: 'etc',
  };

  const r: Room = obj; // 정상: 우항의 값이 객체 리터럴이 아니기 때문에 잉여 속성 체크가 동작하지 않고 구조적 타이핑에 의해 에러가 발생하지 않게 된다.
  ```

- 함수의 매개변수로 전달될 때도 잉여 속성 체크가 수행된다.

## 공통 속성 체크

```ts
interface LineChartOptions {
  logscale?: boolean;
  inveertedYAxis?: boolean;
  areeaChart?: boolean;
}

const opts = { logScale: true };
const o: LineChartOptions = opts; // Type '{ logScale: boolean; }' has no properties in common with type 'LineChartOptions'.
```

- 선언 타입에 공통된 속성이 있는지 확인하는 별도의 체크
- 선택적 속성만 가지는 약한(weak) 타입에서 동작함
