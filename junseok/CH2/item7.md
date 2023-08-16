# 2장 타입스크립트의 타입 시스템

## ITEM7. 타입이 값들의 집합이라고 생각하기

> **타입**
>
> *할당 가능한 값들의 집합*
> - 타입 개념을 집합으로 비유해서 자주 설명하는 이유는 타입 확인은 하나의 집합이 다은 집합의 부분 집합인지 검사하는 것으로 해석할 수 있기 때문입니다.

타입스크립트의 타입 지정은 해당 변수가 어떤 범위에서 유효한지를 결정하는 선을 긋는 것입니다.
따라서 null 과 undefinde는 `stricNullChecks`의 여부에 따라 선을 긋는 범위에 차이가 발생하게 됩니다. 
이렇게 다양한 범위 중에 가장 작은 범위는 아무것도 포함하지 않는 공집합이며, 타입스크립트에서는 `never`타입입니다. `never`의 범위는 공집합이기 때문에 아무런 값도 할당할 수 없습니다. 

### Union ( | )
- 합집합을 의미합니다. 

### intersection ( & )
- 타입스크립트의 타입 정의는 구조적 타이핑을 따릅니다. 즉 유연하게 타입을 확장시킬 수 있습니다. 이러한 규칙을 지키기 위해서 intersection은 교집합을 의미하는 것이 아닙니다. 따라서 intersection은 두 타입의 속성을 모두 가진 타입 혹은 두 타입의 속성 이외에 추가적인 속성을 가지고 있는 타입이 해당됩니다. 
```ts
interface Identified {
  id: string;
}
interface Person {
  name: string;
}
interface Lifespan {
  birth: Date;
  death?: Date;
}
type PersonSpan = Person & Lifespan;


const ps: PersonSpan = {
  name: 'Alan Turing',
  birth: new Date('1912/06/23'),
  death: new Date('1954/06/07'),
};  // OK
```
- 

> #### keyof
> - [공식사이트](https://www.typescriptlang.org/ko/docs/handbook/2/keyof-types.html)
> `keyof` 연산자는 객체 타입에서 객체의 키 값을 숫자나, 문자열 리터럴 유니언으로 생성합니다. 
>```ts
>  type K = keyof(Person | Lifespan) // never 타입
>  type A = keyof(Person & Lifespan) // type Kd = "name" | keyof Lifespan 타입
>  keyof (A&B) = (keyof A) | (keyof B)
>  keyof (A|B) = (keyof A) & (keyof B)
>```


#### 타입스크립트 용어 정리
| 타입스크립트 용어 | 집합 용어 |
| --- | --- |
| nerver | 공집합 |
| 리터럴 타입 | 원소가 1개인 집합 |
| 값이 T에 할당 가능 | 값이 T의 원소 |
| T1이 T2에 할당 가능 | T1이 T2의 부분 집합 |
| T1이 T2를 상속 | T1이 T2의 부분 집합 |
| T1 \| T2 (T1과 T2의 유니언) | T1과 T2의 합집합 |
| T1 & T2 (T1와 T2의 인터섹션) | T1과 T2의 교집합 |
| unknown | 전체 집합 |

#### 정리
- 타입스크립트의 타입은 엄격한 상속 관계가 아니라 겹쳐지는 집합으로 표현됩니다. 서브타입이 아니면서도 서로 겹쳐질 수 있습니다.
- 한 객체의 추가적인 속성이 타입 선언에 언급되지 않더라도 그 타입에 속할 수 있습니다. 
- 타입 연산은 집합의 범위에 적용됩니다. A와 B의 인터섹션은 A의 범위와 B의 범위의 인터섹션입니다. 객체 타입에서는 A&B인 값이 A와 B의 속성을 모두 가짐을 의미합니다. 
- `A는 B를 상속`, `A는 B에 할당 가능`, `A는 B의 서브타입`은 `A는 B의 부분 집합`과 같은 의미입니다.