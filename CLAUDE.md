# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 시스템 프롬프트

이 프롬프트는 두 층으로 되어 있다.

- **🔒 고정층**은 이 저장소의 어떤 요청에도 항상 적용되는 규칙이다. 요청마다 다시 쓰지 않는다.
- **🔧 변동층**은 요청마다 사용자가 새로 채우는 부분이다. 아래 템플릿 형식으로 들어온다.

두 층이 충돌하면 고정층이 우선한다. 변동층 요청이 고정층을 깨야만 가능하면 작업 전에 사용자에게 확인한다.

### 🔒 고정층

**역할**
너는 이 저장소의 게임 개발 파트너다. 사용자는 구조화된 프롬프트로 원하는 변경을 설명하고, 결과를 브라우저에서 직접 확인한다. 요청 범위 밖의 부분은 바꾸지 않는다.

**프로젝트 맥락**
`index.html` 하나로 브라우저에서 실행되는 게임이다. 원래 커피를 받아 네 이웃에게 배달하던 게임에서 출발했다. 현재 게임의 내용은 아래 「현재 변동층」에 정리되어 있다.

**기술 제약**
- 파일을 나누지 않는다. CSS·JS·에셋을 모두 `index.html` 하나에 두고, 브라우저로 바로 열어 실행되게 한다 (설치·서버·API 키 불필요).
- 외부 라이브러리·API·CDN을 추가하지 않는다. 렌더링과 사운드(Web Audio 합성)는 직접 구현한다.

**항상 유지할 것**
- 하단 버튼 기능: `#start`(시작/계속), `#pause`(잠깐 멈추기), `#reset`(처음으로), `#action`(주 행동), `[data-dir]` 방향 버튼 4개.
- 시작, 이동, 주 행동, 일시정지, 초기화는 어떤 변경 뒤에도 계속 작동한다.
- 좁은 화면에서도 안내 문구·카드·HUD가 잘리지 않고 줄바꿈된다. 읽어야 하는 텍스트는 캔버스가 아니라 DOM에 둔다.

**아트 디렉션** (문구 그대로 유지)
- 캐릭터: cute handcrafted clay animal character, clay stop-motion animation aesthetic, simple rounded body, minimal facial features, soft sculpted clay texture, slightly imperfect handmade surface, expressive pose, miniature diorama set, soft diffused studio lighting, playful and warm mood.
- 맵: Handcrafted Clay Isometric Diorama — cute handcrafted clay game world, isometric miniature diorama, soft rounded environment, simplified shapes, handmade plasticine texture, slightly imperfect surfaces, miniature trees and buildings, soft diffused lighting, playful stop-motion animation aesthetic.

**작업 방식**
- 변경 후 `node --test tests/game.test.cjs`로 규칙이 깨지지 않았는지 확인한다. 규칙을 바꿨으면 테스트도 함께 고친다.
- 화면이나 소리처럼 테스트로 확인할 수 없는 것은 확인하지 못했다고 밝힌다.

**결과물 형식**
- 파일을 직접 편집할 수 있으면 `index.html`을 수정한다. 직접 편집할 수 없으면 생략 없이 전체 HTML 코드를 제공한다.
- 끝에 **변경한 점**과 **직접 확인하지 못한 점**을 짧게 알린다.

### 🔧 변동층 템플릿

사용자는 요청할 때 아래 칸을 채운다. 비어 있는 칸은 「현재 변동층」의 값을 그대로 이어서 쓴다.

```text
[현재 상황]   지금 게임이 어떤 상태인지
[목표]        무엇이 달라지면 좋은지
[구체적인 변경] 어디를 어떻게 바꿀지
[추가로 유지할 것] 고정층 외에 이번에 건드리지 말아야 할 것
[완료 기준]    무엇을 보면 성공인지
```

### 현재 변동층 (마지막 반영된 요청: 똑딱서점 개편)

**[현재 상황]** 커피를 받아 네 이웃에게 배달하던 게임을 서점 게임으로 바꾸었다.

**[목표]** 서점 주인이 서점을 존속시키기 위해 마을 곳곳의 작가들에게 원고를 받아 오는 게임.

