# 아이템13. 타입과 인터페이스의 차이점 알기

|                 | interface                            | type |
| --------------- | ------------------------------------ | ---- |
| 오류 체크       | O                                    | O    |
| 인덱스 시그니처 | O                                    | O    |
| 함수 타입 정의  | O                                    | O    |
| 제너릭          | O                                    | O    |
| 타입 확장       | O(일부)                              | O    |
| 클래스 구현     | O                                    | O    |
| 유니온 정의     | X                                    | O    |
| 튜플            | X(비슷하게는 가능하나 메서드 사용 X) | O    |
| 보강            | O                                    | X    |

- 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지는 못한다. 복잡한 타입을 확장하고 싶다면 타입과 교차 연산자(`&`)를 사용해야 한다.
- 유니온 타입은 있지만, 유니온 인터페이스라는 개념은 없다. 즉, 유니온 정의는 type으로만 가능하다.
- 인터페이스는 속성을 확장하는 선언 병합(declaration merging)과 같은 보강(augment)이 가능하다. 반면, 타입은 보강이 안되므로 기존 타입에 추가적인 보강이 없는 경우에만 사용해야 한다.

  ```ts
  // 선언 병합 예제

  interface State {
    name: string;
    capital: string;
  }
  interface State {
    population: number; // population 속성을 확장하는 선언 병합
  }

  const wyoming: State = {
    name: 'Wyoming',
    capital: 'Cheyenne',
    population: 500,
  }; // 정상
  ```
