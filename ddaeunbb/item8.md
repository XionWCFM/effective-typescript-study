###📌 ITEM-8. 타입 공간과 값 공간의 심벌 구분하기
<br>
처음 읽었을 때, 조금 이해가되지 않는 경향이 있는데 쉽게 이해하기 위해 자바스크립트로 트랜스파일 한다고 가정해보겠습니다. 인터페이스나 타입같은 경우에는 트랜스파일 했을 때, 사라지게 됩니다.
<br>
<br>
결론적으로, 타입의 공간과 값의 공간을 구분해서 사용하는 것이 좋다는 것이 책의 전반적인 입장입니다.
<br>
<br>

- 각각의 공간에서 각각 존재하는 경우

```typescript
type Daeun = "woman" | "Baeksu";
const Daeun = "i am daeun";
```

위와 같이 동시에 `Daeun`이 존재할 수 있다. 하지만 이는 권장되지 않는 방법이라고 합니다.
<br>

- `typeof`

```typescript
type T1 = typeof p; // 타입은 Person
type T2 = typeof email;
// (p: Person, subject: string)...

const v1 = typeof p; // object
const v2 = typeof email; // function
```

타입의 관점에서 `typeof`은 값을 읽어서 타입스크립트 타입을 반환합니다.

값의 관점에서 `typeof`는 자바스크립트 런타임의 `typeof` 연산자가 됩니다. 값의 공간에서 `typeof`는 6개의 런타임 타입만이 존재합니다.`(string, number, boolean, undefined, object, function)`

<br>

- 타입의 공간과 값의 공간에 동시에 존재하는 `class`
  클래스는 내부적으로 함수이지만 생성자함수로 만든 인스턴스는 `object`가 됩니다.
  `

```typescript
// Cylinder는 class입니다.
const v = typeof Cylinder; // function
type T = typeof Cylinder; // 타입이 typeof Cylinder
```

두번째 줄의 타입은 생성자 함수입니다. 이부분에서 헷갈렸는데요, 생성자 함수 타입 그자체가 되어버린다는 의미라네요.
만약에 class의 인스턴스라고 타입을 기입하고 싶다면?

```typescript
type C = InstanceType<typeof Cylinder>; // 타입이 Cylinder
```

위와 같이 쓰면 타입에서 클래스의 인스턴스임을 명시할 수 있습니다.

<br>
### 요약
- class나 enum 같은 키워드는 타입과 값 두 가지로 사용될 수 있습니다.
- `typeof`,`this` 그리고 많은 연산자들과 키워들은 타입 공간과 값 공간에서 다른 목적으로 사용될 수 있습니다.
