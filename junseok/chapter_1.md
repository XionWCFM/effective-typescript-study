---
title: 1장 타입스크립트 알아보기
date: 2023-08-09
---


# 1장 타입스크립트 알아보기

## ITEM 1. 타입스크립트와 자바스크립트의 관계 이해하기
**타입스크립트는 고수준 언어인 자바스크립트로 컴파일되며, 실행 역시 타입스크립트가 아닌 자바스크립트로 이루어집니다.** 

- 타입스크립트는 자바스크립트의 상위집합입니다. 따라서 기존의 `.js` 확장자 파일도 모두 타입스크립트 코드입니다. 이는 마이그레이션에 엄청난 이점이 됩니다.
- 타입 시스템의 목표 중 하나는 런타임에 오류를 발생시킬 코드를 미리 찾는 것입니다. (`정적 타입`)
- 타입스크립트는 런타임 전에 오류를 잡아내는 것 뿐만 아니라 런타임에서 오류를 발생시키지 않는 코드에 대해서도 문제점을 표기합니다. 따라서 타입스크립는 자바스크립트의 상위 프로그램이면서도 타입체커를 통과한 타입스크립트 프로그램을 별도로 구분해야 합니다.

  <img width="431" alt="image" src="https://github.com/kd02109/effective-typescript-study/assets/57277708/96ec4251-eee2-43eb-9b61-48131a31b5b5">

```ts
const x = 2 + '3'; // 정상

const a = null + 7;
    //  ~~~~~~~ "+" 연산자를 ... 형식에 적용할 수 없습니다. 

```

## ITEM 2. 타입스크립트 설정 이해하기 
- 설정 파일 `tsonfig.json`을 활용하는 것이 좋습니다. 타입스크립트의 설정들은 **어디서 소스 파일을 찾을지, 어떤 종류의 출력을 생성할지 제어**하는 내용이 있습니다.

- 설정을 제대로 사용하려면 `noImplicitAny` 와 `strictNullChecks`를 이해해야 합니다. 
    - `noImplicitAny` 는 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어합니다. (any 사용을 최대한 자제합니다.)
    - `strictNullChecks`는 `null`, `undefined`기 모든 타입에서 허용되는지 확인하는 설정입니다.
    - 타입스크립트에서 `strict` 설정을 하면 대부분의 오류를 잡아냅니다. 

## ITEM 3. 코드 생성과 타입이 관계없음을 이해하기

**타입스크립트의 두 가지 역할**
1. 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일(transpile)합니다.

2. 코드의 타입 오류를 체크합니다. 

이 두 가지 역할에 따라 타입스크립트의 특징이 결정이 됩니다.

- **타입오류가 있는 코드도 컴파일이 가능합니다.**
   - 오류가 있을 때, 컴파일하지 않으려면, `tsconfig.json`에 `noEmitOnError`를 설정합니다. 

- **런타임에는 타입 체크가 불가능합니다.**
    - 타입스크립트의 타입은 제거가능(erasable)합니다. 실제로 자바스크립트로 컴파일 되는 과정에서 모든 인터페이스, 타입, 타입 구문은 제거되어 버립니다.
    - 따라서 타입 정보를 명시적으로 저장하는 tag 기능을 사용합니다. 
    ```ts
    interface Square {
        type: "square";
        width: number;
    }
    ```
    - 혹은 class로 선언하여 타입과 값으로 모두 사용합니다.
    ```ts
    class Square {
        constructor(public width: number) {}
    }
    class Rectangle extends Square {
        constructor(public width: number, public height: number) {
            super(width);
        }
    }
    type Shape = Square | Rectangle;

    function calculateArea(shape: Shape) {
        if (shape instanceof Rectangle) {
            shape;  // Type is Rectangle
            return shape.width * shape.height;
        } else {
            shape;  // Type is Square
            return shape.width * shape.width;  // OK
        }
    }
    ```

- **타입 연산은 런타임에 영향을 주지 않습니다.**

- **런타임 타입은 선언된 타입과 다를 수 있습니다.**

- **타입스크립트 타입으로는 함수를 오버로드 할 수 없습니다.**
    - C++과 같은 언어는 동일한 함수 명에 다른 매개변수를 가진 여러버전의 함수를 허용합니다. 하지만 **타입스크립트에서는 타입과 런타임의 동작이 무관**하기 때문에, 함수 오버로딩은 불가능합니다.  **여러 개의 선언문을 작성할 수 있지만, 구현체는 오직 하나뿐입니다.**
