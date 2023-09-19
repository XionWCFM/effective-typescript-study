# 다른 타입에는 다른 변수 사용하기

자바스크립트에서는 한 변수를 다른 목적을 가지는 다른 타입으로 재사용이 가능하다.

```js
let id = "12-34-56";
fetchProduct(id); // string으로 사용
id = 123456;
fetchProductBySerialNumber(id); // number로 사용
```

반면 타입스크립트에서는 두 가지 오류가 발생한다.

```ts
let id = "12-34-56";
fetchProduct(id);
id = 123456; // string 형식에 할당할 수 없습니다.
fetchProductBySerialNumber(id);
// 'string' 형식의 인수는 'number' 형식의 매개변수에 할당될 수 없습니다.
```

"변수의 값은 바뀔 수 있지만 그 타입은 보통 바뀌지 않는다"는 중요한 관점을 알 수 있다. 타입을 바꿀 수 있는 한 가지 방법은 범위를좁히는 것인데, 새로운 변수 값을 포함하도록 확장하는 것이 아니라 타입을 더 작게 제한하는 것이다.

위의 코드는 id의 타입을 바꾸지 않으려면 유니온 타입으로 정의하면 된다.

```ts
let id: string | number = "12-34-56";
fetchProduct(id);
id = 123456; // 정상
fetchProductBySerialNumber(id); // 정상
```

하지만 유니온 타입의 경우 `id`를 사용할 때마다 값이 어떤 타입인지 확인해야 하는 번거로움이 있습니다.

따라서 위의 코드와 같이 목적이 다른 경우라면 차라리 별도의 변수를 도입하는 것이 낫다.

```ts
const id = "12-34-56";
fetchProduct(id);

const serial = 123456;
fetchProductBySerialNumber(serial);
```

타입이 바뀌는 변수는 되도록 피해야 하며, 목적이 다른 곳에는 별도의 변수명을 사용해야 한다. 다른 타입에는 별도의 변수를 사용하는 게 바람직한 이유는 다음과 같다.

- 서로 관련 없는 두 개의 값을 분리한다.(`id`와 `serial`)
- 변수명을 더 구체적으로 지을 수 있다.
- 타입 추론을 향상시키며 타입 구문이 불필요해진다.
- 타입이 좀 더 간결해진다. (`string | number` 대신 `string`, `number`를 사용)
- `let` 대신 `const`로 변수를 선언하게 된다. `const` 키워드로 선언하게 되면 코드가 간결해지고 타입 체커가 타입을 추론하기에도 좋다.
