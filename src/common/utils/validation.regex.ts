export const regex = {
  login: /^[a-z0-9_-]{3,10}$/i,
  loginTerm: /^[a-z0-9_-]{1,10}$/i,
  email: /^[\w\@\.\-]{3,100}$/i,
  emailTerm: /^[\w\@\.\-]{1,100}$/i,
  password: /^[\w\@\.\-\&\$\*\#\!\%\^\~\,]{6,20}$/i,
  uuid: /^[a-f,0-9,-]{36,36}$/,
  blogName: /^[a-z0-9_-\s]{1,15}$/i,
  postTitle: /^[a-z0-9_-\s]{1,30}$/i,
  questionBody: /^[a-z0-9_-\s]{1,100}$/i,
  httpsUrl:
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  isoDate:
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
};

Object.freeze(regex);
