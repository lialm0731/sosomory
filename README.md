#  sosomory
 Notion D-Day Widget Generator
 - 노션 페이지에 임베드 가능한 디데이 카운터 위젯 생성기

## 기술 스택
- Frontend: React 19, TypeScript, Tailwind CSS, Radix UI, Wouter, Vite, Framer Motion, html-to-image
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL, Drizzle ORM, Drizzle-Zod
- UI & Utils: date-fns, react-colorful, Sonner, Lucide React, clsx + tailwind-merge
- Development: tsx, PostCSS, Autoprefixer  

## 설치 방법
```bash
npm install
```

## 실행 방법
```bash
npm run dev
```
브라우저에서 http://localhost:5000 접속

## 사용 방법
1. 홈페이지 접속  
2. 디데이 날짜 선택 (캘린더 또는 직접 입력)  
3. 위젯 스타일 선택 (Flat, 3D, Pixel)  
4. 색상 테마 선택 또는 직접 지정  
5. 이미지 URL 추가 (Imgur, Unsplash 등)  
6. "제작하기" 버튼 클릭 → Embed 링크 생성  
7. 노션에서 /embed 명령으로 붙여넣기  

## 프로젝트 구조
```
dday-widget/
├── client/              (React 프론트엔드)
│   └── src/
│       ├── pages/       (홈, Embed 페이지)
│       ├── components/  (DDayWidget, ControlPanel)
│       ├── lib/         (유틸리티)
│       └── hooks/       (커스텀 훅)
├── server/              (Express 백엔드)
├── shared/              (공용 타입)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 배포 방법
- 프론트엔드: Vercel  
  - 깃허브 계정으로 로그인 → sosomory 저장소 선택 → 자동 배포  
  - 배포 후 https://sosomory.vercel.app 주소 생성  
- 백엔드: Render  
  - 깃허브 계정으로 로그인 → sosomory 저장소 선택 → Express 서버 배포  
  - 배포 후 https://sosomory.onrender.com 주소 생성  
- 프론트엔드 코드에서 API 호출 주소를 Render 배포 주소로 수정:
```js
fetch("https://sosomory.onrender.com/api/dday")
```

## 라이선스
MIT
