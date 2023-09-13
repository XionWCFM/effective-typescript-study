# 2장 타입스크립트의 타입 시스템

## ITEM11. 잉여 속성 체크의 한계 인지하기(excess-property-checking)

- 구조적 타이핑 관점에서 생각을 하면 잉여 속성을 객체에 추가하는 것은 오류를 발생시키지 않아야 합니다. 하지만 오류를 발생시키고 있습니다. 
```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}
const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
// ~~~~~~~~~~~~~~~~~~ Object literal may only specify known properties,
//                    and 'elephant' does not exist in type 'Room'
};
```

아래와 같은 방식으로 잉여 속성이 이미 있는 객체를 할댕하는 것은 문제가 없습니다.
```ts
// #1
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
};
const r: Room = obj;  // OK
```

- #1에서는 구조적 타입 시스템에서 발생할 수 있는 중요한 종류의 오류를 잡을 수 있도록 `잉여 속성 체크`라는 과정이 수행되었습니다. 하지만 상황에 따라 가능한 지점이 있고 불가능한 지점이 있습니다. 따라서 **잉여 속성 체크가 할당 가능 검사와는 별도의 과정**이라는 것을 이해해야 합니다.


## 잉여 속성 체크(엄격한 객체 리터럴 체크)의 특징
- `document`, `new HTMLAnchorElement`는 객체 리터럴이 아니기 때문에 잉여 속성 체크가 되지 않습니다. 하지만 `{title, darkmode}` 객체는 체크가 됩니다. 
```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}
function setDarkMode() {}
interface Options {
  title: string;
  darkMode?: boolean;
}
const o1: Options = document;  // OK
const o2: Options = new HTMLAnchorElement;  // OK

const o: Options = { darkmode: true, title: 'Ski Free' };
                  // ~~~~~~~~ 'darkmode' does not exist in type 'Options'...
```
- 객체 리터럴이 아닌 경우 잉여 속성 체크가 되지 않습니다.
- 즉 객체 리터럴은 변수에 할당하거나, 함수에 매개변수로 전달할 때 잉여 속성 체크가 수행됩니다. 
- 잉여 속성 체크에도 한계가 있습니다. 임시 변수를 도입하면 잉여 속성 체크를 건너뛸 수 있습니다. 
