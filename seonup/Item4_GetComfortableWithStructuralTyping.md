# 아이템4. 구조적 타이핑에 익숙해지기

타입스크립트는 객체가 어떤 타입에 부합하는 변수와 메서드를 가질 경우 객체를 해당 타입에 속하는 것으로 간주하는 덕 타이핑(duck typing) 기반의 자바스크립트를 모델링하여, 매개변수 값이 요구사항을 만족한다면 타입이 무엇인지 신경 쓰지 않고 동작한다. 이를 구조적 타이핑(structural typing)이라 하는데, 구조적 타이핑은 **타입 간의 관계를 선언하지 않고도 구조적으로 동일한 타입을 가지면 허용해주는 것**을 말한다.

```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}

const v: NamedVector = { x: 3, y: 4, name: 'Zee' };

calculateLength(v); // OK, result is 5
```

## 구조적 타이핑은 오류를 발생시킬 수 있다

```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

function normalize(v: Vector3D) {
  const length = calculateLength(v);

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}

normalize({ x: 3, y: 4, z: 5 }); // => { x: 0.6, y: 0.8, z: 1 }로 예상밖의 결과를 출력함
```

위 코드는 구조적 타이핑으로 인해 원하는 결과값을 얻을 수 없는 문제가 발생한 예제이다. `normalize`의 인수로 전달된 값은 `Vector3D` 타입인데 함수 내부에서 `calculateLength`에 전달되는 인수는 구조적 타이핑에 의해 `Vector2D`로 연산되어 `z` 속성이 무시되었다.

함수를 작성할 때 타입을 선언하면 의도한 매개변수만 함수의 인수로 전달될 것이라 생각하지만, **타입스크립트의 타입은 열려있기 때문에(타입의 확장에 열려있다) 타입에 선언된 속성 외에 임의의 속성을 추가하더라도 오류가 발생하지 않는다.**

클래스 역시 구조적 타이핑 규칙을 따른다. 때문에 클래스의 인스턴스가 예상과 다를 수 있음을 인지해야 한다.

## 구조적 타이핑은 유닛 테스트 구현에 용이하다

구조적 타이핑을 사용하면 실제 DB 모킹하지 않아도 DB 인터페이스를 사용하여 간단하게 테스트 코드를 작성할 수 있다.

```ts
interface PostgresDB {
  runQuery: (sql: string) => any[];
}
interface Author {
  first: string;
  last: string;
}
interface DB {
  runQuery: (sql: string) => any[];
}

function getAuthors(database: DB): Author[] {
  const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`);
  return authorRows.map((row) => ({ first: row[0], last: row[1] }));
}

test('getAuthors', () => {
  const authors = getAuthors({
    runQuery(sql: string) {
      return [
        ['Toni', 'Morrison'],
        ['Maya', 'Angelou'],
      ];
    },
  });
  expect(authors).toEqual([
    { first: 'Toni', last: 'Morrison' },
    { first: 'Maya', last: 'Angelou' },
  ]);
});
```
