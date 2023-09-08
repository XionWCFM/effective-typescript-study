# 동적 데이터에 인덱스 시그니처 사용하기

자바스크립트에서는 아래와 같이 바로 객체를 생성하는 간단한 문법이 있습니다.

```js
const rocket = {
  name: "Falcon 9",
  variant: "Block 5",
  thrust: "7,607 kN",
};
```

타입스크립트에서는 타입에 '인덱스 시그니처'를 명시하여 유연하게 매핑을 표현할 수 있습니다.

```ts
type Rocket = { [property: string]: string };
const rocket: Rocket = {
  name: "Falcon 9",
  variant: "Block 5",
  thrust: "7,607 kN",
};
```

하지만 위의 코드 방식은 몇 가지 단점이 드러납니다.

- 잘못된 키를 포함해 모든 키를 허용. `name` 대신 `Name`으로 작성해도 유효한 Rocket 타입이 됨.
- 특정 키가 필요하지 않음. {}도 유효한 타입임.
- 키마다 다른 타입을 가질 수 없음. 예를 들어 Rocket 타입에서 `thrust`는 string이 아닌 number여야 할 수도 있음.
- 키는 무엇이든 가능하기 때문에 자동 완성 기능과 같은 타입스크립트 언어 서비스를 사용하지 못함.

인덱스 시그니처는 동적 데이터를 표현할 때 사용합니다.

아래의 코드처럼 CSV 파일에서 header 행에 열 이름이 있고, 데이터 행을 열 이름과 값으로 매핑하는 객체로 나타내는 경우 인덱스 시그니처를 유용하게 사용할 수 있습니다.

```ts
type RowType = {
  [columnName: string]: string;
};
function parseCSV(input: string): RowType[] {
  const lines = input.split("\n");
  const [header, ...rows] = lines;
  const headerColumns = header.split(",");
  return rows.map((rowStr) => {
    const row: RowType = {};
    rowStr.split(",").forEach((cell, i) => {
      row[headerColumns[i]] = cell;
    });
    return row;
  });
}
```

만약 CSV 파일을 읽을 때 열 이름을 알고 있는 특정한 상황이라면 미리 선언해 둔 타입으로 단언문을 사용합니다.

```ts
interface ProductRow {
  productId: string;
  name: string;
  price: string;
}

declare let csvData: string;
const products = parseCSV(csvData) as unknown as ProductRow[];
```

하지만 선언해 둔 열들이 런타임에 실제로 일치한다는 보장이 없습니다. 이 부분이 걱정된다면 값 타입에 `undefined`를 추가할 수 있습니다.

```ts
function safeParseCSV(
  input: string
): { [columnName: string]: string | undefined }[] {
  return parseCSV(input);
}

const rows = parseCSV(csvData);
const prices: { [product: string]: number } = {};
for (const row of rows) {
  prices[row.productId] = Number(row.price);
}

const safeRows = safeParseCSV(csvData);
for (const row of safeRows) {
  prices[row.productId] = Number(row.price);
  // ~~~~~~ 'undefined' 형식을 인덱스 형식으로 사용할 수 없습니다.
}
```

어떤 타입에 가능한 필드가 제한되어 있는 경우라면 인덱스 시그니처로 모델링하지 말아야 합니다. 이 경우 다음과 같은 방법들을 사용할 수 있습니다.

1. Record 사용하기
   Record는 키 타입에 유연성을 제공하는 제너릭 타입입니다. 특히 string의 부분 집합을 사용할 수 있습니다.

   ```ts
   type Vec3D = Record<"x" | "y" | "z", number>;
   /* 아래와 동일
   type Vec3D = {
       x: number;
       y: number;
       z: number
   }
   */
   ```

2. 매핑된 타입을 사용
   매핑된 타입은 키마다 별도의 타입을 사용하게 해 줍니다.

   ```ts
   type Vec3D = { [k in "x" | "y" | "z"]: number };
   /* 아래와 동일
   type Vec3D = {
       x: number;
       y: number;
       z: number
   }
   */

   type ABC = { [k in "a" | "b" | "c"]: k extends "b" ? string : number };
   /*
   type ABC = {
       a: number;
       b: string;
       c: number;
   }
   */
   ```