**[구체적인 변경]**
- **맵:** 구형이 아닌 아이소메트릭 디오라마 / 미니어처 월드.
- **주인공과 주간 흐름:** 숲속 동물마을 서점 주인 딱따구리 '똑딱'. 서점 앞에서 금주 할당량을 확인하면 왼쪽 위 「이번 주의 업무일지」에 체크리스트가 뜬다. 월~금 낮밤으로 작가 집을 돌며 원고를 받는다.
- **하루:** 해 뜰 때부터 한밤까지, 실제 시간 약 2분 30초. 시간은 15분 단위로 넘어가며 그 변화가 보인다. 한밤이 되면 그날 업무가 끝난다. 달의 위상은 매일 바뀐다.
- **기운과 씨앗:** 이동·재촉하면 기운이 줄고, 마을 카페의 음료로 채운다 (사과 < 석류 < 스타프루트 순으로 많이 참). 출판·판매·음료 구매 등 모든 거래는 공동 재화 씨앗으로 한다.
- **원고 받기:**
  1. 문을 랜덤 횟수만큼 클릭해 두드려 연다 (시각적으로 드러나게).
  2. 랜덤으로 작가가 내기를 제안한다. 상식 퀴즈나 미니게임 4~5종 중 하나이며, 씨앗을 거는 도박성 게임을 포함한다.
  3. 원고가 완성돼 있으면 바로 수확하고, 미완성이면 Space 연타로 재촉한다. 필요한 횟수는 랜덤인 남은 작업량에 비례한다.
- **효과음:** 재촉(클레이를 누르는 소리), 게이지 차오름, 게이지 완충, 원고 수확에 각각 효과음이 있다.
- **바다 마을:** 숲에서 2~3주 뒤 다음 주에는 책 표지·그림을 받으러 바다 마을 물총새 '총총'에게 간다. 조작 캐릭터가 총총으로 바뀌고, 똑딱은 총총의 집에서 일하며 이따금 잔소리를 한다. 총총은 모래사장과 바닷속 주민을 찾아간다 (바닷속 진입은 시청각적으로 표현). 메커닉은 숲과 같고, 총총이 돌아오면 똑딱과 바통 터치한다.
- **월간 출간:** 4주마다 일정 권수의 책을 출간하며 서점을 존속·성장시킨다.
- **도입부:** 시작 시 스토리/세계관을 설명하는 프롤로그.

**[추가로 유지할 것]** 없음 (고정층으로 충분).

**[완료 기준]**
- 안내 문구가 요청한 순서와 글자 크기로 보인다.
- 화면이 좁아도 안내가 잘리지 않는다.
- 시작, 이동, 원고 받기, 재촉, 일시정지, 초기화가 계속 작동한다.
- 완료와 게이지 차징이 시각적·청각적으로 효과적으로 보인다.

## 명령어

```bash
# 실행: 브라우저로 열기 (빌드 단계 없음)
open index.html

# 테스트 전체 (Node 내장 test runner, 의존성 없음)
node --test tests/game.test.cjs

# 테스트 하나만
node --test --test-name-pattern="15-minute" tests/game.test.cjs
```

이 Mac의 `/usr/bin/git`은 Xcode 문제로 동작하지 않는다. GitHub Desktop에 포함된 git을 쓴다 (push 인증은 이 레포의 local config `credential.helper manager`로 설정됨):

```bash
D="/Applications/GitHub Desktop.app/Contents/Resources/app/git"; export GIT_EXEC_PATH="$D/libexec/git-core" GIT_TEMPLATE_DIR="$D/share/git-core/templates" PATH="$D/bin:$PATH"
```

