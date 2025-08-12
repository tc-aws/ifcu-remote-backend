import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config/jwt.config';


@Global() // Mark the module as global to avoid importing it multiple times
@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [JwtModule],
})
export class JwtSharedModule {}