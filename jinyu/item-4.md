# 구조적 타이핑에 익숙해지기

자바스크립트는 본질적으로 **덕 타이핑(duck typing)** 기반입니다. 덕 타이핑이란 "만약 어떤 새가 오리처럼 걷고, 헤엄치고, 꽥꽥거리는 소리를 낸다면 나는 그 새를 오리라고 부를 것이다." 이 문장처럼 객체가 어떤 타입에 부합하는 변수와 메서드를 가질 경우 객체를 해당 타입에 속하는 것으로 간주하는 방식을 말합니다.

타입스크립트 역시 자바스크립트의 런타임 동작을 모델링하므로 덕 타이핑을 그대로 모델링합니다. 하지만 타입스크립트의 타입 체커가 컴파일 단계에서 타입을 검사하기 때문에 **구조적 타이핑**이 가능합니다.

타입 체커의 타입에 대한 이해도가 사람과 조금 다르기 때문에 가끔 예상치 못한 결과가 나오기도 합니다. 때문에 구조적 타이핑을 제대로 이해한다면 오류인 경우와 오류가 아닌 경우의 차이를 알 수 있고, 더욱 견고한 코드를 작성할 수 있습니다.

다음 예제를 봅시다:

```ts
interface Vector2D {
  x: number;
  y: number;
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

const v: NamedVector = { x: 3, y: 4, name: 'jin yu' };
calculateLength(v);
```

위의 코드를 보면 `NamedVector` 구조가 `Vector2D`와 호환되기 때문에 `calculateLength` 함수를 호출할 때 `v` 변수를 전달인자로 넘겨주어도 타입 체커가 불평하지 않습니다. 여기서 **구조적 타이핑(structural typing)**이라는 용어가 사용됩니다.

구조적 타이핑 때문에 문제가 발생하기도 합니다. 타입스크립트는 타입의 확장에 **열려(open)** 있습니다. 즉, 타입에 선언된 속성 외에 임의이 속성을 추가하더라도 오류가 발생하지 않는다는 것입니다. 위의 코드에서 3D 벡터 타입과 벡터의 길이를 1로 만드는 정규화 함수를 추가해보겠습니다.

```ts
interface Vector2D {
  x: number;
  y: number;
}

// 3D 벡터
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function normalize(v: Vector3D) {
  const length = calculateLength(v);
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}

normalize({ x: 3, y: 4, z: 5 }); // output: {x: 0.6, y: 0.8, z: 1}
```

`normalize` 함수의 출력 값이 기대했던 값과 다른 결과를 출력합니다. 왜 타입스크립트는 오류를 잡지 못하였을까요?

`calculateLength`의 함수는 2D 벡터를 기반으로 연산하는데, `normalize` 함수는 3D 벡터로 연산되었습니다. `z`가 정규화에서 무시되었기 때문에 기대했던 결과와는 다른 결과가 출력되었습니다. `calculateLength` 함수는 2D 벡터를 받도록 선언되었음에도 불구하고 3D 벡터를 받는데 문제가 없었던 것일까요?

타입의 확장에 대해 열려있기 때문입니다. 구조적 타이핑 관점에서 `Vector 3D`에 `x`와 `y`가 있어 `Vector 2D`와 호환되어 오류가 발생하지 않았고 타입 체커가 문제로 인식하지 않았습니다.

호출에 사용되는 매개변수의 속성들이 매개변수의 타입에 선언된 속성만을 가질 거라 생각하기 쉬운데, 이러한 타입을 '봉인된(sealed)' 또는 '정확한(precise)' 타입이라고 부릅니다.

타입스크립트의 타입 확장에 대한 특성 때문에 가끔 당황스러운 결과가 발생하기도 합니다. 앞선 예제에서 `calculateLengthL1` 함수를 추가해주겠습니다.

```ts
function calculateLengthL1(v: Vector3D) {
  let length = 0;

  for (const axis of Object.keys(v)) {
    const coord = v[axis];

    length += Math.abs(coord);
  }
  return length;
}
```

위의 코드에서 `for` 루프안에 있는 `coord` 변수에 할당된 `v[axis]`의 인덱스 값인 `axis`에서 "string은 Vector3D의 인덱스로 사용할 수 없다."라는 오류가 발생합니다. 선언된 `Vector3D` 인터페이스의 구조를 보면 `x`,`y`,`z` 모두 `number` 값을 갖기 때문에 `axis`의 타입도 `number`로 유추할 수 있지 않을까요?

그러나 타입스크립트가 오류를 정확히 찾아낸 것이 맞다고합니다. 거듭 말하지만 타입스크립트는 타입 확장에 대해 열려있다고 했습니다. 만약 `calculateLengthL1`함수의 매개변수가 `Vector3D` 구조를 갖고 있는 객체가 들어올 경우를 가정해봅시다.

```ts
const vec3D = { x: 3, y: 4, z: 1, address: '123 Broadway' };
calculateLengthL1(vec3D); // 정상, NaN을 반환합니다.
```

이해가 되시나요? 위의 코드처럼 타입스크립트는 타입 확장에 열려 있기 때문에 `v[axis]`가 어떤 속성이 될지 알 수 없어 `number`라고 확정할 수 없습니다. 정확한 타입으로 객체를 순회하는 것은 까다로운 문제이며 위의 코드의 경우 루프보다는 모든 속성을 각각 더하는 구현이 낫습니다.

```ts
function calculateLengthL1(v: Vector3D) {
  return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
}
```