- origin은 `JangYurim0607/coffee-delivery-game-week3-bookstore` (폴더 이름과 다름), 브랜치 `main`.
- `main`에 push하면 Vercel(https://coffee-delivery-game-week3-bookstor.vercel.app)이 자동 배포된다. push는 공개 작업이므로 사용자 확인 후에만 한다.

## 아키텍처

`index.html`의 `<script>`는 세 부분으로 나뉜다.

1. **UMD 팩토리 `Ttokttak`** — `(function(root,factory){...})` 안에 규칙, 렌더러, `mount`가 모두 있다. 브라우저에서는 `window.Ttokttak`, Node에서는 `module.exports`.
2. **DOM 연결부** — 마지막 줄의 `const game=Ttokttak.mount(...)`부터 버튼 핸들러까지.
3. 테스트(`tests/game.test.cjs`)는 `index.html`을 읽어 **`const game=Ttokttak.mount` 앞까지만** `vm`으로 실행한다. 이 문자열을 바꾸거나 팩토리 밖으로 규칙을 옮기면 테스트가 깨진다. 팩토리 본문은 `document`/`window`를 건드리지 않아야 한다 (DOM·오디오는 `mount` 안에서만).

### 팩토리 내부 계층

- **월드 데이터:** `WORLD_DEF`(forest/sea의 서점·작가·카페 좌표), `ANIMALS`(캐릭터 색·귀·꼬리 등 파츠 정의), `DRINKS`, `QUIZ`, `GAMES`, `NAGS`. 새 작가·카페·음료·퀴즈는 여기에 데이터로 추가한다.
- **지형 파생:** `sites()`(문 위치·바닷속 여부), `paths()`(그리드 A*로 집과 개울을 피해 다리로 건너는 길), `props()`(나무·소품, 결정론적 시드). 세 함수 결과는 캐시되며 **렌더러와 충돌 판정(`blocked`)이 같은 데이터를 공유**한다. 좌표나 반지름을 바꾸면 테스트 마지막 항목(문·길이 막히지 않는지)으로 확인한다.
- **규칙 (순수 함수, 상태 `s`를 직접 변경):**
  - `s.status`: `ready | playing | paused | over`.
  - `s.phase` 상태 머신: `explore → board | cafe | knock → bet → quiz|timing|memory|reaction|cups → betResult → hurry → got → explore`, 그리고 `dayEnd`, `weekEnd`, `travel`, `monthEnd`.
  - `interact(s)`가 E/Space/버튼 입력을 현재 phase에 맞게 분배한다. 숫자 키·화살표 입력은 `answer`, `buy`, `pickCup`, `acceptBet`, `memInput`이 처리한다.
  - 시계는 `CLOCK_PHASES`에서만 흐른다. 카드형 phase(board, dayEnd 등)에서는 멈춘다. 연타가 카드를 건너뛰지 않도록 `s.phaseT` 지연 조건이 있다.
  - 난수는 `rnd(s)`(상태에 저장된 LCG 시드)만 사용한다. `Math.random`은 규칙에 쓰지 않는다 (테스트 재현성).
  - 규칙은 사운드·이펙트를 직접 실행하지 않고 `emit(s,'knock'|'press'|'full'|'dive'...)`로 이벤트만 쌓는다. `mount`의 `handleEvents`가 이를 `SFX`(Web Audio 합성)와 파티클로 바꾼다.
- **렌더러 (캔버스 1200×800, `object-fit:contain`):**
  - 등각 투영 `iso()`는 정사영이라 카메라 이동이 평행 이동뿐이다. `makeScene`이 정적 폴리곤의 화면 좌표·정렬을 월드별로 한 번 미리 계산해 `sceneCache`에 둔다 (키: 월드 + 서점 레벨). 매 프레임에는 캐릭터·물고기 같은 동적 폴리곤만 만들어 병합한다.
  - 그리기 순서는 레이어 번호다: 0 바닥·판 옆면, 1 길·개울 데칼, 2 바닷속 물체, 3 수면(반투명), 4 지상 물체·캐릭터. 같은 레이어 안에서는 물체 깊이 `od`(x+z), 그다음 폴리곤 깊이 `pd` 순으로 정렬한다. 바닷속에 있는 것은 반드시 레이어 2에 둔다.
  - 클레이 질감 표현: `makeB(list, jit)`의 정점 지터, `lit()`의 면별 밝기 흔들림, 2D `clay()`의 울퉁불퉁한 외곽선, 지문 grain 패턴(soft-light). 스톱모션 느낌은 캐릭터 포즈를 12fps로 양자화(`ta`, `BOIL`)해서 낸다.
  - 시간 표현: `steppedDay()`가 15분 단위로 하늘·조명·그림자를 끊어 움직인다. `clockLabel()`은 HUD 시계 문자열이다.
  - 문 두드리기, 미니게임, 재촉, 수확 화면은 `closeUp()`이 캔버스에 2D로 그린다.
- **`mount(canvas, ui)`:** 게임 루프(`step → handleEvents → draw → renderUI`), 키·포인터 입력, Web Audio 체인(수중에서는 master에 lowpass와 거품 앰비언스), DOM HUD를 맡는다. HUD는 `#journal` 업무일지, `#clock` 시계·달·기운·씨앗, `#toast` 안내, `#panel` 카드(프롤로그·게시판·카페·내기·결과)다. `renderUI`는 key 문자열이 바뀔 때만 DOM을 다시 그린다.

### 밸런스 값 위치

| 항목 | 현재 값 | 처음 요청 | 코드 위치 |
|---|---|---|---|
| 하루 길이 | 150초 | 약 2분 30초 | `DAY_LEN` |
| 시계 단위 | 15분 (06:00~24:00, 72칸) | 15분 | `clockLabel`, `steppedDay` |
| 숲 주차 수 / 바다 주차 | 3주 / 4주차 | 2~3주 | `setupWeek`(`week===4`), `advance`(`week===3`) |
| 주간 할당량 | `2 + 월` (최대 작가 수) | — | `setupWeek` |
| 음료 가격 · 회복량 | 사과 6🌱 +25 · 석류 12🌱 +50 · 스타프루트 20🌱 +90 | 순서만 지정 | `DRINKS` |
| 기운 소모 | 이동 0.5/초 · 재촉 0.25/회 · 두드리기 0.1/회 | — | `step`, `hurryPress`, `knock` |
| 기운 0일 때 | 이동 45% 속도, 재촉 불가 | — | `step`, `hurryPress` |
| 기운 회복 (밤) · 시작값 | +60 · 80 | — | `advance`, `newGame` |
| 이동 속도 | 3.2 (바닷속 ×0.85) | — | `SPEED`, `step` |
| 씨앗 시작값 · 수입 | 40 · 주간 받은 원고×4 (+완료 보너스 10) · 월간 출간 권수×10 | — | `newGame`, `finishWeek`, `advance` |
| 문 두드리기 횟수 | 3~9회 랜덤 | 랜덤 | `interact` (`visit.need`) |
| 내기 제안 확률 | 40% | 랜덤 | `afterOpen` |
| 미니게임 종류 | 상식 퀴즈 · 타이밍 · 화살표 기억력 · 먼저 누르기 결투 · 도토리 컵 찾기(씨앗 내기) | 4~5종 | `GAMES`, `acceptBet` |
| 컵 내기 판돈 · 배당 | 5 / 10 / 20 씨앗 · 2배 | — | `acceptBet`, `step`(cups) |
| 재촉 횟수 | `max(6, (1-진행률)×34 + 랜덤 0~6)`, 내기에서 지면 ×1.4 | 남은 작업량에 비례 | `resolveVisit` |
| 서점 온기(♥) | 시작 3, 최대 5. 완료 +1, 미달 −1~2, 0이면 게임 오버 | — | `finishWeek` |
| 서점 레벨 | 누적 6권마다 +1 (Lv.2~4에서 건물이 커짐) | — | `advance`, `makeScene`(bookshop) |
| 작가 명단 | 숲 6명 · 바다 5명 (바닷속 2명) | — | `WORLD_DEF` |
| 텍스트 콘텐츠 | 퀴즈 20문항 · 똑딱 잔소리 9개 · 프롤로그 7장 | — | `QUIZ`, `NAGS`, `INTRO`(`mount` 안) |
| 맵 배치 | 숲 24×24 · 바다 26×26, 개울·다리 2개, 카페 각 2곳 | — | `WORLD_DEF`, `streamZ`, `BRIDGES`, `props` |
| 효과음 음색 · 파티클 | Web Audio 합성 값 | 피드백 종류만 지정 | `SFX`, `handleEvents` |
| 스톱모션 프레임 | 12fps | — | `draw`(`ta`, `BOIL`) |
