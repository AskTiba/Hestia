import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-me', // Fallback for dev
    });
  }

  async validate(payload: any) {
    // This payload is the decoded JWT
    // Senior Pattern: Returning the minimal user object needed for the request
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
