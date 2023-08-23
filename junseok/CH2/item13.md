# 2장 타입스크립트의 타입 시스템

## ITEM13. 타입과 인터페이스의 차이점 알기(type-vs-interface)


### 공통점
- 인덱스 시그니처는 인터페이스와 타입에서 모두 사용할 수 있습니다. 
- 함수 타입도 인터페이스나 타입으로 정의할 수 있습니다.
```ts
type TDict = { [key: string]: string };
interface IDict {
  [key: string]: string;
}

type TFn = (x: number) => string;
interface IFn {
  (x: number): string;
}
```
- 타입 별칭과 인터페이스는 모두 제너릭이 가능합니다.
- 인터페이스는 타입을 확장할 수 있으며, 타입은 인터페이스를 확장할 수 있습니다. 다만 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지는 못합니다.
```ts
interface IStateWithPop extends TState {
  population: number;
}
type TStateWithPop = IState & { population: number; };
```
- 클래스를 구현할 시에는 타입과 인터페이스 둘 다 사용할 수 있습니다.
```ts
class StateT implements TState {
  name: string = '';
  capital: string = '';
}
class StateI implements IState {
  name: string = '';
  capital: string = '';
}
```

###  차이점
- 인터페이스는 타입을 확장할 수 있지만, 유니온은 할 수 없습니다.
- 유니온 타입은 있지만, 유니온 인터페이스라는 개념은 없습니다.
- type 키워드는 일반적으로 interface보다 쓰임새가 많습니다. type 키워드는 유니온이 될 수 있고, 매핑된 타입 또는 조건부 타입 같은 고급 기능에 활용됩니다. 
- 튜플과 배열 타입도 type 키워드를 이용해 더 간결하게 표현할 수 있습니다.
```ts
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];
```
- 인터페이스는 보강(augment)이 가능합니다. 이를 선언 병합(declaration merging)이라고 합니다. (타입은 기존 타입에 추가적인 보강이 없는 경우에만 사용해야 합니다.)
```ts
interface IState {
  name: string;
  capital: string;
}
interface IState {
  population: number;
}
const wyoming: IState = {
  name: 'Wyoming',
  capital: 'Cheyenne',
  population: 500_000
};  // OK
```

### 정리
- 복잡한 타입이라면 고민 할 필요 없이 타입 별칠을 사용하면 됩니다.
- 타입, 인터페이스 두 가지 방법으로 모두 표현 할 수 있는 간단한 객체 타입이라면, 일관성과 보강의 관점에서 고려해야 합니다. 
- API에 대한 타입 선언을 작성해야 한다면 인터페이스를 사용하는게 좋습니다. (하지만 프로젝트 내부적으로 사용되는 타입에 선언 병합이 발생되는 것은 잘못된 설계입니다.)