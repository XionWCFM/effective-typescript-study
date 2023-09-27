## 2장 타입스크립트의 타입 시스템
### 6 편집기를 사용하여 타입 시스템 탐색하기 
편집기에서 타입스크립트 언어 서비스를 통해 어떻게 타입 시스템이 동작하는 지 어떻게 추론하는 지 알 수 있음으로 적극 활용하는 것이 좋습니다. 

*서브 타입 : 어떤 집합이 다른 집합의 부분집합.
<img width="254" alt="image" src="https://github.com/XionWCFM/effective-typescript-study/assets/82435813/001e10b0-3bc9-4828-a7c3-da15e2621d30">

- 한 객체의 추가적인 속성이 타입 선언에 언급되지 않더라도 그 타입에 속할 수 있습니다.
-  "A는 B를 상속"=== "A는 B에 할당가능" === "A와 B 의 값이 A와 B 의 속성을 모두 가짐"
### 7. 할당 간으한 값들의 집합 === 타입 
  ```ts
const list =[1,2];
const tuple:[number,number]=list ;
```
해당 코드는 에러를 띄운다 list 는 타입이 number[]이고 tuple 의 타입은 [number,number]이다. number[] 는 [number,number]의 부분 집합이 아니기 대문에 할당할 수 없다. "A는 B를 상속"="A는 B에 할당 가능"="A는 B의 서브타입"= "A는 B의 부분 집합"
### 8. 타입 공간과 값 공간의 심벌 구분
  ```ts
interface List {
name : string
}
const List = ()=>{} 
```
서로 아무런 관련이 없으나 오류를 발생하기도 해 주의해야한다. 이 둘을 구분하려면 타입스크립트 플레이그라운드를 활용하면 된다.  모든 값은 타입을 가지지만 타입은 값을 가지지 않는다. typeof 등  많은 다른 연산자들과 키워드들은 타입 공간과 값 공간에서 다른 목적으로 사용될 수 있다. 
### 9. 타입 단언보다는 타입 선언 & 10. 객체 래퍼 타입 피하기 
  ```ts
interface Person {
name : string
}
const alice:Person={name:"lee"} // 타입선언 good
const bob ={name: "lee"}as Person //타입 단언

const bb = {} as Person //타입 단언, 오류없음 
```

타입 단언은 강제로 타입을 지정하는 것임으로 타입 체거에게 오류를 무시하라고 한다. 타입 단언을 사용할 때는 타입스크립트보다 개발자가 타입 정보를 더 잘고 있을 상황에만 타입 단언문과 null 아님 단언문을 사용하면 된다. 객체 레퍼 타입 보다 기본형 타입을 사용해야한다. String 보다는 string 등 
### 11 잉여 속성 체크의 한계 
잉여 속성 체크도 조건에 따라 동작하지 않는다는 한계가 있고 통상적인 할당 가능 검사와 함께 쓰이면 구조적 타이핑이 무엇인지 혼란스러울 수 있다. 잉여 속성 체크는 오류를 찾는 데 효과적이지만 일반적인 구조적 할당 가능성 체크와 역활이 다르다. 
### 12. 함수 표현식에 타입 적용
타입스크립트에서는 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 재사용할 수 있기때문에 함수표현식을 사용하는 것이 좋다. 반복되는 함수 시그니처를 하나의 함수 타입으로 통합할 수 있고 다른 함수의 시그니처를 참조하고싶으면 typeof fn을 사용하면 되기때문이다. 
### 13 타입과 인터페이스의 차이
타입과 인터페이스의 차이를 분명히 알고 같은 상황에서 동일하게 타입을 정의해 일관성을 유지하는 게 중요하다. 인터페이스는 유니온 타입과 같은 복잡한 타입을 확장하지 못한다. 복잡한 타입확장시 타입과 &를 사용하자. type은 유니온이 될 수 있고 매핑된 타입또는 조건부 타입 같은 고급 기능에 활용된다. 반명 인터페이스는 보강이 가능하다. 속성을 확장하는 것 . 선언 병합이 가능하다는 것이다. 
복잡한 타입 => type
간단한 타입 => 일관성의 측면을 고려해서 type or interface
단, 보강의 가능성이 있는 새 프로젝트라면 interface

```ts
interface Istate{
name:string;
}
interface Istate{
capital:string
}
const lee:Istate={
name:"lee",
capital: "cheyeonn"
}
```
### 14 타입 연산과 제네릭 사용으로 반복 줄이기 
DRY 원칙을 이용해 타입 코드도 반복을 줄이자. 타입을 반복하는 대신 제네릭 타입을 사용해 타입간에 매핑을 하고 제한할시 extends 사용을 지향한다. Pick, Partial, RetrurnType 의 제네릭 타입을 잘 사용하자.
```ts
function distance(a:{x:number,y:number},b:{x:number,y:number}){
*/.../*
}
//수정
interface Point2D{
x:number
y:number
}
function distance(a:Point2D,b:Point2D){
*/.../*
}
```
