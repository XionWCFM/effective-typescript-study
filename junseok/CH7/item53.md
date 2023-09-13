# CH7. 코드를 작성하고 실행하기 

## ITEM 53. 타입스크립트 기능 보다는 ESCMAScript 기능을 사용하기

- 타입스크립트 팀의 현재 원칙은 **자바스크립트의 신규 기능을 그대로 채택하고 타입스크립트 초기 버전과 호환성을 포기하는 것입니다.** 하지만 이 원칙을 세우기 전에 이미 사용 되고 있던 몇가지 기능이 있습니다. **이 기능들은 타입 공간(타입스크립트)과 값 공간(자바스크립트)의 경계를 혼란스럽게 만들기 때문에 사용하지 않는 것이 좋습니다.**

#### enum(열거형)
```ts
enum Flavor {
  VANILLA = 0,
  CHOCOLATE = 1,
  STRAWBERRY = 2,
}

let flavor = Flavor.CHOCOLATE;  // Type is Flavor

Flavor  // Autocomplete shows: VANILLA, CHOCOLATE, STRAWBERRY
Flavor[0]  // Value is "VANILLA"
```

- 열거형은 단순히 값을 나열하는 것보다 실수가 적고 명확하기 때문에 일반적으로 열거형을 사용하는 것이 좋습니다. 하지만 차입스크립의 열거형은 다음 목록처럼 상황에 따라 다르게 동작합니다.
    1. 숫자 열거형에 0,1,2 외의 다른 숫자가 할당되면 매우 위험합니다. 
    2. 상수 열거형은 보통의 열거형과 달리 런타임에 완전히 제거됩니다. `const enum Flavor`로 변경되면 컴파일러는 `Flavor.CHCOLATE`을 `0`으로 변경합니다. 
    3. `preserveConstEnum` 플래그를 설정한 상태의 상수 열거형은 보통의 열거형 처럼 런타임 코드에 정보를 유지합니다.
    4. 문자열 열거형은 구조적 타이핑이 아닌 명목적 타이핑(타입의 이름이 같아야 할당이 허용)을 사용합니다.
이처럼 자바스크립트와 타입스크립트에서 동작이 다르기 떄문에 문자열 열거형 대신 **리터럴 타입의 유니온**을 사용하면 됩니다.

```ts
type Flavor = 'vanilla' | 'chocolate' | 'strawberry';

let flavor: Flavor = 'chocolate';  // OK
    flavor = 'mint chip';
 // ~~~~~~ Type '"mint chip"' is not assignable to type 'Flavor'
```

#### 매개변수 속성
- 일반적으로 클래스를 초기화 할 때 속성을 할당하기 위해 생성자의 매개변수를 사용합니다.
```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
```
타입스크립트는 더 간결한 문법을 제공합니다.
```ts
class Person {
  constructor(public name: string) {}
}
/* change JS 
class Person {
    constructor(name) {
        this.name = name;
    }
}
*/
```
예제의 `public name`은 **매개변수 속성**이라고 불리며, 멤버 변수로 name을 선언한 이전 예제와 동일하게 동작합니다. 하지만 몇가지 문제가 존재합니다.
1. 일반적으로 타입스크립트 컴파일은 타입 제거가 이루어지므로 코드가 줄어들지만, 매개변수 속성은 코드가 늘어나는 문법입니다.
2. 매개변수 속성이 러타임에는 실제로 사용되지만, 타입스크립트 관점에서는 사용되지 않는 것처럼 보입니다. 
3. 매개변수 속성과 일반 속성을 섞어서 사용하면 클래스의 설계가 혼란스러워 집니다. 

- 일반적으로 매개변수 속성과 일반 속성 중 하나만 사용하는 것을 추천하며, 매개변수 속성 문법이 낯설기 때문에 주의가 필요합니다. 


#### 네임스페이스와 트리플 슬래시 임포트 
- ESCMAScript 2015 이전까지 자바스크립트에는 모듈 시스템이 없었습니다. 따라서 각 환경마다 자신만의 방식으로 모듈 시스템을 마련합니다. Node.js의 경우는 `require`와 `module.exports`를 사용한 반면, AMD는 `define`함수와 콜백을 사용했습니다. 
- 따라서 타입스크립트 또한 자체적인 모듈시스템을 구축했고, module 키워드와 '트리플 슬래시' 임포트를 사용했습니다. 
ESCMAScript 2015가 공식적으로 모듈 시스템을 도입한 이후, 타입스크립트는 충돌을 피하기 위해 **module과 같은 기능을 하는 `namespace` 키워드를 추가합니다.**

```ts
namespace foo {
  function bar() {}
}

// JS 변환
var foo;
(function (foo) {
    function bar() { }
})(foo || (foo = {}));

```

- 현재는 모듈 import와 export를 사용해야 합니다. 


#### 데코레이터 

- **데코레이터는 클래스, 메서드, 속성에 에니메이션을 붙이거나 기능을 추가하는 데 사용**할 수 있습니다. 예를 들어, 클래스의 메서드가 호출될 때마다 로그를 남기려면 logged 에너테이션을 정의할 수 있습니다.
- 아직까지 표준화가 완료되지 않은 기능으로 사용을 추천하지 않습니다.

```ts
// tsConfig: {"experimentalDecorators":true}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  // 데코레이터 기능을 통해 logged 함수를 실행합니다. 
  @logged
  greet() {
    return "Hello, " + this.greeting;
  }
}

function logged(target: any, name: string, descriptor: PropertyDescriptor) {
  const fn = target[name];
  descriptor.value = function() {
    console.log(`Calling ${name}`);
    return fn.apply(this, arguments);
  };
}

console.log(new Greeter('Dave').greet());
// Logs:
// Calling greet
// Hello, Dave
```