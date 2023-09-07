# 아이템14. 타입 연산과 제너릭 사용으로 반복 줄이기

1. 타입에 이름 붙이기
2. 인터페이스를 확장하기
3. 교차 연산자(`&`) 사용하기
4. 이미 선언된 타입의 부분집합으로 중복 제거하기 (유니온 타입도 가능)

   - 부분을 그대로 가져오는 방법

     - 인덱싱하여 이미 선언된 타입의 속성 타입을 가져오기

       ```ts
       interface State {
         userId: string;
         pageTitle: string;
         recentFiles: string[];
         pageContents: string;
       }

       type TopNavState {
         userId: State['userId'];
         pageTitle: State['pageTitle'];
         recentFiles: State['recentFiles'];
       }
       ```

     - 매핑된 타입 사용하기

       ```ts
       // 1번 방법
       type TopNavState = {
         [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k];
       };

       // 2번 방법: Pick 제너릭 타입 이용
       type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
       ```

   - 옵셔널 속성으로 가져오는 방법

     - 매핑된 타입과 keyof 사용

       ```ts
       interface Options {
         width: number;
         height: number;
         color: string;
         label: string;
       }

       type OptionsUpdate = { [k in keyof Options]?: Options[k] };
       ```

     - Partial 제너릭 타입 이용
       ```ts
       type OptionsUpdate = Partial<Options>;
       ```

5. 이미 선언된 값을 값의 형태에 해당하는 타입으로 정의하기: typeof

   ```ts
   const INIT_OPTIONS = {
     width: 640,
     height: 480,
     color: '#00FF00',
   };

   type Options = typeof INIT_OPTIONS; //=> type Options = { width: number; height: number; color: string; };
   ```

   주의!: 값으로부터 타입을 만들어 낼 때는 선언의 순서에 주의해야 한다. 타입 정의를 먼저하고 값이 그 타입에 할당 가능하다고 선언하는 것이 좋다.

6. ReturnType 제너릭 타입을 이용하여 함수, 메서드 반환 값에 명명된 타입 만들기

   ```ts
   function getUserInfo(userId: string) {
     // ...
     return {
       userId,
       name,
       age,
     };
   }

   type UserInfo = ReturnType<typeof getUserInfo>; // 적용대상이 함수의 값이 아니라 함수의 타입이므로 ReturnType에 getUserInfo가 아닌 typeof getUserInfo가 적용됨.
   ```

7. extends를 사용하여 제너릭 타입에서 매개변수를 제한하기

   ```ts
   interface Name {
     first: string;
     last: string;
   }
   type DancingDue<T extends Name> = [T, T];
   ```
