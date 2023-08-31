# CH4: 타입 설계

## iTEM32. 유니온의 인터페이스보다는 인터페이스의 유니온을 사용하기

```ts
// 현재의 형태가 더울 명료합니다. 타입의 계층을 분리된 인터페이스로 두어야 합니다.
interface FillLayer {
  layout: FillLayout;
  paint: FillPaint;
}
interface LineLayer {
  layout: LineLayout;
  paint: LinePaint;
}
interface PointLayer {
  layout: PointLayout;
  paint: PointPaint;
}
type Layer = FillLayer | LineLayer | PointLayer;


interface Layer {
  type: 'fill' | 'line' | 'point';
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```

- 유니온 타입의 속성을 여러 개 가지는 인터페이스에서는 속성 간의 관계가 분명하지 않기 때문에 실수가 자주 발생하므로 주의 해야 합니다. 

- 유니온의 인터페이스보다 인터페이스의 유니온이 더 정확하고 타입스크립트가 이해하기도 좋습니다. 

- 타입스크립트가 제어 흐름을 분석할 수 있돌고 타입에 태그를 넣는 것을 골려해야 합니다. 태그된 유니온은 타입스크립트와 매우 잘 맞기 때문에 자주 볼 수 있는 패턴입니다.

-