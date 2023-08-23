# 2장 타입스크립트의 타입 시스템

## ITEM18. 매핑된 타입을 사용하여 값 동기화하기(values-in-sync)
- 프로그램 작성 방식으로는 오류 대처 방면으로 접근 할 때에 크게 두가지가 있습니다. 
    1. **실패에 닫힌** 접근법(보수적 접근법)
        - 오류 발생시에 적극적으로 대처하는 방향을 말합니다. 
    2. **실패에 열린** 접근법
        -  오류 발생시에 소극적으로 대처하는 방향입니다. 기능에 무리가 없고 사용성이 중요할 때에, 다음과 같은 방법을 주로 사용합니다.


- 매핑된 타입과 객체를 사용하여 효율적으로 UI를 업데이트하는 코드를 작성할 수 있습니다. 매핑된 객체의 값이 true인 경우에만 UI 업데이트가 발생하며, 함수의 변경은 UI 업데이트에 반영이 되지 않습니다. 이를 통해서 인터페이스에 새로운 속성을 추가할 때, 선택을 강제하도록 매핑된 타입을 고려해야 합니다.
```ts
interface ScatterProps {
  // The data
  xs: number[];
  ys: number[];

  // Display
  xRange: [number, number];
  yRange: [number, number];
  color: string;

  // Events
  onClick: (x: number, y: number, index: number) => void;
}
const REQUIRES_UPDATE: {[k in keyof ScatterProps]: boolean} = {
  xs: true,
  ys: true,
  xRange: true,
  yRange: true,
  color: true,
  onClick: false,
};

function shouldUpdate(
  oldProps: ScatterProps,
  newProps: ScatterProps
) {
  let k: keyof ScatterProps;
  for (k in oldProps) {
    if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
      return true;
    }
  }
  return false;
}
```