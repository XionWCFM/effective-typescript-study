# noImplictAny

noImplictAny를 설정하지 않은 상태에서는 타입선언에서 비롯되는 실제 오류가 숨어있기 때문에

마이그레이션이 완료 되었다고 보기 어렵습니다.

왜냐하면 noImplictAny 설정을 하지 않으면 타입체크가 허술해지기 때문입니다.

# 주의 할 점

처음에는 noImplictAny를 로컬에서만 설정하고 작업하는 게 좋습니다.

원격에서도 noImplictAny를 설정하면 불의의 사고(컴파일 실패)가 발생할 수 있기 때문입니다.

# 최종적으로는

strict:true를 적용하는 게 가장 강력한 설정입니다.
