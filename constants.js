const ERROR_MESSAGE = Object.freeze({
  NOT_FOUNT: "Not Found",
  BAD_REQUEST: "Bad Request",
  SERVER_ERROR: "Internal Server Error",
  DUPLICATE_KEY_ERROR: "해당 닉네임이 존재합니다",
  EMAIL_REQUIRED: "email은 필수 입력란 입니다.",
  MUST_BE_EMAIL: "email란 값은 email 형식이어야 합니다.",
  NICKNAME_REQUIRED: "nickname은 필수 입력란 입니다.",
  PROFILE_URL_REQUIRED: "profileUrl 값이 없습니다.",
  NOT_VALID_URL: "접근 불가능한 URL입니다.",
  NOT_VALID_USER: "해당 유저가 존재하지 않습니다.",
  RELOGIN_NEEDED: "재로그인이 필요한 유저입니다.",
});

module.exports = ERROR_MESSAGE;
