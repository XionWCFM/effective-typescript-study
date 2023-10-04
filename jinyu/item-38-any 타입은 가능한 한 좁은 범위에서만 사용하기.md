# any 타입은 가능한 한 좁은 범위에서만 사용하기

```ts
function processBar(b: Bar) {
  /*...*/
}

function f() {
  const x = expressionReturningFoo();
  processBar(x);
  // ~~~~ 'Foo' 형식의 인수는 'Bar' 형식의 매개변수에 할당될 수 없습니다.
}
```

위의 오류를 제거하려면 2가지 방법이 있음.

```ts
function f1() {
  const x: any = expressionReturningFoo(); // 이렇게 하지 않는 것이 좋음
  processBar(x);
}

function f2() {
  const x = expressionReturningFoo();
  processBar(x as any); // 이렇게 값이 사용되는 곳에 단언문을 활용해 좁은 범위로 사용해야 함
}
```

위의 2가지 방법 중 아래 방법이 가장 좋은 이유는 `f1` 함수의 경우 `any` 타입을 선언하였으므로 `processBar` 함수 호출 이후에도 `x` 는 `any` 타입을 계속 가지게 된다. 반면 `f2` 함수의 경우 `processBar` 함수의 매개변수로 사용되는 경우에만 `any` 타입으로 사용된다.

만약 위의 코드에서 `f1` 함수가 `x`를 반환하게 되면 해당 함수는 `any` 타입을 반환하게 되므로 문제가 커질 수 있다.

```ts
function f1() {
  const x: any = expressionReturningFoo(); // 이렇게 하지 않는 것이 좋음
  processBar(x);
  return x;
}

function g() {
  const foo = f1(); // 타입이 any
  foo.fooMethod(); // 이 함수 호출은 체크되지 않는다.
}
```

이렇게 함수에서 `any`를 반환하면 그 영향력은 프로젝트 전반에 전염병처럼 퍼지게 된다. 반면 `f2` 함수처럼 `any`의 사용 범위를 좁게 한다면 함수 바깥으로 영향을 미치지 않아 타입으로 인해 발생될 수 있는 오류를 예방할 수 있다.

비슷한 관점에서 함수의 반환 타입을 추론할 수 있는 경우에도 반환 타입을 명시하는 것이 좋다. 함수의 반환 타입을 명시하게 되면 `any` 타입이 함수 바깥으로 영향을 미치는 것을 방지할 수 있다.

객체의 경우도 살펴보자.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value,
    // ~~~~ 'foo' 속성이 'Foo' 타입에 필요하지만 'Bar' 타입에는 없습니다.
  },
};
```

위의 타입 에러는 단순하게 생각한다면 타입 단언으로 쉽게 해결할 수 있다.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value,
  },
} as any;
```

하지만 위의 코드처럼 객체 전체를 타입 단언으로 `any` 타입을 주면 안된다. 객체 전체를 단언하게 되면 다른 속성들(`a`와 `b`)의 타입 체크가 되지 않는 문제가 발생하기 때문이다. 그러므로 아래의 코드처럼 최소한의 범위에만 `any`를 사용하는 것이 좋다.

```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value as any,
  },
};
```
