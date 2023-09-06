# CH7. 코드를 작성하고 실행하기 

## ITEM 55. DOM 계층 구조 이해하기

![image](https://file.notion.so/f/s/098e56a6-a443-4239-8081-8df223cd1677/Untitled.png?id=9c50455d-c5a8-4d5e-8a51-6d057145e9e3&table=block&spaceId=ff5faddb-d222-44da-a1dd-6221b00592ce&expirationTimestamp=1694066400000&signature=i0OY9hACFapBCm2cT8AY1_Mo8dqXiBoCXnGLjDc19hg&downloadName=Untitled.png)


|타입|예시|
| --- | --- |
| Envent Target | window, XMLHttpRequest |
| Node | document, Text, Comment |
| Element | HTMLElement, SVGELement 포함 |
| HTMLElement | \<i>, \<b> |
| HTMLButtonElement | \<button> |


- EventTarget 타입의 계층 구조뿐 아니라 Event 타입에도 별도의 계층 구조가 있습니다. Mozilla 문서에는 52개 이상의 Event 종류가 나열되어 있습니다. **Event**는 가장 추상화된 이벤트입니다. 더 구체적인 타입들은 다음과 같습니다. 

    - UIEvent: 모든 종류의 사용자 인터페이스 이벤트
    - MouseEvent: 클릭처럼 마우스로부터 발생되는 이벤트
    - TouchEvent: 모바일 기기의 터치 이벤트
    - WheelEvent: 스크롤 휠을 돌려서 발생되는 이벤트
    - KeyboardEvent: 키 누름 이벤트

## 정리
- DOM에는 타입 계층 구조가 있습니다. DOM 타입은 타입스크립트에서 중요한 정보이며, 브라우저 관련 프로젝트에서 타입스크립트를 사용할 때 유용합니다. 

- Node, Element, HTMLElement, EventTarget 간의 차이점, 그리고 Event와 Mouse Event의 차이점을 알아야 합니다. 
- DOM 엘리먼트와 이벤트에는 충분히 구체적인 타입 정보를 사용하거나, 타입스크립트가 추론할 수 있도록 문맥 정보를 활용해야 합니다. 

