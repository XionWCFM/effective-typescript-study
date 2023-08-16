# 아이템7. 타입이 값들의 집합이라고 생각하기

모든 변수는 코드가 실행되기 전, 즉 타입스크립트가 오류를 체크하는 순간 타입을 가지고 있다. 이는 '할당 가능한 값들의 집합'이자 타입의 범위이다.

## 개수로 보는 타입 구성

1. 아무런 값도 포함하지 않는 공집합: `never 타입`

   never 타입으로 선언된 변수의 타입 범위는 공집합이기 때문에 어떠한 값도 할당할 수 없음.

2. 한 가지 값만 포함하는 타입: 유닛(unit) 타입이라고 불리는 `리터럴(literal) 타입`

3. 두 개 이상의 값을 포함하는 타입: `유니온(union) 타입`

   유니온 타입은 `|`를 이용하여 표기된 값 집합들의 합집합이다.

## 집합으로 보는 타입 체커

타입스크립트 오류에서 자주 보이는 "Type 'typeA' is not assignable to type 'typeB'" 문구의 assignable은 집합의 관점에서 '~의 원소(값과 타입의 관계)' 또는 '~의 부분 집합(두 타입의 관계)'를 의미한다. 즉, 집합의 관점에서 타입 체커의 주요 역할은 **하나의 집합이 다른 집합의 부분 집합인지 검사하는 것**이다.

## 구조적 타이핑 규칙으로 보는 타입 연산자

타입스크립트에서 말하는 교집합과 합집합의 개념은 구조적 타이핑 규칙을 따르기 때문에 일반적으로 이해하는 집합의 개념과 차이가 있다. 아이템4에서 언급됐던 구조적 타이핑의 정의를 다시 보면 **구조적 타이핑은 객체가 어떤 타입에 부합하는 최소한의 특징이 있다면 그냥 그 타입에 해당한다고 간주하는 것**이다.

### 교집합

교집합은 두 집합이 공통적으로 가지는 속성을 가져야 하는 것이 아니라, A 집합에 있는 속성을 포함하면서 B 집합에 있는 속성도 포함하는 것을 말한다. 나는 타입스크립트의 교집합은 수학적 합집합과 비슷하다고 받아들였다. 즉, 교집합으로 만들어진 타입은 A와 B의 모든 속성을 포함해야 한다.

두 타입의 인터섹션(intersection, 교집합)을 타입으로 만드는 `&` 연산자로 예시를 살펴보자.

```ts
interface Person {
  name: string;
}
interface Lifespan {
  birth: Date;
  death?: Date;
}
type PersonSpan = Person & Lifespan;

const ps: PersonSpan = {
  name: 'Alan Turing',
  birth: new Date('1912/06/23'),
  death: new Date('1954/06/07'),
}; // OK
```

위 코드에서 `PersonSpan` 타입은 `Person`과 `Lifespan`의 교집합으로 이뤄져있다. 수학의 교집합으로 접근했을 때 `PersonSpan`는 `Person`과 `Lifespan`에 공통된 속성이 없으므로 `never` 타입이 되어야 할 것 같지만, `{ name: string; birth: Date; death?: Date; }`이 된다.

#### keyof 연산자

keyof 연산자는 항상 접근 가능한 유형의 속성을 뽑아 유니온 타입을 생성한다.

```ts
interface Person {
  name: string;
}
interface Lifespan {
  birth: Date;
  death?: Date;
}

type K = keyof (Person | Lifespan);
```

위 예제의 `Person | Lifespan`은 유니온 타입이다. 유니온 타입은 서로 간에 공유하는 타입이 없으면 항상 접근가능한 속성이 없게 된다. 따라서, 두 집합간의 공유된 속성이 없어 never 타입을 반환한다.

`keyof` 연산자와 함께 작성된 교집합과 합집합은 아래와 같이 해석할 수 있다.

```ts
keyof (A&B) = (keyof A) | (keyof B)
keyof (A|B) = (keyof A) & (keyof B)
```

예제,

```ts
interface Person {
  name: string;
}
interface Lifespan {
  name: string; // 추가
  birth: Date;
  death?: Date;
}

type K = keyof (Person | Lifespan); //=> type K = 'name'
type I = keyof (Person & Lifespan); //=> type I = 'name' | 'birth | 'death'
```

### 합집합

`|` 연산자로 볼 수 있는 합집합은 A 집합이거나 B 집합인 속성을 타입으로 한다. 즉, 합집합으로 만들어진 타입은 A의 속성도 가능하고, B의 속성도 가능하고, A와 B를 섞은 속성도 올 수 있다.

### `extends` 키워드

타입스크립트의 `extends` 키워드 또한 '~의 부분집합'이라는 의미로, 클래스에서 서브 클래스처럼 타입을 확장하는 데 사용된다.

## 타입스크립트의 타입이 되지 못하는 값의 집합

- 정수에 대한 타입
- x와 y 속성 외에 다른 속성이 없는 객체
