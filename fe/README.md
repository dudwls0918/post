# Green Board Frontend

연한 녹색 기반의 게시판 프론트엔드입니다. 회원가입 없이 기존 계정으로 로그인하고, 게시글 CRUD·검색·카테고리·좋아요·프로필을 제공합니다.

## 실행

```bash
npm install
npm run dev
```

백엔드가 없을 때는 브라우저 LocalStorage 목업 데이터로 모든 기능을 시험할 수 있습니다.

## 백엔드 연결

`.env.example`을 복사하여 `.env`를 만들고 백엔드 주소를 입력합니다.

```bash
cp .env.example .env
```

|기능|메서드|경로|
|---|---|---|
|로그인|POST|`/auth/login`|
|목록 조회|GET|`/posts`|
|글 작성|POST|`/posts`|
|글 수정|PATCH|`/posts/:id`|
|글 삭제|DELETE|`/posts/:id`|
|공감|POST|`/posts/:id/like`|

터미널 API 호출 예시:

```bash
curl -X POST http://localhost:8080/auth/login -H 'Content-Type: application/json' -d '{"email":"green@example.com","password":"1234"}'
curl -X POST http://localhost:8080/posts -H 'Content-Type: application/json' -d '{"title":"첫 글","content":"안녕하세요","category":"자유","authorId":1}'
```

## GitHub Desktop / Git

변경 파일을 확인하고 Summary에 `feat(board): 게시판 CRUD 화면 구현`처럼 작성한 뒤 **Commit to fe** → **Push origin**을 누릅니다.

```bash
git status
git add .
git commit -m "feat(board): 게시판 CRUD 화면 구현"
git push -u origin fe
```
