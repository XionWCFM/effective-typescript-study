###📌 ITEM-15. 동적 데이터에 인덱스 시그니처 사용하기

```typescript
type IndexSignatureType = { [property: string]: string };
// [property: string]: string
// (키의 이름)  (키의 타입) (값의 타입)
```

여기서 property는 키의 위치를 표시하는 용도로 사용된다.
키의 타입이 string으로 표시 되었고,
값의 타입 또한 string으로 표시됐다.

사실 Object.entries를 사용하거나 타입 단언을 사용하는 것이 더 좋다.

왜냐면 인덱스 시그니처를 사용하게 다음 다음과 같은 단점들이 있기 때문이다.

- 모든 키를 허용한다. : 객체에는 없는 키를 이용하더라도 타입 체크에서 에러가 나지 않는다.
- 특정 키가 필요하지 않는다. : 빈 오브젝트{}도 할당이 된다.
- 키마다 다른 타입을 가질 수 없다. : 값의 타입을 유니온 타입을 통해 타입을 확장 시켜야 한다.
  타입스크립트의 언어 서비스를 제공받을 수 없다.

따라서 `Record`를 사용해서 해결할 수 있다.

```typescript
type Vec3D = { [k in "x" | "y" | "z"]: number };
```

또한 매핑된 타입은 키마다 별도의 타입을 사용하고 싶다면

```typescript
type Vec3D = { [k in "x" | "y" | "name"]: k extends "name" ? string : number };
```
