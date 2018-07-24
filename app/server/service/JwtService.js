import {sign, verify} from "jsonwebtoken";

export class JwtService {

  static verify(jwtString) {
    var publicKey = process.env.JWT_PUBLIC_KEY;
    return verify(jwtString, publicKey);
  }

  static sign(payload) {
    var privateKey = process.env.JWT_PRIVATE_KEY;
    return sign(payload, privateKey);
  }
}