```ts
// tsConfig: {"noImplicitAny":false}

function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a, b) {
  return a + b;
}

const three = add(1, 2);  // Type is number
const twelve = add('1', '2');  // Type is string
```

- **타입스크립트 타입은 런타임 성능에 영향을 주지 않습니다.**

    - 선언된 타입은 자바스크립트 변환 시점에 모두 제거되기 때문에, 런타임 성능에 아무런 영향을 주지 않습니다.

## ITEM 4. 구조적 타이핑에 익숙해지기

> **덕 타이핑(duck typing)**
> - 참조: [duck typing](https://devopedia.org/duck-typing), [타입스크립트와 덕 티이핑 관계](https://soopdop.github.io/2020/12/09/duck-typing/)
> - 자바스크립트는 덕 타이핑입니다. 
> - 덕 타이핑에서, 함수 프로토타입이나 메서드에서 인자 유형을 선언하지 않습니다. 이는 컴파일러가 타입 검사를 수행할 수 없음을 의미합니다. 실제로 중요한 것은 런타임에 객체가 특정 메서드/속성을 가지고 있는지 여부입니다. 따라서 덕 타이핑은 종종 동적 언어에서 지원됩니다.
>
>   **오리처럼 걷고, 오리처럼 헤엄치고, 오리처럼 꽥꽥거린다면 오리일 가능성이 높습니다.** 오리처럼 행동하는 오리가 아닌 개체도 오리로 간주될 수 있는데, 이는 행동에 중점을 두기 때문입니다. 비유하자면, *컴퓨팅 언어의 경우 예상대로 동작하기만 하면 객체의 유형은 중요하지 않습니다.*
>```ts
>const duck = {
> appearance: "feathers", // 깃털을 가졌다.
> quack: function duck_quack(what) {
>   console.log(what + " quack-quack!")
> }, // 꽥꽥거리는 기능을 가졌다.
> color: "black", // 검은색이다.
>}
>const someAnimal = {
> appearance: "feathers", // 깃털을 가졌다
> quack: function animal_quack(what) {
>   console.log(what + " whoof-whoof!")
> }, // 꽥꽥거리는 기능을 가졌다. 소리가 좀 다를 뿐.
> eyes: "yellow", // 눈이 노랗다.
>}
>// 오리인지 판단하는 함수. 깃털이 있고 꽥꽥거리는 기능이 있으면 오리이다.
>function check(who) {
>   if (who.appearance == "feathers" && typeof who.quack == "function") {
>   who.quack("I look like a duck!\n")
>       return true
> }
>   return false
>}
>heck(duck) // true
>heck(someAnimal) // true
>
>
>```

- **타입스크립트는 자바스크립트의 상위 집합이므로 덕 타이핑을 따릅니다.** 따라서 매개변수의 값, 객체의 형태, 함수의 기능이 동일하다면, 타입이 무엇인지 신경 쓰지 않는 동작을 그대로 모델링 합니다. 아래의 코드에서 Vector2D 와 NamedVector의 관계를 선언하지 않고도 정상 작동을 합니다. 이는 내부 구성이 결국 같기 때문입니다. 

```ts
interface Vector2D {
  x: number;
  y: number;
}
function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
interface NamedVector {
  name: string;
  x: number;
  y: number;
}
const v: NamedVector = { x: 3, y: 4, name: 'Zee' };
calculateLength(v);  // OK, result is 5
```
- **덕 타이핑을 따르는 타입스크립트이기에 자유롭게 타입을 확장하여도 크게 문제가 되지 않는다고 생각합니다.** 고양이의 속성에 크기를 추가하여 작은 고양이가 되어도 결론적으로는 고양이 입니다. 따라서 고양이 속성을 필요로 하는 모든 곳에 작은 고양이가 공통적으로 사용될 수 있습니다. 

## ITEM 5. any 타입 지양하기
- 타입 추가와 타입 해지의 핵심은 any입니다. 
- **any 타입에는 안전성이 없습니다.** 
- **any는 함수 시그니처를 무시해 버립니다.** 
   - 함수를 호출할 시, 약속된 타입의 입력을 제공하고 함수는 약속된 타입의 출력을 반환해야 합니다. any 타입은 이를 어기게 만듭니다. 
- **any 타입에는 언어 서비스가 적용되지 않습니다.**
- **any 타입은 코드 리펙터링 때 버그를 감춥니다.** 
- **any는 타입 설계를 감춰버립니다.**
- **any는 타입시스템의 신뢰도를 떨어뜨립니다.**
