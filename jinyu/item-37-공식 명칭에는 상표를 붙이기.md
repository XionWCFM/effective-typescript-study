# 공식 명칭에는 상표를 붙이기

구조적 타이핑의 특성 때문에 가끔 코드가 이상한 결과를 나타낸다. 다음 코드를 보자.

```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateNorm(p: Vector2D) {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

calculateNorm({ x: 3, y: 4 }); // 정상, 결과는 5
const vec3D = { x: 3, y: 4, z: 1 };
calculateNorm(vec3D); // 정상! 결과는 동일하게 5
```

이 코드는 구조적 타이핑 관점에서는 문제가 없기는 하지만, 수학적으로 따지면 2차원 벡터를 사용해야 이치에 맞다. `calculateNorm` 함수가 3차원 벡터를 허용하지 않게 하려면 공식 명칭(nominal typing)을 사용하면 된다. 타입이 아니라 값의 관점에서 `Vector2D`라고 말하는 것이다. 공식 명칭 개념을 타입스크립트에서 흉내 내려면 '상표(brand)'를 붙이면 된다.

```ts
interface Vector2D {
  _brand: "2d";
  x: number;
  y: number;
}
function vec2D(x: number, y: number): Vector2D {
  return { x, y, _brand: "2d" };
}
function calculateNorm(p: Vector2D) {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

calculateNorm(vec2D(3, 4));
const vec3D = { x: 3, y: 4, z: 1 };
calculateNorm(vec3D); // ~~~ '_brand' 속성이 ... 형식에 없습니다.
```

상푤르 사용해서 `calculateNorm` 함수가 `Vector2D` 타입만 받는 것을 보장해준다. 하지만 `vec3D` 값에 `_brand: '2d'`라고 추가하는 것과 같은 악의적인 사용을 막을 수는 없다. 다만 단순한 실수를 방지하기에는 충분하다.

이 외에도 상표 기법을 다음과 같이 활용할 수 있다.

- 파일 시스템에서의 상표 기법 활용
  절대 경로를 사용해 파일 시스템에 접근하는 함수를 가정해보자. 런타임에는 절대 경로('/')로 시작하는지 체크하기 쉽지만 타입 시스템에서는 절대 경로를 판단하기 어렵기 때문에 상표 기법을 사용하면 좋다.

  ```ts
  type AbsolutePath = string & { _brand: "abs" };
  function listAbsolutePath(path: AbsolutePath) {
    // ...
  }
  function isAbsolutePath(path: string): path is AbsolutePath {
    return path.startsWith("/");
  }
  ```

  만약 `path` 값이 절대 경로와 상대 경로 둘 다 될 수 있다면 타입을 정제해 주는 **타입 가드**를 사용해서 오류를 방지할 수 있다.

  ```ts
  function f(path: string) {
    if (isAbsolutePath(path)) {
      listAbsolutePath(path);
    }
    listAbsolutePath(path);
    // ~~~~ 'string' 형식의 인수는 'AbsolutePath' 형식의 매개변수에 할당될 수 없습니다.
  }
  ```

- 타입 시스템 내에서 표현할 수 없는 수많은 속성들을 모델링하는 경우
- 숫자 단위를 표현해야 하는 경우, 여러 단위가 혼합된 많은 수의 숫자가 들어 있는 경우에는 숫자의 단위를 문서화하는 것도 괜찮은 방법이다.
