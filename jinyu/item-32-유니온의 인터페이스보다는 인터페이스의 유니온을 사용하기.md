# 유니온의 인터페이스보다는 인터페이스의 유니온을 사용하기

유니온 타입의 속성을 가지는 인터페이스를 작성 중이라면, 인터페이스의 유니온 타입을 사용하게 더 알맞을 수도 있다.

다음과 같이 유니온 타입의 속성을 가진 인터페이스가 있다.

```ts
interface Layer {
  layout: FillLayout | LineLoayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```

이러한 유니온 타입의 속성을 가진 인터페이스의 경우 라이브러리에서 오류가 발생하기 쉽고 인터페이스를 다루기 어려울 것이다.

따라서 타입의 계층을 분리된 인터페이스로 둬야 한다.

```ts
interface FillLayer {
  layout: FillLayout;
  paint: FillPaint;
}
interface LineLayer {
  layout: LineLoayout;
  paint: LinePaint;
}
interface PointLayer {
  layout: PointLayout;
  paint: PointPaint;
}
type Layer = FillLayer | LineLayer | PointLayer;
```

이런 형태로 `Layer`를 정의하면 `layout` 속성과 `paint` 속성이 잘못된 조합으로 섞이는 경우를 방지할 수 있다.

효과적으로 타입을 설계하려면 아이템 28의 조언에 따라 유효한 상태만 표현하는 타입을 만들어 내는 것이 중요하다.

유효한 상태만 표현하는 타입의 경우 **태그된 유니온**을 활용하면 된다.

```ts
interface Layer {
  type: 'fill' | 'line' | 'point';
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```

하지만 위의 코드의 경우 `type: 'fill'`과 함께 `LineLayout`과 `PointPaint` 타입이 쓰이는 오류가 발생할 수 있다. 때문에 인터페이스의 유니온으로 설계해야 한다.

```ts
interface FillLayer {
  type: 'fill';
  layout: FillLayout;
  paint: FillPaint;
}
interface LineLayer {
  type: 'line';
  layout: LineLoayout;
  paint: LinePaint;
}
interface PointLayer {
  type: 'point';
  layout: PointLayout;
  paint: PointPaint;
}
type Layer = FillLayer | LineLayer | PointLayer;
```

태그된 유니온은 타입스크립트의 타입 체커와 잘 맞기 때문에 타입스크립트에서 이러한 패턴을 많이 찾아볼 수 있다. 어떤 데이터 타입을 태그된 유니온으로 표현할 수 있다면 보통은 그렇게 하는 것이 좋다.

또는 여러 개의 선택적 필드가 동시에 값이 있거나 동시에 `undefined`인 경우도 태그된 유니온 패턴이 잘 맞다. 다음 코드를 보자.

```ts
interface Person {
  name: string;
  // 다음은 둘 다 동시에 있거나 동시에 없을 수도 있습니다.
  placeOfBirth?: string;
  dateOfBirth?: Date;
}
```

타입 정보를 담고 있는 주석은 문제가 될 소지가 높다. 또한 위의 코드의 경우 `placeOfBirth`와 `dateOfBirth`의 경우 `Birth`와 뭔가 관련이 있어 보인다. 하지만 선언된 타입 정보만으로 봤을 때 두 타입의 연관성을 찾기 힘들어 보인다. 따라서 **위의 두 속성의 경우 하나의 객체로 모으는 것이 더 나은 설계**이다.

```ts
interface Person {
  name: string;
  birth?: {
    place: string;
    date: Date;
  };
}
```

개발을 하다보면 타입의 구조를 손 댈 수 없는 상황(예를 들어 API의 결과)이면, 인터페이스의 유니온을 사용해서 속성 사이의 관계를 모델링할 수 있다.

```ts
interface Name {
  name: string;
}

interface PersonWithBirth extends Name {
  placeOfBirth: string;
  dateOfBirth: Date;
}

type Person = Name | PersonWithBirth;
```

이제 중첩된 객체에서도 동일한 효과를 볼 수 있습니다.

```ts
function eulogize(p: Person) {
  if ('placeOfBirth' in p) {
    p; // 타입이 PersonWithBirth
    const { dasteOfBirth } = p;
  }
}
```

