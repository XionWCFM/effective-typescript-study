# 해당 분야의 용어로 타입 이름 짓기

> 컴퓨터 과학에서 어려운 일은 단 두 가지 뿐이다. 캐시 무효화와 이름 짓기. - 필 칼튼(Phil Karlton)

타입의 이름 짓는 것은 설계에서 중요한 부분이다. 엄선된 타입, 속성, 변수의 이름은 의도를 명확히하고 코드와 타입의 추상화 수준을 높여 준다. 반대로 잘못 선택한 타입 이름은 코드의 의도를 왜곡하고 잘못된 개념을 심어준다.

동물들의 데이터베이스를 구축한다고 가정해보자.

```ts
interface Animal {
  name: string;
  endagered: boolean;
  habitat: string;
}

const leopard: Animal = {
  name: "Snow Leopard",
  endagered: false,
  habitat: "tundra",
};
```

위의 코드는 다음과 같은 문제점들이 있다.

- `name`은 매우 일반적인 용어이다. 동물의 학명인지 일반적인 명칭인지 알 수 없다.
- `endangered` 속성이 멸종 위기를 표현하기 위해 `boolean` 타입을 사용한 것이 이상하다. 이미 멸정된 동물을 `true`로 해야 될지 아니면 '멸종 위기 또는 멸종'으로 생각할 것인지 모호하다.
- 서식지를 나타내는 `habitat` 속성은 너무 범위가 넓은 `string` 타입일 뿐 아니라 서식지라는 뜻 자체도 불분명하다.
- 객체의 변수명이 `leopard`이지만, `name` 속성의 값은 `Snow Leopard`이다. 객체의 이름과 속성의 `name`이 다른 의도로 사용된 것인지 불분명하다.
- 모호한 속성에 대한 정보를 물어보기 위해 작성한 사람을 찾아서 의도를 물어보는게 가장 정확하다. 하지만 해당 속성을 작성한 사람은 아마도 회사에 없거나 코드를 기억하지 못할 수도 있다. 또는 작성한 사람이 본인일 수도 있다.

그럼 위의 코드를 의미가 분명하게 개선해보자.

```ts
interface Aniaml {
  commonName: string;
  genus: string;
  species: string;
  status: ConservationStatus;
  climates: KoppenClimate[];
}
type ConservationStatus = "EX" | "EW" | "CR" | "EN" | "VU" | "NT" | "LC";
type KoppenClimate =
  | "Af"
  | "Am"
  | "As"
  | "Aw"
  | "BSh"
  | "BSk"
  | "BWh"
  | "BWk"
  | "CFa"
  | "Cfb"
  | "Cfc"
  | "Csa"
  | "Csb"
  | "Csc"
  | "Cwa"
  | "Cwb"
  | "Cwc"
  | "Dfa"
  | "Dfb"
  | "Dfc"
  | "Dfd"
  | "Dsa"
  | "Dsb"
  | "Dsc"
  | "Dwa"
  | "Dwb"
  | "Dwc"
  | "Dwd"
  | "EF"
  | "ET";

const snowLeopard: Animal = {
  commonName: "Snow Leopard",
  genus: "Panthera",
  species: "Uncia",
  status: "VU", // 취약종(vulnerable)
  climates: ["ET", "EF", "Dfd"], // 고산대(alpine) 또는 아고산대(subbalpine)
};
```

이 코드의 개선 부분은 다음과 같다.

- `name`은 `commonName`, `genus`, `species` 등 더 구체적인 용어로 대체했다.
- `endangered`는 동물 보호 등급에 대한 IUCN의 표준 분류 체계인 `ConservationStatus` 타입의 `stauts`로 변경되었다.
- `habitat`은 기후를 뜻하는 `climates`로 변경되었으며, 콰펜 기후 분류(Koppen climate classification)를 사용한다.
- 데이터를 훨씬 명확하게 표현하고 있으며 정보를 찾기 위해 사람에 의존할 필요가 없다.

코드로 표현하고자 하는 모든 분야에는 주제를 설명하기 위한 전문 용어들이 있다. 자체적으로 용어를 만들어 내려고 하지 말고, 해당 분야에 이미 존재하는 용어를 사용해야 한다.

전문 분야의 용어는 정확하게 사용해야 한다. 특정 용어를 다른 의미로 잘못 쓰게 되면 직접 만들어 낸 용어보다 더 혼란을 준다.

타입, 속성, 변수에 이름을 붙일 떄 명심해야할 규칙이 세 가지 있다.

- 동일한 의미를 나타낼 때는 같은 용어를 사용해야 한다. 정말로 의미적으로 구분이 되어야 하는 경우에만 다른 용어를 사용해라.
- `data`, `info`, `thing`, `item`, `object`, `entity` 같은 모호하고 의미 없는 이름은 피해라.
- 이름을 지을 떄는 포함된 내용이나 계산 방식이 아니라 데이터 자체가 무엇인지를 고려해라.

좋은 이름은 추상화의 수준을 높이고 의도치 않은 충돌의 위험성을 줄여준다. 가독성을 높이고 추상화 수준을 올리고 싶다면 해당 분야의 용어를 사용해라.
