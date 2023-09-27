# 3장 타입추론.
### 19. 타입 추론을 사용해 장황한 코드 방지
불필요한 타입구문은 작성하지말고 중요한 타입구문만 적절히 작성하는 것이 바람직합니다. 추론 될 경우라도 객체 리터럴과 함수 반환에는 타입을 명시하는 것이 좋습니다. 
```ts
let x:number = 12; //불필요한 타입구문
let x =12;  //good
```
###  다른 타입에는 다른 변수 사용하기 
변수의 값은 바뀔 수 있지만 타입은 일반적으로 바뀌지 않기 때문에 타입이 달라질 때는 변수를 따로 생성하여 사용하는 것이 좋습니다. 
### 21. 타입 넓히기 
let은 string 타입으로 추론하지만 const는 값이 변하지 않을 것이기 때문에 리터럴 타입으로 추론합니다.
```ts
interface Vector3 { x: number; y: number; z: number; }
function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
  return vector[axis];
}
const x = 'x';  //const 키워드임으로 x
let vec = {x: 10, y: 20, z: 30};
getComponent(vec, x);  // OK
```
```ts
const v1 = {
  x: 1,
  y: 2,
};  // Type is { x: number; y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
};  // Type is { x: 1; y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const;  // Type is { readonly x: 1; readonly y: 2; }
```
### 22. 타입 좁히기 
태그/구별된 유니온과 사용자 정의 타입 가드를 사용
//if(!el)을 사용
```ts
const el = document.getElementById('foo'); // Type is HTMLElement | null
if (!el) throw new Error('Unable to find #foo');
el; // Now type is HTMLElement
el.innerHTML = 'Party Time'.blink();

```
//(태그된 유니온) 타입 
```ts
interface UploadEvent { type: 'upload'; filename: string; contents: string }
interface DownloadEvent { type: 'download'; filename: string; }
type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'download':
      e  // Type is DownloadEvent
      break;
    case 'upload':
      e;  // Type is UploadEvent
      break;
  }
}

```
//사용자 정의 타입가드
```ts
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // Type is HTMLInputElement
    return el.value;
  }
  el; // Type is HTMLElement
  return el.textContent;
}

```
### 24. 일관성 있는 별칭 사용하기 
별칭을 사용하는 것보다 구조 분해 할당으로 변수를 뽑아내는 것이 더 좋습니다. 
```ts
interface Coordinate {
  x: number;
  y: number;
}

interface BoundingBox {
  x: [number, number];
  y: [number, number];
}

interface Polygon {
  exterior: Coordinate[];
  holes: Coordinate[][];
  bbox?: BoundingBox;
}
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const box = polygon.bbox;
  if (polygon.bbox) {
    if (pt.x < box.x[0] || pt.x > box.x[1] ||
        //     ~~~                ~~~  Object is possibly 'undefined'
        pt.y < box.y[1] || pt.y > box.y[1]) {
        //     ~~~                ~~~  Object is possibly 'undefined'
      return false;
    }
  }
  // ...
}
```
```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const {bbox} = polygon;
  if (bbox) {
    const {x, y} = bbox;
    if (pt.x < x[0] || pt.x > x[1] ||
        pt.y < x[0] || pt.y > y[1]) {
      return false;
    }
  }
  // ...
}
```
### 26 타입 추론 작동 이해하기
변수를 추출해서 별도로 선언시 오류가 발생한다면 타입 선언을 추가해야합니다. 변수가 정말로 상수라면 상수 단언을 사용해야하지만 주의가 필요합니다.
```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';
function setLanguage(language: Language) { /* ... */ }

setLanguage('JavaScript');  // OK

let language = 'JavaScript';
setLanguage(language);
         // ~~~~~~~~ Argument of type 'string' is not assignable
         //          to parameter of type 'Language'

//language를 선언한 시점에 타입이 string로 추론되어서 에러 발생

let language1: Language = 'JavaScript';
setLanguage(language1);  // OK

//language1 선언 때 타입을 지정해주는 방법을 해결

const language = 'JavaScript';
setLanguage(language);  // OK

//const를 사용하여 타입 제한
```


