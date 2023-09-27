# 아이템17. 변경 관련된 오류 방지를 위해 readonly 사용하기

## readonly 접근 제어자란?

배열이나 튜플 리터럴의 값이 변경되지 않아야 하는 경우 readonly 접근 제어자를 사용한다. readonly 접근 제어자를 이용하여 변수에 타입을 선언하면, 타입스크립트는 변수의 원본 값을 변경하려는 시도를 체크하여 에러를 발생시키기 때문에 의도치 않은 변경을 방지할 수 있다. 특히, 함수 내부에서 원본 값이 변경되지 않아야 하는 매개변수에 용이하다.

함수의 매개변수가 readonly일 경우, 그 함수를 호출하는 함수에서 전달되는 인수도 readonly 타입이어야 한다. 이러한 특징은 인터페이스를 명확히 하고 타입 안정성을 높일 수 있으나, 다른 라이브러리에 있는 함수를 호출하는 경우라면 타입 선언을 바꿀 수 없으므로 타입 단언문(as number[])를 사용해야 한다.

인덱스 시그니처에도 readonly를 사용할 수 있다. 읽기는 허용하되 쓰기를 방지하는 효과가 있다.

## 적용 케이스

```ts
const readonlyNumbers: readonly number[] = [1, 2, 3, 4];
```

원본을 변경할 경우 에러를 발생시킨다는 것을 기억하며, 위 예제에서 허용되는 것과 허용되지 않는 것을 알아보자

- 원본을 변경하려는 시도가 있을 경우: Error

  ```ts
  readonlyNumbers.pop(); // ts Error: Property 'pop' does not exist on type 'readonly number[]'.
  readonlyNumbers[0] = 3; // ts Error: Index signature in type 'readonly number[]' only permits reading
  ```

- 원본을 변경하지 않는 경우: Success

  ```ts
  readonlyNumbers.map((number, i) => number + i); // map 메서드는 numbers의 원본 값을 변경하지 않고 새로운 배열을 생성하기 때문에 에러가 발생되지 않는다.
  ```

- readonly 접근 제어자로 선언된 값을 변경 가능한 변수에 할당하는 경우: Error

  ```ts
  const numbers: number[] = readonlyNumbers; // ts Error: The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
  ```

## Readonly 제너릭

객체에 사용되는 제너릭으로 readonly와 비슷한 역할을 한다.

```ts
interface Outer {
  inner: {
    x: number;
  };
}

const o: Readonly<Outer> = {
  inner: {
    x: 1,
  },
};

o.inner = { x: 1 }; // ts Error: Cannot assign to 'inner' because it is a read-only property.
```

그러나 Readonly 제너릭 및 readonly는 깊은 readonly가 지원되지 않기 때문에 readonly가 선언된 객체의 하위 deps에 접근하면 변경이 가능하다.

```ts
o.inner.x = 1;
```

깊은 readonly를 위해서는 제너릭을 만들어서 사용해야 하지만, 제너릭을 만드는 것은 까다롭기 때문에 대개 라이브러리(ts-essentials의 DeepReadonly 제너릭)를 사용한다.
