# [14] [BE] 초대 링크 수락 시, map 스키마 멤버 업데이트

## 노션 칸반 링크

- [[BE] 초대 링크 수락 시, map 스키마 멤버 업데이트](https://www.notion.so/vanillacoding/BE-map-9f3bbea3b253411487db6c2ed1fbe1df)

## 카드에서 구현 혹은 해결하려는 내용

- req.params에 담긴 토큰 정보를 복호화해서 이메일 정보 얻기
- 이메일로 유저 정보를 찾기
- 위에서 찾아낸 User id를 map의 members에 추가하기
- map의 members에 성공적으로 추가되었다면 invitation list 배열에서 멤버로 추가한 이메일 삭제하기

## 테스트 방법

- mock 데이터를 활용해서 postman으로 테스트

## 기타 사항

- 전반적인 변수 네이밍이 조금 어려웠는데, 각 파일, 함수들 네이밍 확인해보시고 의견 남겨주세요! 저는 일단 컨트롤러 함수를 acceptInvitation이라고 했는데 좀 이상한 것 같아서 여러분의 의견이 궁금합니다..!
- mapController 파일의 92 - 98번째 줄이 map의 invitationList에서 map의 멤버가 된 이메일을 삭제해주는 로직인데 조금 복잡해보이기도 해서, 혹시 더 나은 코드가 생각나신다면 의견 남겨주세요..!
