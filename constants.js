const ERROR_MESSAGE = Object.freeze({
  NOT_FOUND: "Not Found",
  BAD_REQUEST: "Bad Request",
  SERVER_ERROR: "Internal Server Error",
  DUPLICATE_KEY_ERROR: "해당 닉네임이 존재합니다",
  EMAIL_REQUIRED: "email은 필수 입력란 입니다.",
  MUST_BE_EMAIL: "email란 값은 email 형식이어야 합니다.",
  NICKNAME_REQUIRED: "nickname은 필수 입력란 입니다.",
  PROFILE_URL_REQUIRED: "profileUrl 값이 없습니다.",
  RELOGIN_NEEDED: "재로그인이 필요한 유저입니다.",
  FORBIDDEN: "해당 페이지에 접근 권한이 없습니다.",
  UNAUTHORIZED: "인증되지 않은 유저입니다.",
  NOT_VALID_USER: "해당 유저가 존재하지 않습니다.",
  MESSAGE_REQUIRED: "message는 필수 입력란 입니다.",
  LENGTH_LIMIT: "message는 50자 까지 입력할 수 있습니다.",
  MUST_BE_IN_LIMIT: "-90 ~ 90 사이에 있어야 합니다.",
  PLACENAME_REQUIRED: "장소이름은 필수 항목입니다.",
  PHOTO_REQUIRED: "최소 1개 이상의 사진이 있어야 합니다.",
  VALID_DATE_REQUIRED: "유효한 날짜여야 합니다.",
  URL_REQUIRE: "사진 url값이 없습니다.",
  POINT_REQUIRED: "point정보가 있어야 합니다.",
});

const RESPONSE_MESSAGE = Object.freeze({
  SENDING_SUCCESS: "메일 발송 성공",
  ALREADY_IN_SAME_GROUP: "이미 같은 그룹 멤버입니다.",
  ALREADY_INVITED: "이미 초대 메일을 보낸 유저입니다.",
});

const PAGE_SIZE = 8;

exports.PAGE_SIZE = PAGE_SIZE;
exports.ERROR_MESSAGE = ERROR_MESSAGE;
exports.RESPONSE_MESSAGE = RESPONSE_MESSAGE;
